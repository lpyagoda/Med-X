-- Med-X — products + characteristics schema
-- Phase 2 / Etap E

create extension if not exists pg_trgm;

------------------------------------------------------------
-- products
------------------------------------------------------------
create table public.products (
    id                  uuid        primary key default gen_random_uuid(),
    slug                text        not null unique,
    title               text        not null,
    brand               text        not null default '',
    manufacturer        text        not null default '',
    image_url           text,
    price               numeric(12,2),
    price_label         text        not null default '',
    short_description   text        not null default '',
    description         text        not null default '',
    category_id         uuid        not null references public.categories(id) on delete restrict,
    subcategory_id      uuid               references public.subcategories(id) on delete set null,
    availability        text        not null default 'on-order'
                                    check (availability in ('in-stock','on-order')),
    availability_label  text,
    position            integer     not null default 0,
    is_active           boolean     not null default true,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

create index products_category_id_idx     on public.products (category_id);
create index products_subcategory_id_idx  on public.products (subcategory_id);
create index products_is_active_idx       on public.products (is_active);
create index products_position_idx        on public.products (position);
create index products_title_trgm_idx      on public.products using gin (title gin_trgm_ops);

create trigger products_set_updated_at
before update on public.products
for each row execute function public.tg_set_updated_at();

------------------------------------------------------------
-- product_characteristics
------------------------------------------------------------
create table public.product_characteristics (
    id          uuid        primary key default gen_random_uuid(),
    product_id  uuid        not null references public.products(id) on delete cascade,
    position    integer     not null default 0,
    name        text        not null,
    value       text        not null default '',
    created_at  timestamptz not null default now()
);

create index product_characteristics_product_id_idx
    on public.product_characteristics (product_id, position);

------------------------------------------------------------
-- RLS
------------------------------------------------------------
alter table public.products                enable row level security;
alter table public.product_characteristics enable row level security;

create policy products_select_public
    on public.products for select
    using (is_active);

create policy products_all_authenticated
    on public.products for all
    to authenticated
    using (true) with check (true);

create policy product_characteristics_select_public
    on public.product_characteristics for select
    using (
        exists (
            select 1 from public.products
            where products.id = product_characteristics.product_id
              and products.is_active
        )
    );

create policy product_characteristics_all_authenticated
    on public.product_characteristics for all
    to authenticated
    using (true) with check (true);
