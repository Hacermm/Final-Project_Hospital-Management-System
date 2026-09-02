<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct(
        private ChatService $service
    ) {}

    public function conversations(Request $request): JsonResponse
    {
        $conversations = $this->service->conversationsFor($request->user());

        return ConversationResource::collection($conversations)->response();
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        $unreadCounts = \App\Models\Message::select('conversation_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereHas('conversation', function ($q) use ($userId) {
                $q->where('user_one_id', $userId)->orWhere('user_two_id', $userId);
            })
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->groupBy('conversation_id')
            ->get();
            
        $perConversation = [];
        $total = 0;
        
        foreach ($unreadCounts as $item) {
            $perConversation[$item->conversation_id] = $item->count;
            $total += $item->count;
        }

        return response()->json([
            'total' => $total,
            'per_conversation' => $perConversation
        ]);
    }

    public function startConversation(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id', 'different:' . $request->user()->id],
        ]);

        $conversation = $this->service->findOrCreate($request->user(), $request->user_id);

        return (new ConversationResource($conversation))->response();
    }

    public function messages(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorizeParticipant($request, $conversation);

        $this->service->markAsRead($conversation, $request->user());

        $messages = $this->service->messages($conversation);

        return MessageResource::collection($messages)->response();
    }

    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorizeParticipant($request, $conversation);

        $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = $this->service->sendMessage($conversation, $request->user(), $request->body);

        broadcast(new MessageSent($message))->toOthers();

        return (new MessageResource($message))->response()->setStatusCode(201);
    }

    private function authorizeParticipant(Request $request, Conversation $conversation): void
    {
        $userId = $request->user()->id;

        abort_unless(
            $conversation->user_one_id === $userId || $conversation->user_two_id === $userId,
            403,
            'Bu söhbətə girişiniz yoxdur.'
        );
    }
}
