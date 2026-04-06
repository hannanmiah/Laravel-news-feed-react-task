<?php

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->post = Post::factory()->create(['user_id' => User::factory()->create()->id]);
});

test('authenticated user can like a post', function () {
    $response = $this->actingAs($this->user)->post('/likes/toggle', [
        'likeable_id' => $this->post->id,
        'likeable_type' => 'App\\Models\\Post',
    ]);

    $response->assertRedirect();
    expect(Like::where([
        'user_id' => $this->user->id,
        'likeable_id' => $this->post->id,
        'likeable_type' => Post::class,
    ])->exists())->toBeTrue();
});

test('authenticated user can unlike a post', function () {
    Like::create([
        'user_id' => $this->user->id,
        'likeable_id' => $this->post->id,
        'likeable_type' => Post::class,
    ]);

    $response = $this->actingAs($this->user)->post('/likes/toggle', [
        'likeable_id' => $this->post->id,
        'likeable_type' => 'App\\Models\\Post',
    ]);

    $response->assertRedirect();
    expect(Like::where([
        'user_id' => $this->user->id,
        'likeable_id' => $this->post->id,
        'likeable_type' => Post::class,
    ])->exists())->toBeFalse();
});

test('authenticated user can like a comment', function () {
    $comment = Comment::factory()->create(['post_id' => $this->post->id]);

    $response = $this->actingAs($this->user)->post('/likes/toggle', [
        'likeable_id' => $comment->id,
        'likeable_type' => 'App\\Models\\Comment',
    ]);

    $response->assertRedirect();
    expect(Like::where([
        'user_id' => $this->user->id,
        'likeable_id' => $comment->id,
        'likeable_type' => Comment::class,
    ])->exists())->toBeTrue();
});

test('user can only like once per entity', function () {
    $this->actingAs($this->user)->post('/likes/toggle', [
        'likeable_id' => $this->post->id,
        'likeable_type' => 'App\\Models\\Post',
    ]);

    // Second like should toggle (remove)
    $this->actingAs($this->user)->post('/likes/toggle', [
        'likeable_id' => $this->post->id,
        'likeable_type' => 'App\\Models\\Post',
    ]);

    expect(Like::where([
        'user_id' => $this->user->id,
        'likeable_id' => $this->post->id,
        'likeable_type' => Post::class,
    ])->count())->toBe(0);
});

test('user cannot like another users private post', function () {
    $privatePost = Post::factory()->create([
        'user_id' => User::factory()->create()->id,
        'visibility' => 'private',
    ]);

    $response = $this->actingAs($this->user)->post('/likes/toggle', [
        'likeable_id' => $privatePost->id,
        'likeable_type' => 'App\\Models\\Post',
    ]);

    $response->assertStatus(403);
    expect(Like::where([
        'user_id' => $this->user->id,
        'likeable_id' => $privatePost->id,
        'likeable_type' => Post::class,
    ])->exists())->toBeFalse();
});

test('user cannot like a comment on another users private post', function () {
    $privatePost = Post::factory()->create([
        'user_id' => User::factory()->create()->id,
        'visibility' => 'private',
    ]);

    $privateComment = Comment::factory()->create([
        'post_id' => $privatePost->id,
        'user_id' => User::factory()->create()->id,
    ]);

    $response = $this->actingAs($this->user)->post('/likes/toggle', [
        'likeable_id' => $privateComment->id,
        'likeable_type' => 'App\\Models\\Comment',
    ]);

    $response->assertStatus(403);
    expect(Like::where([
        'user_id' => $this->user->id,
        'likeable_id' => $privateComment->id,
        'likeable_type' => Comment::class,
    ])->exists())->toBeFalse();
});
