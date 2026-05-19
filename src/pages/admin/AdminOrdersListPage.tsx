import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  listOrders,
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

const TYPE_LABELS = {
  cart: "Корзина",
  quick: "В 1 клик",
} as const;

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function formatTotal(value: OrderRow["total"]): string {
  if (value == null) return "—";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num) || num <= 0) return "—";
  return `${num.toLocaleString("ru-RU")} ₽`;
}

export function AdminOrdersListPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        setOrders(await listOrders());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <AdminHeader
        title="Заказы"
        description={loading ? "Загрузка…" : `Всего: ${orders.length}`}
      />

      <main className="p-8">
        <div className="admin-card overflow-hidden">
          {error ? (
            <div className="border-b border-admin-border bg-red-50 px-4 py-3 text-sm text-destructive">
              Ошибка: {error}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-admin-bg text-xs font-medium uppercase tracking-wide text-admin-muted-fg">
                <tr>
                  <th className="px-4 py-3 text-left">№</th>
                  <th className="px-4 py-3 text-left">Дата</th>
                  <th className="px-4 py-3 text-left">Клиент</th>
                  <th className="px-4 py-3 text-left">Телефон</th>
                  <th className="px-4 py-3 text-left">Тип</th>
                  <th className="px-4 py-3 text-left">Позиций</th>
                  <th className="px-4 py-3 text-left">Сумма</th>
                  <th className="px-4 py-3 text-left">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {loading && orders.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-admin-muted-fg" colSpan={8}>
                      Загрузка…
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-admin-muted-fg" colSpan={8}>
                      Заказов пока нет
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      className="cursor-pointer hover:bg-admin-bg"
                      key={order.id}
                      onClick={() => {
                        window.location.assign(`/admin/orders/${order.id}`);
                      }}
                    >
                      <td className="px-4 py-3 font-mono text-foreground">
                        <Link
                          className="hover:underline"
                          onClick={(event) => event.stopPropagation()}
                          to={`/admin/orders/${order.id}`}
                        >
                          № {order.number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-admin-muted-fg">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-3 text-foreground">{order.customer_phone}</td>
                      <td className="px-4 py-3 text-admin-muted-fg">
                        {TYPE_LABELS[order.type] ?? order.type}
                      </td>
                      <td className="px-4 py-3 text-foreground">{order.items_count}</td>
                      <td className="px-4 py-3 text-foreground">{formatTotal(order.total)}</td>
                      <td className="px-4 py-3">{STATUS_LABELS[order.status] ?? order.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
