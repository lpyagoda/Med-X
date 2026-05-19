import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ChevronDown,
  ChevronRight,
  ImageOff,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { AdminInput } from "@/components/admin/ui/input";
import { AdminLabel } from "@/components/admin/ui/label";
import { AdminSwitchField } from "@/components/admin/ui/switch";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { toast } from "@/components/admin/ui/toast";
import {
  countProductsByCategory,
  countProductsBySubcategory,
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  listCategories,
  listSubcategories,
  updateCategory,
  updateSubcategory,
} from "@/lib/admin/categories";
import { generateUniqueSlug } from "@/lib/admin/slug";
import { uploadCategoryImage } from "@/lib/admin/storage";
import type { CategoryRow, SubcategoryRow } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type Tree = Array<{
  category: CategoryRow;
  productCount: number;
  subcategories: Array<SubcategoryRow & { productCount: number }>;
}>;

export function AdminCategoriesPage() {
  const [tree, setTree] = useState<Tree>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [editingCategory, setEditingCategory] = useState<CategoryRow | "new" | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<
    | { categoryId: string; subcategory: SubcategoryRow | "new" }
    | null
  >(null);

  // Delete confirm state
  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<{
    category: CategoryRow;
    productCount: number;
    subcategoryCount: number;
  } | null>(null);
  const [pendingDeleteSubcategory, setPendingDeleteSubcategory] = useState<
    (SubcategoryRow & { productCount: number }) | null
  >(null);
  const [deleting, setDeleting] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, subs, catCounts, subCounts] = await Promise.all([
        listCategories(),
        listSubcategories(),
        countProductsByCategory(),
        countProductsBySubcategory(),
      ]);
      const next: Tree = cats.map((category) => ({
        category,
        productCount: catCounts[category.id] ?? 0,
        subcategories: subs
          .filter((sub) => sub.category_id === category.id)
          .map((sub) => ({ ...sub, productCount: subCounts[sub.id] ?? 0 })),
      }));
      setTree(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  function toggleExpand(categoryId: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  async function handleDeleteCategory() {
    if (!pendingDeleteCategory) return;
    setDeleting(true);
    try {
      await deleteCategory(pendingDeleteCategory.category.id);
      toast.success(`Удалена: ${pendingDeleteCategory.category.title}`);
      setPendingDeleteCategory(null);
      await refetch();
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Unknown error";
      const hint =
        raw.toLowerCase().includes("foreign key") ||
        raw.toLowerCase().includes("violates")
          ? "В категории есть товары — сначала перенесите их."
          : raw;
      toast.error(hint);
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteSubcategory() {
    if (!pendingDeleteSubcategory) return;
    setDeleting(true);
    try {
      await deleteSubcategory(pendingDeleteSubcategory.id);
      toast.success(`Удалена: ${pendingDeleteSubcategory.title}`);
      setPendingDeleteSubcategory(null);
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <AdminHeader
        title="Категории"
        description={loading ? "Загрузка…" : `${tree.length} категорий верхнего уровня`}
        actions={
          <AdminButton onClick={() => setEditingCategory("new")}>
            <Plus className="h-4 w-4" />
            Категория
          </AdminButton>
        }
      />

      <main className="p-8">
        {error ? (
          <div className="admin-card mb-6 border-l-4 border-destructive p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="admin-card overflow-hidden">
          {loading && tree.length === 0 ? (
            <div className="p-10 text-center text-sm text-admin-muted-fg">Загрузка…</div>
          ) : tree.length === 0 ? (
            <div className="p-10 text-center text-sm text-admin-muted-fg">
              Категорий нет. Добавьте первую через кнопку справа сверху.
            </div>
          ) : (
            <ul className="divide-y divide-admin-border">
              {tree.map((node) => {
                const isOpen = expanded.has(node.category.id);
                return (
                  <li key={node.category.id} className="group/cat">
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-admin-bg">
                      <button
                        type="button"
                        onClick={() => toggleExpand(node.category.id)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-admin-muted-fg hover:bg-admin-border"
                        aria-label={isOpen ? "Свернуть" : "Развернуть"}
                      >
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      <CategoryThumb
                        imageUrl={node.category.image_url}
                        onUploaded={refetch}
                        category={node.category}
                      />

                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <p className="truncate font-medium text-foreground">
                          {node.category.title}
                        </p>
                        <CountBadge value={node.productCount} />
                        {!node.category.is_active ? (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            скрыта
                          </span>
                        ) : null}
                        {node.subcategories.length > 0 ? (
                          <span className="text-xs text-admin-muted-fg">
                            · {node.subcategories.length} подкат.
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1">
                        <AdminButton
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingCategory(node.category)}
                          aria-label="Редактировать"
                        >
                          <Pencil className="h-4 w-4" />
                        </AdminButton>
                        <AdminButton
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setPendingDeleteCategory({
                              category: node.category,
                              productCount: node.productCount,
                              subcategoryCount: node.subcategories.length,
                            })
                          }
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </AdminButton>
                      </div>
                    </div>

                    {isOpen ? (
                      <ul className="border-t border-admin-border bg-admin-bg/50">
                        {node.subcategories.map((sub) => (
                          <li
                            key={sub.id}
                            className="flex items-center gap-3 border-b border-admin-border/50 px-4 py-2 pl-16 hover:bg-admin-bg"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                              <p className="truncate text-sm text-foreground">
                                {sub.title}
                              </p>
                              <CountBadge value={sub.productCount} />
                              {!sub.is_active ? (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                  скрыта
                                </span>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-1">
                              <AdminButton
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  setEditingSubcategory({
                                    categoryId: node.category.id,
                                    subcategory: sub,
                                  })
                                }
                                aria-label="Редактировать подкатегорию"
                              >
                                <Pencil className="h-4 w-4" />
                              </AdminButton>
                              <AdminButton
                                size="icon"
                                variant="ghost"
                                onClick={() => setPendingDeleteSubcategory(sub)}
                                aria-label="Удалить подкатегорию"
                              >
                                <Trash2 className="h-4 w-4" />
                              </AdminButton>
                            </div>
                          </li>
                        ))}
                        <li className="px-4 py-2 pl-16">
                          <AdminButton
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setEditingSubcategory({
                                categoryId: node.category.id,
                                subcategory: "new",
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                            Подкатегория
                          </AdminButton>
                        </li>
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {editingCategory ? (
        <CategoryDialog
          category={editingCategory === "new" ? null : editingCategory}
          open={true}
          onOpenChange={(next) => !next && setEditingCategory(null)}
          onSaved={async () => {
            setEditingCategory(null);
            await refetch();
          }}
        />
      ) : null}

      {editingSubcategory ? (
        <SubcategoryDialog
          categoryId={editingSubcategory.categoryId}
          subcategory={
            editingSubcategory.subcategory === "new"
              ? null
              : editingSubcategory.subcategory
          }
          open={true}
          onOpenChange={(next) => !next && setEditingSubcategory(null)}
          onSaved={async () => {
            setEditingSubcategory(null);
            await refetch();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={pendingDeleteCategory !== null}
        onOpenChange={(next) => !next && setPendingDeleteCategory(null)}
        title="Удалить категорию?"
        description={
          pendingDeleteCategory ? (
            <>
              «{pendingDeleteCategory.category.title}» и её{" "}
              {pendingDeleteCategory.subcategoryCount} подкат. будут удалены.
              {pendingDeleteCategory.productCount > 0 ? (
                <>
                  {" "}
                  <span className="font-semibold text-destructive">
                    К категории привязано {pendingDeleteCategory.productCount}{" "}
                    товаров — БД откажется удалять, сначала перенесите их.
                  </span>
                </>
              ) : null}
            </>
          ) : null
        }
        confirmLabel="Удалить"
        destructive
        busy={deleting}
        onConfirm={handleDeleteCategory}
      />

      <ConfirmDialog
        open={pendingDeleteSubcategory !== null}
        onOpenChange={(next) => !next && setPendingDeleteSubcategory(null)}
        title="Удалить подкатегорию?"
        description={
          pendingDeleteSubcategory ? (
            <>
              «{pendingDeleteSubcategory.title}» будет удалена. У{" "}
              {pendingDeleteSubcategory.productCount} товаров поле «подкатегория»
              станет пустым (товары останутся в категории).
            </>
          ) : null
        }
        confirmLabel="Удалить"
        destructive
        busy={deleting}
        onConfirm={handleDeleteSubcategory}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Category thumbnail with hover-upload
// ---------------------------------------------------------------------------

function CategoryThumb({
  imageUrl,
  category,
  onUploaded,
}: {
  imageUrl: string | null;
  category: CategoryRow;
  onUploaded: () => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Только изображения");
      return;
    }
    setUploading(true);
    try {
      const { publicUrl } = await uploadCategoryImage(file, category.title);
      await updateCategory(category.id, {
        slug: category.slug,
        title: category.title,
        description: category.description,
        image_url: publicUrl,
        tags: category.tags,
        position: category.position,
        is_active: category.is_active,
      });
      toast.success("Картинка обновлена");
      await onUploaded();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Не удалось загрузить");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="relative h-12 w-12 shrink-0">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        disabled={uploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group/thumb relative h-12 w-12 overflow-hidden rounded-lg border border-admin-border bg-admin-bg"
        aria-label="Загрузить картинку категории"
        disabled={uploading}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <ImageOff className="m-auto mt-[14px] h-5 w-5 text-admin-muted-fg" />
        )}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition-opacity",
            uploading ? "opacity-100" : "group-hover/thumb:opacity-100",
          )}
        >
          <Upload className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category dialog (create / edit full record)
// ---------------------------------------------------------------------------

function CategoryDialog({
  category,
  open,
  onOpenChange,
  onSaved,
}: {
  category: CategoryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void> | void;
}) {
  const [title, setTitle] = useState(category?.title ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [position, setPosition] = useState((category?.position ?? 0).toString());
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (title.trim().length < 2) {
      toast.error("Название обязательно");
      return;
    }
    setSaving(true);
    try {
      const slug = await generateUniqueSlug({
        table: "categories",
        source: title,
        excludeId: category?.id,
      });
      const payload = {
        slug,
        title: title.trim(),
        description: description.trim(),
        image_url: category?.image_url ?? null,
        tags: category?.tags ?? [],
        position: Number(position) || 0,
        is_active: isActive,
      };
      if (category) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(payload);
      }
      toast.success(category ? "Изменения сохранены" : "Категория создана");
      await onSaved();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="text-base font-semibold text-foreground">
            {category ? "Редактировать категорию" : "Новая категория"}
          </DialogPrimitive.Title>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <AdminLabel htmlFor="cat-title">Название</AdminLabel>
              <AdminInput
                id="cat-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <AdminLabel htmlFor="cat-description">Описание</AdminLabel>
              <textarea
                id="cat-description"
                rows={3}
                className="flex w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <AdminLabel htmlFor="cat-position">Порядок</AdminLabel>
              <AdminInput
                id="cat-position"
                type="number"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
              />
            </div>

            <AdminSwitchField
              label="Показывать категорию на сайте"
              checked={isActive}
              onCheckedChange={setIsActive}
            />

            <p className="text-xs text-admin-muted-fg">
              Картинка категории загружается через клик по миниатюре в списке.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <DialogPrimitive.Close asChild>
              <AdminButton variant="outline" disabled={saving}>
                Отмена
              </AdminButton>
            </DialogPrimitive.Close>
            <AdminButton onClick={() => void save()} disabled={saving}>
              {saving ? "Сохраняем…" : category ? "Сохранить" : "Создать"}
            </AdminButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ---------------------------------------------------------------------------
// Subcategory dialog
// ---------------------------------------------------------------------------

function SubcategoryDialog({
  categoryId,
  subcategory,
  open,
  onOpenChange,
  onSaved,
}: {
  categoryId: string;
  subcategory: SubcategoryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void> | void;
}) {
  const [title, setTitle] = useState(subcategory?.title ?? "");
  const [isActive, setIsActive] = useState(subcategory?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (title.trim().length < 2) {
      toast.error("Название обязательно");
      return;
    }
    setSaving(true);
    try {
      const slug = await generateUniqueSlug({
        table: "subcategories",
        source: title,
        excludeId: subcategory?.id,
        scopeColumn: "category_id",
        scopeValue: categoryId,
      });
      const payload = {
        slug,
        title: title.trim(),
        label: null,
        description: subcategory?.description ?? null,
        position: subcategory?.position ?? 0,
        is_active: isActive,
      };
      if (subcategory) {
        await updateSubcategory(subcategory.id, payload);
      } else {
        await createSubcategory(categoryId, payload);
      }
      toast.success(subcategory ? "Сохранено" : "Подкатегория создана");
      await onSaved();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="text-base font-semibold text-foreground">
            {subcategory ? "Редактировать подкатегорию" : "Новая подкатегория"}
          </DialogPrimitive.Title>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <AdminLabel htmlFor="sub-title">Название</AdminLabel>
              <AdminInput
                id="sub-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <AdminSwitchField
              label="Показывать подкатегорию на сайте"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <DialogPrimitive.Close asChild>
              <AdminButton variant="outline" disabled={saving}>
                Отмена
              </AdminButton>
            </DialogPrimitive.Close>
            <AdminButton onClick={() => void save()} disabled={saving}>
              {saving ? "Сохраняем…" : subcategory ? "Сохранить" : "Создать"}
            </AdminButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}


function CountBadge({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
        value > 0
          ? "bg-primary/10 text-primary"
          : "bg-admin-border text-admin-muted-fg",
      )}
      aria-label={`${value} товаров`}
    >
      {value}
    </span>
  );
}
