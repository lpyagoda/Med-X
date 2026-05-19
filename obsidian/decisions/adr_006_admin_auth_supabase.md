---
name: adr-006-admin-auth-supabase
description: Supabase Auth with one pre-seeded admin user — secure for SPA without a backend
metadata:
  type: decision
---

**Status:** accepted — 2026-05-19. **Supersedes:** [[adr-003-admin-auth-env]].
**Decision:** Use **Supabase Auth** with **one seeded user** for the admin. Email + password are configured in the server's `.env` and used (a) once at deploy time to create the user, (b) by the admin to log in via the browser. Public registration is disabled. The `signup` route in GoTrue is locked down via Supabase config (`auth.enable_signup = false`).

## Threat model
- Anyone visiting the public IP can download the JS bundle and read every line of code.
- We have no backend to store a server-side secret. Anything baked into the bundle is public.
- The site is currently served over **HTTP** (no domain, no TLS). On a hostile network the password is observable in transit.

## Why this design beats the alternatives

| Approach | What leaks | Verdict |
|---|---|---|
| nginx HTTP Basic Auth + Supabase service-role key in bundle | Service-role key gives **full DB write** without auth. Anyone reading the bundle = full DB access. | ❌ Critical leak |
| Custom login form + `service_role` key in bundle | Same problem | ❌ Same leak |
| Custom login form + Express backend + `service_role` key on server | Nothing leaks, but adds a second pm2 process to maintain | ⚠️ Works, more moving parts |
| **Supabase Auth + seeded user + ANON key in bundle** | ANON publishable key by design is browser-safe (`sb_publishable_*`). It cannot bypass RLS. Authenticating consumes the bcrypt-hashed password in `auth.users`. | ✅ **Chosen** |

## Implementation

### 1. Lock down signup
In `supabase/config.toml`:
```toml
[auth]
enable_signup = false
[auth.email]
enable_signup = false
enable_confirmations = false
```
This means **no random user can register** — only admin-seeded accounts exist.

### 2. Seed the admin (idempotent)
A migration `supabase/migrations/<ts>_seed_admin.sql` creates the user using GoTrue's `auth.users` table directly. Password comes from a postgres setting that supabase reads from env at apply time. Concretely we use Supabase's `auth.email_signup` flow at the seed step, or — simpler — we insert into `auth.users` with bcrypted password via `crypt(password, gen_salt('bf'))` from pgcrypto:

```sql
do $$
declare
    admin_email text := nullif(current_setting('app.admin_email', true), '');
    admin_password text := nullif(current_setting('app.admin_password', true), '');
    admin_uid uuid := '00000000-0000-0000-0000-000000000001';
begin
    if admin_email is null or admin_password is null then
        raise notice 'app.admin_email / app.admin_password not set, skipping admin seed';
        return;
    end if;
    insert into auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        aud, role, created_at, updated_at
    ) values (
        admin_uid, '00000000-0000-0000-0000-000000000000',
        admin_email, crypt(admin_password, gen_salt('bf')), now(),
        'authenticated', 'authenticated', now(), now()
    )
    on conflict (email) do update
       set encrypted_password = excluded.encrypted_password,
           updated_at         = now();
end$$;
```

At deploy time we run `psql ... -v admin_email=... -v admin_password=... -f seed.sql` (or set via `SET LOCAL`).

### 3. Login flow in the SPA
```ts
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```
On success, supabase-js stores the session (refresh token) in `localStorage`. RLS policies allow `authenticated` users to perform all CRUD. The publishable key alone cannot bypass RLS.

### 4. Sign-out
Standard `supabase.auth.signOut()` from a button in the header.

## Remaining risk — and the fix
HTTP-only transport means the password is observable on the wire when the admin logs in from a hostile network. **Mitigation:** get a domain, add Let's Encrypt cert (`certbot --nginx`). Until then, log in only from trusted networks (home / office). This is documented as a known limitation, not a permanent design choice.

## What to do operationally
- On the server, create `/var/www/med-x/.env` with `ADMIN_EMAIL=` and `ADMIN_PASSWORD=` (chmod 600, owner root)
- Add a small helper script `deploy/seed-admin.sh` that reads those env vars and runs the seed migration
- Document the rotation steps: change env vars → re-run script → done

## Related
- [[adr-002-self-hosted-supabase]]
- [[data-model]]
- [[admin-phase2-plan]]
- [[adr-003-admin-auth-env]] (superseded)
