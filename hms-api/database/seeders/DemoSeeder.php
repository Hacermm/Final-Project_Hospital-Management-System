<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@hms.test'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole('super_admin');

        $admin = User::firstOrCreate(
            ['email' => 'admin@hms.test'],
            [
                'name' => 'Hospital Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        $cardiology = Department::firstOrCreate(
            ['name' => 'Cardiology'],
            ['description' => 'Ürək və damar xəstəlikləri']
        );
        Department::firstOrCreate(
            ['name' => 'Neurology'],
            ['description' => 'Sinir sistemi xəstəlikləri']
        );
        Department::firstOrCreate(
            ['name' => 'Pediatrics'],
            ['description' => 'Uşaq sağlamlığı']
        );

        $doctorUser = User::firstOrCreate(
            ['email' => 'doctor@hms.test'],
            [
                'name' => 'Dr. Anne Hathaway',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $doctorUser->assignRole('doctor');

        Doctor::firstOrCreate(
            ['user_id' => $doctorUser->id],
            [
                'department_id' => $cardiology->id,
                'specialization' => 'Kardioloq',
                'bio' => '10 illik təcrübəli kardioloq',
                'experience_years' => 10,
                'consultation_fee' => 50.00,
                'phone' => '+994501234567',
            ]
        );

        $patientUser = User::firstOrCreate(
            ['email' => 'patient@hms.test'],
            [
                'name' => 'Henry Cavill',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $patientUser->assignRole('patient');

        Patient::firstOrCreate(
            ['user_id' => $patientUser->id],
            [
                'date_of_birth' => '2001-05-14',
                'gender' => 'male',
                'blood_group' => 'A+',
                'address' => 'Bakı, Azərbaycan',
                'phone' => '+994551111111',
                'emergency_contact' => '+994552222222',
            ]
        );
    }
}
