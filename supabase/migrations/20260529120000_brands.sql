-- Med-X — brands as a first-class entity (бренд + производитель + логотип)
--
-- Previously `products.brand` / `products.manufacturer` were free text. This
-- migration introduces a `brands` dictionary so the admin can manage the
-- (brand → manufacturer → logo) triple once and link products to it, instead
-- of retyping brand/manufacturer on every product.
--
-- `products.brand_id` is a nullable FK (on delete set null). The denormalised
-- `products.brand` / `products.manufacturer` text columns are KEPT and stay in
-- sync with the linked brand on every save — the public read layer and the
-- relevance search still rely on them, so this stays backward-compatible.

------------------------------------------------------------
-- brands
------------------------------------------------------------
create table if not exists public.brands (
    id            uuid        primary key default gen_random_uuid(),
    slug          text        not null unique,
    name          text        not null,
    manufacturer  text        not null default '',
    logo_url      text,
    description   text        not null default '',
    position      integer     not null default 0,
    is_active     boolean     not null default true,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index if not exists brands_position_idx  on public.brands (position);
create index if not exists brands_is_active_idx on public.brands (is_active);

create trigger brands_set_updated_at
before update on public.brands
for each row execute function public.tg_set_updated_at();

------------------------------------------------------------
-- products.brand_id
------------------------------------------------------------
alter table public.products
    add column if not exists brand_id uuid references public.brands(id) on delete set null;

create index if not exists products_brand_id_idx on public.products (brand_id);

------------------------------------------------------------
-- RLS — same shape as categories: public read of active rows,
-- full access for the (single) authenticated admin user.
------------------------------------------------------------
alter table public.brands enable row level security;

create policy brands_select_public
    on public.brands for select
    using (is_active);

create policy brands_all_authenticated
    on public.brands for all
    to authenticated
    using (true) with check (true);

------------------------------------------------------------
-- Seed brands from existing distinct product brand values and link them.
-- Slug mirrors src/lib/catalogBrands.ts getBrandSlug() closely enough
-- (lower + transliterate common diacritics + non-alnum → '-'); duplicate
-- slugs get a numeric suffix so the unique constraint never trips.
------------------------------------------------------------
with base as (
    select btrim(brand) as name,
           max(btrim(manufacturer)) as manufacturer
    from public.products
    where btrim(brand) <> ''
    group by btrim(brand)
),
slugged as (
    select name,
           coalesce(manufacturer, '') as manufacturer,
           nullif(
               regexp_replace(
                   regexp_replace(
                       lower(translate(name, 'üöäßÜÖÄ', 'uoassUOA')),
                       '[^a-z0-9]+', '-', 'g'
                   ),
                   '(^-+|-+$)', '', 'g'
               ),
               ''
           ) as base_slug
    from base
),
ranked as (
    select *,
           row_number() over (partition by base_slug order by name) as dup_rank,
           row_number() over (order by name) - 1 as pos
    from slugged
    where base_slug is not null
)
insert into public.brands (slug, name, manufacturer, position)
select case when dup_rank = 1 then base_slug else base_slug || '-' || dup_rank end,
       name,
       manufacturer,
       pos
from ranked
on conflict (slug) do nothing;

-- Link existing products to the freshly-seeded brands by exact (case-insensitive) name.
update public.products p
set brand_id = b.id
from public.brands b
where btrim(p.brand) <> ''
  and lower(btrim(p.brand)) = lower(b.name)
  and p.brand_id is null;
