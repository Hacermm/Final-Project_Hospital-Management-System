<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\DoctorSchedule;
use Illuminate\Database\Eloquent\Collection;

class DoctorScheduleService
{
   
    public function getForDoctor(Doctor $doctor): Collection
    {
        return $doctor->schedules()->orderByRaw(
            "FIELD(day_of_week,'monday','tuesday','wednesday','thursday','friday','saturday','sunday')"
        )->get();
    }

    public function create(Doctor $doctor, array $data): DoctorSchedule
    {
        return $doctor->schedules()->create($data);
    }

    public function update(DoctorSchedule $schedule, array $data): DoctorSchedule
    {
        $schedule->update($data);
        return $schedule;
    }

    public function delete(DoctorSchedule $schedule): void
    {
        $schedule->delete();
    }
}
