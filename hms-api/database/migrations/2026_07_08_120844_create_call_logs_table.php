<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('call_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('caller_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();
        $table->timestamp('started_at')->nullable();
        $table->timestamp('ended_at')->nullable();
        $table->enum('status', ['missed','completed','rejected'])->default('missed');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('call_logs');
    }
};
