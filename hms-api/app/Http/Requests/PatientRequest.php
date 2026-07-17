<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class PatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isCreate = $this->isMethod('post');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', $isCreate ? 'unique:users,email' : 'nullable'],
            'password' => $isCreate
                ? ['required', 'confirmed', Password::min(8)->letters()->numbers()]
                : ['nullable'],
            'date_of_birth' => ['nullable', 'date', 'before:today', 'after:1900-01-01'],
            'gender' => ['nullable', 'in:male,female,other'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:255'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
        ];
    }
}
