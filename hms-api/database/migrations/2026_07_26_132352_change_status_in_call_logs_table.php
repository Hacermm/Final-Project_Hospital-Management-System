<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE call_logs MODIFY status VARCHAR(20) NOT NULL DEFAULT 'ringing'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE call_logs MODIFY status ENUM('missed','completed','rejected') NOT NULL DEFAULT 'missed'");
    }
};
