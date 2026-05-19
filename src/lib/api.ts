import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { matchesProductQuery } from "@/lib/catalogSearch";
import { createLead } from "@/lib/public/leads";
import type { Category } from "@/types/category";
import type { ConsultationFormData, ProductOrderFormData } from "@/types/forms";
import type { Product } from "@/types/product";

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function searchProducts(query: string): Product[] {
  return products.filter((product) => matchesProductQuery(product, query));
}

export function searchProductsInCategory(
  categorySlug: string,
  query: string,
): Product[] {
  return getProductsByCategory(categorySlug).filter((product) =>
    matchesProductQuery(product, query),
  );
}

export async function submitProductOrder(
  data: ProductOrderFormData,
): Promise<{ success: true }> {
  await createLead({
    name: data.name,
    phone: data.phone,
    comment: `Заявка по товару: ${data.productTitle} (id ${data.productId})`,
    source: "product_order",
  });
  return { success: true };
}

export async function submitConsultationForm(
  data: ConsultationFormData,
): Promise<{ success: true }> {
  await createLead({
    name: data.name,
    phone: data.phone,
    comment: data.comment,
    source: "consultation",
  });
  return { success: true };
}
