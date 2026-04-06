import { router } from '@inertiajs/react';
import { useState } from 'react';
import { destroy as destroyComment, store as storeComment } from '@/routes/comments';
import { toggle as toggleLike } from '@/routes/likes';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    full_name?: string;
}

interface Comment {
    id: number;
    content: string;
    user_id: number;
    post_id: number;
    parent_id: number | null;
    created_at: string;
    user: User;
    is_liked: boolean;
    likes_count: number;
    likes: Array<{
        user_id: number;
        likeable_id: number;
        likeable_type: string;
        user?: { first_name: string; last_name: string; full_name?: string };
    }>;
    replies: Comment[];
}

interface CommentSectionProps {
    comments: Comment[];
    postId: number;
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
        return 'now';
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    }

    if (diffHours < 24) {
        return `${diffHours}h`;
    }

    if (diffDays < 7) {
        return `${diffDays}d`;
    }

    return `${diffWeeks}w`;
}

function CommentItem({
    comment,
    authUserId,
    postId,
    depth = 0,
    onCommentDeleted,
}: {
    comment: Comment;
    authUserId: number;
    postId: number;
    depth?: number;
    onCommentDeleted: (id: number) => void;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const likes = comment.likes ?? [];
    const replies = comment.replies ?? [];
    const commenter = comment.user ?? { first_name: 'Unknown', last_name: '' };
    const likerNames = likes
        .map((like) => like.user?.full_name ?? `${like.user?.first_name ?? ''} ${like.user?.last_name ?? ''}`.trim())
        .filter((name) => name.length > 0);

    const handleLike = () => {
        router.post(
            toggleLike.url(),
            {
                likeable_id: comment.id,
                likeable_type: 'App\\Models\\Comment',
            },
            {
                preserveScroll: true,
                onFinish: () => router.reload({ only: ['posts'] }),
            },
        );
    };

    const handleReplySubmit = () => {
        if (!replyContent.trim() || submitting) {
            return;
        }

        setSubmitting(true);
        router.post(
            storeComment.url(),
            {
                post_id: postId,
                parent_id: comment.id,
                content: replyContent.trim(),
            },
            {
                onSuccess: () => {
                    router.reload({ only: ['posts'] });
                    setReplyContent('');
                    setShowReplyForm(false);
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const handleDeleteComment = (id: number) => {
        router.delete(destroyComment.url({ comment: id }), {
            onSuccess: () => onCommentDeleted(id),
        });
    };

    return (
        <div className="_comment_main" style={{ marginTop: depth > 0 ? '10px' : '0' }}>
            <div className="_comment_image">
                <a href="#" className="_comment_image_link">
                    <img src="/assets/images/profile.png" alt="" className="_comment_img1" />
                </a>
            </div>
            <div className="_comment_area">
                <div className="_comment_details">
                    <div className="_comment_details_top">
                        <div className="_comment_name">
                            <a href="#">
                                <h4 className="_comment_name_title">
                                    {commenter.first_name} {commenter.last_name}
                                </h4>
                            </a>
                        </div>
                    </div>
                    <div className="_comment_status">
                        <p className="_comment_status_text">
                            <span>{comment.content}</span>
                        </p>
                    </div>
                    {((comment.likes_count ?? likes.length) > 0 || comment.is_liked) && (
                        <div className="_total_reactions">
                            <div className="_total_react">
                                <span className="_reaction_like">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    </svg>
                                </span>
                            </div>
                            <span className="_total">{comment.likes_count ?? likes.length}</span>
                        </div>
                    )}
                    {likerNames.length > 0 && (
                        <div className="_comment_status">
                            <p className="_comment_status_text">
                                <span>Liked by {likerNames.join(', ')}</span>
                            </p>
                        </div>
                    )}
                    <div className="_comment_reply">
                        <div className="_comment_reply_num">
                            <ul className="_comment_reply_list">
                                <li>
                                    <span
                                        onClick={handleLike}
                                        style={{
                                            cursor: 'pointer',
                                            color: comment.is_liked ? '#377DFF' : 'inherit',
                                            fontWeight: comment.is_liked ? 600 : 400,
                                        }}
                                    >
                                        Like
                                    </span>
                                </li>
                                <li>
                                    <span style={{ cursor: 'pointer' }} onClick={() => setShowReplyForm(!showReplyForm)}>
                                        Reply
                                    </span>
                                </li>
                                <li>
                                    <span
                                        className="_time_link"
                                        style={{
                                            cursor: 'default',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        &middot;&nbsp;{formatRelativeTime(comment.created_at)}
                                    </span>
                                </li>
                                {comment.user_id === authUserId && (
                                    <li>
                                        <span
                                            style={{ cursor: 'pointer', color: '#e74c3c' }}
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            Delete
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {showReplyForm && (
                    <div className="_feed_inner_comment_box" style={{ marginTop: '8px' }}>
                        <form
                            className="_feed_inner_comment_box_form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleReplySubmit();
                            }}
                        >
                            <div className="_feed_inner_comment_box_content">
                                <div className="_feed_inner_comment_box_content_image">
                                    <img src="/assets/images/profile.png" alt="" className="_comment_img" />
                                </div>
                                <div className="_feed_inner_comment_box_content_txt">
                                    <textarea
                                        className="form-control _comment_textarea"
                                        placeholder="Write a reply..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleReplySubmit();
                                            }
                                        }}
                                        rows={1}
                                    />
                                </div>
                            </div>
                            <div className="_feed_inner_comment_box_icon">
                                <button
                                    type="submit"
                                    className="_feed_inner_comment_box_icon_btn"
                                    disabled={!replyContent.trim() || submitting}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                        <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {replies.map((reply) => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        authUserId={authUserId}
                        postId={postId}
                        depth={depth + 1}
                        onCommentDeleted={onCommentDeleted}
                    />
                ))}
            </div>
        </div>
    );
}

export default function CommentSection({ comments, postId, authUserId }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPreviousComments, setShowPreviousComments] = useState(false);
    const allComments = comments ?? [];
    const hasHiddenComments = allComments.length > 1;
    const hiddenCommentsCount = Math.max(allComments.length - 1, 0);
    const visibleComments = showPreviousComments ? allComments : allComments.slice(0, 1);

    const handleSubmit = () => {
        if (!newComment.trim() || submitting) {
            return;
        }

        setSubmitting(true);
        router.post(
            storeComment.url(),
            {
                post_id: postId,
                parent_id: null,
                content: newComment.trim(),
            },
            {
                onSuccess: () => {
                    router.reload({ only: ['posts'] });
                    setNewComment('');
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const handleCommentDeleted = () => {
        router.reload({ only: ['posts'] });
    };

    return (
        <>
            {allComments.length > 0 && (
                <div className="_timline_comment_main">
                    {hasHiddenComments && !showPreviousComments && (
                        <div className="_previous_comment">
                            <button
                                type="button"
                                className="_previous_comment_txt"
                                onClick={() => setShowPreviousComments(true)}
                            >
                                {`View ${hiddenCommentsCount} previous comment${hiddenCommentsCount !== 1 ? 's' : ''}`}
                            </button>
                        </div>
                    )}
                    {visibleComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            authUserId={authUserId}
                            postId={postId}
                            depth={0}
                            onCommentDeleted={handleCommentDeleted}
                        />
                    ))}
                </div>
            )}

            <div className="_feed_inner_timeline_cooment_area">
                <div className="_feed_inner_comment_box">
                    <form
                        className="_feed_inner_comment_box_form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div className="_feed_inner_comment_box_content">
                            <div className="_feed_inner_comment_box_content_image">
                                <img src="/assets/images/profile.png" alt="" className="_comment_img" />
                            </div>
                            <div className="_feed_inner_comment_box_content_txt">
                                <textarea
                                    className="form-control _comment_textarea"
                                    placeholder="Write a comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                    rows={1}
                                />
                            </div>
                        </div>
                        <div className="_feed_inner_comment_box_icon">
                            <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={!newComment.trim() || submitting}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button type="button" className="_feed_inner_comment_box_icon_btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
