import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { status } = useAdminAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="admin-scope flex min-h-screen items-center justify-center text-sm text-admin-muted-fg">
        Проверка сессии…
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
