-- Med-X — categories + subcategories schema
-- Phase 2 / Etap E

create extension if not exists "pgcrypto";

------------------------------------------------------------
-- categories
------------------------------------------------------------
create table public.categories (
    id           uuid        primary key default gen_random_uuid(),
    slug         text        not null unique,
    title        text        not null,
    description  text        not null default '',
    image_url    text,
    tags         text[]      not null default '{}',
    position     integer     not null default 0,
    is_active    boolean     not null default true,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index categories_position_idx on public.categories (position);
create index categories_is_active_idx on public.categories (is_active);

------------------------------------------------------------
-- subcategories
------------------------------------------------------------
create table public.subcategories (
    id           uuid        primary key default gen_random_uuid(),
    category_id  uuid        not null references public.categories(id) on delete cascade,
    slug         text        not null,
    title        text        not null,
    label        text,
    description  text,
    position     integer     not null default 0,
    is_active    boolean     not null default true,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    unique (category_id, slug)
);

create index subcategories_category_id_idx on public.subcategories (category_id);
create index subcategories_position_idx on public.subcategories (position);

------------------------------------------------------------
-- updated_at trigger
------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.tg_set_updated_at();

create trigger subcategories_set_updated_at
before update on public.subcategories
for each row execute function public.tg_set_updated_at();

------------------------------------------------------------
-- RLS
------------------------------------------------------------
alter table public.categories     enable row level security;
alter table public.subcategories  enable row level security;

-- Public read for active rows; full access only via service_role
create policy categories_select_public
    on public.categories for select
    using (is_active);

create policy subcategories_select_public
    on public.subcategories for select
    using (is_active);

-- Authenticated users can do everything (admin is the only authed user)
create policy categories_all_authenticated
    on public.categories for all
    to authenticated
    using (true) with check (true);

create policy subcategories_all_authenticated
    on public.subcategories for all
    to authenticated
    using (true) with check (true);
