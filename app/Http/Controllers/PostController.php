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
        $userId = (int) auth()->id();

        return Inertia::render('feed', [
            'posts' => Inertia::scroll(fn () => Post::query()
                ->select(['id', 'user_id', 'content', 'image', 'visibility', 'created_at'])
                ->with([
                    'user:id,first_name,last_name',
                    'likes' => fn ($query) => $query
                        ->select(['id', 'user_id', 'likeable_id', 'likeable_type'])
                        ->with('user:id,first_name,last_name'),
                    'topLevelComments' => fn ($query) => $query
                        ->select(['id', 'post_id', 'user_id', 'parent_id', 'content', 'created_at'])
                        ->latest()
                        ->withCount('likes')
                        ->withExists(['likes as is_liked' => fn ($likesQuery) => $likesQuery->where('user_id', $userId)])
                        ->with([
                            'user:id,first_name,last_name',
                            'likes' => fn ($likesQuery) => $likesQuery
                                ->select(['id', 'user_id', 'likeable_id', 'likeable_type'])
                                ->with('user:id,first_name,last_name'),
                            'replies' => fn ($repliesQuery) => $repliesQuery
                                ->select(['id', 'post_id', 'user_id', 'parent_id', 'content', 'created_at'])
                                ->latest()
                                ->withCount('likes')
                                ->withExists(['likes as is_liked' => fn ($likesQuery) => $likesQuery->where('user_id', $userId)])
                                ->with([
                                    'user:id,first_name,last_name',
                                    'likes' => fn ($likesQuery) => $likesQuery
                                        ->select(['id', 'user_id', 'likeable_id', 'likeable_type'])
                                        ->with('user:id,first_name,last_name'),
                                ]),
                        ]),
                ])
                ->withCount(['likes', 'comments'])
                ->withExists(['likes as is_liked' => fn ($query) => $query->where('user_id', $userId)])
                ->visibleTo($userId)
                ->latest()
                ->paginate(10)),
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
