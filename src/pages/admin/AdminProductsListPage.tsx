import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { AdminInput } from "@/components/admin/ui/input";
import { AdminSwitch } from "@/components/admin/ui/switch";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { toast } from "@/components/admin/ui/toast";
import { listCategories } from "@/lib/admin/categories";
import { formatPriceLabel } from "@/lib/admin/price";
import {
  deleteProduct,
  listProducts,
  toggleProductActive,
} from "@/lib/admin/products";
import { exportProductsToXlsx } from "@/lib/admin/products-export";
import type { CategoryRow, ProductWithJoins } from "@/lib/admin/types";

const PAGE_SIZE = 50;

export function AdminProductsListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductWithJoins[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ProductWithJoins | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err: unknown) => {
        console.error(err);
        toast.error("Не удалось загрузить категории");
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
    [debouncedSearch, categoryId, page],
  );

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 whenever the filter shape changes so the user doesn't
  // land on an empty page after narrowing the result set.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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

  // Stop row-click navigation when the user interacts with controls inside the row
  const stopRowClick = (event: React.MouseEvent | React.PointerEvent) =>
    event.stopPropagation();

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
          <div className="flex flex-col gap-3 border-b border-admin-border p-4 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted-fg" />
              <AdminInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по названию, бренду, артикулу..."
                className="pl-9"
              />
            </div>

            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-10 rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="border-b border-admin-border bg-red-50 px-4 py-3 text-sm text-destructive">
              Ошибка: {error}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-admin-bg text-xs font-medium uppercase tracking-wide text-admin-muted-fg">
                <tr>
                  <th className="px-4 py-3 text-left">Товар</th>
                  <th className="px-4 py-3 text-left">Бренд</th>
                  <th className="px-4 py-3 text-left">Категория</th>
                  <th className="px-4 py-3 text-left">Цена</th>
                  <th className="px-4 py-3 text-left">Статус</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-admin-muted-fg">
                      Загрузка…
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-admin-muted-fg">
                      Ничего не найдено
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => navigate(`/admin/products/${product.id}`)}
                      className="cursor-pointer hover:bg-admin-bg"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{product.title}</p>
                        <p className="font-mono text-xs text-admin-muted-fg">
                          {product.sku}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-foreground">{product.brand || "—"}</td>
                      <td className="px-4 py-3 text-foreground">
                        {product.category?.title ?? "—"}
                        {product.subcategory ? (
                          <span className="text-admin-muted-fg">
                            {" "}
                            / {product.subcategory.title}
                          </span>
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
                              product.is_active
                                ? "text-emerald-700"
                                : "text-admin-muted-fg"
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
                            onClick={() => setPendingDelete(product)}
                            aria-label={`Удалить ${product.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </AdminButton>
                        </div>
                      </td>
                    </tr>
                  ))
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
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
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
    </>
  );
}
