# Nova AI Video

Nova AI Video is a commercial-grade AI video generation SaaS starter built with Next.js 15 App Router, TypeScript, TailwindCSS, shadcn-style UI primitives, Framer Motion, Prisma/PostgreSQL, Supabase Auth, Redis/BullMQ, Stripe subscriptions, Cloudflare R2, and a Seedance2.0 API integration.

## Features

- Premium dark cyberpunk SaaS landing page with aurora, grid, particles, mouse glow, neon glassmorphism, 3D hover cards, pricing, testimonials, FAQ, and SEO metadata.
- Supabase email/password and Google OAuth authentication.
- Dashboard with credits, plan, usage, API call stats, video history, empty/loading states.
- AI video generation studio with text-to-video, image-to-video, prompt enhancement, aspect ratio, duration, style selection, live polling, progress bar, preview, and download.
- Async generation with Redis + BullMQ worker, retries, exponential backoff, timeout handling, Seedance webhooks, and Cloudflare R2 persistence.
- Stripe Checkout subscriptions and webhook-driven plan/credit updates.
- Admin backend for users, videos, and paid-account overview.
- Security headers, protected routes, responsive design, skeletons, toasts, and deployment guides.

## Local setup

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev
npm run dev
```

Run the worker in a second terminal:

```bash
npm run worker
```

## Required services

### PostgreSQL / Supabase

1. Create a Supabase project.
2. Copy the project URL and anon key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
4. Copy the direct database connection string into `DATABASE_URL`.
5. In Supabase Auth, enable email auth and Google OAuth.
6. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
7. Run `npx prisma migrate deploy` in production.

### Redis

Use Upstash, Railway, Redis Cloud, or a managed Redis instance. Set `REDIS_URL` to the TLS or non-TLS connection URL. The app uses Redis for BullMQ render jobs and retry orchestration.

### Stripe subscriptions

1. Create two recurring products in Stripe: Pro and Unlimited.
2. Copy price IDs to `STRIPE_PRO_PRICE_ID` and `STRIPE_UNLIMITED_PRICE_ID`.
3. Copy the secret key to `STRIPE_SECRET_KEY`.
4. Add webhook endpoint: `https://your-domain.com/api/stripe/webhook`.
5. Subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
6. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

### Cloudflare R2

1. Create an R2 bucket, e.g. `nova-ai-video`.
2. Create R2 API tokens with object read/write access.
3. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET`.
4. Configure a public bucket domain or CDN custom domain and set `R2_PUBLIC_URL`.
5. Add cache rules for generated videos: long TTL, immutable assets.

### Seedance2.0

1. Get a Seedance2.0 API key from your provider dashboard.
2. Set `SEEDANCE_API_KEY` and `SEEDANCE_BASE_URL`.
3. Confirm endpoint paths match your provider account. The wrapper lives in `lib/seedance.ts` and exposes:
   - `generateVideo()`
   - `imageToVideo()`
   - `getTaskStatus()`
   - `downloadVideo()`

## Vercel deployment

1. Push this repository to GitHub.
2. Import it in Vercel.
3. Add every variable from `.env.example` in Vercel Project Settings → Environment Variables.
4. Set build command to `npm run build`.
5. Deploy.
6. Run Prisma production migration from a secure CI step or local machine:

```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

7. Deploy the worker separately on Railway/Fly.io/Render using:

```bash
npm install && npx prisma generate && npm run worker
```

Vercel serverless functions should enqueue jobs; long-running BullMQ workers should run outside Vercel.

## Domain, CDN, SEO, and security checklist

- Point your apex/root domain to Vercel and add `www` redirect.
- Use a Cloudflare proxied custom domain for R2 video delivery.
- Configure canonical `NEXT_PUBLIC_APP_URL`.
- Keep generated videos on R2/CDN, not Vercel function responses.
- Enable Supabase RLS if you expose Supabase tables directly; this app accesses data via server-side Prisma.
- Rotate Stripe, Supabase, R2, and Seedance keys regularly.
- Add API gateway/WAF rate limiting for `/api/*` and bot protection for auth routes.
- Monitor queue failures, Stripe webhook failures, and Prisma connection pool usage.

## Production commands

```bash
npm run build
npm run start
npm run worker
```
