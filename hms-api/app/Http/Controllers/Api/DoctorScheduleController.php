<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoctorScheduleRequest;
use App\Http\Resources\DoctorScheduleResource;
use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Services\DoctorScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorScheduleController extends Controller
{
    public function __construct(
        private DoctorScheduleService $service
    ) {}

    public function index(Doctor $doctor): JsonResponse
    {
        return DoctorScheduleResource::collection(
            $this->service->getForDoctor($doctor)
        )->response();
    }

    public function store(DoctorScheduleRequest $request, Doctor $doctor): JsonResponse
    {
        $this->authorizeDoctor($request, $doctor);

        $schedule = $this->service->create($doctor, $request->validated());
        return (new DoctorScheduleResource($schedule))->response()->setStatusCode(201);
    }

    public function update(DoctorScheduleRequest $request, DoctorSchedule $schedule): JsonResponse
    {
        $this->authorizeDoctor($request, $schedule->doctor);

        $updated = $this->service->update($schedule, $request->validated());
        return (new DoctorScheduleResource($updated))->response();
    }

    public function destroy(Request $request, DoctorSchedule $schedule): JsonResponse
    {
        $this->authorizeDoctor($request, $schedule->doctor);

        $this->service->delete($schedule);
        return response()->json(['message' => 'Qrafik silindi.']);
    }

    private function authorizeDoctor(Request $request, Doctor $doctor): void
    {
        $user = $request->user();
        $isOwner = $user->doctor?->id === $doctor->id;
        $isAdmin = $user->hasAnyRole(['admin', 'super_admin']);

        abort_unless($isOwner || $isAdmin, 403, 'Bu əməliyyata icazəniz yoxdur.');
    }
}
