<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToggleLikeRequest;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;

class LikeController extends Controller
{
    public function toggle(ToggleLikeRequest $request)
    {
        $data = $request->validated();
        $userId = auth()->id();
        $likeable = match ($data['likeable_type']) {
            Post::class => Post::query()->findOrFail($data['likeable_id']),
            Comment::class => Comment::query()->with('post')->findOrFail($data['likeable_id']),
        };

        $post = $likeable instanceof Comment ? $likeable->post : $likeable;
        $this->authorize('view', $post);

        $like = Like::where('user_id', $userId)
            ->where('likeable_id', $likeable->id)
            ->where('likeable_type', $data['likeable_type'])
            ->first();

        if ($like) {
            $like->delete();

            return redirect()->back()->with('info', 'Like removed.');
        }

        Like::create([
            'user_id' => $userId,
            'likeable_id' => $likeable->id,
            'likeable_type' => $data['likeable_type'],
        ]);

        return redirect()->back()->with('success', 'Liked successfully.');
    }
}
