# DevTree

DevTree is a Linktree-style web app that lets developers publish a single, shareable page (`devtree.greenie.dev/username`) with a profile photo, bio, and a curated, reorderable list of social/portfolio links. This repository contains the frontend client — a React + TypeScript SPA that consumes a separate DevTree REST API.

**Live site:** [https://devtree.greenie.dev/](https://devtree.greenie.dev/)
**Repository:** [https://github.com/MarioAGtzC/devtree-frontend](https://github.com/MarioAGtzC/devtree-frontend)

## The Problem It Solves

Developers and creators typically have their presence scattered across many platforms — GitHub, LinkedIn, Twitch, YouTube, X, Instagram, TikTok, Facebook — but only one link slot available in most social media bios. DevTree solves this by giving each user a single, personal, brandable URL that consolidates every relevant link in one place.

From a user's perspective, DevTree answers three needs:

- **Discoverability** — check instantly whether a desired username/handle is available before signing up.
- **Control** — decide which social networks to show, provide the URL for each, and toggle them on/off at any time.
- **Presentation** — arrange links in whatever order matters most via drag-and-drop, and personalize the public page with a profile photo and short bio.

## My Role and Process

I designed and built the entire frontend client end-to-end, working feature-by-feature against a REST API contract (auth, profile, and public-lookup endpoints). The development history reflects an incremental, commit-per-feature workflow:

1. **Foundation** — scaffolded the project with Vite, set up routing, Tailwind theming, and shared layouts (`AuthLayout` for public/auth pages, `AppLayout` for the authenticated admin area).
2. **Public landing & discovery** — built the marketing home page and a username-search form (with slug normalization) that checks availability against the API before funneling users into registration.
3. **Authentication** — implemented registration (with password-confirmation and complexity validation) and login, backed by JWT stored client-side and attached to requests automatically.
4. **Protected admin area** — added route protection that redirects unauthenticated users to login, using React Query to fetch and cache the current user.
5. **Profile management** — built the profile form (username, bio, avatar upload) with optimistic UI updates and toast-based error/success feedback.
6. **Social links editor** — implemented the per-network link editor (URL input + enable/disable toggle with URL validation) and persisted changes back to the API.
7. **Drag-and-drop ordering** — added reorderable enabled links using a sortable drag-and-drop context, persisting the new order.
8. **Public profile page** — built the read-only public view (`/:username`) rendering the user's photo, bio, and enabled links, plus a custom 404 for unknown usernames.

Throughout, the focus was on keeping server state (user/session data) and local UI state cleanly separated, minimizing boilerplate in forms, and giving immediate feedback on every mutation.

## Technologies and Tools Used

- **React 19 + TypeScript** — core UI framework and static typing for the whole application.
- **Vite (with SWC)** — development server and production build tooling, chosen for fast HMR and build times.
- **React Router** — client-side routing, including nested layouts for public, auth, and authenticated admin sections, plus route-level redirects for protected pages.
- **TanStack React Query** — server-state management: fetching, caching, and invalidating the logged-in user's data, with manual cache updates for optimistic-style UI on profile and link changes.
- **Axios** — HTTP client for all API communication, with a request interceptor that automatically attaches the JWT bearer token from local storage.
- **JWT-based authentication** — session handling: token issued on login, persisted client-side, and used to gate access to the admin routes.
- **React Hook Form** — form state, validation, and error handling across login, registration, and profile forms (including custom rules like password complexity and password-confirmation matching).
- **Tailwind CSS (with `@tailwindcss/forms`)** — utility-first styling and consistent form-control theming, including a custom background image/theme extension for the landing page.
- **dnd-kit** (`core` + `sortable`) — drag-and-drop reordering of enabled social links on the admin dashboard.
- **Sonner** — toast notifications for surfacing API success/error responses (e.g., validation errors, save confirmations) throughout the app.
- **Deployment on Netlify** — the production build is hosted and served via Netlify.

## Results or Impact

- Shipped a fully functional, deployed product (devtree.greenie.dev) covering the complete user journey: discover a username → register → log in → edit profile & links → share a public page.
- Decoupled server and UI state using React Query, removing manual loading/error/cache-invalidation boilerplate that would otherwise be duplicated across every data-fetching component.
- Delivered an editable, drag-and-drop link ordering experience without hand-rolling pointer/touch event handling, keeping the interaction accessible and consistent across devices.
- Centralized authentication concerns (token storage/attachment, protected-route redirects) so that individual views don't need to know about auth mechanics.

## Screenshots / Demo

No screenshots are currently checked into this repository. Recommended location: add images to `public/screenshots/` and reference them here, for example:

```md
![Home page](public/screenshots/home.png)
![Admin dashboard - link editor](public/screenshots/admin-links.png)
![Public profile page](public/screenshots/public-profile.png)
```

In the meantime, the live app can be explored directly at [https://devtree.greenie.dev/](https://devtree.greenie.dev/).

## Links

- **Live site:** [https://devtree.greenie.dev/](https://devtree.greenie.dev/)
- **Repository:** [https://github.com/MarioAGtzC/devtree-frontend](https://github.com/MarioAGtzC/devtree-frontend)
