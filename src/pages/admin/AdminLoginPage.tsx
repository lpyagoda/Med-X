import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/button";
import { AdminInput } from "@/components/admin/ui/input";
import { AdminLabel } from "@/components/admin/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type LocationState = { from?: string };

export function AdminLoginPage() {
  const { status, signIn } = useAdminAuth();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated") {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
    }
  }

  return (
    <div className="admin-scope flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-wide text-primary">MED-IX</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-admin-muted-fg">
            Админ-панель
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-card space-y-4 p-6"
          aria-describedby={error ? "login-error" : undefined}
        >
          <div className="space-y-1.5">
            <AdminLabel htmlFor="email">Email</AdminLabel>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted-fg" />
              <AdminInput
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="pl-9"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <AdminLabel htmlFor="password">Пароль</AdminLabel>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted-fg" />
              <AdminInput
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="pl-9"
                disabled={submitting}
              />
            </div>
          </div>

          {error ? (
            <p id="login-error" className="text-xs text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <AdminButton type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Входим…" : "Войти"}
          </AdminButton>
        </form>

        <p className="mt-4 text-center text-xs text-admin-muted-fg">
          Если забыли пароль — пересоздайте через <code>deploy/seed-admin.sh</code>
        </p>
      </div>
    </div>
  );
}
