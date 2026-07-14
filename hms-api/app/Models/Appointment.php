<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id', 'doctor_id', 'appointment_date',
        'appointment_time', 'status', 'reason',
    ];

    protected function casts(): array
    {
        return ['appointment_date' => 'date'];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function medicalRecord(): HasOne
    {
        return $this->hasOne(MedicalRecord::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
