<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrescriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'medicine' => $this->medicine,
            'dosage' => $this->dosage,
            'duration' => $this->duration,
            'instructions' => $this->instructions,
        ];
    }
}
