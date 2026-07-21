<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LabTestRequest;
use App\Http\Resources\LabTestResource;
use App\Models\LabTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LabTestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('doctor')) {
            $tests = LabTest::with(['patient.user'])->where('doctor_id', $user->doctor->id)->latest()->get();
        } elseif ($user->hasRole('patient')) {
            $tests = LabTest::with(['doctor.user'])->where('patient_id', $user->patient->id)->latest()->get();
        } elseif ($user->hasAnyRole(['admin', 'super_admin'])) {
            $tests = LabTest::with(['patient.user', 'doctor.user'])->latest()->get();
        } else {
            abort(403);
        }

        return LabTestResource::collection($tests)->response();
    }

    public function store(LabTestRequest $request): JsonResponse
    {
        $doctor = $request->user()->doctor;
        abort_unless($doctor || $request->user()->hasAnyRole(['admin', 'super_admin']), 403);

        $file = $request->file('file');
        $path = $file->store('lab-tests', 'local');

        $labTest = LabTest::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $doctor->id,
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
        ]);

        return (new LabTestResource($labTest->load(['patient.user', 'doctor.user'])))
            ->response()->setStatusCode(201);
    }

    public function download(Request $request, LabTest $labTest): mixed
    {
        $user = $request->user();
        $isDoctor = $labTest->doctor_id === $user->doctor?->id;
        $isPatient = $labTest->patient_id === $user->patient?->id;
        $isAdmin = $user->hasAnyRole(['admin', 'super_admin']);

        abort_unless($isDoctor || $isPatient || $isAdmin, 403);

        abort_unless(Storage::disk('local')->exists($labTest->file_path), 404, 'Fayl tapılmadı.');

        return Storage::disk('local')->download($labTest->file_path, $labTest->file_name);
    }
}
