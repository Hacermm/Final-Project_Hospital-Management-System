<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    public function sendCode(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $code = (string) random_int(100000, 999999);

            DB::table('password_reset_codes')->where('email', $request->email)->delete();
            DB::table('password_reset_codes')->insert([
                'email' => $request->email,
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Mail::html("
                <h2>HMS - Parol Berpasi</h2>
                <p>Salam, {$user->name}!</p>
                <p>Parol berpa kodunuz:</p>
                <h1 style='letter-spacing:5px'>{$code}</h1>
                <p>Bu kod 10 deqiqe etibarlidir. Eger bu sorgunu siz gondermemisinizse, mehel qoymayin.</p>
            ", function ($m) use ($request) {
                $m->to($request->email)->subject('HMS Parol Berpa Kodu');
            });
        }

        return response()->json([
            'message' => 'Əgər bu email qeydiyyatdadırsa, bərpa kodu göndərildi.',
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (! $record) {
            return response()->json(['message' => 'Kod yanlışdır.'], 422);
        }

        if (now()->greaterThan($record->expires_at)) {
            return response()->json(['message' => 'Kodun vaxtı bitib. Yenidən sorğu göndərin.'], 422);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => $request->password]);

        DB::table('password_reset_codes')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Parol uğurla dəyişdirildi! İndi giriş edə bilərsiniz.']);
    }
}
