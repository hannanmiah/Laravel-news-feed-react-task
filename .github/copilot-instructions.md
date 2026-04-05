# Copilot Instructions for `news-feed`

## Project requirement and scope (from README.md)

- This repository’s primary brief is to implement Login, Register, and Feed experiences using Laravel 13 + Inertia + React while preserving the provided design assets/templates.
- Keep implementation scope aligned to the listed requirements:
  - Auth with registration fields: `first_name`, `last_name`, `email`, `password`.
  - Feed is protected and ordered newest-first.
  - Create posts with text + image.
  - Post like/unlike.
  - Comments and replies with like/unlike.
  - Visibility modes: `public` (everyone) and `private` (author only).
- Do not expand feature scope unless explicitly requested (e.g., avoid adding unrelated auth/product features by default).

## Build, test, and lint commands

- Initial setup: `composer setup`
- Local development (Laravel server, queue worker, logs, and Vite): `composer dev`
- Frontend dev/build:
  - `npm run dev`
  - `npm run build`
  - `npm run build:ssr`

- PHP tests:
  - Full suite (project script): `composer test`
  - Full suite (direct): `php artisan test`
  - Single test file: `php artisan test tests/Feature/Auth/AuthenticationTest.php`
  - Single test name/filter: `php artisan test --filter="users can authenticate using the login screen"`

- Lint/format/type checks:
  - PHP format check: `composer lint:check`
  - PHP format fix: `composer lint`
  - Frontend ESLint check: `npm run lint:check`
  - Frontend ESLint fix: `npm run lint`
  - Prettier check: `npm run format:check`
  - Prettier write: `npm run format`
  - TypeScript checks: `npm run types:check`
  - Combined CI checks: `composer ci:check`

- Wayfinder route generation:
  - `php artisan wayfinder:generate`

## High-level architecture

- Stack: Laravel 13 + Fortify auth + Inertia.js v3 + React 19 + Vite + Tailwind v4, with Pest for tests.

- Request/UI flow:
  - Laravel routes are in `routes/web.php` and `routes/settings.php`.
  - Fortify auth views are mapped to Inertia pages in `app/Providers/FortifyServiceProvider.php`.
  - Inertia shared props come from `app/Http/Middleware/HandleInertiaRequests.php` (`auth.user`, app name, sidebar state).
  - Page layout selection is centralized in `resources/js/app.tsx` by page name/prefix (`auth/*`, `settings/*`, etc.).

- Feed domain model:
  - `Post`, `Comment`, and `Like` live in `app/Models`.
  - Likes are polymorphic (`likes.likeable_type` / `likeable_id`) and target posts/comments.
  - Comments support replies via self-reference (`parent_id`).
  - Post visibility is enforced through `Post::visibleTo($userId)` (public posts + owner’s private posts).
  - Feed endpoint is `PostController@index`, which eager-loads user/comments/replies/likes and returns Inertia `feed`.

- Frontend composition:
  - Auth/settings/welcome pages are under `resources/js/pages`.
  - Feed behavior is implemented through `resources/js/components/post-form.tsx`, `post-card.tsx`, and `comment-section.tsx`.
  - Route helpers are expected from Wayfinder imports (`@/routes`, `@/actions`), not manual URL strings.

- Styling system:
  - `resources/views/app.blade.php` loads both Tailwind app CSS and legacy design assets (`/assets/css/common.css`, `main.css`, `responsive.css`, Bootstrap).
  - Many auth/feed UIs depend on legacy class names (`_social_*`, `_feed_*`) from provided templates.

## Key conventions in this repository

- Preserve provided template styling for login/register/feed flows (from project brief files like `AGENTS.md` / `README.md`); do not redesign those views to default starter-kit styles.

- Use Wayfinder-generated route helpers for frontend calls and regenerate after route/controller signature changes (`php artisan wayfinder:generate`).

- User profile fields are `first_name` and `last_name` (not a single `name` field).

- For post/comment mutations, follow policy authorization patterns (`PostPolicy`, `CommentPolicy`) and existing request validation classes in `app/Http/Requests`.

- Keep like toggling compatible with existing payload conventions:
  - `likeable_type` values are fully-qualified model strings (`App\\Models\\Post`, `App\\Models\\Comment`).

- Eloquent mass-assignment and hidden fields use PHP attributes (`#[Fillable(...)]`, `#[Hidden(...)]`) in models instead of classic `$fillable`/`$hidden` properties.

- Feature tests use Pest with `RefreshDatabase` configured globally in `tests/Pest.php`; new behavior changes should be covered by targeted Pest feature tests.
