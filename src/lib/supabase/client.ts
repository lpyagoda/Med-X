import { createClient } from "@supabase/supabase-js";

const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const rawUrl = import.meta.env.VITE_SUPABASE_URL ?? "/__sb__";

if (!supabaseKey) {
  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY must be set in .env.local");
}

// supabase-js requires an absolute http(s) URL. A relative path like "/__sb__"
// is rejected upfront. Resolve against window.location.origin in the browser
// so dev (localhost:5173) and prod (188.225.86.146:3040) both work — the
// nginx vhost and the Vite dev proxy both serve the /__sb__/ prefix.
const supabaseUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
  ? rawUrl
  : `${window.location.origin}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "med-x-admin-auth",
  },
});
