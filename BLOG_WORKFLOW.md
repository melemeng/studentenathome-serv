# Blog Post Creation Workflow

## Overview

Users can log in and create blog posts that will be displayed on the public blog page. The system supports both server-side storage (with authentication) and local fallback storage.

## How It Works

### 1. User Login

1. Navigate to `/login` page
2. Enter credentials (demo: `demo@studentenathome.de` / `demo123`)
3. After successful login, user sees a dashboard with a **"Blog Posts"** card
4. Click "Beitrag erstellen" to navigate to the blog page

### 2. Creating a Blog Post

1. On the blog page, logged-in users see a **"Neuen Beitrag erstellen"** button
2. Click the button to open the blog post creation form
3. Fill in the required fields:
   - **Titel** (Title) - minimum 10 characters
   - **Kurzbeschreibung** (Excerpt) - minimum 20 characters, max 200
   - **Kategorie** (Category) - select from dropdown
   - **Autor** (Author) - defaults to "StudentenAtHome Team"
   - **Lesezeit** (Read time) - auto-calculated or manual
   - **Inhalt** (Content) - HTML formatted content

### 3. Publishing

1. Click "Beitrag veröffentlichen" to publish
2. The system attempts to save to the backend API first
3. If successful, the post is stored in `server/data/posts.json`
4. If the API fails, the post is saved locally using GitHub Spark's KV storage
5. Success/error notifications are shown via toast messages

### 4. Viewing Published Posts

- All posts (from API + local) are displayed on the blog page
- Click any post card to view the full article
- SEO metadata is dynamically generated for each post

## Technical Implementation

### Authentication

- Login stores `authToken` in `localStorage`
- Token is sent as `Bearer` token in API requests
- Backend validates token against `ADMIN_TOKEN` environment variable

### Storage Options

1. **Server API** (`POST /api/posts`):

   - Requires authentication
   - Persists to `server/data/posts.json`
   - Included in dynamic sitemap generation

2. **Local Storage** (fallback):
   - Uses GitHub Spark's `useKV` hook
   - Stored in browser's IndexedDB
   - Only visible on the same device/browser

### Form Features

- **Auto-calculation**: Click "Lesezeit berechnen" to estimate read time
- **Character counter**: Shows remaining characters for excerpt (max 200)
- **Live preview**: See title, category, author, and read time before publishing
- **Validation**: Ensures all required fields are filled with minimum lengths
- **HTML editor**: Supports rich content with HTML formatting

## HTML Content Guidelines

Use these HTML patterns in the content field:

```html
<h3 class="text-xl font-bold mb-4">Überschrift</h3>
<p class="mb-4">Absatz mit Text...</p>

<h4 class="font-bold mt-6 mb-2">Unterüberschrift</h4>
<p class="mb-4">Weiterer Text...</p>

<ul class="list-disc list-inside mb-4">
  <li>Listenpunkt 1</li>
  <li>Listenpunkt 2</li>
</ul>
```

## Environment Variables

Set these in the backend:

- `ADMIN_TOKEN` - Authentication token for blog post creation (default: "demo-token")
- `CANONICAL_BASE_URL` - Base URL for sitemap generation (default: "https://studentenathome.de")

## File Structure

```
src/components/pages/
├── LoginPage.tsx        # Login form + dashboard with blog creation link
├── BlogPage.tsx         # Blog list + post detail + creation form

server/
├── index.js             # Express API with POST /api/posts endpoint
└── data/
    └── posts.json       # Persisted blog posts
```

## Development Workflow

### Starting the Development Server

```bash
# Terminal 1: Frontend
npm run dev              # Vite dev server on port 5173

# Terminal 2: Backend API
npm run start:server     # Express API on port 5000
```

### Testing Blog Creation

1. Navigate to `http://localhost:5173/login`
2. Login with demo credentials
3. Click "Beitrag erstellen" or navigate to `/blog`
4. Create a new post
5. Verify it appears in the blog list

### Production Deployment

- Backend must be deployed separately with proper authentication
- Frontend is deployed to GitHub Pages
- API endpoint should be configured in production environment
- Set proper `ADMIN_TOKEN` in production (not "demo-token")

## Security Considerations

⚠️ **Important**:

- Change `ADMIN_TOKEN` in production
- Implement proper user authentication (current system is demo-only)
- Validate and sanitize HTML content on the backend
- Consider adding CSRF protection
- Implement rate limiting for API endpoints

## Future Enhancements

- [ ] Rich text editor (WYSIWYG) instead of HTML textarea
- [ ] Image upload support
- [ ] Post editing and deletion
- [ ] Draft saving
- [ ] Preview mode before publishing
- [ ] Multi-user authentication with roles
- [ ] Comment system
- [ ] Post search and filtering
- [ ] Analytics and view counts
