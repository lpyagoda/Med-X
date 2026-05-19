import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { toast } from "@/components/admin/ui/toast";
import {
  deleteOrder,
  getOrderWithItems,
  updateOrderStatus,
  type OrderItemRow,
  type OrderRow,
  type OrderStatus,
} from "@/lib/admin/orders";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  paid: "Оплачен",
  shipped: "Отгружен",
  done: "Завершён",
  cancelled: "Отменён",
};

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString("ru-RU");
  } catch {
    return value;
  }
}

function formatPrice(value: number | string | null): string {
  if (value == null) return "—";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "—";
  return `${num.toLocaleString("ru-RU")} ₽`;
}

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleting, setConfirmDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderWithItems(id)
      .then(({ order, items }) => {
        setOrder(order);
        setItems(items);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    try {
      await updateOrderStatus(order.id, status);
      setOrder({ ...order, status });
      toast.success("Статус обновлён");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function confirmDelete() {
    if (!order) return;
    setDeleting(true);
    try {
      await deleteOrder(order.id);
      toast.success("Заказ удалён");
      window.location.assign("/admin/orders");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      setDeleting(false);
    }
  }

  if (error) {
    return (
      <>
        <AdminHeader title="Ошибка" />
        <main className="p-8">
          <div className="admin-card p-6 text-sm text-destructive">{error}</div>
        </main>
      </>
    );
  }

  if (loading || !order) {
    return (
      <>
        <AdminHeader title="Загрузка…" />
        <main className="p-8">
          <div className="admin-card p-10 text-center text-sm text-admin-muted-fg">
            Загрузка…
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title={`Заказ № ${order.number}`}
        description={`Создан ${formatDate(order.created_at)}`}
        actions={
          <>
            <AdminButton asChild variant="outline">
              <Link to="/admin/orders">
                <ArrowLeft className="h-4 w-4" />К списку
              </Link>
            </AdminButton>
            <select
              className="h-9 rounded-md border border-admin-border bg-admin-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) =>
                void handleStatusChange(event.target.value as OrderStatus)
              }
              value={order.status}
            >
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <AdminButton
              onClick={() => setConfirmDeleting(true)}
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
              Удалить
            </AdminButton>
          </>
        }
      />

      <main className="space-y-6 p-8">
        <section className="admin-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Клиент</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-admin-muted-fg">Имя</dt>
              <dd className="text-sm font-medium text-foreground">{order.customer_name}</dd>
            </div>
            <div>
              <dt className="text-xs text-admin-muted-fg">Телефон</dt>
              <dd className="text-sm font-medium text-foreground">
                <a
                  className="text-primary hover:underline"
                  href={`tel:${order.customer_phone.replace(/[^+\d]/g, "")}`}
                >
                  {order.customer_phone}
                </a>
              </dd>
            </div>
            {order.customer_email ? (
              <div>
                <dt className="text-xs text-admin-muted-fg">Email</dt>
                <dd className="text-sm font-medium text-foreground">{order.customer_email}</dd>
              </div>
            ) : null}
            {order.delivery_address ? (
              <div>
                <dt className="text-xs text-admin-muted-fg">Адрес</dt>
                <dd className="text-sm font-medium text-foreground">{order.delivery_address}</dd>
              </div>
            ) : null}
            {order.comment ? (
              <div className="sm:col-span-2">
                <dt className="text-xs text-admin-muted-fg">Комментарий</dt>
                <dd className="whitespace-pre-line text-sm text-foreground">{order.comment}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="admin-card overflow-hidden">
          <div className="border-b border-admin-border p-4">
            <h2 className="text-sm font-semibold text-foreground">
              Позиции · {items.length}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-admin-bg text-xs font-medium uppercase tracking-wide text-admin-muted-fg">
                <tr>
                  <th className="px-4 py-3 text-left">Товар</th>
                  <th className="px-4 py-3 text-left">Кол-во</th>
                  <th className="px-4 py-3 text-left">Цена</th>
                  <th className="px-4 py-3 text-left">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-admin-muted-fg" colSpan={4}>
                      Позиций нет
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const unit = item.unit_price == null ? null : Number(item.unit_price);
                    const total = unit != null ? unit * item.quantity : null;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.product_image ? (
                              <img
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-md object-contain"
                                src={item.product_image}
                              />
                            ) : null}
                            <div>
                              <p className="font-medium text-foreground">
                                {item.product_slug ? (
                                  <Link
                                    className="hover:underline"
                                    to={`/product/${item.product_slug}`}
                                    target="_blank"
                                  >
                                    {item.product_title}
                                  </Link>
                                ) : (
                                  item.product_title
                                )}
                              </p>
                              {item.price_label ? (
                                <p className="text-xs text-admin-muted-fg">
                                  {item.price_label}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground">{item.quantity}</td>
                        <td className="px-4 py-3 text-foreground">{formatPrice(unit)}</td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {formatPrice(total)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {order.total != null ? (
                <tfoot>
                  <tr className="border-t border-admin-border bg-admin-bg">
                    <td className="px-4 py-3 text-right font-semibold text-foreground" colSpan={3}>
                      Итого
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </section>
      </main>

      <ConfirmDialog
        busy={deleting}
        confirmLabel="Удалить"
        description={<>Заказ № {order.number} будет удалён без возможности восстановления.</>}
        destructive
        onConfirm={confirmDelete}
        onOpenChange={(next) => !next && setConfirmDeleting(false)}
        open={confirmDeleting}
        title="Удалить заказ?"
      />
    </>
  );
}
