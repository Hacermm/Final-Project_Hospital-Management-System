<?php

namespace App\Http\Controllers\Api;

use App\Events\CallSignal;
use App\Http\Controllers\Controller;
use App\Models\CallLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\ChatService;
use App\Events\MessageSent;

class CallController extends Controller
{
    public function __construct(
        private ChatService $chatService
    ) {}
    public function signal(Request $request): JsonResponse
    {
        $data = $request->validate([
            'to_user_id' => ['required', 'exists:users,id'],
            'type' => ['required', 'in:offer,answer,ice,end,reject'],
            'payload' => ['nullable'],
        ]);

        $me = $request->user();
        $me->loadMissing(['doctor', 'patient']);
        $toId = (int) $data['to_user_id'];

        if ($data['type'] === 'offer') {
            CallLog::create([
                'caller_id' => $me->id,
                'receiver_id' => $toId,
                'started_at' => now(),
                'status' => 'ringing',
            ]);
        } elseif ($data['type'] === 'answer') {
            $this->latestCall($me->id, $toId)?->update(['status' => 'answered']);
        } elseif ($data['type'] === 'reject') {
            $this->latestCall($me->id, $toId)?->update([
                'status' => 'rejected',
                'ended_at' => now(),
            ]);
        } elseif ($data['type'] === 'end') {
            $call = $this->latestCall($me->id, $toId);
            if ($call && $call->status === 'ringing') {
                $call->update(['status' => 'missed', 'ended_at' => now()]);
                $data['type'] = 'missed'; // Send 'missed' to receiver
                
                // Söhbətə "Buraxılmış zəng" mesajı əlavə edirik
                $conversation = $this->chatService->findOrCreate($me, $toId);
                $message = $this->chatService->sendMessage($conversation, $me, '[MISSED_CALL]');
                broadcast(new MessageSent($message))->toOthers();
            } else {
                $call?->update(['status' => 'ended', 'ended_at' => now()]);
            }
        }

        $photo = $me->doctor?->photo ?? $me->patient?->photo;

        broadcast(new CallSignal(
            toUserId: $toId,
            fromUserId: $me->id,
            fromName: $me->name,
            fromPhoto: $photo,
            type: $data['type'],
            payload: $data['payload'] ?? null,
        ));

        return response()->json(['status' => 'sent']);
    }

    public function logs(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $logs = CallLog::with(['caller', 'receiver'])
            ->where('caller_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'direction' => $c->caller_id === $userId ? 'outgoing' : 'incoming',
                'other_name' => $c->caller_id === $userId ? $c->receiver?->name : $c->caller?->name,
                'status' => $c->status,
                'started_at' => $c->started_at?->format('d.m.Y H:i'),
                'duration' => $c->ended_at && $c->started_at
                    ? $c->started_at->diffInSeconds($c->ended_at)
                    : null,
            ]);

        return response()->json(['data' => $logs]);
    }

    private function latestCall(int $a, int $b): ?CallLog
    {
        return CallLog::where(function ($q) use ($a, $b) {
                $q->where('caller_id', $a)->where('receiver_id', $b);
            })
            ->orWhere(function ($q) use ($a, $b) {
                $q->where('caller_id', $b)->where('receiver_id', $a);
            })
            ->whereNull('ended_at')
            ->latest()
            ->first();
    }
}
