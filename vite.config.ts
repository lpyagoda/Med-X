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
  build: {
    // Target modern browsers — smaller output, no legacy transforms
    target: "es2020",
    // Split CSS per chunk to avoid loading all styles upfront
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — cached separately from app code
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }
          // Supabase client — heavy, only needed when admin or catalogue fetches fire
          if (id.includes("node_modules/@supabase/")) {
            return "vendor-supabase";
          }
          // xlsx — very heavy (~1 MB), keep isolated; admin import page loads it lazily
          if (id.includes("node_modules/xlsx")) {
            return "vendor-xlsx";
          }
          // Radix UI primitives — shared by public + admin but separate from react core
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
        },
      },
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
