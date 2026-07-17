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
}
