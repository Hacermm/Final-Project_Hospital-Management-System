<?php

namespace App\Repositories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Collection;

class DepartmentRepository
{
    public function all(): Collection
    {
        return Department::withCount('doctors')->latest()->get();
    }

    public function find(int $id): ?Department
    {
        return Department::withCount('doctors')->find($id);
    }

    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function update(Department $department, array $data): Department
    {
        $department->update($data);
        return $department;
    }

    public function delete(Department $department): void
    {
        $department->delete();
    }
}
