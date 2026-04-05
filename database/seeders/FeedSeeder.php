<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class FeedSeeder extends Seeder
{
    /**
     * Seed realistic feed data.
     */
    public function run(): void
    {
        /** @var Collection<int, User> $users */
        $users = User::query()->get();

        if ($users->count() < 8) {
            $users = $users->merge(User::factory()->count(8 - $users->count())->create());
        }

        $posts = collect();

        foreach ($users as $index => $author) {
            $postCount = $index < 3 ? 3 : 2;

            for ($i = 0; $i < $postCount; $i++) {
                $visibility = $i === 0 && $index % 2 === 0 ? 'private' : 'public';

                $post = Post::query()->create([
                    'user_id' => $author->id,
                    'content' => fake()->sentence(rand(8, 20)),
                    'visibility' => $visibility,
                    'image' => null,
                ]);

                $posts->push($post);
            }
        }

        $posts->each(function (Post $post) use ($users): void {
            $commenters = $users->where('id', '!=', $post->user_id)->shuffle()->take(rand(2, 5));

            foreach ($commenters as $commenter) {
                $topComment = Comment::query()->create([
                    'post_id' => $post->id,
                    'user_id' => $commenter->id,
                    'parent_id' => null,
                    'content' => fake()->sentence(rand(6, 16)),
                ]);

                if (rand(0, 1) === 1) {
                    $replier = $users->where('id', '!=', $commenter->id)->random();

                    Comment::query()->create([
                        'post_id' => $post->id,
                        'user_id' => $replier->id,
                        'parent_id' => $topComment->id,
                        'content' => fake()->sentence(rand(5, 12)),
                    ]);
                }
            }

            $postLikers = $users->shuffle()->take(rand(1, min(5, $users->count())));
            foreach ($postLikers as $liker) {
                Like::query()->firstOrCreate([
                    'user_id' => $liker->id,
                    'likeable_id' => $post->id,
                    'likeable_type' => Post::class,
                ]);
            }
        });

        Comment::query()->get()->each(function (Comment $comment) use ($users): void {
            $likers = $users->shuffle()->take(rand(0, min(4, $users->count())));

            foreach ($likers as $liker) {
                Like::query()->firstOrCreate([
                    'user_id' => $liker->id,
                    'likeable_id' => $comment->id,
                    'likeable_type' => Comment::class,
                ]);
            }
        });
    }
}
