import { ExternalLink, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type AdminHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  const { user, signOut } = useAdminAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-admin-border bg-admin-surface/95 px-8 backdrop-blur">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="truncate text-xs text-admin-muted-fg">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-admin-border bg-admin-surface px-3 text-xs font-medium text-foreground transition-colors hover:bg-admin-bg"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Открыть сайт
        </Link>

        <div className="flex h-9 items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-3 text-xs">
          <span className="text-admin-muted-fg">{user?.email ?? "—"}</span>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-1 text-admin-muted-fg transition-colors hover:text-destructive"
            aria-label="Выйти"
          >
            <LogOut className="h-3.5 w-3.5" />
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
