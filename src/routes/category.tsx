import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { CategoryPage } from "@/pages/CategoryPage";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api";
import { fetchPublicCategories } from "@/lib/public/catalogue";
import { fetchPublicProducts } from "@/lib/public/products";
import { buildMeta, jsonLd, breadcrumbJsonLd } from "@/lib/seo";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

type LoaderData = {
  categories: Category[];
  products: Product[];
  category: Pick<Category, "slug" | "title" | "description">;
};

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const slug = params.category ?? "";
  const [categories, products] = await Promise.all([
    fetchPublicCategories().catch(() => getCategories()),
    fetchPublicProducts().catch(() => getProducts()),
  ]);

  const category =
    categories.find((c) => c.slug === slug) ?? getCategoryBySlug(slug);
  if (!category) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  return {
    categories,
    products,
    category: {
      slug: category.slug,
      title: category.title,
      description: category.description,
    },
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return buildMeta({ pathname: "/catalog", noindex: true });
  const { category } = data;
  const path = `/catalog/${category.slug}`;
  return buildMeta({
    pathname: path,
    title: `${category.title} — купить, цена`,
    description: `Купить ${category.title} в каталоге МЕД-ИКС: актуальные цены, наличие и доставка по России. Официальные бренды, помощь инженера в подборе оборудования.`,
    extra: [
      jsonLd(
        breadcrumbJsonLd([
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          { name: category.title, url: path },
        ]),
      ),
    ],
  });
};

export default function CategoryRoute() {
  const { categories, products } = useLoaderData<typeof loader>();
  return <CategoryPage initialCategories={categories} initialProducts={products} />;
}
