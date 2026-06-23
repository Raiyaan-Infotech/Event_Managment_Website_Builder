# Event Management Website Builder

A Next.js frontend for an event vendor dashboard and website builder. The app gives vendors a compact workspace for bookings, leads, website configuration, publishing, and basic analytics.

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React icons
- Iconify social icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open `http://localhost:3005`.

## Scripts

- `npm run dev` starts the Next.js dev server on port `3005`.
- `npm run build` creates a production build.
- `npm run start` serves the production build on port `3005`.
- `npm run typecheck` runs TypeScript validation without emitting files.

## Project Structure

```text
src/
  app/
    (builder)/                 Main authenticated builder routes
    login/                     Vendor login screen
    globals.css                Global theme tokens and base styles
  components/
    builder/                   Dashboard shell, sidebar, builder design helpers
    ui/                        Shared buttons, cards, inputs, tables, toasts
  config/
    navigation.ts              Sidebar navigation model
  lib/
    utils.ts                   Shared utility helpers
```

## Key Routes

- `/` dashboard overview
- `/bookings`, `/leads`, `/customers`, `/payments`
- `/website/header`, `/website/menu`, `/website/hero-section`
- `/website/simple-slider`, `/website/advance-slider`
- `/website/gallery`, `/website/gallery/categories`, `/website/testimonials`, `/website/footer`
- `/website/seo`, `/website/pages`, `/website/preview-publish`
- `/settings`, `/analytics`, `/reviews`

## Reusable Status Pages

Shared status page layouts live in `src/components/status-pages/status-page.tsx`.

- `/404`
- `/no-internet`
- `/no-content`
- `/maintenance`

The real Next.js not-found route is also wired through `src/app/not-found.tsx`.

## Design System Notes

The interface is designed as a dense operational builder, not a landing page. Keep future UI updates quiet, scannable, and form-friendly.

- Use global CSS tokens in `src/app/globals.css` for colors, radius, shadows, spacing, and control sizing.
- Keep cards at small radii and reserve them for actual panels or repeated items.
- Use icon buttons or icon-plus-label buttons for builder actions such as save, preview, publish, upload, reorder, and copy.
- Prefer restrained neutral surfaces with primary blue for committed actions and teal for secondary data highlights.
- Avoid oversized hero typography inside dashboards, settings screens, sidebars, and form panels.

## Recent Design Update

- Refined global theme tokens for a cleaner admin workspace.
- Reworked the builder header to avoid wide-page overflow and keep actions usable across viewport sizes.
- Tightened sidebar navigation with clearer active states and consistent row sizing.
- Improved dashboard responsiveness for stat cards, setup progress, analytics, and recent activity.
- Updated the Hero Section builder to a compact single-view editor inspired by the supplied mockup, with smaller controls and a larger live preview.
- Added reusable 404, no internet, no content, and maintenance design pages for later routing.
- Replaced the placeholder README with project setup, route, and design guidance.
