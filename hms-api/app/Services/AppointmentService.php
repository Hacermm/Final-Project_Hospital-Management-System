<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Repositories\AppointmentRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class AppointmentService
{
    private const SLOT_MINUTES = 30;   

    public function __construct(
        private AppointmentRepository $repository
    ) {}

    public function forPatient(int $patientId): Collection
    {
        return $this->repository->forPatient($patientId);
    }

    public function forDoctor(int $doctorId): Collection
    {
        return $this->repository->forDoctor($doctorId);
    }

    public function all(): Collection
    {
        return $this->repository->all();
    }


    public function availableSlots(Doctor $doctor, string $date): array
    {
        $carbon = Carbon::parse($date);


        if ($carbon->isPast() && ! $carbon->isToday()) {
            return [];
        }

        $dayName = strtolower($carbon->format('l'));


        $schedule = $doctor->schedules()
            ->where('day_of_week', $dayName)
            ->where('is_available', true)
            ->first();

        if (! $schedule) {
            return [];
        }

        $slots = [];
        $start = Carbon::parse($date . ' ' . $schedule->start_time);
        $end = Carbon::parse($date . ' ' . $schedule->end_time);

        while ($start->lt($end)) {
            $slots[] = $start->format('H:i');
            $start->addMinutes(self::SLOT_MINUTES);
        }

        $booked = $this->repository->bookedTimes($doctor->id, $date);
        $free = array_values(array_diff($slots, $booked));

        if ($carbon->isToday()) {
            $now = Carbon::now()->format('H:i');
            $free = array_values(array_filter($free, fn ($s) => $s > $now));
        }

        return $free;
    }

    public function create(int $patientId, array $data): Appointment
    {
        $doctor = Doctor::findOrFail($data['doctor_id']);

        $available = $this->availableSlots($doctor, $data['appointment_date']);

        if (! in_array($data['appointment_time'], $available)) {
            throw ValidationException::withMessages([
                'appointment_time' => ['Bu saat artıq tutulub və ya həkim həmin vaxt işləmir.'],
            ]);
        }

        return $this->repository->create([
            'patient_id' => $patientId,
            'doctor_id' => $data['doctor_id'],
            'appointment_date' => $data['appointment_date'],
            'appointment_time' => $data['appointment_time'],
            'reason' => $data['reason'] ?? null,
            'status' => 'pending',
        ]);
    }

    public function updateStatus(Appointment $appointment, string $status): Appointment
    {
        return $this->repository->updateStatus($appointment, $status);
    }
}
