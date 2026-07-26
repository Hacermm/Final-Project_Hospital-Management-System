<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\User;
use App\Repositories\DoctorRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DoctorService
{
    public function __construct(
        private DoctorRepository $repository
    ) {}

    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    public function getById(int $id): ?Doctor
    {
        return $this->repository->find($id);
    }

    public function create(array $data, ?UploadedFile $photo = null): Doctor
    {
        return DB::transaction(function () use ($data, $photo) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
            $user->markEmailAsVerified();
            $user->assignRole('doctor');

            return $this->repository->create([
                'user_id' => $user->id,
                'department_id' => $data['department_id'] ?? null,
                'specialization' => $data['specialization'],
                'bio' => $data['bio'] ?? null,
                'experience_years' => $data['experience_years'] ?? 0,
                'consultation_fee' => $data['consultation_fee'] ?? 0,
                'phone' => $data['phone'] ?? null,
                'photo' => $photo ? $photo->store('doctor-photos', 'public') : null,
            ]);
        });
    }

    public function update(Doctor $doctor, array $data, ?UploadedFile $photo = null): Doctor
    {
        return DB::transaction(function () use ($doctor, $data, $photo) {
            $userData = ['name' => $data['name'] ?? $doctor->user->name];

            if (!empty($data['email']) && $data['email'] !== $doctor->user->email) {
                $userData['email'] = $data['email'];
            }
            $doctor->user->update($userData);

            $fields = [
                'department_id' => $data['department_id'] ?? $doctor->department_id,
                'specialization' => $data['specialization'] ?? $doctor->specialization,
                'bio' => $data['bio'] ?? $doctor->bio,
                'experience_years' => $data['experience_years'] ?? $doctor->experience_years,
                'consultation_fee' => $data['consultation_fee'] ?? $doctor->consultation_fee,
                'phone' => $data['phone'] ?? $doctor->phone,
            ];

            if ($photo) {
                if ($doctor->photo) {
                    Storage::disk('public')->delete($doctor->photo);
                }
                $fields['photo'] = $photo->store('doctor-photos', 'public');
            }

            return $this->repository->update($doctor, $fields);
        });
    }

    public function delete(Doctor $doctor): void
    {
        if ($doctor->photo) {
            Storage::disk('public')->delete($doctor->photo);
        }
        $doctor->user->delete();
    }
}
