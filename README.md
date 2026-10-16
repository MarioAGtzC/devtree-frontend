# DevTree — Frontend

DevTree is a link-in-bio web app for developers. Each user gets one public page at `devtree.greenie.dev/<username>` with a profile photo, a short bio and a list of their social links in the order they choose. This repository is the React + TypeScript single-page app. It talks to a separate REST API ([devtree-backend](https://github.com/MarioAGtzC/devtree-backend)).

**Live site:** https://devtree.greenie.dev

---

## The problem it solves

A developer's work and presence are usually spread across GitHub, LinkedIn, YouTube, Twitch, X and other platforms, but most social profiles allow only one link. DevTree gives each person a single, memorable URL that collects all of those links, and the person decides which ones show and in what order.

The app covers the full user journey:

- **Claim a handle:** visitors check on the home page whether a username is free, then go straight to registration with that handle pre-filled.
- **Control what is shown:** users add a URL for each supported network (Facebook, GitHub, Instagram, X, YouTube, TikTok, Twitch, LinkedIn) and switch each one on or off.
- **Present it their way:** users reorder links by drag and drop, upload a profile image and write a bio, with a live preview next to the editor.
- **Share one link:** the public page at `/<username>` shows only the enabled links. Unknown usernames go to a "User Not Found" page.

## My role and process

I built this solo as a 2025 course project. I followed the course material and then extended it. I built the whole frontend and integrated it with my own backend API.

**What I built**

- **Public area:** landing page with a username availability search, plus public profile pages.
- **Authentication:** registration and login forms with client-side validation. This includes an email format check, a password strength rule (8+ characters with upper case, lower case, a number and a symbol) and a password confirmation match.
- **Protected admin area (`/admin`):** a links editor and a profile editor. If the current user can't be loaded, the user is redirected to login.
- **Links editor:** URLs are validated before a link can be enabled, enabled links can be reordered by drag and drop, and changes are saved to the API in one action.
- **Profile editor:** change username and bio, and upload an image as a multipart file.
- **Deployment:** an SPA fallback rule so deep links like `/<username>` resolve correctly on the host.

**Approach**

- I split the app into route-level layouts: one for the public and auth pages and one for the authenticated dashboard.
- Server data (the logged-in user) lives in a single query cache. Link toggles and reordering update that cache immediately so the preview reacts at once, and **Save changes** sends it to the API.
- All API calls go through one HTTP client module, so auth headers and error handling live in one place.
- The project grew one feature per commit: routing, then auth, profile, links, drag and drop, public pages and deployment fixes.

## Technologies and tools

| Area | What it does in this project |
| --- | --- |
| **Language & UI framework** | React 19 with TypeScript for a type-safe component-based SPA |
| **Build & dev server** | Vite with the SWC React plugin for local development and production builds |
| **Routing** | React Router for nested layouts, the `/admin` dashboard, dynamic `/:username` public pages and redirects to login or 404 |
| **Server state** | TanStack Query for fetching and caching the current user and public profiles, mutations for saving, and cache updates for an instant preview |
| **API communication** | Axios client with a configurable base URL and a request interceptor that attaches the auth token to every call |
| **Authentication** | Token-based auth: the token returned at login is stored in the browser and sent as a Bearer header. Logging out clears it and invalidates the cached user |
| **Forms & validation** | React Hook Form for registration, login, profile and search forms, with field-level validation rules |
| **Drag-and-drop ordering** | dnd-kit (core + sortable) for reordering enabled links |
| **Styling** | Tailwind CSS with the forms plugin and a custom theme extension for the landing page background |
| **User feedback** | Sonner toast notifications for API success and error messages |
| **Hosting & deployment** | Netlify, with a catch-all rewrite to `index.html` so client-side routes work on direct visits and refreshes |

## Results and impact

- **Live in production** at [devtree.greenie.dev](https://devtree.greenie.dev), running against my own backend, so the project covers the full stack from UI to API.
- **A complete user journey** in one app: find a free handle, sign up, edit the profile, pick and order links, and share the public page.
- **Fewer failed saves:** checks in the browser (email format, password strength, password match, valid URL before a link is turned on) catch common mistakes before a request is sent.
- **Instant feedback:** link changes and new orderings show in the preview before they are saved.
- **Tested behaviour:** 57 automated tests across 7 test files, all passing. They run locally with `npm test`; there is no CI pipeline yet.

No usage or performance metrics are tracked, so none are reported here.

## Screenshots and live demo

**Live demo:** https://devtree.greenie.dev

There are no screenshots in the repository yet. Add them under `docs/screenshots/` and link them here. Suggested captures:

1. Landing page with the username availability search
2. Admin links editor with the live preview panel
3. Profile editor (username, bio, image upload)
4. A public profile page (`/<username>`)

## Links

- **Live site:** https://devtree.greenie.dev
- **Frontend (this repo):** https://github.com/MarioAGtzC/devtree-frontend
- **Backend API / case study:** [devtree-backend](https://github.com/MarioAGtzC/devtree-backend)

---

**Author:** Mario Gutiérrez, Backend Software Engineer
