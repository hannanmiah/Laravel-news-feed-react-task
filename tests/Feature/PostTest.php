<?php

use App\Models\Post;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('authenticated user can create a post', function () {
    $response = $this->actingAs($this->user)->post('/posts', [
        'content' => 'Hello, this is my first post!',
        'visibility' => 'public',
    ]);

    $response->assertRedirect();
    expect(Post::where('user_id', $this->user->id)->count())->toBe(1);
});

test('post requires content', function () {
    $response = $this->actingAs($this->user)->post('/posts', [
        'content' => '',
        'visibility' => 'public',
    ]);

    $response->assertSessionHasErrors(['content']);
});

test('authenticated user can delete own post', function () {
    $post = Post::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->delete("/posts/{$post->id}");

    $response->assertRedirect();
    expect(Post::find($post->id))->toBeNull();
});

test('user cannot delete another users post', function () {
    $otherUser = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($this->user)->delete("/posts/{$post->id}");

    $response->assertStatus(403);
});

test('public posts are visible to everyone', function () {
    $otherUser = User::factory()->create();
    Post::factory()->create(['user_id' => $otherUser->id, 'visibility' => 'public']);

    $response = $this->actingAs($this->user)->get('/feed');

    $response->assertOk();
});

test('private posts are only visible to the author', function () {
    Post::factory()->create(['user_id' => $this->user->id, 'visibility' => 'private']);

    $otherUser = User::factory()->create();
    Post::factory()->create(['user_id' => $otherUser->id, 'visibility' => 'private']);

    $response = $this->actingAs($this->user)->get('/feed');

    $response->assertOk();
    $posts = collect($response->inertiaProps()['posts']['data']);
    $privatePosts = $posts->where('visibility', 'private');
    $privatePosts->each(fn ($p) => expect($p['user_id'])->toBe($this->user->id));
});
