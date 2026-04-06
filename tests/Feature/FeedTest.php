<?php

use App\Models\Post;
use App\Models\User;

test('feed page requires authentication', function () {
    $response = $this->get('/feed');
    $response->assertRedirect(route('login'));
});

test('authenticated user can view feed', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/feed');

    $response->assertOk();
});

test('feed shows newest posts first', function () {
    $user = User::factory()->create();
    Post::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(2)]);
    $newest = Post::factory()->create(['user_id' => $user->id, 'created_at' => now()]);

    $response = $this->actingAs($user)->get('/feed');

    $posts = collect($response->inertiaProps()['posts']['data']);
    $firstPostId = $posts->first()['id'];
    expect($firstPostId)->toBe($newest->id);
});
