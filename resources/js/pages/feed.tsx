import { Head, usePage } from '@inertiajs/react';
import FeedLayout from '@/layouts/feed-layout';
import PostCard from '@/components/post-card';
import PostForm from '@/components/post-form';
import type { User,Post } from '@/types';



type FeedPageProps = {
    auth: {
        user: User;
    };
    posts: {
        data: Post[];
    };
};

export default function Feed() {
    const { auth, posts } = usePage<FeedPageProps>().props;

    return (
        <>
            <Head title="Feed" />

            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                    <div className="_layout_middle_inner">
                        <PostForm
                            authUser={{
                                id: auth.user.id,
                                first_name: auth.user.first_name,
                                last_name: auth.user.last_name,
                            }}
                        />

                        {posts.data.length > 0 ? (
                            posts.data.map((post) => (
                                <PostCard key={post.id} post={post} authUserId={auth.user.id} />
                            ))
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
