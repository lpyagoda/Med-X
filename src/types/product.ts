export type ProductCharacteristic = {
  name: string;
  value: string;
};

export type ProductAvailability = "in-stock" | "on-order";

export type Product = {
  availability?: ProductAvailability;
  availabilityLabel?: string;
  brand: string;
  categoryName: string;
  categorySlug: string;
  characteristics: ProductCharacteristic[];
  description: string;
  id: string;
  image: string;
  manufacturer: string;
  price: number | null;
  priceLabel: string;
  shortDescription: string;
  slug: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  title: string;
};
