<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    public function __construct(
        private DepartmentService $service
    ) {}

    public function index(): JsonResponse
    {
        $departments = $this->service->getAll();
        return DepartmentResource::collection($departments)->response();
    }

    public function store(DepartmentRequest $request): JsonResponse
    {
        $department = $this->service->create($request->validated());
        return (new DepartmentResource($department))->response()->setStatusCode(201);
    }

    public function show(Department $department): JsonResponse
    {
        return (new DepartmentResource($department->loadCount('doctors')))->response();
    }

    public function update(DepartmentRequest $request, Department $department): JsonResponse
    {
        $updated = $this->service->update($department, $request->validated());
        return (new DepartmentResource($updated))->response();
    }

    public function destroy(Department $department): JsonResponse
    {
        $this->service->delete($department);
        return response()->json(['message' => 'Şöbə silindi.']);
    }
}
