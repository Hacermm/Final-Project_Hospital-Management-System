<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'summary' => $this->summary(),
            'monthly' => $this->monthlyAppointments(),
            'by_status' => $this->byStatus(),
            'by_department' => $this->byDepartment(),
            'top_doctors' => $this->topDoctors(),
        ]);
    }

    private function summary(): array
    {
        return [
            'doctors' => Doctor::count(),
            'patients' => Patient::count(),
            'departments' => Department::count(),
            'appointments' => Appointment::count(),
            'appointments_today' => Appointment::whereDate('appointment_date', today())->count(),
            'pending' => Appointment::where('status', 'pending')->count(),
            'medical_records' => MedicalRecord::count(),
            'users' => User::count(),
        ];
    }

    private function monthlyAppointments(): array
    {
        $months = [];
        $azMonths = [1 => 'Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);

            $count = Appointment::whereYear('appointment_date', $date->year)
                ->whereMonth('appointment_date', $date->month)
                ->count();

            $months[] = [
                'month' => $azMonths[$date->month] . ' ' . $date->format('y'),
                'count' => $count,
            ];
        }

        return $months;
    }

    private function byStatus(): array
    {
        $labels = [
            'pending' => 'Gözləyir',
            'confirmed' => 'Təsdiqlənib',
            'completed' => 'Tamamlanıb',
            'cancelled' => 'Ləğv edilib',
        ];

        return Appointment::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(fn ($r) => [
                'name' => $labels[$r->status] ?? $r->status,
                'value' => (int) $r->total,
            ])
            ->toArray();
    }

    private function byDepartment(): array
    {
        return Department::withCount([
                'doctors',
            ])
            ->get()
            ->map(function ($dept) {
                $appointments = Appointment::whereHas('doctor', fn ($q) => $q->where('department_id', $dept->id))->count();
                return [
                    'name' => $dept->name,
                    'doctors' => $dept->doctors_count,
                    'appointments' => $appointments,
                ];
            })
            ->sortByDesc('appointments')
            ->values()
            ->toArray();
    }

    private function topDoctors(): array
    {
        return Doctor::with('user')
            ->withCount('appointments')
            ->orderByDesc('appointments_count')
            ->limit(5)
            ->get()
            ->map(fn ($d) => [
                'name' => $d->user?->name,
                'specialization' => $d->specialization,
                'count' => $d->appointments_count,
            ])
            ->toArray();
    }
}
