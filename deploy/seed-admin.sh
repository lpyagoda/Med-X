#!/usr/bin/env bash
# Med-X — idempotent admin user seed
#
# Reads ADMIN_EMAIL + ADMIN_PASSWORD from /var/www/med-x/.env (server-only file),
# creates or updates the single admin user in auth.users with a bcrypt-hashed password.
#
# Usage (on server):
#   bash /var/www/med-x/deploy/seed-admin.sh
#
# Safe to re-run — on conflict, password gets updated.

set -euo pipefail

ENV_FILE="${ENV_FILE:-/var/www/med-x/.env}"
DB_CONTAINER="${DB_CONTAINER:-supabase_db_med-x}"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "❌  $ENV_FILE not found"
    echo "    Create it with: ADMIN_EMAIL=... ADMIN_PASSWORD=..."
    exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${ADMIN_EMAIL:?ADMIN_EMAIL not set in $ENV_FILE}"
: "${ADMIN_PASSWORD:?ADMIN_PASSWORD not set in $ENV_FILE}"

# Pass parameters via SET LOCAL (avoids shell-quoting traps in SQL).
docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 <<SQL
do \$\$
declare
    admin_email text := '$ADMIN_EMAIL';
    admin_password text := '$ADMIN_PASSWORD';
    admin_uid uuid := '00000000-0000-0000-0000-000000000001';
begin
    insert into auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        aud, role, created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data, is_super_admin
    ) values (
        admin_uid, '00000000-0000-0000-0000-000000000000',
        admin_email, crypt(admin_password, gen_salt('bf')), now(),
        'authenticated', 'authenticated', now(), now(),
        '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false
    )
    on conflict (id) do update
       set email              = excluded.email,
           encrypted_password = excluded.encrypted_password,
           updated_at         = now();

    insert into auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at)
    values (
        gen_random_uuid(), admin_uid,
        jsonb_build_object('sub', admin_uid::text, 'email', admin_email, 'email_verified', true),
        'email', admin_uid::text,
        now(), now(), now()
    )
    on conflict (provider, provider_id) do update
       set identity_data = excluded.identity_data,
           updated_at    = now();
end \$\$;

select 'admin seeded: ' || email as result from auth.users where id = '00000000-0000-0000-0000-000000000001';
SQL
