import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In dev we forward /__sb__/* to the server's nginx, which proxies to its local Supabase.
// In prod the SPA is served from the same nginx vhost, so the relative path resolves natively.
const DEV_SUPABASE_PROXY_TARGET = "http://188.225.86.146:3030";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/__sb__": {
        target: DEV_SUPABASE_PROXY_TARGET,
        changeOrigin: true,
        ws: true,
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
    proxy: {
      "/__sb__": {
        target: DEV_SUPABASE_PROXY_TARGET,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
