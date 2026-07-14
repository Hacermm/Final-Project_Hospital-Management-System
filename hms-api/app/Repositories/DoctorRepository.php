<?php

namespace App\Repositories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Collection;

class DoctorRepository
{
    public function all(): Collection
    {
        return Doctor::with(['user', 'department'])->latest()->get();
    }

    public function find(int $id): ?Doctor
    {
        return Doctor::with(['user', 'department'])->find($id);
    }

    public function create(array $data): Doctor
    {
        return Doctor::create($data);
    }

    public function update(Doctor $doctor, array $data): Doctor
    {
        $doctor->update($data);
        return $doctor->load(['user', 'department']);
    }

    public function delete(Doctor $doctor): void
    {
        $doctor->delete();
    }
}
