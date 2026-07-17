<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class DoctorRequest extends FormRequest
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
            'email' => [
                'required', 'email',
                $isCreate ? 'unique:users,email' : 'nullable',
            ],
            'password' => $isCreate
                ? ['required', 'confirmed', Password::min(8)->letters()->numbers()]
                : ['nullable'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'specialization' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:70'],
            'consultation_fee' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'phone' => ['nullable', 'string', 'max:255'],
        ];
    }
}
