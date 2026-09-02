<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ChatService
{
    public function conversationsFor(User $user): Collection
    {
        return Conversation::with(['userOne.doctor', 'userOne.patient', 'userTwo.doctor', 'userTwo.patient', 'latestMessage'])
            ->where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->latest('updated_at')
            ->get();
    }

    public function findOrCreate(User $user, int $otherUserId): Conversation
    {
        $conversation = Conversation::where(function ($q) use ($user, $otherUserId) {
            $q->where('user_one_id', $user->id)->where('user_two_id', $otherUserId);
        })->orWhere(function ($q) use ($user, $otherUserId) {
            $q->where('user_one_id', $otherUserId)->where('user_two_id', $user->id);
        })->first();

        if (! $conversation) {
            $conversation = Conversation::create([
                'user_one_id' => $user->id,
                'user_two_id' => $otherUserId,
            ]);
        }

        return $conversation->load(['userOne.doctor', 'userOne.patient', 'userTwo.doctor', 'userTwo.patient']);
    }

    public function messages(Conversation $conversation): Collection
    {
        return $conversation->messages()->with('sender')->oldest()->get();
    }

    public function sendMessage(Conversation $conversation, User $sender, string $body): Message
    {
        $message = $conversation->messages()->create([
            'sender_id' => $sender->id,
            'body' => $body,
        ]);

        $conversation->touch();

        return $message->load('sender');
    }

    public function markAsRead(Conversation $conversation, User $user): void
    {
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
