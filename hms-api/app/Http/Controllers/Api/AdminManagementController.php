<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $admins = User::role(['admin', 'super_admin'])
            ->latest()
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->getRoleNames()->first(),
                'created_at' => $u->created_at->format('d.m.Y'),
                'verified' => (bool) $u->email_verified_at,
            ]);

        return response()->json(['data' => $admins]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'role' => ['required', 'in:admin,super_admin'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        $user->markEmailAsVerified();
        $user->assignRole($data['role']);

        return response()->json([
            'message' => 'Admin yaradıldı.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $data['role'],
            ],
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', 'in:admin,super_admin'],
        ]);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Öz rolunuzu dəyişə bilməzsiniz.'], 422);
        }

        $user->syncRoles([$data['role']]);

        return response()->json(['message' => 'Rol yeniləndi.']);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Öz hesabınızı silə bilməzsiniz.'], 422);
        }

        if ($user->hasRole('super_admin') && User::role('super_admin')->count() <= 1) {
            return response()->json(['message' => 'Sistemdə ən azı bir super admin qalmalıdır.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Admin silindi.']);
    }
}



