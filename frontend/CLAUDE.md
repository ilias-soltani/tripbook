# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config, next core-web-vitals + typescript)
npx tsc --noEmit # type check (no script defined)
```

No test runner is configured.

## Architecture

- `frontend/` is the web client of the `tripbook` monorepo (trip proposals). The sibling `../backend` is a Django REST Framework API exposing `/api/trips/` (router in `backend/core/urls.py`; `Trip` has `destination`, `start_date`, `end_date`, `price`, `notes`). The backend's `CORS_ALLOWED_ORIGINS` only allows `http://localhost:3000`, so run this app on that port when calling the API from the browser.
- Next.js 16 App Router, React 19, Tailwind CSS v4 (via `@tailwindcss/postcss`, styles in `app/globals.css`), TypeScript strict mode. Path alias `@/*` maps to the project root.
- Currently still the `create-next-app` scaffold (`app/layout.tsx`, `app/page.tsx`); no API client or feature code exists yet.
- Next.js docs for this version are bundled at `node_modules/next/dist/docs/` — consult them before writing code (see AGENTS.md).
