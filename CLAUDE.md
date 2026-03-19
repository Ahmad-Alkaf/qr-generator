# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server (Next.js 16)
npm run build        # Production build
npm run lint         # ESLint (flat config)
npm run db:studio    # Open Prisma Studio
npx prisma generate  # Regenerate Prisma client (output: src/generated/prisma/)
npx prisma migrate dev --name <name>  # Create and apply a migration
```

## Architecture

**QRForge** — a freemium QR code generator SaaS built with Next.js 16, React 19, Tailwind CSS 4, Clerk auth, Prisma (PostgreSQL via `@prisma/adapter-pg`), and Stripe billing.

### Key flows

- **QR generation is client-side.** The `qr-code-styling` library renders QR codes in the browser (canvas/SVG). The server API (`/api/qr/generate`) only persists metadata and, for tracked QR codes, generates a short code. It does NOT generate images.
- **Direct vs Tracked QR codes.** Direct QR encodes content directly (no server round-trip needed for the data). Tracked QR encodes a redirect URL (`/r/[shortCode]`) that goes through the server, enabling scan analytics and editable destinations.
- **Redirect route** at `src/app/r/[shortCode]/route.ts` handles tracked QR scans: looks up destination, logs scan data (geo from Vercel headers, UA parsing), then 302-redirects.
- **Download formats:** PNG/SVG generated client-side via `qr-code-styling`, PDF wraps a PNG using `pdf-lib` — all in the browser.

### Auth & users

- Clerk handles authentication. Middleware in `src/proxy.ts` protects `/dashboard(.*)` routes.
- Users are synced to the DB via Clerk webhooks (`/api/webhooks/clerk`) using Svix verification.
- `src/lib/auth.ts` provides `getCurrentUser()` to look up the DB user from the Clerk session.

### Data layer

- Prisma schema at `prisma/schema.prisma`. Generated client output goes to `src/generated/prisma/` (do NOT edit generated files).
- Models: `User`, `QRCode` (with `QRType` enum), `Scan`, `ContactMessage`.
- DB connection uses the `PrismaPg` adapter with `DATABASE_URL` env var.

### Project structure

- `src/components/qr/` — QR generator form (`qr-generator.tsx`), live preview (`qr-preview.tsx`), type-specific input fields (`qr-type-fields.tsx`)
- `src/lib/qr.ts` — Zod validation schema (`qrGenerateSchema`) and `buildQRData()` which converts structured input into QR-encodable strings (WIFI:, VCARD, mailto:, smsto:, etc.)
- `src/lib/constants.ts` — `QR_TYPE_INFO`, `PLANS` with plan limits (defines feature gating)
- Path alias: `@/*` maps to `./src/*`

### Styling

- Tailwind CSS 4 with `@tailwindcss/postcss`. Custom CSS variables for colors (`--color-primary`, etc.) defined in `globals.css`.
- Fonts: Outfit (sans) + Fraunces (serif), loaded via `next/font/google`.
- Utility: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).

### Environment variables

Required: `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`
Stripe-related: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
Rate limiting: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
