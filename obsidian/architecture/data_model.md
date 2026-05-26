---
name: data-model
description: Current TS types for Product / Category + planned Supabase tables
metadata:
  type: architecture
---

## Current TS shapes (src/types/)

### Product (`src/types/product.ts`)
```ts
type Product = {
  id: string;                          // slug-like string id
  slug: string;                        // URL slug
  title: string;
  brand: string;
  manufacturer: string;
  image: string;                       // public/images/products/* path
  price: number | null;
  priceLabel: string;                  // e.g. "от 250 000 ₽" or "По запросу"
  shortDescription: string;
  description: string;
  characteristics: { name: string; value: string }[];
  categoryName: string;
  categorySlug: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  availability?: "in-stock" | "on-order";
  availabilityLabel?: string;
};
```

### Category (`src/types/category.ts`)
```ts
type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  subcategories?: Subcategory[];
};

type Subcategory = {
  id: string;
  slug: string;
  title: string;
  label?: string;
  description?: string;
};
```

## Planned Supabase schema (Phase 2)

To be confirmed once we inspect arcadia-meb.ru's `database_schema.sql` (Explore agent running). First-pass mapping:

### `categories`
- `id` uuid pk
- `slug` text unique
- `title` text
- `description` text
- `image_url` text nullable — фото для CategoryGrid (главная)
- `icon_url` text nullable — PNG-иконка для CatalogCategoryNav (фильтр каталога). Добавлено миграцией 20260526120000_category_icon.sql
- `tags` text[] nullable
- `position` int — for ordering
- `created_at`, `updated_at` timestamptz

### `subcategories`
- `id` uuid pk
- `category_id` uuid fk → categories.id (on delete cascade)
- `slug` text
- `title` text
- `label` text nullable
- `description` text nullable
- `position` int
- unique (`category_id`, `slug`)

### `products`
- `id` uuid pk
- `slug` text unique
- `title` text
- `brand` text
- `manufacturer` text
- `image_url` text — Supabase storage public URL
- `price` numeric nullable
- `price_label` text
- `short_description` text
- `description` text
- `category_id` uuid fk → categories.id
- `subcategory_id` uuid fk → subcategories.id nullable
- `availability` text — enum-like ('in-stock'|'on-order')
- `availability_label` text nullable
- `is_active` boolean default true
- `created_at`, `updated_at` timestamptz

### `product_characteristics`
- `id` uuid pk
- `product_id` uuid fk → products.id (on delete cascade)
- `position` int
- `name` text
- `value` text

### Storage buckets
- `product-images` — public, for product photos

### RLS (planned)
- Public **read** allowed on `products`, `categories`, `subcategories`, `product_characteristics`
- Admin **write** allowed only via service-role key from server-side admin actions (we don't use Supabase Auth — see [[adr-003-admin-auth-env]])

## Sales surface (live, Phase 3)

### `leads`
- `id` uuid pk
- `name`, `phone` text not null
- `email`, `comment` text nullable
- `source` text — `consultation` | `lead_modal` | `contacts_page` | `product_order`
- `page_url` text nullable
- `status` text — `new` | `in_progress` | `done` | `cancelled` (default `new`)
- `created_at`, `updated_at` timestamptz
- RLS: anon INSERT, authenticated ALL

### `orders`
- `id` uuid pk
- `number` integer unique — auto from sequence `orders_number_seq` (start 1000)
- `customer_name`, `customer_phone` text not null
- `customer_email`, `delivery_address`, `comment` text nullable
- `total` numeric(12,2) nullable
- `items_count` integer not null default 0
- `type` text — `cart` | `quick` (default `cart`)
- `status` text — `new` | `in_progress` | `paid` | `shipped` | `done` | `cancelled`
- `created_at`, `updated_at` timestamptz
- RLS: anon INSERT, authenticated ALL

### `order_items`
- `id` uuid pk
- `order_id` uuid → `orders.id` on delete cascade
- `product_id` uuid → `products.id` on delete set null (nullable — для статических товаров)
- `product_slug`, `product_title`, `product_image` text — snapshots at sale time
- `unit_price` numeric(12,2), `price_label` text — snapshots
- `quantity` integer not null check (> 0)
- RLS: anon INSERT, authenticated ALL

## Related
- [[stack-overview]]
- [[admin-phase2-plan]]
- [[adr-002-self-hosted-supabase]]
