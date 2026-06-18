import path from "node:path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";

// In dev we forward /__sb__/* to the prod nginx, which proxies to its local Supabase.
// In prod the SSR server is fronted by the same nginx vhost, so the relative path resolves natively.
const DEV_SUPABASE_PROXY_TARGET = "http://188.225.86.146:3030";

export default defineConfig({
  // tailwind must run before reactRouter so its generated CSS is picked up by the route CSS graph.
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
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
});
