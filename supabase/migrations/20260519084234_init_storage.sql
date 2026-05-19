-- Med-X — storage bucket for product images
-- Phase 2 / Etap E

------------------------------------------------------------
-- bucket: product-images (public)
------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'product-images',
    'product-images',
    true,
    10 * 1024 * 1024, -- 10 MB
    array['image/jpeg','image/png','image/webp','image/avif','image/gif']
)
on conflict (id) do nothing;

------------------------------------------------------------
-- Storage RLS: anyone can read; authenticated users can write
------------------------------------------------------------
create policy product_images_select_public
    on storage.objects for select
    using (bucket_id = 'product-images');

create policy product_images_insert_authenticated
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'product-images');

create policy product_images_update_authenticated
    on storage.objects for update
    to authenticated
    using (bucket_id = 'product-images')
    with check (bucket_id = 'product-images');

create policy product_images_delete_authenticated
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'product-images');
