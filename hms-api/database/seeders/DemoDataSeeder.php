<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->clearOldData();

        $departments = $this->createDepartments();
        $doctors = $this->createDoctors($departments);
        $patients = $this->createPatients();
        $this->createSchedules($doctors);
        $this->createAppointmentsAndRecords($doctors, $patients);
        $this->createAdmins();

        $this->command->info('✅ Demo data hazırdır!');
        $this->command->info('   Şöbələr: ' . count($departments) . ' | Həkimlər: ' . count($doctors) . ' | Xəstələr: ' . count($patients));
    }

    private function clearOldData(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach ([
            'ai_messages', 'messages', 'conversations', 'call_logs',
            'lab_tests', 'prescriptions', 'medical_records',
            'appointments', 'doctor_schedules', 'doctors', 'patients',
            'departments', 'personal_access_tokens',
        ] as $table) {
            DB::table($table)->truncate();
        }

        DB::table('model_has_roles')->truncate();
        DB::table('users')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->command->info('🧹 Köhnə data təmizləndi.');
    }

    private function createDepartments(): array
    {
        $data = [
            ['name' => 'Kardiologiya', 'description' => 'Ürək və damar xəstəliklərinin diaqnostikası və müalicəsi'],
            ['name' => 'Nevrologiya', 'description' => 'Sinir sistemi xəstəliklərinin müasir üsullarla müalicəsi'],
            ['name' => 'Pediatriya', 'description' => 'Uşaq sağlamlığı, profilaktika və inkişaf müşahidəsi'],
            ['name' => 'Ortopediya', 'description' => 'Sümük, oynaq və əzələ sistemi problemlərinin müalicəsi'],
            ['name' => 'Terapiya', 'description' => 'Ümumi tibbi müayinə və daxili xəstəliklər'],
            ['name' => 'Oftalmologiya', 'description' => 'Göz xəstəlikləri və görmə korreksiyası'],
        ];

        $result = [];
        foreach ($data as $d) {
            $result[$d['name']] = Department::create($d);
        }
        return $result;
    }

    private function createDoctors(array $departments): array
    {
        $data = [
            ['name' => 'Dr. Anar Məmmədov', 'email' => 'doctor@hms.test', 'spec' => 'Kardioloq', 'dept' => 'Kardiologiya', 'exp' => 15, 'fee' => 80, 'bio' => 'Ürək-damar xəstəlikləri üzrə 15 illik təcrübəyə malik mütəxəssis. Beynəlxalq sertifikatlı kardioloq.'],
            ['name' => 'Dr. Leyla Hüseynova', 'email' => 'leyla.h@hms.test', 'spec' => 'Nevroloq', 'dept' => 'Nevrologiya', 'exp' => 12, 'fee' => 75, 'bio' => 'Sinir sistemi xəstəlikləri, baş ağrıları və epilepsiya üzrə ixtisaslaşıb.'],
            ['name' => 'Dr. Elçin Quliyev', 'email' => 'elcin.q@hms.test', 'spec' => 'Pediatr', 'dept' => 'Pediatriya', 'exp' => 9, 'fee' => 60, 'bio' => 'Uşaq sağlamlığı və inkişafı üzrə mütəxəssis. Yenidoğulmuş müayinəsi.'],
            ['name' => 'Dr. Nigar Əliyeva', 'email' => 'nigar.a@hms.test', 'spec' => 'Ortoped-travmatoloq', 'dept' => 'Ortopediya', 'exp' => 11, 'fee' => 85, 'bio' => 'Oynaq protezləmə və idman travmaları üzrə cərrah.'],
            ['name' => 'Dr. Rəşad Kərimov', 'email' => 'resad.k@hms.test', 'spec' => 'Terapevt', 'dept' => 'Terapiya', 'exp' => 7, 'fee' => 50, 'bio' => 'Ümumi tibbi müayinə, profilaktik check-up və daxili xəstəliklər.'],
            ['name' => 'Dr. Günel Bağırova', 'email' => 'gunel.b@hms.test', 'spec' => 'Oftalmoloq', 'dept' => 'Oftalmologiya', 'exp' => 10, 'fee' => 70, 'bio' => 'Göz xəstəlikləri, katarakta cərrahiyyəsi və görmə korreksiyası.'],
        ];

        $result = [];
        foreach ($data as $d) {
            $user = User::create([
                'name' => $d['name'],
                'email' => $d['email'],
                'password' => Hash::make('password'),
            ]);
            $user->markEmailAsVerified();
            $user->assignRole('doctor');

            $result[] = Doctor::create([
                'user_id' => $user->id,
                'department_id' => $departments[$d['dept']]->id,
                'specialization' => $d['spec'],
                'bio' => $d['bio'],
                'experience_years' => $d['exp'],
                'consultation_fee' => $d['fee'],
                'phone' => '+994 50 ' . rand(200, 799) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
            ]);
        }
        return $result;
    }

    private function createPatients(): array
    {
        $data = [
            ['name' => 'Kamran Səfərov', 'email' => 'patient@hms.test', 'dob' => '1992-04-18', 'gender' => 'male', 'blood' => 'A+'],
            ['name' => 'Aysel Rəhimova', 'email' => 'aysel.r@hms.test', 'dob' => '1988-11-02', 'gender' => 'female', 'blood' => 'O+'],
            ['name' => 'Tural Abbasov', 'email' => 'tural.a@hms.test', 'dob' => '1975-07-25', 'gender' => 'male', 'blood' => 'B+'],
            ['name' => 'Səbinə Nəbiyeva', 'email' => 'sebine.n@hms.test', 'dob' => '1999-01-30', 'gender' => 'female', 'blood' => 'AB+'],
            ['name' => 'Orxan Vəliyev', 'email' => 'orxan.v@hms.test', 'dob' => '1984-09-12', 'gender' => 'male', 'blood' => 'A-'],
        ];

        $result = [];
        foreach ($data as $p) {
            $user = User::create([
                'name' => $p['name'],
                'email' => $p['email'],
                'password' => Hash::make('password'),
            ]);
            $user->markEmailAsVerified();
            $user->assignRole('patient');

            $result[] = Patient::create([
                'user_id' => $user->id,
                'date_of_birth' => $p['dob'],
                'gender' => $p['gender'],
                'blood_group' => $p['blood'],
                'address' => 'Bakı ş., Nərimanov r., Atatürk pr. ' . rand(10, 90),
                'phone' => '+994 55 ' . rand(200, 799) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                'emergency_contact' => '+994 51 ' . rand(200, 799) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
            ]);
        }
        return $result;
    }

    private function createSchedules(array $doctors): void
    {
        $weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        foreach ($doctors as $i => $doctor) {
            $start = $i % 2 === 0 ? '09:00' : '13:00';
            $end = $i % 2 === 0 ? '15:00' : '19:00';

            foreach ($weekdays as $day) {
                DoctorSchedule::create([
                    'doctor_id' => $doctor->id,
                    'day_of_week' => $day,
                    'start_time' => $start,
                    'end_time' => $end,
                    'is_available' => true,
                ]);
            }

            if ($i % 3 === 0) {
                DoctorSchedule::create([
                    'doctor_id' => $doctor->id,
                    'day_of_week' => 'saturday',
                    'start_time' => '10:00',
                    'end_time' => '14:00',
                    'is_available' => true,
                ]);
            }
        }
    }

    private function createAppointmentsAndRecords(array $doctors, array $patients): void
    {
        $diagnoses = [
            ['d' => 'Arterial hipertoniya (I dərəcə)', 'n' => 'Təzyiqin gündəlik ölçülməsi tövsiyə olunur. Duz qəbulu azaldılmalıdır.', 'meds' => [['Lisinopril', '10 mg', '30 gün', 'Gündə 1 dəfə, səhər'], ['Aspirin Cardio', '100 mg', '30 gün', 'Gündə 1 dəfə, axşam yeməkdən sonra']]],
            ['d' => 'Kəskin faringit', 'n' => 'Bol maye qəbulu və istirahət tövsiyə olunur.', 'meds' => [['Amoksisillin', '500 mg', '7 gün', 'Gündə 3 dəfə'], ['Paracetamol', '500 mg', '5 gün', 'Hərarət 38°C-dən yuxarı olduqda']]],
            ['d' => 'Miqren', 'n' => 'Tetikleyici amillərdən (stress, yuxusuzluq) qaçınmaq lazımdır.', 'meds' => [['Sumatriptan', '50 mg', '10 gün', 'Ağrı başlayanda 1 tablet']]],
            ['d' => 'Dəmir çatışmazlığı anemiyası', 'n' => '3 ay sonra təkrar qan analizi tələb olunur.', 'meds' => [['Ferrum Lek', '100 mg', '90 gün', 'Gündə 1 dəfə, yeməkdən sonra'], ['Vitamin C', '500 mg', '90 gün', 'Dəmir preparatı ilə birlikdə']]],
            ['d' => 'Bel nahiyəsində osteoxondroz', 'n' => 'Fizioterapiya kursu və müalicəvi bədən tərbiyəsi tövsiyə olunur.', 'meds' => [['Diclofenac', '75 mg', '10 gün', 'Gündə 2 dəfə, yeməkdən sonra']]],
        ];

        $reasons = [
            'Sinəmdə sıxıntı və təngnəfəslik hiss edirəm',
            'Bir həftədir davam edən baş ağrısı',
            'Boğaz ağrısı və hərarət',
            'Ümumi zəiflik və yorğunluq',
            'Bel nahiyəsində ağrı',
            'Profilaktik müayinə üçün',
        ];

        foreach ($diagnoses as $i => $diag) {
            $doctor = $doctors[$i % count($doctors)];
            $patient = $patients[$i % count($patients)];

            $appointment = Appointment::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'appointment_date' => now()->subDays(rand(5, 40))->format('Y-m-d'),
                'appointment_time' => sprintf('%02d:%s', rand(9, 17), rand(0, 1) ? '00' : '30'),
                'reason' => $reasons[$i % count($reasons)],
                'status' => 'completed',
            ]);

            $record = MedicalRecord::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'appointment_id' => $appointment->id,
                'diagnosis' => $diag['d'],
                'notes' => $diag['n'],
            ]);

            foreach ($diag['meds'] as $m) {
                $record->prescriptions()->create([
                    'medicine' => $m[0],
                    'dosage' => $m[1],
                    'duration' => $m[2],
                    'instructions' => $m[3],
                ]);
            }
        }

        $statuses = ['confirmed', 'pending', 'confirmed', 'pending', 'cancelled'];

        foreach ($statuses as $i => $status) {
            $doctor = $doctors[($i + 2) % count($doctors)];
            $patient = $patients[$i % count($patients)];

            // iş gününə düşsün (bazar ertəsi - cümə)
            $date = now()->addDays(rand(1, 12));
            while (in_array($date->dayOfWeek, [0, 6])) {
                $date->addDay();
            }

            Appointment::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'appointment_date' => $date->format('Y-m-d'),
                'appointment_time' => sprintf('%02d:%s', rand(10, 16), rand(0, 1) ? '00' : '30'),
                'reason' => $reasons[($i + 1) % count($reasons)],
                'status' => $status,
            ]);
        }
    }

    private function createAdmins(): void
    {
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@hms.test',
            'password' => Hash::make('password'),
        ]);
        $superAdmin->markEmailAsVerified();
        $superAdmin->assignRole('super_admin');

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@hms.test',
            'password' => Hash::make('password'),
        ]);
        $admin->markEmailAsVerified();
        $admin->assignRole('admin');
    }
}
