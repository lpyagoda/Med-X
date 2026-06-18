import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders its children only after hydration on the client. Used to keep the
 * admin panel out of SSR entirely — it has no SEO value and relies on
 * browser-only APIs (auth session, storage, file APIs). The children are passed
 * as a function so they are never evaluated on the server.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: () => ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children() : fallback}</>;
}
