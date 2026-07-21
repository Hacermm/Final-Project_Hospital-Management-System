<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicalRecordRequest;
use App\Http\Resources\MedicalRecordResource;
use App\Models\MedicalRecord;
use App\Services\MedicalRecordService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
 use Barryvdh\DomPDF\Facade\Pdf;


class MedicalRecordController extends Controller
{
    public function __construct(
        private MedicalRecordService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('doctor')) {
            $records = $this->service->forDoctor($user->doctor->id);
        } elseif ($user->hasRole('patient')) {
            $records = $this->service->forPatient($user->patient->id);
        } else {
            abort(403);
        }

        return MedicalRecordResource::collection($records)->response();
    }

    public function store(MedicalRecordRequest $request): JsonResponse
    {
        $doctor = $request->user()->doctor;
        abort_unless($doctor, 403, 'Yalnız həkimlər tibbi qeyd yaza bilər.');

        $record = $this->service->create($doctor->id, $request->validated());

        return (new MedicalRecordResource($record))->response()->setStatusCode(201);
    }

    public function show(Request $request, MedicalRecord $medicalRecord): JsonResponse
    {
        $this->authorizeAccess($request, $medicalRecord);

        return (new MedicalRecordResource(
            $this->service->getById($medicalRecord->id)
        ))->response();
    }


    private function authorizeAccess(Request $request, MedicalRecord $record): void
    {
        $user = $request->user();
        $isDoctor = $record->doctor_id === $user->doctor?->id;
        $isPatient = $record->patient_id === $user->patient?->id;
        $isAdmin = $user->hasAnyRole(['admin', 'super_admin']);

        abort_unless($isDoctor || $isPatient || $isAdmin, 403);
    }
    public function downloadPdf(Request $request, MedicalRecord $medicalRecord): \Illuminate\Http\Response
    {
        $this->authorizeAccess($request, $medicalRecord);

        $medicalRecord->load(['doctor.user', 'patient.user', 'prescriptions']);

        $pdf = Pdf::loadView('pdf.prescription', ['record' => $medicalRecord]);

        return $pdf->download("resept-{$medicalRecord->id}.pdf");
    }
}
