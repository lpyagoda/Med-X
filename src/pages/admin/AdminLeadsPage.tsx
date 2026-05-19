import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { toast } from "@/components/admin/ui/toast";
import {
  deleteLead,
  listLeads,
  updateLeadStatus,
  type LeadRow,
  type LeadStatus,
} from "@/lib/admin/leads";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Готово",
  cancelled: "Отменена",
};

const SOURCE_LABELS: Record<string, string> = {
  consultation: "Консультация",
  lead_modal: "Модалка «Оставить заявку»",
  contacts_page: "Страница «Контакты»",
  product_order: "Заявка с товара",
};

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

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<LeadRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        setLeads(await listLeads());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  async function handleStatusChange(lead: LeadRow, status: LeadStatus) {
    try {
      await updateLeadStatus(lead.id, status);
      setLeads((current) =>
        current.map((row) => (row.id === lead.id ? { ...row, status } : row)),
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteLead(pendingDelete.id);
      toast.success("Заявка удалена");
      setLeads((current) => current.filter((row) => row.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <AdminHeader
        title="Заявки"
        description={loading ? "Загрузка…" : `Всего: ${leads.length}`}
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
                  <th className="px-4 py-3 text-left">Дата</th>
                  <th className="px-4 py-3 text-left">Имя</th>
                  <th className="px-4 py-3 text-left">Телефон</th>
                  <th className="px-4 py-3 text-left">Источник</th>
                  <th className="px-4 py-3 text-left">Комментарий</th>
                  <th className="px-4 py-3 text-left">Статус</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {loading && leads.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-admin-muted-fg" colSpan={7}>
                      Загрузка…
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-admin-muted-fg" colSpan={7}>
                      Заявок пока нет
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr className="align-top" key={lead.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-admin-muted-fg">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                      <td className="px-4 py-3 text-foreground">
                        <a
                          className="text-primary hover:underline"
                          href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-admin-muted-fg">
                        {SOURCE_LABELS[lead.source] ?? lead.source}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        <div className="max-w-md whitespace-pre-line break-words text-xs leading-5">
                          {lead.comment || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="h-8 rounded-md border border-admin-border bg-admin-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          onChange={(event) =>
                            void handleStatusChange(lead, event.target.value as LeadStatus)
                          }
                          value={lead.status}
                        >
                          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <AdminButton
                            aria-label="Удалить заявку"
                            onClick={() => setPendingDelete(lead)}
                            size="icon"
                            variant="ghost"
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
        </div>
      </main>

      <ConfirmDialog
        busy={deleting}
        confirmLabel="Удалить"
        description={
          pendingDelete ? <>Заявка от «{pendingDelete.name}» будет удалена.</> : null
        }
        destructive
        onConfirm={confirmDelete}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        open={pendingDelete !== null}
        title="Удалить заявку?"
      />
    </>
  );
}
