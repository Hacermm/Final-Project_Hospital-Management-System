<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'doctor_id' => $this->doctor_id,
            'day_of_week' => $this->day_of_week,
            'start_time' => substr($this->start_time, 0, 5),   
            'end_time' => substr($this->end_time, 0, 5),
            'is_available' => $this->is_available,
        ];
    }
}
