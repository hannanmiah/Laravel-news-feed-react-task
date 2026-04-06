<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request)
    {
        $data = $request->validated();
        $post = Post::query()->findOrFail($data['post_id']);

        $this->authorize('view', $post);

        $data['user_id'] = auth()->id();

        Comment::create($data);

        return redirect()->back()->with('success', 'Comment added successfully.');
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return redirect()->back()->with('success', 'Comment deleted successfully.');
    }
}
