import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";

type ExportRow = {
  sku: string;
  title: string;
  brand: string;
  manufacturer: string;
  category_title: string;
  subcategory_title: string;
  price: number | string | null;
  short_description: string;
  description: string;
  availability: string;
  characteristics: string;
  is_active: string;
};

const COLUMNS: Array<{ key: keyof ExportRow; label: string; width: number }> = [
  { key: "sku", label: "Артикул", width: 14 },
  { key: "title", label: "Название", width: 40 },
  { key: "brand", label: "Бренд", width: 18 },
  { key: "manufacturer", label: "Производитель", width: 22 },
  { key: "category_title", label: "Категория", width: 24 },
  { key: "subcategory_title", label: "Подкатегория", width: 24 },
  { key: "price", label: "Цена, ₽", width: 12 },
  { key: "short_description", label: "Короткое описание", width: 40 },
  { key: "description", label: "Описание", width: 50 },
  { key: "availability", label: "Наличие", width: 14 },
  { key: "characteristics", label: "Характеристики", width: 50 },
  { key: "is_active", label: "Видимость", width: 10 },
];

const PRODUCTS_SELECT = `
  id, sku, title, brand, manufacturer, price, short_description, description,
  availability, is_active,
  category:categories!products_category_id_fkey ( title ),
  subcategory:subcategories!products_subcategory_id_fkey ( title )
`;

type ProductRecord = {
  id: string;
  sku: string;
  title: string;
  brand: string;
  manufacturer: string;
  price: number | string | null;
  short_description: string;
  description: string;
  availability: "in-stock" | "on-order" | null;
  is_active: boolean;
  category: { title: string } | null;
  subcategory: { title: string } | null;
};

type CharacteristicRecord = {
  product_id: string;
  position: number;
  name: string;
  value: string;
};

const AVAILABILITY_RU: Record<string, string> = {
  "in-stock": "В наличии",
  "on-order": "Под заказ",
};

export async function exportProductsToXlsx(): Promise<void> {
  const [productsResult, characteristicsResult] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCTS_SELECT)
      .order("position", { ascending: true }),
    supabase
      .from("product_characteristics")
      .select("product_id, position, name, value")
      .order("position", { ascending: true }),
  ]);

  if (productsResult.error) throw productsResult.error;
  if (characteristicsResult.error) throw characteristicsResult.error;

  const products = (productsResult.data ?? []) as unknown as ProductRecord[];
  const characteristics = (characteristicsResult.data ?? []) as CharacteristicRecord[];

  const characteristicsByProduct = new Map<string, CharacteristicRecord[]>();
  for (const row of characteristics) {
    const list = characteristicsByProduct.get(row.product_id) ?? [];
    list.push(row);
    characteristicsByProduct.set(row.product_id, list);
  }

  const rows: ExportRow[] = products.map((product) => {
    const productCharacteristics = (characteristicsByProduct.get(product.id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((row) => `${row.name}: ${row.value}`)
      .join(", ");
    return {
      sku: product.sku ?? "",
      title: product.title,
      brand: product.brand,
      manufacturer: product.manufacturer,
      category_title: product.category?.title ?? "",
      subcategory_title: product.subcategory?.title ?? "",
      price: product.price == null ? null : Number(product.price),
      short_description: product.short_description,
      description: product.description,
      availability:
        AVAILABILITY_RU[product.availability ?? "on-order"] ?? "Под заказ",
      characteristics: productCharacteristics,
      is_active: product.is_active ? "да" : "нет",
    };
  });

  const sheetData: (string | number | boolean | null)[][] = [
    COLUMNS.map((column) => column.label),
    ...rows.map((row) =>
      COLUMNS.map((column) => {
        const value = row[column.key];
        if (value === null || value === undefined) return "";
        return value as string | number | boolean;
      }),
    ),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = COLUMNS.map((column) => ({ wch: column.width }));
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Товары");

  const stamp = new Date()
    .toISOString()
    .replace(/[:T]/g, "-")
    .replace(/\..+/, "");
  XLSX.writeFile(workbook, `med-x-products-${stamp}.xlsx`, { bookType: "xlsx" });
}
