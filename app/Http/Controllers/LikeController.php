<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToggleLikeRequest;
use App\Models\Like;

class LikeController extends Controller
{
    public function toggle(ToggleLikeRequest $request)
    {
        $data = $request->validated();
        $userId = auth()->id();

        $like = Like::where('user_id', $userId)
            ->where('likeable_id', $data['likeable_id'])
            ->where('likeable_type', $data['likeable_type'])
            ->first();

        if ($like) {
            $like->delete();

            return redirect()->back()->with('info', 'Like removed.');
        }

        Like::create([
            'user_id' => $userId,
            'likeable_id' => $data['likeable_id'],
            'likeable_type' => $data['likeable_type'],
        ]);

        return redirect()->back()->with('success', 'Liked successfully.');
    }
}
