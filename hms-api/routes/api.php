<?php

use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\DoctorScheduleController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\LabTestController;
use App\Http\Controllers\Api\ChatController;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\Api\CallController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AdminManagementController;

Broadcast::routes(['middleware' => ['auth:sanctum']]);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/{department}', [DepartmentController::class, 'show']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);

Route::middleware(['auth:sanctum', 'role:admin|super_admin'])->group(function () {
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin|super_admin'])->group(function () {
    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::put('/departments/{department}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroy']);
});



Route::post('/forgot-password', [PasswordResetController::class, 'sendCode'])
    ->middleware('throttle:5,1');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->middleware('throttle:5,1');


Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $frontend = env('FRONTEND_URL', 'http://localhost:5173');

    $user = User::find($id);

    if (! $user || ! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return redirect("{$frontend}/login?verified=invalid");
    }

    if ($user->hasVerifiedEmail()) {
        return redirect("{$frontend}/login?verified=already");
    }

    $user->markEmailAsVerified();

    return redirect("{$frontend}/login?verified=success");
})->middleware(['signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Təsdiq maili yenidən göndərildi.']);
})->middleware(['auth:sanctum', 'throttle:6,1']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

Route::get('/login', function () {
    return response()->json(['message' => 'Giriş tələb olunur.'], 401);
})->name('login');


Route::middleware(['auth:sanctum', 'role:admin|super_admin|doctor'])->group(function () {
    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{patient}', [PatientController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'role:admin|super_admin'])->group(function () {
    Route::post('/patients', [PatientController::class, 'store']);
    Route::put('/patients/{patient}', [PatientController::class, 'update']);
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);
});
Route::get('/doctors/{doctor}/schedules', [DoctorScheduleController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:doctor|admin|super_admin'])->group(function () {
    Route::post('/doctors/{doctor}/schedules', [DoctorScheduleController::class, 'store']);
    Route::put('/schedules/{schedule}', [DoctorScheduleController::class, 'update']);
    Route::delete('/schedules/{schedule}', [DoctorScheduleController::class, 'destroy']);
});
Route::get('/doctors/{doctor}/slots', [AppointmentController::class, 'slots']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/medical-records', [MedicalRecordController::class, 'index']);
    Route::get('/medical-records/{medicalRecord}', [MedicalRecordController::class, 'show']);
    Route::get('/medical-records/{medicalRecord}/pdf', [MedicalRecordController::class, 'downloadPdf']);
    Route::post('/medical-records', [MedicalRecordController::class, 'store']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/lab-tests', [LabTestController::class, 'index']);
    Route::post('/lab-tests', [LabTestController::class, 'store']);
    Route::get('/lab-tests/{labTest}/download', [LabTestController::class, 'download']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/conversations', [ChatController::class, 'conversations']);
    Route::post('/conversations', [ChatController::class, 'startConversation']);
    Route::get('/conversations/{conversation}/messages', [ChatController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages', [ChatController::class, 'sendMessage']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/call/signal', [CallController::class, 'signal']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/call/signal', [CallController::class, 'signal']);
    Route::get('/call/logs', [CallController::class, 'logs']);
});
Route::middleware(['auth:sanctum', 'throttle:20,1'])->group(function () {
    Route::get('/ai/messages', [AiController::class, 'index']);
    Route::post('/ai/ask', [AiController::class, 'ask']);
    Route::delete('/ai/messages', [AiController::class, 'clear']);
});
Route::post('/ai/public-ask', [AiController::class, 'publicAsk'])
    ->middleware('throttle:10,1');


Route::middleware(['auth:sanctum', 'role:admin|super_admin'])->group(function () {
    Route::get('/analytics', [AnalyticsController::class, 'index']);
});
Route::middleware(['auth:sanctum', 'role:super_admin'])->group(function () {
    Route::get('/admins', [AdminManagementController::class, 'index']);
    Route::post('/admins', [AdminManagementController::class, 'store']);
    Route::put('/admins/{user}', [AdminManagementController::class, 'update']);
    Route::delete('/admins/{user}', [AdminManagementController::class, 'destroy']);
});
