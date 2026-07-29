<?php

namespace App\Services;

use App\Models\AiMessage;
use App\Models\Appointment;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\LabTest;
use App\Models\MedicalRecord;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class AiService
{
    // ---------- LOGIN OLMUŞ istifadəçi üçün ----------
    private function systemPrompt(): string
    {
        return <<<TXT
Sən NovaCare Hospital saytının virtual köməkçisisən. Adın "NovaCare Köməkçi"dir.

QAYDALAR:
1. Yalnız Azərbaycan dilində cavab ver.
2. Yalnız NovaCare Hospital və onun xidmətləri haqqında danışırsan: həkimlər, şöbələr, randevu almaq, tibbi qeydlər, lab nəticələri, sayt istifadəsi.
3. Mövzudan kənar suallara (siyasət, idman, proqramlaşdırma və s.) nəzakətlə imtina et: "Bağışlayın, mən yalnız NovaCare Hospital ilə bağlı suallara kömək edə bilərəm."
4. ⚠️ ÇOX VACİB: Sən həkim DEYİLSƏN. Diaqnoz qoymursan, dərman təyin etmirsən, müalicə tövsiyə etmirsən. Simptom soruşsalar: "Bu, həkim müayinəsi tələb edir. Sizə uyğun həkimə randevu almağa kömək edə bilərəm."
5. Təcili hal (güclü ağrı, nəfəs darlığı, huşsuzluq) qeyd olunarsa, dərhal təcili tibbi yardıma müraciət etməyi tövsiyə et.
6. Cavabların qısa və aydın olsun (2-4 cümlə).
7. Aşağıdakı real məlumatlardan istifadə et. Bilmədiyin şeyi uydurma — "Dəqiq məlumat üçün administrasiya ilə əlaqə saxlayın" de.

SAYTDAN İSTİFADƏ:
- Randevu almaq: "Randevu al" səhifəsi → şöbə seç → həkim seç → tarix seç → boş saatlardan birini seç.
- Randevuları görmək/ləğv etmək: "Randevularım" səhifəsi.
- Diaqnoz və reseptlər: "Tibbi tarixçəm" səhifəsi (PDF yükləmək olar).
- Analiz nəticələri: "Lab nəticələrim" səhifəsi.
- Həkimlə yazışmaq və ya səsli zəng: "Mesajlar" səhifəsi.
TXT;
    }

    // ---------- GİRİŞ ETMƏMİŞ ziyarətçi üçün ----------
    private function publicSystemPrompt(): string
    {
        return <<<TXT
Sən NovaCare Hospital saytının virtual köməkçisisən. Adın "NovaCare Köməkçi"dir.

QAYDALAR:
1. Yalnız Azərbaycan dilində cavab ver.
2. Yalnız NovaCare Hospital haqqında ÜMUMİ məlumat verirsən: həkimlər, şöbələr, ixtisaslar, müayinə haqları, saytdan necə istifadə edilir.
3. ⚠️ İstifadəçi hazırda SİSTEMƏ GİRİŞ ETMƏYİB. Şəxsi məlumat (randevular, diaqnozlar, analizlər) verə bilmirsən. Belə sual verilsə: "Şəxsi məlumatlarınızı görmək üçün zəhmət olmasa hesabınıza daxil olun."
4. Randevu almaq istəyənə: "Randevu almaq üçün qeydiyyatdan keçin və ya hesabınıza daxil olun" de.
5. Sən həkim deyilsən — diaqnoz qoymursan, dərman təyin etmirsən. Simptom soruşsalar həkimə müraciəti tövsiyə et.
6. Təcili hal (güclü ağrı, nəfəs darlığı, huşsuzluq) → dərhal təcili yardıma müraciət.
7. Mövzudan kənar suallara nəzakətlə imtina et.
8. Cavablar qısa olsun (2-4 cümlə). Bilmədiyini uydurma.
TXT;
    }

    // ---------- xəstəxananın ümumi datası (hamı üçün) ----------
    private function hospitalContext(): string
    {
        $departments = Department::withCount('doctors')->get()
            ->map(fn ($d) => "- {$d->name}: {$d->description} ({$d->doctors_count} həkim)")
            ->implode("\n");

        $doctors = Doctor::with(['user', 'department', 'schedules'])->get()
            ->map(function ($doc) {
                $days = $doc->schedules->map(fn ($s) => $this->dayAz($s->day_of_week)
                    . ' ' . substr($s->start_time, 0, 5) . '-' . substr($s->end_time, 0, 5)
                )->implode(', ');

                return "- {$doc->user?->name} | {$doc->specialization} | Şöbə: {$doc->department?->name}"
                    . " | Təcrübə: {$doc->experience_years} il | Haqq: {$doc->consultation_fee} AZN"
                    . ($days ? " | İş günləri: {$days}" : " | İş qrafiki təyin edilməyib");
            })
            ->implode("\n");

        return "MÖVCUD ŞÖBƏLƏR:\n{$departments}\n\nMÖVCUD HƏKİMLƏR:\n{$doctors}";
    }

    // ---------- YALNIZ həmin xəstənin şəxsi datası ----------
    private function patientContext(User $user): string
    {
        $patient = $user->patient;
        if (! $patient) {
            return '';
        }

        $appointments = Appointment::with('doctor.user')
            ->where('patient_id', $patient->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('appointment_date')
            ->limit(5)
            ->get()
            ->map(fn ($a) => "- {$a->appointment_date?->format('d.m.Y')} "
                . substr($a->appointment_time, 0, 5)
                . " | {$a->doctor?->user?->name} | Status: "
                . ($a->status === 'pending' ? 'təsdiq gözləyir' : 'təsdiqlənib'))
            ->implode("\n") ?: 'Aktiv randevu yoxdur.';

        $records = MedicalRecord::with(['doctor.user', 'prescriptions'])
            ->where('patient_id', $patient->id)
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($r) {
                $meds = $r->prescriptions->pluck('medicine')->implode(', ');
                return "- {$r->created_at->format('d.m.Y')} | Həkim: {$r->doctor?->user?->name}"
                    . " | Diaqnoz: {$r->diagnosis}"
                    . ($meds ? " | Reseptlər: {$meds}" : '');
            })
            ->implode("\n") ?: 'Tibbi qeyd yoxdur.';

        $labCount = LabTest::where('patient_id', $patient->id)->count();

        return <<<TXT


BU İSTİFADƏÇİNİN ŞƏXSİ MƏLUMATLARI (adı: {$user->name}):
Aktiv randevular:
{$appointments}

Son tibbi qeydlər:
{$records}

Lab nəticələri: {$labCount} ədəd ("Lab nəticələrim" səhifəsindən yükləmək olar).

⚠️ Bu məlumatlar YALNIZ bu istifadəçiyə aiddir. Soruşulanda istifadə et, başqa xəstələr haqqında heç nə demə.
TXT;
    }

    private function dayAz(string $day): string
    {
        return [
            'monday' => 'B.e', 'tuesday' => 'Ç.a', 'wednesday' => 'Çərşənbə',
            'thursday' => 'C.a', 'friday' => 'Cümə', 'saturday' => 'Şənbə', 'sunday' => 'Bazar',
        ][$day] ?? $day;
    }

    public function history(User $user, int $limit = 20)
    {
        return AiMessage::where('user_id', $user->id)
            ->latest()->limit($limit)->get()->reverse()->values();
    }

    public function clearHistory(User $user): void
    {
        AiMessage::where('user_id', $user->id)->delete();
    }

    // ---------- GİRİŞSİZ sual (tarixçə saxlanmır) ----------
    public function askPublic(string $question): string
    {
        $messages = [
            ['role' => 'user', 'content' => $question],
        ];

        return $this->callAi(
            $messages,
            $this->publicSystemPrompt() . "\n\n" . $this->hospitalContext()
        );
    }

    // ---------- LOGIN OLMUŞ istifadəçi sualı ----------
    public function ask(User $user, string $question): string
    {
        AiMessage::create([
            'user_id' => $user->id,
            'role' => 'user',
            'content' => $question,
        ]);

        $history = AiMessage::where('user_id', $user->id)
            ->latest()->limit(10)->get()->reverse()->values();

        $messages = [];
        foreach ($history as $m) {
            $messages[] = [
                'role' => $m->role === 'assistant' ? 'assistant' : 'user',
                'content' => $m->content,
            ];
        }

        $systemText = $this->systemPrompt()
            . "\n\n" . $this->hospitalContext()
            . $this->patientContext($user);

        $answer = $this->callAi($messages, $systemText);

        AiMessage::create([
            'user_id' => $user->id,
            'role' => 'assistant',
            'content' => $answer,
        ]);

        return $answer;
    }

    private function callAi(array $messages, ?string $systemText = null): string
    {
        $key = config('services.groq.key');
        $model = config('services.groq.model');

        if (! $key) {
            return 'AI köməkçi hazırda əlçatan deyil (API açarı təyin edilməyib).';
        }

        // System mesajını əvvələ əlavə et
        $allMessages = [
            ['role' => 'system', 'content' => $systemText ?? ($this->systemPrompt() . "\n\n" . $this->hospitalContext())],
            ...$messages,
        ];

        $maxRetries = 3;
        $lastError = null;

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                $response = Http::timeout(30)
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . $key,
                        'Content-Type' => 'application/json',
                    ])
                    ->post('https://api.groq.com/openai/v1/chat/completions', [
                        'model' => $model,
                        'messages' => $allMessages,
                        'temperature' => 0.4,
                        'max_tokens' => 500,
                    ]);

                if ($response->successful()) {
                    return data_get($response->json(), 'choices.0.message.content')
                        ?? 'Cavab alına bilmədi.';
                }

                logger()->warning('Groq xətası', [
                    'attempt' => $attempt,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                // 429 = Rate Limit — retry with exponential backoff
                if ($response->status() === 429 && $attempt < $maxRetries) {
                    $delay = pow(2, $attempt);
                    logger()->info("Groq 429 - {$delay}s gözlənilir (cəhd {$attempt}/{$maxRetries})");
                    sleep($delay);
                    continue;
                }

                if ($response->status() === 429) {
                    $lastError = 'AI köməkçi limitə çatıb (kvota). Bir azdan və ya sabah yenidən cəhd edin.';
                } else {
                    $lastError = 'AI xətası (kod: ' . $response->status() . ').';
                }
                break;

            } catch (\Throwable $e) {
                logger()->error('Groq istisna', [
                    'attempt' => $attempt,
                    'msg' => $e->getMessage(),
                ]);

                if ($attempt < $maxRetries) {
                    sleep(pow(2, $attempt));
                    continue;
                }

                $lastError = 'Bağışlayın, texniki problem yarandı.';
                break;
            }
        }

        return $lastError ?? 'Bağışlayın, texniki problem yarandı.';
    }
}
