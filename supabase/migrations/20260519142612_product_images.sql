-- Med-X — product_images table for gallery (up to 10 images per product, one marked main)
-- The `products.image_url` column remains as a denormalised cache of the main image
-- so public reads stay simple. Admin code keeps both in sync on every save.

create table public.product_images (
    id          uuid        primary key default gen_random_uuid(),
    product_id  uuid        not null references public.products(id) on delete cascade,
    url         text        not null,
    is_main     boolean     not null default false,
    position    integer     not null default 0,
    created_at  timestamptz not null default now()
);

create index product_images_product_id_idx on public.product_images (product_id, position);

-- Only one main image per product
create unique index product_images_one_main_per_product
    on public.product_images (product_id)
    where is_main;

alter table public.product_images enable row level security;

create policy product_images_select_public
    on public.product_images for select
    using (
        exists (
            select 1 from public.products
            where products.id = product_images.product_id
              and products.is_active
        )
    );

create policy product_images_all_authenticated
    on public.product_images for all
    to authenticated
    using (true) with check (true);
