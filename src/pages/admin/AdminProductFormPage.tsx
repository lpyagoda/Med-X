import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useFieldArray, useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  Check,
  GripVertical,
  ImageOff,
  Plus,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { z } from "zod";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { AdminInput } from "@/components/admin/ui/input";
import { AdminLabel } from "@/components/admin/ui/label";
import { AdminSwitch } from "@/components/admin/ui/switch";
import { toast } from "@/components/admin/ui/toast";
import {
  createCategory,
  createSubcategory,
  listCategories,
  listSubcategories,
} from "@/lib/admin/categories";
import { formatPriceLabel, parsePriceInput } from "@/lib/admin/price";
import {
  createProduct,
  getProductWithDetails,
  updateProduct,
} from "@/lib/admin/products";
import { generateUniqueSlug } from "@/lib/admin/slug";
import { uploadProductImage } from "@/lib/admin/storage";
import type {
  CategoryRow,
  ProductImageInput,
  SubcategoryRow,
} from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const MAX_GALLERY_IMAGES = 10;

const productSchema = z.object({
  title: z.string().min(2, "Название обязательно"),
  brand: z.string(),
  manufacturer: z.string(),
  price: z
    .union([z.string(), z.number()])
    .transform((value) => parsePriceInput(value))
    .nullable(),
  short_description: z.string(),
  description: z.string(),
  category_id: z.string().min(1, "Категория обязательна"),
  subcategory_id: z.string(),
  availability: z.enum(["in-stock", "on-order"]),
  characteristics: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .default([]),
});

type ProductFormValues = z.input<typeof productSchema>;

const defaultValues: ProductFormValues = {
  title: "",
  brand: "",
  manufacturer: "",
  price: "",
  short_description: "",
  description: "",
  category_id: "",
  subcategory_id: "",
  availability: "on-order",
  characteristics: [],
};

type GalleryImage = ProductImageInput & {
  id: string; // local-only, used as React key
};

function serializeImages(images: GalleryImage[]): string {
  return JSON.stringify(
    images.map((image, index) => ({
      url: image.url,
      is_main: image.is_main,
      position: index,
    })),
  );
}

function formatPriceDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ru-RU");
}

export function AdminProductFormPage() {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !params.id;

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryRow[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [sku, setSku] = useState<string>("");
  // Baseline values used to decide whether the form has unsaved changes.
  // For external state (images, isActive) that RHF doesn't know about.
  const [initialIsActive, setInitialIsActive] = useState(true);
  const [initialImagesSig, setInitialImagesSig] = useState<string>("[]");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Inline-create dialogs
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const characteristics = useFieldArray({
    control: form.control,
    name: "characteristics",
  });

  const selectedCategoryId = form.watch("category_id");
  const subcategoriesForCategory = useMemo(
    () =>
      subcategories.filter((subcategory) => subcategory.category_id === selectedCategoryId),
    [subcategories, selectedCategoryId],
  );

  // Did anything change since load? Includes RHF dirty + external state.
  const imagesSig = serializeImages(images);
  const isDirty =
    form.formState.isDirty ||
    isActive !== initialIsActive ||
    imagesSig !== initialImagesSig;
  // New products: we still want the user to be able to click save once they
  // fill in the required fields. Treat new-product as always "dirty enough".
  const canSave = isNew ? true : isDirty;

  const refreshDictionaries = useCallback(async () => {
    const [categoryRows, subcategoryRows] = await Promise.all([
      listCategories(),
      listSubcategories(),
    ]);
    setCategories(categoryRows);
    setSubcategories(subcategoryRows);
  }, []);

  useEffect(() => {
    refreshDictionaries().catch((err: unknown) => {
      toast.error(`Не удалось загрузить справочники: ${err instanceof Error ? err.message : err}`);
    });
  }, [refreshDictionaries]);

  useEffect(() => {
    if (isNew || !params.id) return;
    setLoading(true);
    getProductWithDetails(params.id)
      .then(({ product, characteristics: rows, images: imageRows }) => {
        const priceForForm =
          product.price != null ? Number(product.price).toLocaleString("ru-RU") : "";
        form.reset({
          title: product.title,
          brand: product.brand,
          manufacturer: product.manufacturer,
          price: priceForForm,
          short_description: product.short_description,
          description: product.description,
          category_id: product.category_id,
          subcategory_id: product.subcategory_id ?? "",
          availability: product.availability,
          characteristics: rows.map((row) => ({ name: row.name, value: row.value })),
        });
        setIsActive(product.is_active);
        setInitialIsActive(product.is_active);
        setSku(product.sku ?? "");

        // Hydrate gallery from product_images rows. If the new table doesn't
        // exist yet (pre-migration), fall back to the legacy image_url field.
        let hydrated: GalleryImage[];
        if (imageRows.length > 0) {
          hydrated = imageRows.map((row, index) => ({
            id: row.id,
            url: row.url,
            is_main: row.is_main,
            position: index,
          }));
        } else if (product.image_url) {
          hydrated = [
            {
              id: `legacy-${product.id}`,
              url: product.image_url,
              is_main: true,
              position: 0,
            },
          ];
        } else {
          hydrated = [];
        }
        setImages(hydrated);
        setInitialImagesSig(serializeImages(hydrated));
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [isNew, params.id, form]);

  async function onSubmit(rawValues: ProductFormValues) {
    const parsed = productSchema.parse(rawValues);
    setSaving(true);
    try {
      const slug = await generateUniqueSlug({
        table: "products",
        source: parsed.title,
        excludeId: params.id,
      });
      const galleryPayload: ProductImageInput[] =
        images.length === 0
          ? []
          : images.map((image, index) => ({
              url: image.url,
              is_main: image.is_main,
              position: index,
            }));
      // Ensure exactly one main image when gallery has any.
      if (galleryPayload.length > 0 && !galleryPayload.some((i) => i.is_main)) {
        galleryPayload[0].is_main = true;
      }
      const mainUrl = galleryPayload.find((i) => i.is_main)?.url ?? null;

      const payload = {
        slug,
        title: parsed.title,
        brand: parsed.brand,
        manufacturer: parsed.manufacturer,
        image_url: mainUrl,
        price: parsed.price,
        price_label: formatPriceLabel(parsed.price),
        short_description: parsed.short_description,
        description: parsed.description,
        category_id: parsed.category_id,
        subcategory_id: parsed.subcategory_id || null,
        availability: parsed.availability,
        availability_label: null,
        is_active: isActive,
        characteristics: parsed.characteristics.filter(
          (characteristic) =>
            characteristic.name.trim() || characteristic.value.trim(),
        ),
        images: galleryPayload,
      };
      if (isNew) {
        const created = await createProduct(payload);
        toast.success("Товар создан");
        navigate(`/admin/products/${created.id}`, { replace: true });
      } else if (params.id) {
        await updateProduct(params.id, payload);
        toast.success("Изменения сохранены");
        // Reset baselines so the Save button goes back to disabled.
        form.reset(rawValues);
        setInitialIsActive(isActive);
        setInitialImagesSig(serializeImages(images));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Максимум ${MAX_GALLERY_IMAGES} фото`);
      return;
    }
    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast.error(
        `Загружено только ${remainingSlots} из ${files.length} — лимит ${MAX_GALLERY_IMAGES}`,
      );
    }

    const title = form.getValues("title") || "draft";
    setUploading(true);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name}: не изображение`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name}: больше 10 МБ`);
          continue;
        }
        const { publicUrl } = await uploadProductImage(file, title);
        uploaded.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url: publicUrl,
          is_main: false,
          position: 0,
        });
      }
      setImages((current) => {
        const next = [...current, ...uploaded];
        if (next.length > 0 && !next.some((image) => image.is_main)) {
          next[0] = { ...next[0], is_main: true };
        }
        return next.map((image, index) => ({ ...image, position: index }));
      });
      if (uploaded.length > 0) toast.success(`Загружено: ${uploaded.length}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }

  function setMainImage(localId: string) {
    setImages((current) =>
      current.map((image) => ({ ...image, is_main: image.id === localId })),
    );
  }

  function removeImage(localId: string) {
    setImages((current) => {
      const filtered = current.filter((image) => image.id !== localId);
      if (filtered.length > 0 && !filtered.some((image) => image.is_main)) {
        filtered[0] = { ...filtered[0], is_main: true };
      }
      return filtered.map((image, index) => ({ ...image, position: index }));
    });
  }

  const fieldError = (path: keyof ProductFormValues) => {
    const error = form.formState.errors[path];
    if (!error) return null;
    const messageRaw = (error as { message?: unknown }).message;
    return typeof messageRaw === "string" ? messageRaw : null;
  };

  if (loadError) {
    return (
      <>
        <AdminHeader title="Ошибка" />
        <main className="p-8">
          <div className="admin-card p-6 text-sm text-destructive">{loadError}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title={isNew ? "Новый товар" : form.watch("title") || "Редактирование товара"}
        description={isNew ? "" : sku ? `Артикул: ${sku}` : params.id}
        actions={
          <>
            <AdminButton variant="outline" asChild>
              <Link to="/admin/products">
                <ArrowLeft className="h-4 w-4" />К списку
              </Link>
            </AdminButton>
            <div className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-3 py-1.5">
              <span className="text-xs font-medium text-foreground">
                {isActive ? "Виден на сайте" : "Скрыт"}
              </span>
              <AdminSwitch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <AdminButton
              onClick={() => void form.handleSubmit(onSubmit)()}
              disabled={saving || loading || !canSave}
              title={!canSave ? "Нет изменений для сохранения" : undefined}
            >
              {saving ? "Сохраняем…" : isNew ? "Создать" : "Сохранить"}
            </AdminButton>
          </>
        }
      />

      <main className="p-8">
        {loading ? (
          <div className="admin-card p-10 text-center text-sm text-admin-muted-fg">
            Загрузка…
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Gallery + Main details — side by side */}
            <div className="grid gap-6 lg:grid-cols-12">
              <section className="admin-card p-6 lg:col-span-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Галерея фотографий
                    </h2>
                    <p className="text-xs text-admin-muted-fg">
                      До {MAX_GALLERY_IMAGES} фото. Клик — главное. До 10 МБ.
                    </p>
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleImageUpload}
                    disabled={uploading || images.length >= MAX_GALLERY_IMAGES}
                  />
                  <AdminButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploading || images.length >= MAX_GALLERY_IMAGES}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Загружаем…" : "Добавить"}
                  </AdminButton>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.length === 0 ? (
                    <div className="col-span-full flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-admin-border bg-admin-bg text-admin-muted-fg">
                      <div className="text-center">
                        <ImageOff className="mx-auto h-6 w-6" />
                        <p className="mt-1 text-xs">Пока нет фото</p>
                      </div>
                    </div>
                  ) : (
                    images.map((image) => (
                      <GalleryThumb
                        key={image.id}
                        image={image}
                        onMain={() => setMainImage(image.id)}
                        onRemove={() => removeImage(image.id)}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="admin-card p-6 lg:col-span-7">
                <h2 className="text-sm font-semibold text-foreground">Основное</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <AdminLabel htmlFor="title">Название</AdminLabel>
                    <AdminInput id="title" {...form.register("title")} />
                    {fieldError("title") && (
                      <p className="text-xs text-destructive">{fieldError("title")}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <AdminLabel htmlFor="brand">Бренд</AdminLabel>
                    <AdminInput id="brand" {...form.register("brand")} />
                  </div>
                  <div className="space-y-1.5">
                    <AdminLabel htmlFor="manufacturer">Производитель</AdminLabel>
                    <AdminInput id="manufacturer" {...form.register("manufacturer")} />
                  </div>
                </div>
              </section>
            </div>

            {/* Category + subcategory */}
            <section className="admin-card p-6">
              <h2 className="text-sm font-semibold text-foreground">
                Категория и подкатегория
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <AdminLabel htmlFor="category_id">Категория</AdminLabel>
                  <div className="flex gap-2">
                    <select
                      id="category_id"
                      className="h-10 w-full rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...form.register("category_id")}
                      onChange={(event) => {
                        form.setValue("category_id", event.target.value);
                        form.setValue("subcategory_id", "");
                      }}
                    >
                      <option value="">— выбрать —</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                    <AdminButton
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCreatingCategory(true)}
                      aria-label="Создать категорию"
                    >
                      <Plus className="h-4 w-4" />
                    </AdminButton>
                  </div>
                  {fieldError("category_id") && (
                    <p className="text-xs text-destructive">{fieldError("category_id")}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <AdminLabel htmlFor="subcategory_id">Подкатегория</AdminLabel>
                  <div className="flex gap-2">
                    <select
                      id="subcategory_id"
                      className="h-10 w-full rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                      disabled={!selectedCategoryId}
                      {...form.register("subcategory_id")}
                    >
                      <option value="">— не выбрано —</option>
                      {subcategoriesForCategory.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.title}
                        </option>
                      ))}
                    </select>
                    <AdminButton
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCreatingSubcategory(true)}
                      disabled={!selectedCategoryId}
                      aria-label="Создать подкатегорию"
                    >
                      <Plus className="h-4 w-4" />
                    </AdminButton>
                  </div>
                </div>
              </div>
            </section>

            {/* Price + availability */}
            <section className="admin-card p-6">
              <h2 className="text-sm font-semibold text-foreground">
                Цена и наличие
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <AdminLabel htmlFor="price">Цена, ₽</AdminLabel>
                  <PriceInput register={form.register} />
                  <p className="text-xs text-admin-muted-fg">
                    Пусто — «По запросу». Только цифры; разделители подставятся сами.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <AdminLabel htmlFor="availability">Наличие</AdminLabel>
                  <select
                    id="availability"
                    className="h-10 w-full rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...form.register("availability")}
                  >
                    <option value="on-order">Под заказ</option>
                    <option value="in-stock">В наличии</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Texts */}
            <section className="admin-card p-6">
              <h2 className="text-sm font-semibold text-foreground">Описание</h2>
              <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <AdminLabel htmlFor="short_description">Короткое описание</AdminLabel>
                  <textarea
                    id="short_description"
                    rows={2}
                    className="flex w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm text-foreground placeholder:text-admin-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...form.register("short_description")}
                  />
                </div>
                <div className="space-y-1.5">
                  <AdminLabel htmlFor="description">Подробное описание</AdminLabel>
                  <textarea
                    id="description"
                    rows={6}
                    className="flex w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm text-foreground placeholder:text-admin-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...form.register("description")}
                  />
                </div>
              </div>
            </section>

            {/* Characteristics */}
            <section className="admin-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Характеристики</h2>
                <AdminButton
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => characteristics.append({ name: "", value: "" })}
                >
                  <Plus className="h-4 w-4" />
                  Строка
                </AdminButton>
              </div>

              {characteristics.fields.length === 0 ? (
                <p className="mt-4 text-xs text-admin-muted-fg">
                  Пока нет ни одной характеристики. Добавьте первую.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {characteristics.fields.map((field, index) => (
                    <li
                      key={field.id}
                      className="grid grid-cols-[16px_minmax(0,1fr)_minmax(0,1.4fr)_auto] items-center gap-2"
                    >
                      <GripVertical
                        className="h-4 w-4 text-admin-muted-fg"
                        aria-hidden="true"
                      />
                      <AdminInput
                        placeholder="Название (например, «Питание»)"
                        aria-label={`Характеристика ${index + 1}: название`}
                        {...form.register(`characteristics.${index}.name`)}
                      />
                      <AdminInput
                        placeholder="Значение"
                        aria-label={`Характеристика ${index + 1}: значение`}
                        {...form.register(`characteristics.${index}.value`)}
                      />
                      <AdminButton
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => characteristics.remove(index)}
                        aria-label="Удалить характеристику"
                      >
                        <Trash2 className="h-4 w-4" />
                      </AdminButton>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </form>
        )}
      </main>

      {creatingCategory ? (
        <QuickCreateDialog
          title="Новая категория"
          placeholder="Например, Имплантология"
          onCancel={() => setCreatingCategory(false)}
          onCreate={async (name) => {
            const slug = await generateUniqueSlug({
              table: "categories",
              source: name,
            });
            const created = await createCategory({
              slug,
              title: name,
              description: "",
              image_url: null,
              tags: [],
              position: categories.length,
              is_active: true,
            });
            await refreshDictionaries();
            form.setValue("category_id", created.id);
            form.setValue("subcategory_id", "");
            setCreatingCategory(false);
            toast.success("Категория создана");
          }}
        />
      ) : null}

      {creatingSubcategory && selectedCategoryId ? (
        <QuickCreateDialog
          title="Новая подкатегория"
          placeholder="Например, Турбинные наконечники"
          onCancel={() => setCreatingSubcategory(false)}
          onCreate={async (name) => {
            const slug = await generateUniqueSlug({
              table: "subcategories",
              source: name,
              scopeColumn: "category_id",
              scopeValue: selectedCategoryId,
            });
            const created = await createSubcategory(selectedCategoryId, {
              slug,
              title: name,
              label: null,
              description: null,
              position: subcategoriesForCategory.length,
              is_active: true,
            });
            await refreshDictionaries();
            form.setValue("subcategory_id", created.id);
            setCreatingSubcategory(false);
            toast.success("Подкатегория создана");
          }}
        />
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------

// Price input with live thousand-separator mask. Stores the formatted string
// in form state; parsePriceInput (in price.ts) strips spaces on save.
function PriceInput({ register }: { register: UseFormRegister<ProductFormValues> }) {
  const reg = register("price");
  return (
    <AdminInput
      id="price"
      type="text"
      inputMode="numeric"
      placeholder="Например, 860 000"
      {...reg}
      onChange={(event) => {
        const formatted = formatPriceDisplay(event.target.value);
        event.target.value = formatted;
        void reg.onChange(event);
      }}
      onKeyDown={(event) => {
        // Allow control keys
        if (
          event.key.length > 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        ) {
          return;
        }
        // Block any non-digit input
        if (!/^\d$/.test(event.key)) {
          event.preventDefault();
        }
      }}
    />
  );
}

function GalleryThumb({
  image,
  onMain,
  onRemove,
}: {
  image: GalleryImage;
  onMain: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-lg border bg-admin-bg",
        image.is_main ? "border-primary ring-2 ring-primary/30" : "border-admin-border",
      )}
    >
      <button
        type="button"
        onClick={onMain}
        className="absolute inset-0 h-full w-full"
        aria-label={image.is_main ? "Главное фото" : "Сделать главным"}
      >
        <img src={image.url} alt="" className="h-full w-full object-contain" loading="lazy" />
      </button>

      {image.is_main ? (
        <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          <Star className="h-3 w-3 fill-current" />
          Главное
        </span>
      ) : (
        <button
          type="button"
          onClick={onMain}
          className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
        >
          <Check className="h-3 w-3" />
          Сделать главным
        </button>
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
        aria-label="Удалить фото"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

function QuickCreateDialog({
  title,
  placeholder,
  onCancel,
  onCreate,
}: {
  title: string;
  placeholder: string;
  onCancel: () => void;
  onCreate: (name: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (value.trim().length < 2) return;
    setSaving(true);
    try {
      await onCreate(value.trim());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <DialogPrimitive.Root open onOpenChange={(next) => !next && onCancel()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="text-base font-semibold text-foreground">
            {title}
          </DialogPrimitive.Title>
          <div className="mt-4 space-y-1.5">
            <AdminLabel htmlFor="quick-create">Название</AdminLabel>
            <AdminInput
              id="quick-create"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter" && !saving && value.trim().length >= 2) {
                  event.preventDefault();
                  void submit();
                }
              }}
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <AdminButton variant="outline" onClick={onCancel} disabled={saving}>
              Отмена
            </AdminButton>
            <AdminButton
              onClick={() => void submit()}
              disabled={saving || value.trim().length < 2}
            >
              {saving ? "Создаём…" : "Создать"}
            </AdminButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
