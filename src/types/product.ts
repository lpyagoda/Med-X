export type ProductCharacteristic = {
  name: string;
  value: string;
};

export type ProductAvailability = "in-stock" | "on-order";

export type ProductImage = {
  url: string;
  isMain: boolean;
};

export type Product = {
  availability?: ProductAvailability;
  availabilityLabel?: string;
  brand: string;
  brandSlug?: string;
  brandLogo?: string | null;
  categoryName: string;
  categorySlug: string;
  characteristics: ProductCharacteristic[];
  description: string;
  id: string;
  image: string;
  images?: ProductImage[];
  manufacturer: string;
  price: number | null;
  priceLabel: string;
  shortDescription: string;
  slug: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  title: string;
};
