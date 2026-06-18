import type { MetaFunction } from "react-router";
import { RequisitesPage } from "@/pages/legal/RequisitesPage";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/requisites",
    title: "Реквизиты",
    description: "Юридические реквизиты компании МЕД-ИКС.",
  });

export default RequisitesPage;
