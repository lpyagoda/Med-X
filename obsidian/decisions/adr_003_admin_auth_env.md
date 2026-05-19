---
name: adr-003-admin-auth-env
description: Admin login via env credentials — implemented at nginx layer in prod, open in dev
metadata:
  type: decision
---

**Status:** accepted — 2026-05-19. Implementation deferred to Etap I.
**Decision:** Use **nginx HTTP Basic Auth** to gate `/admin/*` in production, with the username/password coming from `.env`-generated `.htpasswd`. In local dev, leave `/admin/*` open (no gate). Do not build a custom login form in v1.

## Context
User asked for "Жёстко зашитый логин/пароль в env" — one admin, creds in env. Three options were considered:

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Custom React login form + tiny Express server checking env | Looks polished; "logout" possible | Need to deploy & maintain a server process; can't safely check env from the browser alone | Overkill for one admin |
| **nginx HTTP Basic Auth** | Zero application code; one config block; browser native | Ugly native dialog; no "logout" (cache until origin cleared) | **Chosen** |
| Client-side hash check | Simplest to ship | Trivially bypassable; hash extractable from JS bundle | Rejected — false sense of security |

## Implementation sketch (Etap I)
- On deploy, run a small bash step that converts `$ADMIN_LOGIN` / `$ADMIN_PASSWORD` from `.env` into `/etc/nginx/.htpasswd-med-x` via `htpasswd -bc`
- In the nginx vhost:
  ```nginx
  location /admin/ {
      auth_basic "Med-X admin";
      auth_basic_user_file /etc/nginx/.htpasswd-med-x;
      try_files $uri /index.html;
  }
  ```
- For local dev: nothing — admin route works as a normal SPA route
- For SPA navigation: once the user has authed for any `/admin/*` URL, subsequent in-app navigation (client-side) does not re-prompt, since the browser caches basic-auth per origin+realm

## What this means for code
- **No** `AdminLoginPage`, no `RequireAdmin` guard, no auth context, no cookies in v1
- Admin pages assume they're served — if you're seeing them you're authenticated by nginx
- We do **not** track "current admin user" — there's only one
- Logout = clear browser cache for the origin (acceptable for a single-user admin)

## Reconsider if
- We ever need multiple admins with different roles → switch to Supabase Auth + RLS
- We want a custom-styled login UI as a brand requirement → add a tiny Express service that issues a signed cookie

## Related
- [[admin-phase2-plan]] (Etap C scoped down — no auth code; Etap I now owns auth via nginx)
- [[adr-002-self-hosted-supabase]]
