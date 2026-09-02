<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $me = $request->user();
        $other = $this->user_one_id === $me->id ? $this->userTwo : $this->userOne;

        $photo = $other ? ($other->doctor?->photo ?? $other->patient?->photo) : null;

        return [
            'id' => $this->id,
            'other_user' => [
                'id' => $other?->id,
                'name' => $other?->name,
                'photo' => $photo ? url('storage/' . $photo) : null,
            ],
            'last_message' => $this->latestMessage?->body,
            'updated_at' => $this->updated_at->format('Y-m-d H:i'),
        ];
    }
}
