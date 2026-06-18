import type { MetaFunction } from "react-router";
import { PrivacyPage } from "@/pages/legal/PrivacyPage";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/privacy",
    title: "Политика конфиденциальности",
    description: "Политика конфиденциальности и обработки персональных данных МЕД-ИКС.",
  });

export default PrivacyPage;
