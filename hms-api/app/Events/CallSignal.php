<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallSignal implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $toUserId,       
        public int $fromUserId,
        public string $fromName,
        public ?string $fromPhoto,
        public string $type,
        public mixed $payload = null
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->toUserId)];
    }

    public function broadcastAs(): string
    {
        return 'call.signal';
    }

    public function broadcastWith(): array
    {
        return [
            'from_user_id' => $this->fromUserId,
            'from_name' => $this->fromName,
            'from_photo' => $this->fromPhoto ? url('storage/' . $this->fromPhoto) : null,
            'type' => $this->type,
            'payload' => $this->payload,
        ];
    }
}
