<?php

use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DoctorController;

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
    $user = User::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Yanlış təsdiq linki.'], 403);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email artıq təsdiqlənib.']);
    }

    $user->markEmailAsVerified();

    return response()->json(['message' => 'Email uğurla təsdiqləndi! İndi giriş edə bilərsiniz.']);
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
