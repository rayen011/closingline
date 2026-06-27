# ClosingLine

> Every real estate email, ready in seconds.

AI-generated, real-estate-specific emails from editable templates — built for
solo agents who write the same ten emails every day.

## Stack

- **Frontend:** React + Vite, TailwindCSS, React Router v6, Zustand, React Query, React Hook Form + Zod
- **Backend:** Supabase (Postgres + Auth + RLS), Claude via a Supabase Edge Function
- **AI:** Claude Sonnet 4.6 (server-side only — the API key never reaches the client)
- **Payments:** Stripe Checkout + Customer Portal
- **Hosting:** Vercel (frontend) + Supabase (backend)

## Product decisions

| Decision | Value |
|---|---|
| Price | $29/mo single Pro tier ($290/yr) |
| Trial | 10 free generations, no credit card, not time-boxed |
| Fair-use cap | ~1,000 generations / billing period (enforced in the Edge Function) |
| Templates | Private per user in MVP |

## Setup

1. **Install**
   ```bash
   npm install
   ```

2. **Supabase** — create a project, then run the SQL in order:
   - `supabase/migrations/0001_init.sql` (schema + RLS + triggers)
   - `supabase/migrations/0002_seed_templates.sql` (system templates)

   Enable **Google** as an auth provider (Authentication → Providers) and add
   `http://localhost:5173/app` to the redirect allow-list.

3. **Environment** — copy `.env.local` and fill in:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_STRIPE_PUBLISHABLE_KEY=...
   ```

4. **Edge Functions** — deploy all four:
   ```bash
   supabase functions deploy generate-email
   supabase functions deploy stripe-checkout
   supabase functions deploy stripe-portal
   supabase functions deploy stripe-webhook --no-verify-jwt   # Stripe sends no JWT
   ```

5. **Stripe** (for upgrades):
   - Create a recurring **Product/Price** ($29/mo) → copy the Price id (`price_…`).
   - Add a **webhook endpoint** → `https://<project-ref>.functions.supabase.co/stripe-webhook`, subscribe to `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` → copy the signing secret (`whsec_…`).
   - Set the function secrets:
     ```bash
     supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
     supabase secrets set STRIPE_SECRET_KEY=sk_test_...
     supabase secrets set STRIPE_PRICE_ID=price_...
     supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
     supabase secrets set APP_URL=http://localhost:5173
     ```

6. **Run**
   ```bash
   npm run dev
   ```

## Build order

- [x] **1 — Auth + onboarding shell** (Supabase Auth, Google OAuth, protected/onboarding-gated routes, app shell)
- [x] **0 — Schema** (5 tables, RLS, auto-profile trigger, seed templates) + generate-email Edge Function (boundary + trial/cap enforcement)
- [x] **2 — Template Library** (browse system templates, search)
- [x] **3 — Generator + History** (split form/preview wired to the Edge Function, copy/regenerate/save, searchable history)
- [x] **4 — My Templates** (save generated emails as reusable templates, use/delete)
- [x] **5 — Stripe billing + polish** (Settings tabs, Checkout, Customer Portal, webhook, route code-splitting)

## Structure

```
src/
├── components/ui/        # design-system primitives (Button, Input, Card, …)
├── components/shared/    # AppShell, Sidebar, Topbar, Logo, EmptyState, …
├── features/             # feature-first: auth, onboarding, dashboard, generator, templates, history, settings, marketing
├── hooks/                # useProfile, useSubscription
├── lib/                  # supabase client, utils, constants, db/ accessors
├── router/               # route tree + auth/onboarding gates
└── store/                # Zustand UI state (sidebar, theme)
supabase/
├── migrations/           # schema + seed SQL
└── functions/            # generate-email (Claude boundary)
```
