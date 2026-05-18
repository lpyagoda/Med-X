import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { matchesProductQuery } from "@/lib/catalogSearch";
import type { Category } from "@/types/category";
import type { ConsultationFormData, ProductOrderFormData } from "@/types/forms";
import type { Product } from "@/types/product";

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export async function searchProducts(query: string): Promise<Product[]> {
  return products.filter((product) => matchesProductQuery(product, query));
}

export async function searchProductsInCategory(
  categorySlug: string,
  query: string,
): Promise<Product[]> {
  const categoryProducts = await getProductsByCategory(categorySlug);

  return categoryProducts.filter((product) => matchesProductQuery(product, query));
}

export async function submitProductOrder(
  data: ProductOrderFormData,
): Promise<{ success: true }> {
  // Позже здесь будет подключение CRM/API и уведомлений в MAX/email.
  console.log("Product order submitted", data);

  return { success: true };
}

export async function submitConsultationForm(
  data: ConsultationFormData,
): Promise<{ success: true }> {
  // Позже здесь будет подключение CRM/API и уведомлений в MAX/email.
  console.log("Consultation form submitted", data);

  return { success: true };
}
