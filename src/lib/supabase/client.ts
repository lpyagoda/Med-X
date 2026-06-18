import { createClient } from "@supabase/supabase-js";

const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY must be set in .env.local");
}

const isBrowser = typeof window !== "undefined";

/**
 * supabase-js requires an absolute http(s) URL — a relative path like "/__sb__"
 * is rejected upfront.
 *
 * - Browser: resolve "/__sb__" against window.location.origin so dev
 *   (localhost:5173 via Vite proxy) and prod (med-ix.ru nginx) both work.
 * - Server (SSR loaders): there is no window, so we need a fully-qualified URL.
 *   It comes from VITE_SUPABASE_SSR_URL (prod: http://127.0.0.1:54321 — the
 *   self-hosted Supabase on localhost; dev: https://med-ix.ru/__sb__).
 */
function resolveSupabaseUrl(): string {
  if (isBrowser) {
    const raw = import.meta.env.VITE_SUPABASE_URL ?? "/__sb__";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `${window.location.origin}${raw.startsWith("/") ? "" : "/"}${raw}`;
  }
  const ssrUrl = import.meta.env.VITE_SUPABASE_SSR_URL;
  if (ssrUrl) return ssrUrl;
  // Sensible default for the production server: Supabase on the same host.
  return "http://127.0.0.1:54321";
}

export const supabase = createClient(resolveSupabaseUrl(), supabaseKey, {
  auth: {
    // Sessions only make sense in the browser; on the server we read public
    // (RLS-anon) data only, so disable all persistence/refresh machinery.
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: false,
    storageKey: "med-x-admin-auth",
  },
});
