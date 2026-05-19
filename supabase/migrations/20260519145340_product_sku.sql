-- Med-X — auto-generated product SKU
-- Pattern: MX-#####  (e.g. MX-00042). Cap at 99 999 — far above the ~2 000 ceiling.
-- Source: zero-padded sequence, applied as a DEFAULT so INSERTs without `sku`
-- get one automatically. Existing rows are backfilled in the same migration.

create sequence if not exists public.products_sku_seq start 1;

alter table public.products
  add column if not exists sku text;

-- Backfill any rows that don't have a SKU yet
update public.products
set sku = 'MX-' || lpad(nextval('public.products_sku_seq')::text, 5, '0')
where sku is null;

-- Apply default for future inserts
alter table public.products
  alter column sku set default ('MX-' || lpad(nextval('public.products_sku_seq')::text, 5, '0'));

-- Now safe to enforce NOT NULL
alter table public.products
  alter column sku set not null;

-- Uniqueness
create unique index if not exists products_sku_uniq on public.products(sku);
