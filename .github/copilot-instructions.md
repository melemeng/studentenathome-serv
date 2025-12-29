# Copilot Instructions: StudentenAtHome

## Project Overview
StudentenAtHome is a **marketing website** for a tech support service in Dresden. Built as a **single-page application (SPA)** using React 19 + TypeScript + Vite, with client-side routing and an Express backend for blog/SEO features.

**Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS 4.x, shadcn/ui, Radix UI, Framer Motion, GitHub Spark
**Deployment**: GitHub Pages with subpath `/studentenathome-serv/`

## Architecture & Routing

### Client-Side Routing Pattern
- **No React Router** – custom implementation in [src/App.tsx](../src/App.tsx)
- Routes managed via `window.history.pushState()` and `popstate` listener
- URL pathname mapped to page identifiers through `pathToPage()` function
- **Critical**: All paths must handle subpath prefix (`/studentenathome-serv/`) for GitHub Pages deployment
- Example: `/studentenathome-serv/blog` → renders `BlogPage` component

**Navigation flow**:
```tsx
handleNavigate(page: string) → 
  pageToPath(page) → 
  window.history.pushState() → 
  setCurrentPage(page) → 
  renderPage() renders page component
```

### Component Structure
```
src/
├── App.tsx              # Root with routing logic
├── components/
│   ├── Header.tsx       # Navigation bar
│   ├── Footer.tsx       # Site footer
│   ├── pages/           # Page components (receive onNavigate prop)
│   └── ui/              # shadcn/ui components (Radix-based)
├── lib/
│   ├── data.ts          # Central data store (siteData object)
│   ├── seo.ts           # SEO utilities (setMeta function)
│   └── utils.ts         # cn() for className merging
```

## Development Patterns

### Data Management
- **No state management library** – data comes from `siteData` object in [src/lib/data.ts](../src/lib/data.ts)
- Content is static JSON structure with pages, navigation, services, testimonials
- To update content: edit `siteData` directly (no CMS)

### Styling Convention
- **Tailwind 4.x** with custom theme in [theme.json](../theme.json) and [src/styles/theme.css](../src/styles/theme.css)
- Uses **Radix Colors** (`@radix-ui/colors`) for color system with light/dark variants
- Custom CSS variables defined: `--color-neutral-{1-12}`, `--color-primary-{1-12}`, etc.
- **Always use `cn()` helper** from `@/lib/utils` for conditional classes:
  ```tsx
  className={cn("base-classes", condition && "conditional-classes")}
  ```

### UI Components
- **shadcn/ui pattern**: Components in `src/components/ui/` are copied, not imported from package
- Built on Radix UI primitives with Tailwind styling
- Common components: Button, Card, Input, Dialog, Sheet (mobile drawer)
- **Icon library**: `@phosphor-icons/react` (not Heroicons despite being in package.json)

### Animations
- **Framer Motion** for scroll reveals and transitions
- Pattern: fade-in + slide-up on viewport enter
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  />
  ```
- Hover states: `scale(1.02)` with 200ms ease

### SEO Implementation
- Every page calls `setMeta()` from `@/lib/seo` in `useEffect`
- Dynamically updates `<title>`, `<meta>`, `<link rel="canonical">`, and JSON-LD
- Pattern in page components:
  ```tsx
  useEffect(() => {
    setMeta({
      title: "Page Title",
      description: "...",
      canonical: "/page-path",
      jsonLd: { /* schema.org data */ }
    });
  }, []);
  ```

## Backend Server

### Express API ([server/index.js](../server/index.js))
- **Serves blog posts** from `server/data/posts.json`
- **Generates dynamic sitemap** at `/sitemap.xml` including blog posts
- **Generates robots.txt** at `/robots.txt`
- Endpoints:
  - `GET /api/posts` – returns all blog posts
  - `GET /robots.txt` – robots file with sitemap reference
  - `GET /sitemap.xml` – dynamic sitemap with all pages + blog posts
- Environment variables: `ADMIN_TOKEN`, `CANONICAL_BASE_URL`

### Running Locally
```bash
npm run dev              # Start Vite dev server (port 5173)
npm run start:server     # Start Express backend (port 5000)
```
**Important**: Backend runs separately – frontend proxies `/api/*` requests in production

## Design System

### Brand Colors (from [PRD.md](../PRD.md))
- **Primary**: Deep Ocean Blue `oklch(0.35 0.08 250)`
- **Accent**: Energetic Coral `oklch(0.68 0.18 25)` for CTAs
- **Backgrounds**: Soft Slate `oklch(0.92 0.01 250)` for cards

### Typography
- **Headings**: Space Grotesk (load via CDN/font file)
- **Body**: Inter
- **Hierarchy**:
  - H1: 56px bold (hero headlines)
  - H2: 36px bold (section titles)
  - Body: 16px regular, line-height 1.7

### Responsive Breakpoints
- Mobile-first approach
- Hamburger menu (`Sheet` component) on mobile
- Grid layouts collapse to single column on mobile

## Common Tasks

### Adding a New Page
1. Create component in `src/components/pages/NewPage.tsx`
2. Add route mapping in `pathToPage()` and `pageToPath()` in [src/App.tsx](../src/App.tsx)
3. Add case in `renderPage()` switch statement
4. Update navigation in [src/lib/data.ts](../src/lib/data.ts) `siteData.site.navigation`
5. Add SEO metadata with `setMeta()` in page's `useEffect`

### Updating Content
1. Edit [src/lib/data.ts](../src/lib/data.ts) `siteData` object
2. No rebuild needed for static content changes (hot reload in dev)

### Adding UI Component
- Use shadcn/ui CLI: `npx shadcn@latest add <component-name>`
- Components copy to `src/components/ui/`
- Customize styling directly in copied files

### Building for Production
```bash
npm run build           # TypeScript compile + Vite build
npm run preview         # Preview production build locally
```
**Output**: `dist/` folder with static assets

## Critical Gotchas

1. **Subpath Routing**: All URLs must account for `/studentenathome-serv/` base path (set in [vite.config.ts](../vite.config.ts))
2. **No React Router**: Don't try to install react-router-dom – routing is custom
3. **Page Navigation**: Pass `onNavigate` prop down to child components, never use `<a href>`
4. **Image Imports**: Import from `@/assets/images/` – Vite processes at build time
5. **Tailwind 4.x**: Syntax differs from 3.x (check [tailwind.config.js](../tailwind.config.js) for custom theme)
6. **GitHub Spark**: Plugin required in Vite config – do not remove `sparkPlugin()`

## File References
- Routing logic: [src/App.tsx](../src/App.tsx)
- Site data: [src/lib/data.ts](../src/lib/data.ts)
- Theme config: [theme.json](../theme.json), [tailwind.config.js](../tailwind.config.js)
- Backend: [server/index.js](../server/index.js)
- Build config: [vite.config.ts](../vite.config.ts)
- Design spec: [PRD.md](../PRD.md)
