<?php

namespace App\Repositories;

use App\Models\Appointment;
use Illuminate\Database\Eloquent\Collection;

class AppointmentRepository
{
    public function forPatient(int $patientId): Collection
    {
        return Appointment::with(['doctor.user', 'doctor.department'])
            ->where('patient_id', $patientId)
            ->orderByDesc('appointment_date')
            ->get();
    }

    public function forDoctor(int $doctorId): Collection
    {
        return Appointment::with(['patient.user'])
            ->where('doctor_id', $doctorId)
            ->orderByDesc('appointment_date')
            ->get();
    }

    public function all(): Collection
    {
        return Appointment::with(['patient.user', 'doctor.user'])
            ->orderByDesc('appointment_date')
            ->get();
    }


    public function bookedTimes(int $doctorId, string $date): array
    {
        return Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->pluck('appointment_time')
            ->map(fn ($t) => substr($t, 0, 5))
            ->toArray();
    }

    public function create(array $data): Appointment
    {
        return Appointment::create($data);
    }

    public function updateStatus(Appointment $appointment, string $status): Appointment
    {
        $appointment->update(['status' => $status]);
        return $appointment;
    }
}
