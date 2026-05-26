-- Add `icon_url` to categories. Used by the catalog filter sidebar
-- (`CatalogCategoryNav`). Distinct from `image_url`, which is the photo
-- shown on the home page CategoryGrid.
--
-- Nullable: existing categories continue to render via hard-coded SVG
-- icons (see src/lib/categoryIcons.tsx) until an admin uploads a PNG.

alter table public.categories
  add column if not exists icon_url text;
