# News Feed

A social media feed application built with Laravel 13, React 19, Inertia.js v3, and TypeScript. Users can create posts with images, comment with nested replies, and like/unlike posts, comments, and replies. The UI follows a provided HTML/CSS template with Bootstrap 5 styling.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 (PHP 8.4) |
| Frontend | React 19 + TypeScript |
| SPA Framework | Inertia.js v3 |
| Auth | Laravel Fortify |
| CSS | Bootstrap 5.3.3 (template) + Tailwind CSS v4 (starter kit pages) |
| Build | Vite 8 |
| Testing | Pest 4 |
| Routes | Laravel Wayfinder (auto-generated TypeScript route helpers) |

## Features

### Authentication
- Registration with first name, last name, email, and password
- Login/logout via Laravel Fortify (session-based)
- Protected routes — feed is only accessible to authenticated users

### Feed
- **Posts**: Create posts with text and optional image upload. Posts are ordered newest-first with infinite scroll.
- **Visibility**: Posts can be public (visible to all) or private (visible only to the author).
- **Likes**: Toggle like/unlike on posts, comments, and replies. Liked users are displayed on each entity.
- **Comments & Replies**: Add comments to posts and nested replies to comments. Each supports its own like/unlike system.
- **Three-dot menu**: Dropdown to delete own posts or save posts (uses CSS `show` class toggle pattern).

### UI
- Header with notification dropdown and profile dropdown (React state-managed, CSS animated).
- Left sidebar (explore links, suggested people, events) and right sidebar (suggestions, friends).
- Dark mode toggle.
- Responsive design with mobile layouts.

## Architecture Decisions

### Polymorphic Likes
A single `likes` table uses polymorphic relationships (`likeable_type` + `likeable_id`) to handle likes for posts, comments, and replies without separate tables. A unique constraint on `(user_id, likeable_id, likeable_type)` prevents duplicate likes.

### Nested Comments
Comments use a `parent_id` self-referencing foreign key. Top-level comments have `parent_id = null`; replies reference their parent comment. The frontend renders replies recursively.

### Post Visibility
Posts have a `visibility` column (`public` or `private`). A `visibleTo(User $user)` scope filters posts so users see all public posts plus their own private ones.

### Dropdown Menus (CSS `show` Class)
The template uses `opacity: 0; visibility: hidden` to hide dropdowns and a global `.show` CSS class to reveal them (`opacity: 1 !important; visibility: visible !important`). React components toggle this class via state instead of using Bootstrap JS or conditional DOM rendering, preserving CSS transitions.

### Form Handling
Post creation uses Inertia's `useForm` hook, which automatically converts form data to `FormData` when a `File` object is present — no manual `FormData` construction needed.

### Comment & Like Submissions
Comments and likes use Inertia's `router.post()` with `router.reload({ only: ['posts'] })` on success to refresh only the posts data prop, avoiding full page reloads.

## Installation

### Requirements
- PHP 8.3+
- Node.js 18+
- Composer 2+
- SQLite (default) or MySQL/PostgreSQL

### Setup

```bash
# Clone the repository
git clone <repo-url> news-feed
cd news-feed

# Install PHP dependencies
composer install

# Install frontend dependencies
npm install

# Copy environment file and generate app key
cp .env.example .env
php artisan key:generate

# Run database migrations
php artisan migrate

# Link storage for image uploads
php artisan storage:link

# Build frontend assets
npm run build
```

### Development

```bash
# Start all dev servers (PHP, queue, Vite, logs)
composer run dev

# Or run individually:
php artisan serve          # Laravel dev server
npm run dev                # Vite HMR
```

### Testing

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test --compact --filter=PostTest
```

## Project Structure

```
app/Http/Controllers/
├── PostController.php          # CRUD for posts with visibility filtering
├── CommentController.php       # Comment & reply creation/deletion
├── LikeController.php          # Polymorphic like toggle
└── Settings/
    ├── ProfileController.php   # Profile management
    └── SecurityController.php  # Password updates

app/Models/
├── User.php                    # Has many posts, comments, likes
├── Post.php                    # Belongs to user, has comments, morphMany likes
├── Comment.php                 # Self-referencing (parent_id), morphMany likes
└── Like.php                    # Polymorphic (likeable_type + likeable_id)

resources/js/
├── pages/                      # Inertia page components
│   ├── auth/                   # Login, register, password reset
│   ├── feed.tsx                # Main feed page (protected)
│   └── settings/               # Profile, security, appearance
├── components/
│   ├── post-form.tsx           # Create post with image upload (useForm)
│   ├── post-card.tsx           # Post display with like, comment, dropdown
│   ├── comment-section.tsx     # Comments, replies, and their likes
│   ├── feed/                   # Header, sidebars (left, right)
│   └── ui/                     # Reusable UI components (Radix + Tailwind)
├── layouts/
│   ├── feed-layout.tsx         # Feed-specific layout
│   └── app-layout.tsx          # General app layout
└── routes/                     # Auto-generated by Wayfinder
    ├── posts/index.ts
    ├── comments/index.ts
    ├── likes/index.ts
    └── ...
```

## Key Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/` | Feed page (auth required) |
| GET | `/feed` | Feed page (alias) |
| POST | `/posts` | Create a new post |
| PUT | `/posts/{post}` | Update a post |
| DELETE | `/posts/{post}` | Delete a post |
| POST | `/comments` | Add a comment or reply |
| DELETE | `/comments/{comment}` | Delete a comment |
| POST | `/likes/toggle` | Toggle like on post/comment |
| GET | `/login` | Login page |
| GET | `/register` | Registration page |
