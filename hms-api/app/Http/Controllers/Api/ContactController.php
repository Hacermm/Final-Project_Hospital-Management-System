<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        ContactMessage::create($data);

        return response()->json([
            'message' => 'Müraciətiniz qeydə alındı. Tezliklə sizinlə əlaqə saxlanılacaq.',
        ], 201);
    }

    public function index(): JsonResponse
    {
        $messages = ContactMessage::latest()->get()->map(fn ($m) => [
            'id' => $m->id,
            'name' => $m->name,
            'email' => $m->email,
            'phone' => $m->phone,
            'subject' => $m->subject,
            'message' => $m->message,
            'is_read' => $m->is_read,
            'date' => $m->created_at->format('d.m.Y H:i'),
        ]);

        return response()->json([
            'data' => $messages,
            'unread' => ContactMessage::where('is_read', false)->count(),
        ]);
    }

    public function markAsRead(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update(['is_read' => true]);
        return response()->json(['message' => 'Oxundu kimi işarələndi.']);
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();
        return response()->json(['message' => 'Mesaj silindi.']);
    }
}
