<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private AppointmentService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasAnyRole(['admin', 'super_admin'])) {
            $appointments = $this->service->all();
        } elseif ($user->hasRole('doctor')) {
            $appointments = $this->service->forDoctor($user->doctor->id);
        } else {
            $appointments = $this->service->forPatient($user->patient->id);
        }

        return AppointmentResource::collection($appointments)->response();
    }

    public function slots(Request $request, Doctor $doctor): JsonResponse
    {
        $request->validate(['date' => ['required', 'date']]);

        return response()->json([
            'date' => $request->date,
            'slots' => $this->service->availableSlots($doctor, $request->date),
        ]);
    }

    public function store(AppointmentRequest $request): JsonResponse
    {
        $patient = $request->user()->patient;

        abort_unless($patient, 403, 'Yalnız xəstələr randevu ala bilər.');

        $appointment = $this->service->create($patient->id, $request->validated());

        return (new AppointmentResource($appointment->load('doctor.user')))
            ->response()->setStatusCode(201);
    }

    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        $this->authorizeAccess($request, $appointment);

        return (new AppointmentResource(
            $appointment->load(['doctor.user', 'patient.user'])
        ))->response();
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,confirmed,completed,cancelled'],
        ]);

        $user = $request->user();
        $status = $request->status;

        if ($user->hasRole('patient')) {
            abort_unless($appointment->patient_id === $user->patient?->id, 403);
            abort_unless($status === 'cancelled', 403, 'Yalnız randevunu ləğv edə bilərsiniz.');
        }
        elseif ($user->hasRole('doctor')) {
            abort_unless($appointment->doctor_id === $user->doctor?->id, 403);
        }

        $updated = $this->service->updateStatus($appointment, $status);

        return (new AppointmentResource($updated->load(['doctor.user', 'patient.user'])))
            ->response();
    }

    public function destroy(Request $request, Appointment $appointment): JsonResponse
    {
        abort_unless($request->user()->hasAnyRole(['admin', 'super_admin']), 403);

        $appointment->delete();
        return response()->json(['message' => 'Randevu silindi.']);
    }

    private function authorizeAccess(Request $request, Appointment $appointment): void
    {
        $user = $request->user();

        $isPatient = $appointment->patient_id === $user->patient?->id;
        $isDoctor = $appointment->doctor_id === $user->doctor?->id;
        $isAdmin = $user->hasAnyRole(['admin', 'super_admin']);

        abort_unless($isPatient || $isDoctor || $isAdmin, 403);
    }
}
