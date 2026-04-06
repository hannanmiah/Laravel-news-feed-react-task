<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'post_id' => ['required', 'exists:posts,id'],
            'parent_id' => [
                'nullable',
                Rule::exists('comments', 'id')->where(fn ($query) => $query->where('post_id', $this->integer('post_id'))),
            ],
            'content' => ['required', 'string', 'max:2000'],
        ];
    }
}
