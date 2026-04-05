<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:5120'],
            'visibility' => ['required', 'in:public,private'],
        ];
    }
}
