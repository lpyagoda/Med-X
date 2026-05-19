---
name: adr-002-self-hosted-supabase
description: Self-hosted Supabase inside the repo (./supabase/) as the Med-X backend
metadata:
  type: decision
---

**Status:** accepted in principle — 2026-05-19. **Blocked on:** Docker availability locally + port choice on server.
**Decision:** Use **self-hosted Supabase** initialised by the Supabase CLI inside the repo at `./supabase/`. Use it for Postgres + Storage. **Do not** use its built-in Auth (GoTrue) — auth is handled separately (see [[adr-003-admin-auth-env]]).

## Context
Both donor projects use Supabase. Reusing the same primitives in Med-X minimises learning curve and lets us port arcadia-meb's products CRUD with light modifications. The user explicitly chose self-hosted over cloud: *"создаем свой supabase self hosted внутри папки проекта"*. Reasons inferred:
- Data sovereignty (medical-equipment B2B, customer lists)
- No vendor lock-in / no monthly cost
- Server already runs Postgres + Docker — adding another stack is cheap

## What this means in practice
- `./supabase/config.toml`, `./supabase/migrations/`, `./supabase/seed.sql` live in the repo
- Local dev: `supabase start` boots a docker-compose stack (needs Docker Desktop)
- Production on `188.225.86.146`: a docker-compose stack with **shifted ports** (host already has docker-proxy on `5432`, so our Postgres goes to `5433`; Kong/API gateway to a free 54xxx-range port that we'll pick)
- We talk to Supabase via `@supabase/supabase-js` from admin pages

## Constraints
- Need to install **Supabase CLI** locally and on server
- Need **Docker** locally (Docker Desktop on Windows)
- We use `service_role` key from a **server-side** helper for admin writes — never expose it to the browser

## What we DON'T use from Supabase
- **GoTrue (Auth)** — see [[adr-003-admin-auth-env]]
- Realtime — not needed for v1
- Edge Functions — not needed (Vite SPA + tiny Express for auth)

## Open questions (resolve before Etap D)
1. Is Docker Desktop installed on the user's Windows machine? → **must check**
2. Which ports are free on the server for the Supabase stack? → use a script before docker-compose up
3. Will we proxy Supabase API behind nginx (so admin can call `/api/db/*`) or expose it on a public port directly? → defer until deploy

## Related
- [[admin-phase2-plan]]
- [[data-model]]
- [[adr-003-admin-auth-env]]
