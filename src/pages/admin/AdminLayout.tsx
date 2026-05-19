import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminLayout() {
  return (
    <div className="admin-scope flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
