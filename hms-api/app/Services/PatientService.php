<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\User;
use App\Repositories\PatientRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PatientService
{
    public function __construct(
        private PatientRepository $repository
    ) {}

    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    public function getById(int $id): ?Patient
    {
        return $this->repository->find($id);
    }

 
    public function create(array $data): Patient
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
            $user->markEmailAsVerified();
            $user->assignRole('patient');

            return $this->repository->create([
                'user_id' => $user->id,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? null,
                'blood_group' => $data['blood_group'] ?? null,
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'] ?? null,
                'emergency_contact' => $data['emergency_contact'] ?? null,
            ]);
        });
    }

    public function update(Patient $patient, array $data): Patient
    {
        return DB::transaction(function () use ($patient, $data) {
            $userData = ['name' => $data['name'] ?? $patient->user->name];


            if (!empty($data['email']) && $data['email'] !== $patient->user->email) {
                $userData['email'] = $data['email'];
            }
            $patient->user->update($userData);

            return $this->repository->update($patient, [
                'date_of_birth' => $data['date_of_birth'] ?? $patient->date_of_birth,
                'gender' => $data['gender'] ?? $patient->gender,
                'blood_group' => $data['blood_group'] ?? $patient->blood_group,
                'address' => $data['address'] ?? $patient->address,
                'phone' => $data['phone'] ?? $patient->phone,
                'emergency_contact' => $data['emergency_contact'] ?? $patient->emergency_contact,
            ]);
        });
    }

    public function delete(Patient $patient): void
    {
        $patient->user->delete();
    }
}
