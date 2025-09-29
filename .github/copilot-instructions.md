# Copilot Instructions for AI Agents

## Project Overview
This is a Next.js 15 SaaS platform for generating SEO reports using Bright Data, OpenAI, Clerk, and Convex. The app features instant SEO analysis, entity research, AI chat, and a modern dashboard. Key integrations include:
- **Clerk**: Auth & billing (Starter/Pro plans, Stripe integration)
- **Convex**: Serverless backend, job management, real-time updates
- **Bright Data**: Web scraping via Perplexity Scraper
- **OpenAI**: GPT-4o for analysis and chat

## Architecture & Data Flow
- **Frontend**: Next.js App Router (`app/`), React 19, shadcn/ui, Tailwind v4
- **Backend**: Convex functions (`convex/`), Zod schemas, webhook endpoints
- **Workflow**:
  1. User submits entity/country → `startScraping` action
  2. Bright Data scrapes → webhook to Convex (`convex/http.ts`)
  3. OpenAI analyzes → structured report stored
  4. Dashboard updates in real-time
  5. Pro users access AI chat via OpenAI

## Developer Workflows
- **Install**: `pnpm install` (recommended)
- **Dev**: `pnpm dev` (runs Next.js & Convex)
- **Schema Sync**: `npx convex dev` (sync Convex schema/functions)
- **Env Vars**: Set all required keys in `.env.local` (see README)

## Key Conventions & Patterns
- **Convex**:
  - Use new function syntax (`query`, `mutation`, `action`, etc.)
  - Always validate args/returns with `v.*` validators
  - Define schema in `convex/schema.ts`
  - Use file-based routing for function references (e.g., `api.analysis.run`)
  - Webhook endpoints in `convex/http.ts` (use `httpAction`)
  - Background jobs via Convex schedulers
  - Smart retry logic in `actions/retryAnalysis.ts`
- **Auth**:
  - All `/dashboard*` routes protected by Clerk (`middleware.ts`)
  - JWT template named `convex` required in Clerk
- **Feature Gating**:
  - AI chat and advanced features gated to Pro plan (see Clerk Billing config)
- **Prompts**:
  - AI prompt engineering in `prompts/` (separate for scraping & analysis)
- **UI**:
  - Reusable components in `components/ui/`
  - Dashboard/report visualizations in `app/dashboard/report/[id]/summary/ui/`

## Integration Points
- **Bright Data**: API key in `.env.local`, webhook endpoint configured for domain
- **OpenAI**: API key in `.env.local`, GPT-4o model used for analysis/chat
- **Clerk**: Keys in `.env.local`, billing via Stripe
- **Convex**: Deployment URL in `.env.local`, schema/functions in `convex/`

## Troubleshooting
- Missing env vars: check `.env.local`
- Clerk JWT: ensure template exists
- Webhooks: verify endpoint accessibility
- Convex schema: run `npx convex dev` after changes
- Bright Data credits: ensure sufficient balance

## Example Patterns
- **Convex function**:
  ```ts
  export const runAnalysis = mutation({
    args: { ... },
    returns: v.object({ ... }),
    handler: async (ctx, args) => { ... },
  });
  ```
- **Webhook endpoint**:
  ```ts
  http.route({
    path: "/api/webhook",
    method: "POST",
    handler: httpAction(async (ctx, req) => { ... }),
  });
  ```
- **Feature gating**:
  ```ts
  if (user.plan !== "pro") { /* restrict access */ }
  ```

## Key Files/Directories
- `app/` — Next.js pages, dashboard, report UI
- `components/` — UI, chat, providers
- `convex/` — backend functions, schema, webhooks
- `actions/` — server actions (scraping, retry)
- `prompts/` — AI prompt templates
- `lib/` — schemas, utilities
- `middleware.ts` — route protection

---
For more details, see the README and `convex_rules.mdc` for backend best practices.
