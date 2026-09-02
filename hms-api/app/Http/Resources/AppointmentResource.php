<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->appointment_date?->format('Y-m-d'),
            'time' => substr($this->appointment_time, 0, 5),
            'status' => $this->status,
            'reason' => $this->reason,
            'doctor' => $this->whenLoaded('doctor', fn () => [
                'id' => $this->doctor->id,
                'name' => $this->doctor->user?->name,
                'specialization' => $this->doctor->specialization,
                'department' => $this->doctor->department?->name,
            ]),
            'patient' => $this->whenLoaded('patient', fn () => [
                'id' => $this->patient->id,
                'name' => $this->patient->user?->name,
                'blood_group' => $this->patient->blood_group,
                'allergies' => $this->patient->allergies,
                'chronic_diseases' => $this->patient->chronic_diseases,
                'past_diseases' => $this->patient->past_diseases,
            ]),
        ];
    }
}
