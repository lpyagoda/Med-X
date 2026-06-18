import type { MetaFunction } from "react-router";
import { ClientOnly } from "@/components/util/ClientOnly";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminLayout } from "@/pages/admin/AdminLayout";

export const meta: MetaFunction = () => [
  { title: "Админка — МЕД-ИКС" },
  { name: "robots", content: "noindex, nofollow" },
];

function AdminLoading() {
  return (
    <div className="admin-scope flex min-h-screen items-center justify-center text-sm text-admin-muted-fg">
      Загрузка…
    </div>
  );
}

export default function AdminLayoutRoute() {
  return (
    <ClientOnly fallback={<AdminLoading />}>
      {() => (
        <RequireAdmin>
          <AdminLayout />
        </RequireAdmin>
      )}
    </ClientOnly>
  );
}
