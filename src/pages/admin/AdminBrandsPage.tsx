import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ImageOff, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { AdminInput } from "@/components/admin/ui/input";
import { AdminLabel } from "@/components/admin/ui/label";
import { AdminSwitchField } from "@/components/admin/ui/switch";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { toast } from "@/components/admin/ui/toast";
import {
  countProductsByBrand,
  createBrand,
  deleteBrand,
  listBrands,
  updateBrand,
} from "@/lib/admin/brands";
import { generateUniqueSlug } from "@/lib/admin/slug";
import { ACCEPTED_IMAGE_ACCEPT, assertUploadableImage, uploadBrandLogo } from "@/lib/admin/storage";
import type { BrandRow } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type BrandWithCount = BrandRow & { productCount: number };

export function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<BrandRow | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BrandWithCount | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rows, counts] = await Promise.all([listBrands(), countProductsByBrand()]);
      setBrands(rows.map((brand) => ({ ...brand, productCount: counts[brand.id] ?? 0 })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteBrand(pendingDelete.id);
      toast.success(`Удалён: ${pendingDelete.name}`);
      setPendingDelete(null);
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
        title="Бренды"
        description={loading ? "Загрузка…" : `${brands.length} брендов`}
        actions={
          <AdminButton onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" />
            Бренд
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
          {loading && brands.length === 0 ? (
            <div className="p-10 text-center text-sm text-admin-muted-fg">Загрузка…</div>
          ) : brands.length === 0 ? (
            <div className="p-10 text-center text-sm text-admin-muted-fg">
              Брендов нет. Добавьте первый через кнопку справа сверху.
            </div>
          ) : (
            <ul className="divide-y divide-admin-border">
              {brands.map((brand) => (
                <li
                  key={brand.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-admin-bg"
                >
                  <BrandLogoThumb brand={brand} onUploaded={refetch} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground">{brand.name}</p>
                      <CountBadge value={brand.productCount} />
                      {!brand.is_active ? (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          скрыт
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-admin-muted-fg">
                      {brand.manufacturer || "Производитель не указан"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <AdminButton
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditing(brand)}
                      aria-label="Редактировать"
                    >
                      <Pencil className="h-4 w-4" />
                    </AdminButton>
                    <AdminButton
                      size="icon"
                      variant="ghost"
                      onClick={() => setPendingDelete(brand)}
                      aria-label="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </AdminButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {editing ? (
        <BrandDialog
          brand={editing === "new" ? null : editing}
          positionFallback={brands.length}
          open
          onOpenChange={(next) => !next && setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refetch();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title="Удалить бренд?"
        description={
          pendingDelete ? (
            <>
              «{pendingDelete.name}» будет удалён.
              {pendingDelete.productCount > 0 ? (
                <>
                  {" "}
                  У {pendingDelete.productCount} товаров привязка к бренду снимется
                  (название бренда в товаре сохранится как текст).
                </>
              ) : null}
            </>
          ) : null
        }
        confirmLabel="Удалить"
        destructive
        busy={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

// ---------------------------------------------------------------------------

function BrandLogoThumb({
  brand,
  onUploaded,
}: {
  brand: BrandRow;
  onUploaded: () => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      assertUploadableImage(file);
      const { publicUrl } = await uploadBrandLogo(file, brand.name);
      await updateBrand(brand.id, {
        slug: brand.slug,
        name: brand.name,
        manufacturer: brand.manufacturer,
        logo_url: publicUrl,
        description: brand.description,
        position: brand.position,
        is_active: brand.is_active,
      });
      toast.success("Логотип обновлён");
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
        accept={ACCEPTED_IMAGE_ACCEPT}
        className="sr-only"
        onChange={handleFile}
        disabled={uploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group/thumb relative h-12 w-12 overflow-hidden rounded-lg border border-admin-border bg-white"
        aria-label="Логотип бренда"
        title="Логотип бренда"
        disabled={uploading}
      >
        {brand.logo_url ? (
          <img src={brand.logo_url} alt="" className="h-full w-full object-contain p-1.5" loading="lazy" />
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

function BrandDialog({
  brand,
  positionFallback,
  open,
  onOpenChange,
  onSaved,
}: {
  brand: BrandRow | null;
  positionFallback: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void> | void;
}) {
  const [name, setName] = useState(brand?.name ?? "");
  const [manufacturer, setManufacturer] = useState(brand?.manufacturer ?? "");
  const [description, setDescription] = useState(brand?.description ?? "");
  const [position, setPosition] = useState((brand?.position ?? positionFallback).toString());
  const [isActive, setIsActive] = useState(brand?.is_active ?? true);
  const [logoUrl, setLogoUrl] = useState<string | null>(brand?.logo_url ?? null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      assertUploadableImage(file);
      const { publicUrl } = await uploadBrandLogo(file, name || brand?.name || "draft");
      setLogoUrl(publicUrl);
      toast.success("Логотип загружен — не забудьте «Сохранить»");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Не удалось загрузить");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function save() {
    if (name.trim().length < 2) {
      toast.error("Название бренда обязательно");
      return;
    }
    setSaving(true);
    try {
      const slug = await generateUniqueSlug({
        table: "brands",
        source: name,
        excludeId: brand?.id,
      });
      const payload = {
        slug,
        name: name.trim(),
        manufacturer: manufacturer.trim(),
        logo_url: logoUrl,
        description: description.trim(),
        position: Number(position) || 0,
        is_active: isActive,
      };
      if (brand) {
        await updateBrand(brand.id, payload);
      } else {
        await createBrand(payload);
      }
      toast.success(brand ? "Изменения сохранены" : "Бренд создан");
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
            {brand ? "Редактировать бренд" : "Новый бренд"}
          </DialogPrimitive.Title>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <AdminLabel htmlFor="brand-name">Бренд</AdminLabel>
                <AdminInput
                  id="brand-name"
                  value={name}
                  placeholder="Например, NSK"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <AdminLabel htmlFor="brand-manufacturer">Производитель</AdminLabel>
                <AdminInput
                  id="brand-manufacturer"
                  value={manufacturer}
                  placeholder="Например, NSK Nakanishi Inc."
                  onChange={(event) => setManufacturer(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <AdminLabel htmlFor="brand-description">Описание</AdminLabel>
              <textarea
                id="brand-description"
                rows={3}
                className="flex w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <AdminLabel htmlFor="brand-position">Порядок</AdminLabel>
              <AdminInput
                id="brand-position"
                type="number"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
              />
            </div>

            <AdminSwitchField
              label="Показывать бренд на сайте"
              checked={isActive}
              onCheckedChange={setIsActive}
            />

            <div className="flex flex-col gap-1.5">
              <AdminLabel>Логотип</AdminLabel>
              <div className="flex h-24 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-white">
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="h-full w-full object-contain p-3" loading="lazy" />
                ) : (
                  <ImageOff className="h-6 w-6 text-admin-muted-fg" />
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_IMAGE_ACCEPT}
                className="sr-only"
                onChange={handleLogo}
                disabled={uploading}
              />
              <div className="flex items-center gap-2">
                <AdminButton
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? "Загружаем…" : logoUrl ? "Заменить" : "Загрузить"}
                </AdminButton>
                {logoUrl ? (
                  <AdminButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setLogoUrl(null)}
                    disabled={uploading}
                  >
                    Удалить
                  </AdminButton>
                ) : null}
              </div>
              <p className="text-[11px] text-admin-muted-fg">
                JPG, PNG, WEBP, AVIF или GIF. Лучше PNG с прозрачным фоном.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <DialogPrimitive.Close asChild>
              <AdminButton variant="outline" disabled={saving}>
                Отмена
              </AdminButton>
            </DialogPrimitive.Close>
            <AdminButton onClick={() => void save()} disabled={saving}>
              {saving ? "Сохраняем…" : brand ? "Сохранить" : "Создать"}
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
        value > 0 ? "bg-primary/10 text-primary" : "bg-admin-border text-admin-muted-fg",
      )}
      aria-label={`${value} товаров`}
    >
      {value}
    </span>
  );
}
