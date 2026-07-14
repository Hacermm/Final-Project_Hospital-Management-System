<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoctorRequest;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use App\Services\DoctorService;
use Illuminate\Http\JsonResponse;

class DoctorController extends Controller
{
    public function __construct(
        private DoctorService $service
    ) {}

    public function index(): JsonResponse
    {
        return DoctorResource::collection($this->service->getAll())->response();
    }

    public function store(DoctorRequest $request): JsonResponse
    {
        $doctor = $this->service->create($request->validated());
        return (new DoctorResource($doctor->load(['user', 'department'])))
            ->response()->setStatusCode(201);
    }

    public function show(Doctor $doctor): JsonResponse
    {
        return (new DoctorResource($doctor->load(['user', 'department'])))->response();
    }

    public function update(DoctorRequest $request, Doctor $doctor): JsonResponse
    {
        $updated = $this->service->update($doctor, $request->validated());
        return (new DoctorResource($updated))->response();
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        $this->service->delete($doctor);
        return response()->json(['message' => 'Həkim silindi.']);
    }
}
