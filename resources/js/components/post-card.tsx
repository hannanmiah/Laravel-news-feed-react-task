import { router } from '@inertiajs/react';
import { useState, useEffect,useMemo, useRef } from 'react';
import { toggle as toggleLike } from '@/routes/likes';
import { destroy as destroyPost } from '@/routes/posts';
import type {Post} from '@/types';
import CommentSection from './comment-section';
interface PostCardProps {
    post: Post;
    authUserId: number;
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffSeconds < 60) {
return 'just now';
}

    if (diffMinutes < 60) {
return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
}

    if (diffHours < 24) {
return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
}

    if (diffDays < 7) {
return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

    return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
}

export default function PostCard({ post, authUserId }: PostCardProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const photo = useMemo(() => {
        return `https://ui-avatars.com/api/?name=${post.user.first_name+post.user.last_name}&background=random&color=fff&size=128`;
    },[post])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);
    const likerNames = post.likes
        .map((like) => like.user?.full_name ?? `${like.user?.first_name ?? ''} ${like.user?.last_name ?? ''}`.trim())
        .filter((name) => name.length > 0);

    const handleLike = () => {
        router.post(
            toggleLike.url(),
            {
                likeable_id: post.id,
                likeable_type: 'App\\Models\\Post',
            },
            {
                preserveScroll: true,
                onFinish: () => router.reload({ only: ['posts'] }),
            },
        );
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(destroyPost.url({ post: post.id }));
        }
    };

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                {/* Post header with avatar, name, time, visibility, and dropdown */}
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <img src={photo} alt="" className="_post_img" />
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">
                                {post.user.first_name} {post.user.last_name}
                            </h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {formatRelativeTime(post.created_at)} .{' '}
                                <a href="#">{post.visibility === 'public' ? 'Public' : 'Private'}</a>
                            </p>
                        </div>
                    </div>
                    <div className="_feed_inner_timeline_post_box_dropdown">
                        <div className="_feed_timeline_post_dropdown">
                            <button
                                className="_feed_timeline_post_dropdown_link"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                </svg>
                            </button>
                        </div>
                        <div className={`_feed_timeline_dropdown _timeline_dropdown${showDropdown ? ' show' : ''}`}>
                                <ul className="_feed_timeline_dropdown_list">
                                    {post.user_id === authUserId && (
                                        <li className="_feed_timeline_dropdown_item">
                                            <button
                                                className="_feed_timeline_dropdown_link"
                                                onClick={() => {
 handleDelete(); setShowDropdown(false); 
}}
                                                style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                                            >
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
                                                    </svg>
                                                </span>
                                                Delete Post
                                            </button>
                                        </li>
                                    )}
                                    <li className="_feed_timeline_dropdown_item">
                                        <a href="#" className="_feed_timeline_dropdown_link" onClick={() => setShowDropdown(false)}>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                    <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                                                </svg>
                                            </span>
                                            Save Post
                                        </a>
                                    </li>
                                </ul>
                        </div>
                    </div>
                </div>

                {/* Post content text */}
                {post.content && (
                    <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
                )}

                {/* Post image */}
                {post.image && (
                    <div className="_feed_inner_timeline_image">
                        <img src={`/storage/${post.image}`} alt="" className="_time_img" />
                    </div>
                )}
            </div>

            {/* Likes and comments count display */}
            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div className="_feed_inner_timeline_total_reacts_image">
                    {post.likes_count > 0 && (
                        <>
                            <img src="/assets/images/react_img1.png" alt="Like" className="_react_img1" />
                            <img src="/assets/images/react_img2.png" alt="Like" className="_react_img" />
                            <p className="_feed_inner_timeline_total_reacts_para">{post.likes_count}</p>
                        </>
                    )}
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <a href="#"><span>{post.comments_count}</span> Comment{post.comments_count !== 1 ? 's' : ''}</a>
                    </p>
                    {likerNames.length > 0 && (
                        <p className="_feed_inner_timeline_total_reacts_para2">
                            Liked by {likerNames.join(', ')}
                        </p>
                    )}
                </div>
            </div>

            {/* Action buttons: Like, Comment, Share */}
            <div className="_feed_inner_timeline_reaction">
                <button
                    className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${post.is_liked ? '_feed_reaction_active' : ''}`}
                    onClick={handleLike}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                                <path fill={post.is_liked ? '#FFCC4D' : '#ddd'} d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                                <path fill={post.is_liked ? '#664500' : '#999'} d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                                <path fill={post.is_liked ? '#fff' : '#ccc'} d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                                <path fill={post.is_liked ? '#664500' : '#999'} d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
                            </svg>
                            {post.is_liked ? 'Liked' : 'Like'}
                        </span>
                    </span>
                </button>
                <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                            </svg>
                            Comment
                        </span>
                    </span>
                </button>
                <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                            </svg>
                            Share
                        </span>
                    </span>
                </button>
            </div>

            {/* Comment section */}
            <CommentSection
                comments={post.top_level_comments}
                postId={post.id}
                authUserId={authUserId}
            />
        </div>
    );
}
