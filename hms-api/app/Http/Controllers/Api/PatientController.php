<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    public function __construct(
        private PatientService $service
    ) {}

    public function index(): JsonResponse
    {
        return PatientResource::collection($this->service->getAll())->response();
    }

    public function store(PatientRequest $request): JsonResponse
    {
        $patient = $this->service->create($request->validated());
        return (new PatientResource($patient->load('user')))
            ->response()->setStatusCode(201);
    }

    public function show(Patient $patient): JsonResponse
    {
        return (new PatientResource($patient->load('user')))->response();
    }

    public function update(PatientRequest $request, Patient $patient): JsonResponse
    {
        $updated = $this->service->update($patient, $request->validated());
        return (new PatientResource($updated))->response();
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $this->service->delete($patient);
        return response()->json(['message' => 'Xəstə silindi.']);
    }
}
