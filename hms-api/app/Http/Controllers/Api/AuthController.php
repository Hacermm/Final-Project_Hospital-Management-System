<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        $user->assignRole('patient');

        // Create an empty patient record so they can book appointments
        $user->patient()->create([]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Qeydiyyat uğurlu oldu. Zəhmət olmasa email-inizi təsdiqləyin.',
            'user' => $user,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email və ya parol yanlışdır.'],
            ]);
        }

        if (! $user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Zəhmət olmasa əvvəlcə email-inizi təsdiqləyin.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Giriş uğurlu.',
            'user' => $user,
            'role' => $user->getRoleNames()->first(),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Çıxış edildi.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['doctor', 'patient']);

        return response()->json([
            'user' => $user,
            'role' => $user->getRoleNames()->first(),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female,other'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'address' => ['nullable', 'string'],
            'allergies' => ['nullable', 'string'],
            'chronic_diseases' => ['nullable', 'string'],
            'past_diseases' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $user->update(['name' => $request->name]);

        if ($user->hasRole('patient')) {
            if (!$user->patient) {
                $user->patient()->create([]);
                $user->load('patient');
            }

            $user->patient->update([
                'phone' => $request->phone,
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
                'blood_group' => $request->blood_group,
                'address' => $request->address,
                'allergies' => $request->allergies,
                'chronic_diseases' => $request->chronic_diseases,
                'past_diseases' => $request->past_diseases,
            ]);
        }

        return response()->json([
            'message' => 'Profil uğurla yeniləndi.',
            'user' => $user->load(['doctor', 'patient']),
        ]);
    }
}
