# DevTree — Frontend

DevTree is a link-in-bio web app for developers. Each user gets one public page at `devtree.greenie.dev/<username>` with a profile photo, a short bio and their social links in the order they choose. This repository holds the React + TypeScript single-page app. It works with a separate REST API, [devtree-backend](https://github.com/MarioAGtzC/devtree-backend).

**Live site:** https://devtree.greenie.dev

---

## The problem it solves

A developer's presence is usually spread across GitHub, LinkedIn, YouTube, Twitch, X and other platforms, but most profiles allow only one link. DevTree gives each person one short URL that collects all of those links. The owner decides which links appear and in what order.

What a user can do:

- **Claim a handle:** check on the home page whether a username is free, then register with that handle already filled in.
- **Choose what to show:** add a URL for each supported network (Facebook, GitHub, Instagram, X, YouTube, TikTok, Twitch, LinkedIn) and turn each one on or off.
- **Make it their own:** drag links into any order, upload a profile image and write a bio, with a live preview beside the editor.
- **Share one link:** the public page at `/<username>` shows only the links that are turned on. Unknown usernames lead to a "User Not Found" page.

## My role and process

I built this alone as a course project in 2025. I followed the course and then extended it. I wrote the whole frontend and connected it to my own backend API.

**What I built**

- **Public pages:** a landing page with a username availability search, and a public profile page for each user.
- **Sign-up and login:** forms that check input before sending it: email format, password strength (at least 8 characters with a lowercase letter, an uppercase letter, a number and a symbol) and a matching password confirmation.
- **Private dashboard (`/admin`):** a links editor and a profile editor. If the current user can't be loaded, the app sends the visitor to the login page.
- **Links editor:** a link can only be turned on with a valid URL. Active links can be reordered by drag and drop, and everything is saved in one action.
- **Profile editor:** change the username and bio, and upload a profile image.
- **Automated tests:** tests for routing, the API module, the auth forms, the search form, the links editor and the profile editor.

**Approach**

- Pages are grouped under two layouts: one for public and auth pages and one for the logged-in dashboard.
- The logged-in user is kept in one shared data cache. Toggling or reordering links updates that cache right away, so the preview changes at once, and **Save changes** sends it to the API.
- All API calls go through one HTTP client, so the auth header and error handling live in one place.
- Each bug I fixed has a test so it can't come back unnoticed: for example, lost URLs and duplicate link IDs in the links editor, and a login that bounced back to the login page after logging out.

## Technologies and tools

| Area | What it does in this project |
| --- | --- |
| **Language & UI** | React 19 with TypeScript for a typed, component-based single-page app |
| **Build & dev server** | Vite (with the SWC React plugin) for local development and production builds |
| **Routing** | React Router for nested layouts, the `/admin` dashboard, dynamic `/:username` pages and redirects to login or the 404 page |
| **Server state** | TanStack Query to fetch and cache the current user and public profiles, save changes, and update the cache for an instant preview |
| **API client** | Axios with the API address set through an environment variable and an interceptor that adds the auth token to every request |
| **Authentication** | Token-based: the token from login is stored in the browser and sent as a Bearer header; logging out removes it and refreshes the cached user |
| **Forms & validation** | React Hook Form for the sign-up, login, profile and search forms, with field-level rules |
| **Drag-and-drop ordering** | dnd-kit to reorder active links |
| **Styling** | Tailwind CSS with the forms plugin and a custom background for the landing page |
| **User feedback** | Sonner toast messages for success and error responses from the API |
| **Testing** | Vitest with React Testing Library and jsdom for component, routing and API tests |
| **Hosting** | Netlify, with a catch-all rewrite to `index.html` so links like `/<username>` work on direct visits and page refreshes |

## Results and impact

- **Live in production** at [devtree.greenie.dev](https://devtree.greenie.dev), running against my own backend, so the project covers the full stack from UI to API.
- **A complete user journey** in one app: find a free handle, sign up, edit the profile, pick and order links, and share the public page.
- **Fewer failed saves:** checks in the browser (email format, password strength, password match, valid URL before a link is turned on) catch common mistakes before a request is sent.
- **Instant feedback:** link changes and new orderings show in the preview before they are saved.
- **Tested behaviour:** 57 automated tests across 7 test files, all passing. They run locally with `npm test`; there is no CI pipeline yet.

No usage or performance metrics are tracked, so none are reported here.

## Screenshots and live demo

**Live demo:** https://devtree.greenie.dev

The repository has no screenshots yet. Add them under `docs/screenshots/` and link them here. Suggested captures:

1. Landing page with the username search
2. Links editor with the live preview
3. Profile editor (username, bio, image upload)
4. A public profile page (`/<username>`)

## Links

- **Live site:** https://devtree.greenie.dev
- **Frontend (this repo):** https://github.com/MarioAGtzC/devtree-frontend
- **Backend API / case study:** [devtree-backend](https://github.com/MarioAGtzC/devtree-backend)

---

**Author:** Mario Gutiérrez, Backend Software Engineer
