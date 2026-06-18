import type { MetaFunction } from "react-router";
import { PersonalDataPage } from "@/pages/legal/PersonalDataPage";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/personal-data",
    title: "Согласие на обработку персональных данных",
    description: "Условия обработки персональных данных пользователей сайта МЕД-ИКС.",
  });

export default PersonalDataPage;
