import { Link, useLocation } from "react-router-dom";
import {
  ClipboardList,
  FolderTree,
  Inbox,
  Package,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Package;
};

const navItems: NavItem[] = [
  { to: "/admin/products", label: "Товары", icon: Package },
  { to: "/admin/products/import", label: "Импорт Excel", icon: Upload },
  { to: "/admin/categories", label: "Категории", icon: FolderTree },
  { to: "/admin/orders", label: "Заказы", icon: ClipboardList },
  { to: "/admin/leads", label: "Заявки", icon: Inbox },
];

function isActive(currentPath: string, item: NavItem): boolean {
  if (currentPath !== item.to && !currentPath.startsWith(`${item.to}/`)) {
    return false;
  }
  // Don't light up a parent when a deeper sibling already matches.
  const moreSpecific = navItems.some(
    (other) =>
      other !== item &&
      other.to.startsWith(`${item.to}/`) &&
      (currentPath === other.to || currentPath.startsWith(`${other.to}/`)),
  );
  return !moreSpecific;
}

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-admin-sidebar-border bg-admin-sidebar">
      <div className="flex h-16 items-center px-5">
        <span className="text-lg font-bold tracking-wide text-primary">MED-IX</span>
        <span className="ml-2 rounded-md bg-admin-sidebar-active px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Админ навигация">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(location.pathname, item);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn("admin-sidebar-nav-item", active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-admin-sidebar-border px-5 py-4 text-xs text-admin-muted-fg">
        Med-X &middot; v0.1
      </div>
    </aside>
  );
}
