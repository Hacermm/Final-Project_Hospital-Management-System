<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function __construct(
        private AiService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $messages = $this->service->history($request->user())
            ->map(fn ($m) => [
                'id' => $m->id,
                'role' => $m->role,
                'content' => $m->content,
                'time' => $m->created_at->format('H:i'),
            ]);

        return response()->json(['data' => $messages]);
    }

    public function ask(Request $request): JsonResponse
    {
        $request->validate([
            'question' => ['required', 'string', 'max:1000'],
        ]);

        $answer = $this->service->ask($request->user(), $request->question);

        return response()->json(['answer' => $answer]);
    }

    public function clear(Request $request): JsonResponse
    {
        $this->service->clearHistory($request->user());
        return response()->json(['message' => 'Söhbət təmizləndi.']);
    }
     public function publicAsk(Request $request): JsonResponse
    {
        $request->validate([
            'question' => ['required', 'string', 'max:500'],
        ]);

        return response()->json([
            'answer' => $this->service->askPublic($request->question),
        ]);
    }
}
