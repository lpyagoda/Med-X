-- Seed default category image into existing rows.
-- The file lives at public/images/category.jpg → served by nginx alongside the SPA.
-- Admin upload overrides this value for any category.

update public.categories
set image_url = '/images/category.jpg'
where image_url is null;
