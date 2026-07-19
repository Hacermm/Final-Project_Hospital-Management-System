<?php

namespace App\Repositories;

use App\Models\MedicalRecord;
use Illuminate\Database\Eloquent\Collection;

class MedicalRecordRepository
{
    public function forPatient(int $patientId): Collection
    {
        return MedicalRecord::with(['doctor.user', 'prescriptions', 'appointment'])
            ->where('patient_id', $patientId)
            ->latest()
            ->get();
    }

    public function forDoctor(int $doctorId): Collection
    {
        return MedicalRecord::with(['patient.user', 'prescriptions', 'appointment'])
            ->where('doctor_id', $doctorId)
            ->latest()
            ->get();
    }

    public function find(int $id): ?MedicalRecord
    {
        return MedicalRecord::with(['doctor.user', 'patient.user', 'prescriptions', 'appointment'])
            ->find($id);
    }

    public function create(array $data): MedicalRecord
    {
        return MedicalRecord::create($data);
    }
}
