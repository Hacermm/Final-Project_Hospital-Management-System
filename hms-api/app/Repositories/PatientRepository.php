<?php

namespace App\Repositories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Collection;

class PatientRepository
{
    public function all(): Collection
    {
        return Patient::with('user')->latest()->get();
    }

    public function find(int $id): ?Patient
    {
        return Patient::with('user')->find($id);
    }

    public function create(array $data): Patient
    {
        return Patient::create($data);
    }

    public function update(Patient $patient, array $data): Patient
    {
        $patient->update($data);
        return $patient->load('user');
    }

    public function delete(Patient $patient): void
    {
        $patient->delete();
    }
}
