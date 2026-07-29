<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$key = config('services.gemini.key');
$response = \Illuminate\Support\Facades\Http::timeout(15)
    ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$key}", [
        'contents' => [['role' => 'user', 'parts' => [['text' => 'Salam']]]],
    ]);
echo "Status: " . $response->status() . PHP_EOL;
echo substr($response->body(), 0, 500) . PHP_EOL;
