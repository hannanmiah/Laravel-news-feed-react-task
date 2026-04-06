export type Like = {
    user_id: number;
    likeable_id: number;
    likeable_type: string;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        full_name?: string;
    };
};

export type Comment = {
    id: number;
    content: string;
    user_id: number;
    post_id: number;
    parent_id: number | null;
    created_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        full_name?: string;
    };
    is_liked: boolean;
    likes_count: number;
    likes: Like[];
    replies: Comment[];
};

export type Post = {
    id: number;
    content: string;
    image: string | null;
    visibility: 'public' | 'private';
    user_id: number;
    created_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        full_name?: string;
        email: string;
    };
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    top_level_comments: Comment[];
    likes: Like[];
};