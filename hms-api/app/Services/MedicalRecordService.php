<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Repositories\MedicalRecordRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MedicalRecordService
{
    public function __construct(
        private MedicalRecordRepository $repository
    ) {}

    public function forPatient(int $patientId): Collection
    {
        return $this->repository->forPatient($patientId);
    }

    public function forDoctor(int $doctorId): Collection
    {
        return $this->repository->forDoctor($doctorId);
    }

    public function getById(int $id): ?MedicalRecord
    {
        return $this->repository->find($id);
    }

    public function create(int $doctorId, array $data): MedicalRecord
    {
        $appointment = Appointment::findOrFail($data['appointment_id']);

        if ($appointment->doctor_id !== $doctorId) {
            throw ValidationException::withMessages([
                'appointment_id' => ['Bu randevu sizə aid deyil.'],
            ]);
        }

        if ($appointment->medicalRecord) {
            throw ValidationException::withMessages([
                'appointment_id' => ['Bu randevu üçün artıq tibbi qeyd mövcuddur.'],
            ]);
        }

        return DB::transaction(function () use ($doctorId, $appointment, $data) {
            $record = $this->repository->create([
                'patient_id' => $appointment->patient_id,
                'doctor_id' => $doctorId,
                'appointment_id' => $appointment->id,
                'diagnosis' => $data['diagnosis'],
                'notes' => $data['notes'] ?? null,
            ]);

            if (! empty($data['prescriptions'])) {
                foreach ($data['prescriptions'] as $p) {
                    $record->prescriptions()->create([
                        'medicine' => $p['medicine'],
                        'dosage' => $p['dosage'] ?? null,
                        'duration' => $p['duration'] ?? null,
                        'instructions' => $p['instructions'] ?? null,
                    ]);
                }
            }

            $appointment->update(['status' => 'completed']);

            return $record->load(['prescriptions', 'patient.user', 'doctor.user']);
        });
    }
}
