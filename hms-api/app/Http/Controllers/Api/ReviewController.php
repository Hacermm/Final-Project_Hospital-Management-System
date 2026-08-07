<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function public(): JsonResponse
    {
        $reviews = Review::with(['patient.user', 'doctor.user'])
            ->where('is_approved', true)
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'author' => $r->patient?->user?->name,
                'doctor' => $r->doctor?->user?->name,
                'date' => $r->created_at->format('d.m.Y'),
            ]);

        return response()->json(['data' => $reviews]);
    }

    public function myReviews(Request $request): JsonResponse
    {
        $patient = $request->user()->patient;
        abort_unless($patient, 403);

        $reviews = Review::with('doctor.user')
            ->where('patient_id', $patient->id)
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'doctor' => $r->doctor?->user?->name,
                'is_approved' => $r->is_approved,
                'date' => $r->created_at->format('d.m.Y'),
            ]);

        $hasCompleted = Appointment::where('patient_id', $patient->id)
            ->where('status', 'completed')
            ->exists();

        return response()->json([
            'data' => $reviews,
            'can_review' => $hasCompleted,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $patient = $request->user()->patient;
        abort_unless($patient, 403, 'Yalnız pasiyentlər rəy yaza bilər.');

        $data = $request->validate([
            'doctor_id' => ['nullable', 'exists:doctors,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $completed = Appointment::where('patient_id', $patient->id)
            ->where('status', 'completed')
            ->when(!empty($data['doctor_id']), fn ($q) => $q->where('doctor_id', $data['doctor_id']))
            ->exists();

        if (! $completed) {
            return response()->json([
                'message' => 'Rəy yazmaq üçün ən azı bir tamamlanmış müayinəniz olmalıdır.',
            ], 422);
        }

        Review::create([
            'patient_id' => $patient->id,
            'doctor_id' => $data['doctor_id'] ?? null,
            'rating' => $data['rating'],
            'comment' => $data['comment'],
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'Rəyiniz qeydə alındı. Administrator təsdiqindən sonra saytda görünəcək.',
        ], 201);
    }

    public function index(): JsonResponse
    {
        $reviews = Review::with(['patient.user', 'doctor.user'])
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'author' => $r->patient?->user?->name,
                'doctor' => $r->doctor?->user?->name,
                'is_approved' => $r->is_approved,
                'date' => $r->created_at->format('d.m.Y H:i'),
            ]);

        return response()->json([
            'data' => $reviews,
            'pending' => Review::where('is_approved', false)->count(),
        ]);
    }

    public function toggle(Review $review): JsonResponse
    {
        $review->update(['is_approved' => ! $review->is_approved]);

        return response()->json([
            'message' => $review->is_approved ? 'Rəy təsdiqləndi.' : 'Rəy gizlədildi.',
        ]);
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();
        return response()->json(['message' => 'Rəy silindi.']);
    }
}
