import type { Config } from "@react-router/dev/config";

export default {
  // Source lives in src/, not the framework default app/.
  appDirectory: "src",
  // Server-side rendering — the whole point of this migration (SEO for Yandex/Google).
  ssr: true,
} satisfies Config;
