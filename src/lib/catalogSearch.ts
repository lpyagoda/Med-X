import type { Product } from "@/types/product";

export function normalizeCatalogQuery(value: string) {
  return value.trim().toLowerCase();
}

export function getProductSearchFields(product: Product) {
  return [
    product.title,
    product.brand,
    product.manufacturer,
    product.categoryName,
    product.subcategoryName ?? "",
    product.shortDescription,
    product.description,
    ...product.characteristics.flatMap((item) => [item.name, item.value]),
  ];
}

export function matchesProductQuery(product: Product, query: string) {
  const searchValue = normalizeCatalogQuery(query);

  if (!searchValue) {
    return true;
  }

  return getProductSearchFields(product).some((field) =>
    normalizeCatalogQuery(field).includes(searchValue),
  );
}
