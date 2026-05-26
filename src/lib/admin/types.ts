// Database row shapes (subset of what's in the columns) — kept here so admin
// code can stay typed without importing supabase-js generated types.

export type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  icon_url: string | null;
  tags: string[];
  position: number;
  is_active: boolean;
};

export type SubcategoryRow = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  label: string | null;
  description: string | null;
  position: number;
  is_active: boolean;
};

export type ProductAvailability = "in-stock" | "on-order";

export type ProductRow = {
  id: string;
  slug: string;
  sku: string;
  title: string;
  brand: string;
  manufacturer: string;
  image_url: string | null;
  price: number | null;
  price_label: string;
  short_description: string;
  description: string;
  category_id: string;
  subcategory_id: string | null;
  availability: ProductAvailability;
  availability_label: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductCharacteristicRow = {
  id: string;
  product_id: string;
  position: number;
  name: string;
  value: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  is_main: boolean;
  position: number;
};

export type ProductImageInput = {
  url: string;
  is_main: boolean;
  position: number;
};

export type ProductWithJoins = ProductRow & {
  category: { id: string; slug: string; title: string } | null;
  subcategory: { id: string; slug: string; title: string } | null;
};

export type ProductInput = {
  slug: string;
  title: string;
  brand: string;
  manufacturer: string;
  image_url: string | null;
  price: number | null;
  price_label: string;
  short_description: string;
  description: string;
  category_id: string;
  subcategory_id: string | null;
  availability: ProductAvailability;
  availability_label: string | null;
  is_active: boolean;
  characteristics: { name: string; value: string }[];
  images: ProductImageInput[];
};
