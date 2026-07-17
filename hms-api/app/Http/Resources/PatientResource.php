<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user?->name,
            'email' => $this->user?->email,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'blood_group' => $this->blood_group,
            'address' => $this->address,
            'phone' => $this->phone,
            'emergency_contact' => $this->emergency_contact,
        ];
    }
}
