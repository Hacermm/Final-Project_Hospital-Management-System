<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicalRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'appointment_id' => ['required', 'exists:appointments,id'],
            'diagnosis' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
            'prescriptions' => ['nullable', 'array'],
            'prescriptions.*.medicine' => ['required', 'string', 'max:255'],
            'prescriptions.*.dosage' => ['nullable', 'string', 'max:255'],
            'prescriptions.*.duration' => ['nullable', 'string', 'max:255'],
            'prescriptions.*.instructions' => ['nullable', 'string'],
        ];
    }
}
