<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $posts = Post::with([
            'user',
            'topLevelComments.user',
            'topLevelComments.replies.user',
            'topLevelComments.likes.user',
            'topLevelComments.replies.likes.user',
            'likes.user',
        ])
            ->withCount(['likes', 'comments'])
            ->visibleTo($userId)
            ->latest()
            ->paginate(10);

        $posts->through(function ($post) use ($userId) {
            $post->is_liked = $post->isLikedBy($userId);

            $post->topLevelComments->each(function ($comment) use ($userId) {
                $comment->is_liked = $comment->isLikedBy($userId);
                $comment->likes_count = $comment->likes->count();

                $comment->replies->each(function ($reply) use ($userId) {
                    $reply->is_liked = $reply->isLikedBy($userId);
                    $reply->likes_count = $reply->likes->count();
                });
            });

            return $post;
        });

        return Inertia::render('feed', [
            'posts' => $posts,
        ]);
    }

    public function store(StorePostRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        Post::create($data);

        return redirect()->back()->with('success', 'Post created successfully.');
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($post->image) {
                \Storage::disk('public')->delete($post->image);
            }
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $post->update($data);

        return redirect()->back()->with('success', 'Post updated successfully.');
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        if ($post->image) {
            \Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully.');
    }
}
