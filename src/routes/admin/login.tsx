import type { MetaFunction } from "react-router";
import { ClientOnly } from "@/components/util/ClientOnly";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";

export const meta: MetaFunction = () => [
  { title: "Вход в админку — МЕД-ИКС" },
  { name: "robots", content: "noindex, nofollow" },
];

export default function AdminLoginRoute() {
  return <ClientOnly>{() => <AdminLoginPage />}</ClientOnly>;
}
