<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetSuperAdminPassword extends Command
{

    protected $signature = 'hms:reset-superadmin {email}';


    protected $description = 'Super admin parolunu terminaldan sıfırla (son çarə bərpa)';


    public function handle(): int
    {
       $user = User::where('email', $this->argument('email'))->first();

        if (! $user || ! $user->hasRole('super_admin')) {
            $this->error('Bu email ilə super admin tapılmadı.');
            return self::FAILURE;
        }

        $password = $this->secret('Yeni parol daxil edin');
        $confirm = $this->secret('Parolu təsdiqlə');

        if ($password !== $confirm) {
            $this->error('Parollar uyğun gəlmir.');
            return self::FAILURE;
        }

        if (strlen($password) < 8) {
            $this->error('Parol ən azı 8 simvol olmalıdır.');
            return self::FAILURE;
        }

        $user->update(['password' => Hash::make($password)]);

        $this->info('✓ Super admin parolu yeniləndi: ' . $user->email);
        return self::SUCCESS;

    }
}
