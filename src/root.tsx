import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LeadModalProvider } from "@/contexts/LeadModalContext";
import { AdminToaster } from "@/components/admin/ui/toast";
import { buildMeta } from "@/lib/seo";
import stylesheet from "@/styles/globals.css?url";

export const links: LinksFunction = () => [
  // SVG favicon first so modern browsers pick the crisp vector version.
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=2" },
  { rel: "icon", href: "/favicon.ico?v=2", sizes: "any" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700&family=Wix+Madefor+Text:wght@400;500;600;700&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

// Site-wide default head; per-route `meta` exports override these.
export const meta: MetaFunction = () => buildMeta({ pathname: "/" });

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <LeadModalProvider>
          <AdminToaster />
          <Outlet />
        </LeadModalProvider>
      </CartProvider>
    </AdminAuthProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const title = is404 ? "Страница не найдена" : "Что-то пошло не так";
  const message = is404
    ? "Возможно, ссылка устарела или товар снят с публикации."
    : "Мы уже разбираемся. Попробуйте обновить страницу или вернуться на главную.";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-bold text-primary">{is404 ? "404" : "500"}</p>
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="max-w-md text-muted">{message}</p>
      <a
        href="/"
        className="mt-2 inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white"
      >
        На главную
      </a>
    </main>
  );
}
