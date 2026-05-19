-- Med-X — orders, order_items, leads
-- Phase 3 / sales surface.
--
-- - leads: free-form inquiries from consultation/contacts forms
-- - orders: cart checkout + 1-click; order_items snapshots product info at sale time
--   (so renaming/removing a product keeps the history readable).
--
-- RLS:
-- - INSERT allowed for anon (anyone on the public site can submit)
-- - SELECT/UPDATE/DELETE allowed only for authenticated (admin)

------------------------------------------------------------
-- leads
------------------------------------------------------------
create table public.leads (
    id          uuid        primary key default gen_random_uuid(),
    name        text        not null,
    phone       text        not null,
    email       text,
    comment     text,
    source      text        not null default 'consultation',  -- 'consultation' | 'lead_modal' | 'contacts_page' | 'product_order'
    page_url    text,                                          -- where the form was submitted from
    status      text        not null default 'new',            -- 'new' | 'in_progress' | 'done' | 'cancelled'
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create index leads_status_idx     on public.leads (status);
create index leads_created_at_idx on public.leads (created_at desc);

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.tg_set_updated_at();

------------------------------------------------------------
-- orders
------------------------------------------------------------
create sequence if not exists public.orders_number_seq start 1000;

create table public.orders (
    id                uuid        primary key default gen_random_uuid(),
    number            integer     not null default nextval('public.orders_number_seq') unique,
    customer_name     text        not null,
    customer_phone    text        not null,
    customer_email    text,
    delivery_address  text,
    comment           text,
    total             numeric(12,2),
    items_count       integer     not null default 0,
    type              text        not null default 'cart',     -- 'cart' | 'quick'
    status            text        not null default 'new',       -- 'new' | 'in_progress' | 'paid' | 'shipped' | 'done' | 'cancelled'
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now()
);

create index orders_status_idx     on public.orders (status);
create index orders_created_at_idx on public.orders (created_at desc);

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.tg_set_updated_at();

------------------------------------------------------------
-- order_items
-- Snapshot product fields so deletes/renames don't break order history.
------------------------------------------------------------
create table public.order_items (
    id              uuid        primary key default gen_random_uuid(),
    order_id        uuid        not null references public.orders(id) on delete cascade,
    product_id      uuid               references public.products(id) on delete set null,
    product_slug    text,
    product_title   text        not null,
    product_image   text,
    unit_price      numeric(12,2),
    price_label     text,
    quantity        integer     not null default 1 check (quantity > 0),
    created_at      timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items (order_id);

------------------------------------------------------------
-- RLS
------------------------------------------------------------
alter table public.leads        enable row level security;
alter table public.orders       enable row level security;
alter table public.order_items  enable row level security;

-- Anyone can submit
create policy leads_insert_public
    on public.leads for insert
    to anon, authenticated
    with check (true);

create policy orders_insert_public
    on public.orders for insert
    to anon, authenticated
    with check (true);

create policy order_items_insert_public
    on public.order_items for insert
    to anon, authenticated
    with check (true);

-- Admin (any authenticated user) can read/manage everything
create policy leads_all_authenticated
    on public.leads for all
    to authenticated
    using (true) with check (true);

create policy orders_all_authenticated
    on public.orders for all
    to authenticated
    using (true) with check (true);

create policy order_items_all_authenticated
    on public.order_items for all
    to authenticated
    using (true) with check (true);
