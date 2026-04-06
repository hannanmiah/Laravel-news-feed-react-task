import { Head, InfiniteScroll, usePage } from '@inertiajs/react';
import StoryShell from '@/components/feed/story-shell';
import PostCard from '@/components/post-card';
import PostForm from '@/components/post-form';
import FeedLayout from '@/layouts/feed-layout';
import type { User,Post } from '@/types';


type FeedPageProps = {
    auth: {
        user: User;
    };
    posts: {
        data: Post[];
    };
};

export default function Feed({posts}: {posts: {data: Post[]}}) {
    const { auth } = usePage<FeedPageProps>().props;

    return (
        <>
            <Head title="Feed" />

            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                    <div className="_layout_middle_inner">
                        <StoryShell />


                        <PostForm />

                        {posts.data.length > 0 ? (
                            <InfiniteScroll data="posts" loading={() => "Loading more..."}>
                                {posts.data.map((post) => (
                                    <PostCard key={post.id} post={post} authUserId={auth.user.id} />
                                ))}
                            </InfiniteScroll>
                        ) : (
                            <div className="_empty_state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                                <h4 style={{ marginBottom: '8px', color: '#333' }}>No posts yet</h4>
                                <p style={{ color: '#888' }}>Be the first to share something with the community!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Feed.layout = FeedLayout
