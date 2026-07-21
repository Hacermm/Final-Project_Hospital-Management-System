<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LabTestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'file_name' => $this->file_name,
            'date' => $this->created_at?->format('Y-m-d'),
            'doctor' => $this->whenLoaded('doctor', fn () => $this->doctor->user?->name),
            'patient' => $this->whenLoaded('patient', fn () => $this->patient->user?->name),
        ];
    }
}
