<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ToggleLikeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'likeable_id' => ['required', 'integer'],
            'likeable_type' => ['required', 'in:App\\Models\\Post,App\\Models\\Comment'],
        ];
    }
}
