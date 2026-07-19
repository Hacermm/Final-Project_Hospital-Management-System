<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicalRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'diagnosis' => $this->diagnosis,
            'notes' => $this->notes,
            'date' => $this->created_at?->format('Y-m-d'),
            'doctor' => $this->whenLoaded('doctor', fn () => [
                'name' => $this->doctor->user?->name,
                'specialization' => $this->doctor->specialization,
            ]),
            'patient' => $this->whenLoaded('patient', fn () => [
                'name' => $this->patient->user?->name,
            ]),
            'prescriptions' => PrescriptionResource::collection(
                $this->whenLoaded('prescriptions')
            ),
        ];
    }
}
