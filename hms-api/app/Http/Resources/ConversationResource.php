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

        return [
            'id' => $this->id,
            'other_user' => [
                'id' => $other?->id,
                'name' => $other?->name,
            ],
            'last_message' => $this->messages->first()?->body,
            'updated_at' => $this->updated_at->format('Y-m-d H:i'),
        ];
    }
}
