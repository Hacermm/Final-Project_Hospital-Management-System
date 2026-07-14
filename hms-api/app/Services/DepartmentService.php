<?php

namespace App\Services;

use App\Models\Department;
use App\Repositories\DepartmentRepository;
use Illuminate\Database\Eloquent\Collection;

class DepartmentService
{
    public function __construct(
        private DepartmentRepository $repository
    ) {}

    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    public function getById(int $id): ?Department
    {
        return $this->repository->find($id);
    }

    public function create(array $data): Department
    {
        return $this->repository->create($data);
    }

    public function update(Department $department, array $data): Department
    {
        return $this->repository->update($department, $data);
    }

    public function delete(Department $department): void
    {
        $this->repository->delete($department);
    }
}
