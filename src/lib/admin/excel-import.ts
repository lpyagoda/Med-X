import * as XLSX from "xlsx";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";
import {
  createCategory,
  createSubcategory,
  listCategories,
  listSubcategories,
} from "@/lib/admin/categories";
import { generateUniqueSlug } from "@/lib/admin/slug";
import type {
  CategoryRow,
  ProductAvailability,
  SubcategoryRow,
} from "@/lib/admin/types";

// Канонические ключи + русские заголовки в файле. Все ключи отображаются как
// колонки в выгрузке (см. products-export.ts) — на вход принимаем тот же набор.
export const IMPORT_COLUMNS = [
  { key: "sku", label: "Артикул", required: false },
  { key: "title", label: "Название", required: true },
  { key: "brand", label: "Бренд", required: false },
  { key: "manufacturer", label: "Производитель", required: false },
  { key: "category_title", label: "Категория", required: true },
  { key: "subcategory_title", label: "Подкатегория", required: false },
  { key: "price", label: "Цена, ₽", required: false },
  { key: "short_description", label: "Короткое описание", required: false },
  { key: "description", label: "Описание", required: false },
  { key: "availability", label: "Наличие", required: false },
  { key: "characteristics", label: "Характеристики", required: false },
  { key: "is_active", label: "Видимость", required: false },
] as const;

export type ImportColumnKey = (typeof IMPORT_COLUMNS)[number]["key"];

const HEADER_ALIASES: Record<string, ImportColumnKey> = {};
for (const column of IMPORT_COLUMNS) {
  HEADER_ALIASES[normalizeHeader(column.label)] = column.key;
  HEADER_ALIASES[normalizeHeader(column.key)] = column.key;
}
// Бэк-совместимость со старыми экспортами / шаблонами.
HEADER_ALIASES[normalizeHeader("Цена")] = "price";
HEADER_ALIASES[normalizeHeader("category")] = "category_title";
HEADER_ALIASES[normalizeHeader("subcategory")] = "subcategory_title";
HEADER_ALIASES[normalizeHeader("category_slug")] = "category_title";
HEADER_ALIASES[normalizeHeader("subcategory_slug")] = "subcategory_title";
HEADER_ALIASES[normalizeHeader("slug")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("price_label")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("Подпись цены")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("image_url")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("Главное фото")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("availability_label")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("Подпись наличия")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("Создан")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("created_at")] = "_ignore" as ImportColumnKey;
HEADER_ALIASES[normalizeHeader("Видим")] = "is_active";

const rowSchema = z
  .object({
    sku: z.string().trim().default(""),
    title: z.string().trim().min(2, "название обязательно"),
    brand: z.string().trim().default(""),
    manufacturer: z.string().trim().default(""),
    category_title: z.string().trim().min(1, "категория обязательна"),
    subcategory_title: z
      .string()
      .trim()
      .transform((value) => value || null)
      .nullable(),
    price: z
      .union([z.string(), z.number()])
      .transform((value) => {
        if (typeof value === "number") return Number.isFinite(value) ? value : null;
        const trimmed = value.trim();
        if (!trimmed) return null;
        const parsed = Number(
          trimmed.replace(/[\s ]/g, "").replace(",", "."),
        );
        return Number.isFinite(parsed) ? parsed : null;
      })
      .nullable(),
    short_description: z.string().trim().default(""),
    description: z.string().trim().default(""),
    availability: z
      .string()
      .trim()
      .default("")
      .transform((value) => {
        const v = value.toLowerCase();
        if (!v || v === "on-order" || v === "под заказ") {
          return "on-order" as ProductAvailability;
        }
        if (v === "in-stock" || v === "в наличии" || v === "true") {
          return "in-stock" as ProductAvailability;
        }
        throw new z.ZodError([
          {
            code: "custom",
            path: ["availability"],
            message: `Наличие: "${value}" — ожидаем "В наличии" или "Под заказ"`,
            input: value,
          },
        ]);
      }),
    characteristics: z
      .string()
      .trim()
      .default("")
      .transform((value) => parseCharacteristics(value)),
    is_active: z
      .union([z.string(), z.boolean()])
      .default(true)
      .transform((value) => {
        if (typeof value === "boolean") return value;
        const v = value.trim().toLowerCase();
        return !(v === "false" || v === "0" || v === "no" || v === "нет");
      }),
  });

export type ParsedRow = {
  rowIndex: number;
  raw: Record<string, unknown>;
  ok: boolean;
  errors: string[];
  data?: z.infer<typeof rowSchema>;
};

export type ParseResult = {
  headers: string[];
  rows: ParsedRow[];
  unmappedColumns: string[];
  okCount: number;
  errorCount: number;
};

export function parseWorkbook(buffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
    defval: "",
    raw: false,
  });

  const headers = rawRows.length
    ? Object.keys(rawRows[0])
    : XLSX.utils
        .sheet_to_json<string[]>(firstSheet, { header: 1, raw: false })
        .slice(0, 1)
        .flat()
        .map(String);

  const unmappedColumns = headers.filter((header) => {
    const mapped = HEADER_ALIASES[normalizeHeader(header)];
    return !mapped || mapped === ("_ignore" as ImportColumnKey);
  });

  const rows = rawRows.map<ParsedRow>((rawRow, index) => {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rawRow)) {
      const mapped = HEADER_ALIASES[normalizeHeader(key)];
      if (!mapped || mapped === ("_ignore" as ImportColumnKey)) continue;
      normalized[mapped] = value;
    }
    const parsed = rowSchema.safeParse(normalized);
    if (parsed.success) {
      return { rowIndex: index + 2, raw: rawRow, ok: true, errors: [], data: parsed.data };
    }
    return {
      rowIndex: index + 2,
      raw: rawRow,
      ok: false,
      errors: parsed.error.issues.map((issue) =>
        issue.path.length
          ? `${issue.path.join(".")}: ${issue.message}`
          : issue.message,
      ),
    };
  });

  return {
    headers,
    rows,
    unmappedColumns,
    okCount: rows.filter((row) => row.ok).length,
    errorCount: rows.filter((row) => !row.ok).length,
  };
}

function normalizeHeader(header: string): string {
  return header.toString().trim().toLowerCase().replace(/\s+/g, "_");
}

function parseCharacteristics(raw: string): { name: string; value: string }[] {
  if (!raw.trim()) return [];
  // Поддержка двух разделителей: запятая (новая выгрузка) и точка-с-запятой
  // (старая выгрузка). Внутри пары — "name: value".
  return raw
    .split(/[,;]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const colonIndex = entry.indexOf(":");
      if (colonIndex === -1) {
        return { name: entry, value: "" };
      }
      return {
        name: entry.slice(0, colonIndex).trim(),
        value: entry.slice(colonIndex + 1).trim(),
      };
    });
}

// ---------------------------------------------------------------------------
// Existing products lookup
// ---------------------------------------------------------------------------

export type ExistingProductLookup = {
  id: string;
  sku: string;
  title: string;
};

export async function listExistingProductsForMatch(): Promise<ExistingProductLookup[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, sku, title");
  if (error) throw error;
  return ((data ?? []) as ExistingProductLookup[]).map((row) => ({
    id: row.id,
    sku: row.sku ?? "",
    title: row.title ?? "",
  }));
}

// ---------------------------------------------------------------------------
// Import plan
// ---------------------------------------------------------------------------

export type RowMatch =
  | { kind: "new" }
  | { kind: "update-by-sku"; existingId: string; existingTitle: string }
  | { kind: "update-by-title"; existingId: string; existingTitle: string };

type RowPayload = {
  rowIndex: number;
  sku: string | null;
  title: string;
  brand: string;
  manufacturer: string;
  category_title: string;
  subcategory_title: string | null;
  price: number | null;
  short_description: string;
  description: string;
  availability: ProductAvailability;
  characteristics: { name: string; value: string }[];
  is_active: boolean;
  match: RowMatch;
};

export type ImportPlan = {
  ready: RowPayload[];
  problems: Array<{ rowIndex: number; errors: string[] }>;
  newCategories: string[];                       // titles, deduped
  newSubcategories: Array<{ category: string; subcategory: string }>;
  summary: {
    insert: number;
    updateBySku: number;
    updateByTitle: number;
  };
};

function titleKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildImportPlan(
  parsed: ParseResult,
  categories: CategoryRow[],
  subcategories: SubcategoryRow[],
  existingProducts: ExistingProductLookup[],
): ImportPlan {
  const categoryByTitle = new Map<string, CategoryRow>(
    categories.map((category) => [titleKey(category.title), category]),
  );
  const subcategoryByTitle = new Map<string, SubcategoryRow>(
    subcategories.map((subcategory) => [
      `${subcategory.category_id}::${titleKey(subcategory.title)}`,
      subcategory,
    ]),
  );

  const existingBySku = new Map<string, ExistingProductLookup>();
  const existingByTitle = new Map<string, ExistingProductLookup>();
  for (const product of existingProducts) {
    if (product.sku) existingBySku.set(product.sku.trim(), product);
    if (product.title) existingByTitle.set(titleKey(product.title), product);
  }

  const ready: RowPayload[] = [];
  const problems: ImportPlan["problems"] = [];
  const newCategories = new Map<string, string>();
  const newSubcategories = new Map<string, { category: string; subcategory: string }>();

  // Within-file dedup tracking
  const seenSku = new Map<string, number>();   // sku → rowIndex of first appearance
  const seenTitle = new Map<string, number>(); // titleKey → rowIndex of first appearance
  const duplicateRowIndexes = new Set<number>();

  for (const row of parsed.rows) {
    if (!row.ok || !row.data) {
      problems.push({ rowIndex: row.rowIndex, errors: row.errors });
      continue;
    }
    const data = row.data;
    const categoryTitle = data.category_title;
    const subcategoryTitle = data.subcategory_title;
    const sku = data.sku ? data.sku.trim() : "";
    const titleNorm = titleKey(data.title);

    // Within-file dedup
    let inFileDup = false;
    if (sku) {
      const prior = seenSku.get(sku);
      if (prior != null) {
        problems.push({
          rowIndex: row.rowIndex,
          errors: [`артикул "${sku}" уже встречался в строке ${prior}`],
        });
        duplicateRowIndexes.add(row.rowIndex);
        inFileDup = true;
      } else {
        seenSku.set(sku, row.rowIndex);
      }
    }
    if (!inFileDup) {
      const priorTitle = seenTitle.get(titleNorm);
      if (priorTitle != null) {
        problems.push({
          rowIndex: row.rowIndex,
          errors: [`название "${data.title}" уже встречалось в строке ${priorTitle}`],
        });
        duplicateRowIndexes.add(row.rowIndex);
        inFileDup = true;
      } else {
        seenTitle.set(titleNorm, row.rowIndex);
      }
    }
    if (inFileDup) continue;

    if (!categoryByTitle.has(titleKey(categoryTitle))) {
      newCategories.set(titleKey(categoryTitle), categoryTitle);
    }
    if (subcategoryTitle) {
      const existingCategory = categoryByTitle.get(titleKey(categoryTitle));
      const subKey = existingCategory
        ? `${existingCategory.id}::${titleKey(subcategoryTitle)}`
        : `new::${titleKey(categoryTitle)}::${titleKey(subcategoryTitle)}`;
      const alreadyExists = existingCategory
        ? subcategoryByTitle.has(subKey)
        : false;
      if (!alreadyExists) {
        newSubcategories.set(subKey, {
          category: categoryTitle,
          subcategory: subcategoryTitle,
        });
      }
    }

    // Match against existing products: SKU first, then title.
    let match: RowMatch = { kind: "new" };
    if (sku && existingBySku.has(sku)) {
      const existing = existingBySku.get(sku)!;
      match = {
        kind: "update-by-sku",
        existingId: existing.id,
        existingTitle: existing.title,
      };
    } else if (existingByTitle.has(titleNorm)) {
      const existing = existingByTitle.get(titleNorm)!;
      match = {
        kind: "update-by-title",
        existingId: existing.id,
        existingTitle: existing.title,
      };
    }

    ready.push({
      rowIndex: row.rowIndex,
      sku: sku || null,
      title: data.title,
      brand: data.brand,
      manufacturer: data.manufacturer,
      category_title: categoryTitle,
      subcategory_title: subcategoryTitle,
      price: data.price,
      short_description: data.short_description,
      description: data.description,
      availability: data.availability,
      characteristics: data.characteristics,
      is_active: data.is_active,
      match,
    });
  }

  const summary = {
    insert: ready.filter((row) => row.match.kind === "new").length,
    updateBySku: ready.filter((row) => row.match.kind === "update-by-sku").length,
    updateByTitle: ready.filter((row) => row.match.kind === "update-by-title").length,
  };

  return {
    ready,
    problems,
    newCategories: Array.from(newCategories.values()),
    newSubcategories: Array.from(newSubcategories.values()),
    summary,
  };
}

// ---------------------------------------------------------------------------
// Run import
// ---------------------------------------------------------------------------

export type ImportRunResult = {
  inserted: number;
  updated: number;
  createdCategories: number;
  createdSubcategories: number;
  rowErrors: Array<{ rowIndex: number; error: string }>;
};

export async function runImport(plan: ImportPlan): Promise<ImportRunResult> {
  const result: ImportRunResult = {
    inserted: 0,
    updated: 0,
    createdCategories: 0,
    createdSubcategories: 0,
    rowErrors: [],
  };
  if (plan.ready.length === 0) return result;

  // 1. Resolve / create categories.
  const categories = await listCategories();
  const categoryByTitle = new Map<string, CategoryRow>();
  for (const category of categories) {
    categoryByTitle.set(titleKey(category.title), category);
  }
  for (const title of plan.newCategories) {
    if (categoryByTitle.has(titleKey(title))) continue;
    const slug = await generateUniqueSlug({ table: "categories", source: title });
    const created = await createCategory({
      slug,
      title,
      description: "",
      image_url: null,
      icon_url: null,
      tags: [],
      position: categoryByTitle.size,
      is_active: true,
    });
    categoryByTitle.set(titleKey(created.title), created);
    result.createdCategories += 1;
  }

  // 2. Resolve / create subcategories within their categories.
  const subcategories = await listSubcategories();
  const subcategoryByTitle = new Map<string, SubcategoryRow>();
  for (const subcategory of subcategories) {
    subcategoryByTitle.set(
      `${subcategory.category_id}::${titleKey(subcategory.title)}`,
      subcategory,
    );
  }
  for (const entry of plan.newSubcategories) {
    const parent = categoryByTitle.get(titleKey(entry.category));
    if (!parent) continue;
    const key = `${parent.id}::${titleKey(entry.subcategory)}`;
    if (subcategoryByTitle.has(key)) continue;
    const slug = await generateUniqueSlug({
      table: "subcategories",
      source: entry.subcategory,
      scopeColumn: "category_id",
      scopeValue: parent.id,
    });
    const created = await createSubcategory(parent.id, {
      slug,
      title: entry.subcategory,
      label: null,
      description: null,
      position: 0,
      is_active: true,
    });
    subcategoryByTitle.set(`${parent.id}::${titleKey(created.title)}`, created);
    result.createdSubcategories += 1;
  }

  // 3. Upsert each row using the pre-computed match.
  for (const row of plan.ready) {
    try {
      const parent = categoryByTitle.get(titleKey(row.category_title));
      if (!parent) {
        result.rowErrors.push({
          rowIndex: row.rowIndex,
          error: `категория "${row.category_title}" не разрешилась`,
        });
        continue;
      }
      let subcategoryId: string | null = null;
      if (row.subcategory_title) {
        const sub = subcategoryByTitle.get(
          `${parent.id}::${titleKey(row.subcategory_title)}`,
        );
        if (!sub) {
          result.rowErrors.push({
            rowIndex: row.rowIndex,
            error: `подкатегория "${row.subcategory_title}" не разрешилась`,
          });
          continue;
        }
        subcategoryId = sub.id;
      }

      const productPayload = {
        title: row.title,
        brand: row.brand,
        manufacturer: row.manufacturer,
        category_id: parent.id,
        subcategory_id: subcategoryId,
        price: row.price,
        price_label: row.price != null ? formatPriceLabel(row.price) : "По запросу",
        short_description: row.short_description,
        description: row.description,
        availability: row.availability,
        availability_label: null,
        is_active: row.is_active,
      };

      let productId: string;
      if (row.match.kind === "new") {
        const slug = await generateUniqueSlug({
          table: "products",
          source: row.title,
        });
        const { data, error } = await supabase
          .from("products")
          .insert({ ...productPayload, slug })
          .select("id")
          .single();
        if (error) throw error;
        productId = (data as { id: string }).id;
        result.inserted += 1;
      } else {
        const { error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", row.match.existingId);
        if (error) throw error;
        productId = row.match.existingId;
        result.updated += 1;
      }

      // Sync characteristics: wipe + refill (idempotent).
      const { error: deleteError } = await supabase
        .from("product_characteristics")
        .delete()
        .eq("product_id", productId);
      if (deleteError) throw deleteError;

      const cleanCharacteristics = row.characteristics.filter(
        (entry) => entry.name.trim() || entry.value.trim(),
      );
      if (cleanCharacteristics.length > 0) {
        const characteristicsPayload = cleanCharacteristics.map((entry, index) => ({
          product_id: productId,
          position: index,
          name: entry.name,
          value: entry.value,
        }));
        const { error: insertError } = await supabase
          .from("product_characteristics")
          .insert(characteristicsPayload);
        if (insertError) throw insertError;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      result.rowErrors.push({ rowIndex: row.rowIndex, error: message });
    }
  }

  return result;
}

function formatPriceLabel(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

export function buildTemplateWorkbook(): ArrayBuffer {
  const example: Record<string, string | number> = {
    Артикул: "",
    Название: "Пример товара",
    Бренд: "Brand",
    Производитель: "Manufacturer",
    Категория: "Компрессоры",
    Подкатегория: "Стоматологические компрессоры",
    "Цена, ₽": 123000,
    "Короткое описание": "Краткое описание",
    Описание: "Подробное описание",
    Наличие: "Под заказ",
    Характеристики: "Питание: 220 В, Мощность: 1.2 кВт",
    Видимость: "да",
  };
  const headers = IMPORT_COLUMNS.map((column) => column.label) as string[];
  const worksheet = XLSX.utils.json_to_sheet([example], { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "products");
  return XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}
