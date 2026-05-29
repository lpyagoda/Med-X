import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { AdminInput } from "@/components/admin/ui/input";
import { AdminSwitch } from "@/components/admin/ui/switch";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { toast } from "@/components/admin/ui/toast";
import { listBrands } from "@/lib/admin/brands";
import { listCategories } from "@/lib/admin/categories";
import { formatPriceLabel } from "@/lib/admin/price";
import {
  bulkDeleteProducts,
  bulkSetProductsActive,
  deleteProduct,
  duplicateProduct,
  listProducts,
  toggleProductActive,
  type ProductSortKey,
} from "@/lib/admin/products";
import { exportProductsToXlsx } from "@/lib/admin/products-export";
import type { BrandRow, CategoryRow, ProductWithJoins } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 50;

type AvailabilityFilter = "" | "in-stock" | "on-order";
type StatusFilter = "" | "active" | "hidden";

export function AdminProductsListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [products, setProducts] = useState<ProductWithJoins[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [sortKey, setSortKey] = useState<ProductSortKey>("position");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<ProductWithJoins | null>(null);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [busyBulk, setBusyBulk] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    Promise.all([listCategories(), listBrands()])
      .then(([cats, brandRows]) => {
        setCategories(cats);
        setBrands(brandRows);
      })
      .catch((err: unknown) => {
        console.error(err);
        toast.error("Не удалось загрузить справочники");
      });
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(handle);
  }, [search]);

  const fetchProducts = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await listProducts({
          search: debouncedSearch || undefined,
          categoryId: categoryId || undefined,
          brandId: brandId || undefined,
          availability: availability || undefined,
          status: status || undefined,
          sortKey,
          sortAsc,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });
        setProducts(result.rows);
        setTotal(result.total);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, categoryId, brandId, availability, status, sortKey, sortAsc, page],
  );

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 whenever the filter/sort shape changes so the user doesn't
  // land on an empty page after narrowing the result set.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, brandId, availability, status, sortKey, sortAsc]);

  // Drop selection of rows no longer present in the current page.
  useEffect(() => {
    setSelected((current) => {
      if (current.size === 0) return current;
      const visible = new Set(products.map((p) => p.id));
      const next = new Set([...current].filter((id) => visible.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(
    debouncedSearch || categoryId || brandId || availability || status,
  );

  function toggleSort(key: ProductSortKey) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === "title" || key === "brand");
    }
  }

  function toggleSelectAll() {
    setSelected((current) =>
      current.size === products.length
        ? new Set()
        : new Set(products.map((p) => p.id)),
    );
  }

  function toggleSelect(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(pendingDelete.id);
      toast.success(`Удалён: ${pendingDelete.title}`);
      setPendingDelete(null);
      await fetchProducts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Не удалось удалить: ${message}`);
    } finally {
      setDeleting(false);
    }
  }

  async function confirmBulkDelete() {
    setDeleting(true);
    try {
      const ids = [...selected];
      await bulkDeleteProducts(ids);
      toast.success(`Удалено: ${ids.length}`);
      setPendingBulkDelete(false);
      setSelected(new Set());
      await fetchProducts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Не удалось удалить: ${message}`);
    } finally {
      setDeleting(false);
    }
  }

  async function handleBulkSetActive(isActive: boolean) {
    setBusyBulk(true);
    try {
      const ids = [...selected];
      await bulkSetProductsActive(ids, isActive);
      toast.success(isActive ? `Показано: ${ids.length}` : `Скрыто: ${ids.length}`);
      setSelected(new Set());
      await fetchProducts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBusyBulk(false);
    }
  }

  async function handleToggleActive(product: ProductWithJoins) {
    try {
      await toggleProductActive(product.id, !product.is_active);
      toast.success(product.is_active ? "Товар скрыт" : "Товар снова виден");
      await fetchProducts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
    }
  }

  async function handleDuplicate(product: ProductWithJoins) {
    try {
      const created = await duplicateProduct(product.id);
      toast.success("Создана копия — открываю для редактирования");
      navigate(`/admin/products/${created.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }

  // Stop row-click navigation when interacting with controls inside the row.
  const stopRowClick = (event: React.MouseEvent | React.PointerEvent) =>
    event.stopPropagation();

  const allSelected = products.length > 0 && selected.size === products.length;

  return (
    <>
      <AdminHeader
        title="Товары"
        description={loading ? "Загрузка…" : `Всего: ${total} позиций`}
        actions={
          <>
            <AdminButton
              variant="outline"
              disabled={exporting}
              onClick={async () => {
                setExporting(true);
                try {
                  await exportProductsToXlsx();
                  toast.success("Выгрузка готова");
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : "Unknown error";
                  toast.error(`Не удалось выгрузить: ${message}`);
                } finally {
                  setExporting(false);
                }
              }}
            >
              <Download className="h-4 w-4" />
              {exporting ? "Готовим…" : "Экспорт XLSX"}
            </AdminButton>
            <AdminButton asChild>
              <Link to="/admin/products/new">
                <Plus className="h-4 w-4" />
                Добавить
              </Link>
            </AdminButton>
          </>
        }
      />

      <main className="p-8">
        <div className="admin-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-admin-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted-fg" />
                <AdminInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Поиск по названию, бренду, артикулу..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                value={categoryId}
                onChange={setCategoryId}
                allLabel="Все категории"
                options={categories.map((c) => ({ value: c.id, label: c.title }))}
              />
              <FilterSelect
                value={brandId}
                onChange={setBrandId}
                allLabel="Все бренды"
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
              />
              <FilterSelect
                value={availability}
                onChange={(v) => setAvailability(v as AvailabilityFilter)}
                allLabel="Любое наличие"
                options={[
                  { value: "in-stock", label: "В наличии" },
                  { value: "on-order", label: "Под заказ" },
                ]}
              />
              <FilterSelect
                value={status}
                onChange={(v) => setStatus(v as StatusFilter)}
                allLabel="Любой статус"
                options={[
                  { value: "active", label: "Виден на сайте" },
                  { value: "hidden", label: "Скрыт" },
                ]}
              />
              {hasFilters ? (
                <AdminButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setCategoryId("");
                    setBrandId("");
                    setAvailability("");
                    setStatus("");
                  }}
                >
                  Сбросить
                </AdminButton>
              ) : null}
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 ? (
            <div className="flex flex-wrap items-center gap-3 border-b border-admin-border bg-primary/5 px-4 py-3 text-sm">
              <span className="font-medium text-foreground">Выбрано: {selected.size}</span>
              <div className="flex flex-wrap items-center gap-2">
                <AdminButton
                  size="sm"
                  variant="outline"
                  disabled={busyBulk}
                  onClick={() => void handleBulkSetActive(true)}
                >
                  <Eye className="h-4 w-4" />
                  Показать
                </AdminButton>
                <AdminButton
                  size="sm"
                  variant="outline"
                  disabled={busyBulk}
                  onClick={() => void handleBulkSetActive(false)}
                >
                  <EyeOff className="h-4 w-4" />
                  Скрыть
                </AdminButton>
                <AdminButton
                  size="sm"
                  variant="outline"
                  disabled={busyBulk}
                  onClick={() => setPendingBulkDelete(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </AdminButton>
                <AdminButton size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                  Снять выделение
                </AdminButton>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="border-b border-admin-border bg-red-50 px-4 py-3 text-sm text-destructive">
              Ошибка: {error}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-admin-bg text-xs font-medium uppercase tracking-wide text-admin-muted-fg">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-primary"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      aria-label="Выбрать все"
                    />
                  </th>
                  <SortableTh
                    label="Товар"
                    active={sortKey === "title"}
                    asc={sortAsc}
                    onClick={() => toggleSort("title")}
                  />
                  <SortableTh
                    label="Бренд"
                    active={sortKey === "brand"}
                    asc={sortAsc}
                    onClick={() => toggleSort("brand")}
                  />
                  <th className="px-4 py-3 text-left">Категория</th>
                  <SortableTh
                    label="Цена"
                    active={sortKey === "price"}
                    asc={sortAsc}
                    onClick={() => toggleSort("price")}
                  />
                  <th className="px-4 py-3 text-left">Статус</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-admin-muted-fg">
                      Загрузка…
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-admin-muted-fg">
                      Ничего не найдено
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isSelected = selected.has(product.id);
                    return (
                      <tr
                        key={product.id}
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                        className={cn(
                          "cursor-pointer hover:bg-admin-bg",
                          isSelected && "bg-primary/5",
                        )}
                      >
                        <td className="px-4 py-3" onClick={stopRowClick}>
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-primary"
                            checked={isSelected}
                            onChange={() => toggleSelect(product.id)}
                            aria-label={`Выбрать ${product.title}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{product.title}</p>
                          <p className="font-mono text-xs text-admin-muted-fg">{product.sku}</p>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {product.brandRef?.name ?? product.brand ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {product.category?.title ?? "—"}
                          {product.subcategory ? (
                            <span className="text-admin-muted-fg"> / {product.subcategory.title}</span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatPriceLabel(product.price)}
                        </td>
                        <td className="px-4 py-3" onClick={stopRowClick}>
                          <div className="flex items-center gap-2">
                            <AdminSwitch
                              checked={product.is_active}
                              onCheckedChange={() => void handleToggleActive(product)}
                              aria-label={product.is_active ? "Скрыть товар" : "Показать товар"}
                            />
                            <span
                              className={`text-xs ${
                                product.is_active ? "text-emerald-700" : "text-admin-muted-fg"
                              }`}
                            >
                              {product.is_active ? "Виден" : "Скрыт"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3" onClick={stopRowClick}>
                          <div className="flex items-center justify-end gap-1">
                            <AdminButton asChild size="icon" variant="ghost">
                              <Link
                                to={`/admin/products/${product.id}`}
                                aria-label={`Редактировать ${product.title}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </AdminButton>
                            <AdminButton
                              size="icon"
                              variant="ghost"
                              onClick={() => void handleDuplicate(product)}
                              aria-label={`Дублировать ${product.title}`}
                              title="Дублировать"
                            >
                              <Copy className="h-4 w-4" />
                            </AdminButton>
                            <AdminButton
                              size="icon"
                              variant="ghost"
                              onClick={() => setPendingDelete(product)}
                              aria-label={`Удалить ${product.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </AdminButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-between gap-3 border-t border-admin-border px-4 py-3 text-sm">
              <span className="text-admin-muted-fg">
                Страница {page} из {totalPages} · показано{" "}
                {products.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                {"–"}
                {(page - 1) * PAGE_SIZE + products.length} из {total}
              </span>
              <div className="flex items-center gap-1">
                <AdminButton
                  variant="outline"
                  size="icon"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  aria-label="Предыдущая страница"
                >
                  <ChevronLeft className="h-4 w-4" />
                </AdminButton>
                <AdminButton
                  variant="outline"
                  size="icon"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  aria-label="Следующая страница"
                >
                  <ChevronRight className="h-4 w-4" />
                </AdminButton>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title="Удалить товар?"
        description={
          pendingDelete ? (
            <>
              «{pendingDelete.title}» и все его характеристики будут удалены без
              возможности восстановления.
            </>
          ) : null
        }
        confirmLabel="Удалить"
        destructive
        busy={deleting}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={pendingBulkDelete}
        onOpenChange={(next) => !next && setPendingBulkDelete(false)}
        title={`Удалить ${selected.size} товаров?`}
        description="Выбранные товары и все их характеристики будут удалены без возможности восстановления."
        confirmLabel="Удалить"
        destructive
        busy={deleting}
        onConfirm={confirmBulkDelete}
      />
    </>
  );
}

// ---------------------------------------------------------------------------

function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function SortableTh({
  label,
  active,
  asc,
  onClick,
}: {
  label: string;
  active: boolean;
  asc: boolean;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground",
          active && "text-foreground",
        )}
      >
        {label}
        {active ? (
          asc ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : null}
      </button>
    </th>
  );
}
