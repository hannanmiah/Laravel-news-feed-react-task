<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->post = Post::factory()->create(['user_id' => User::factory()->create()->id]);
});

test('authenticated user can comment on a post', function () {
    $response = $this->actingAs($this->user)->post('/comments', [
        'post_id' => $this->post->id,
        'content' => 'Great post!',
    ]);

    $response->assertRedirect();
    expect(Comment::where('post_id', $this->post->id)->count())->toBe(1);
});

test('comment requires content', function () {
    $response = $this->actingAs($this->user)->post('/comments', [
        'post_id' => $this->post->id,
        'content' => '',
    ]);

    $response->assertSessionHasErrors(['content']);
});

test('authenticated user can reply to a comment', function () {
    $comment = Comment::factory()->create([
        'post_id' => $this->post->id,
        'user_id' => $this->user->id,
        'parent_id' => null,
    ]);

    $otherUser = User::factory()->create();
    $response = $this->actingAs($otherUser)->post('/comments', [
        'post_id' => $this->post->id,
        'parent_id' => $comment->id,
        'content' => 'Reply to your comment',
    ]);

    $response->assertRedirect();
    expect(Comment::where('parent_id', $comment->id)->count())->toBe(1);
});

test('authenticated user can delete own comment', function () {
    $comment = Comment::factory()->create([
        'post_id' => $this->post->id,
        'user_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->delete("/comments/{$comment->id}");

    $response->assertRedirect();
    expect(Comment::find($comment->id))->toBeNull();
});

test('user cannot delete another users comment', function () {
    $otherUser = User::factory()->create();
    $comment = Comment::factory()->create([
        'post_id' => $this->post->id,
        'user_id' => $otherUser->id,
    ]);

    $response = $this->actingAs($this->user)->delete("/comments/{$comment->id}");

    $response->assertStatus(403);
});

test('user cannot comment on another users private post', function () {
    $privatePost = Post::factory()->create([
        'user_id' => User::factory()->create()->id,
        'visibility' => 'private',
    ]);

    $response = $this->actingAs($this->user)->post('/comments', [
        'post_id' => $privatePost->id,
        'content' => 'Should not be allowed',
    ]);

    $response->assertStatus(403);
    expect(Comment::where('post_id', $privatePost->id)->count())->toBe(0);
});

test('reply parent comment must belong to the same post', function () {
    $firstPost = Post::factory()->create(['user_id' => User::factory()->create()->id]);
    $secondPost = Post::factory()->create(['user_id' => User::factory()->create()->id]);

    $parentComment = Comment::factory()->create([
        'post_id' => $firstPost->id,
        'user_id' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)->post('/comments', [
        'post_id' => $secondPost->id,
        'parent_id' => $parentComment->id,
        'content' => 'Invalid cross-post reply',
    ]);

    $response->assertSessionHasErrors(['parent_id']);
});
