<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'clinic_address', 'value' => 'Bakı şəhəri, Nərimanov r., Atatürk pr. 58', 'group' => 'contact'],
            ['key' => 'clinic_phone', 'value' => '+994 (12) 345 67 89', 'group' => 'contact'],
            ['key' => 'clinic_whatsapp', 'value' => '994123456789', 'group' => 'contact'],
            ['key' => 'clinic_email', 'value' => 'info@novacare.az', 'group' => 'contact'],
            ['key' => 'clinic_working_hours', 'value' => 'Bazar ertəsi - Şənbə: 08:30 - 19:00', 'group' => 'contact'],
            ['key' => 'clinic_short_address', 'value' => 'Bakı ş., Azərbaycan', 'group' => 'contact'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
