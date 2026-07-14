<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user?->name,
            'email' => $this->user?->email,
            'specialization' => $this->specialization,
            'bio' => $this->bio,
            'experience_years' => $this->experience_years,
            'consultation_fee' => $this->consultation_fee,
            'phone' => $this->phone,
            'department' => $this->department ? [
                'id' => $this->department->id,
                'name' => $this->department->name,
            ] : null,
        ];
    }
}
