import type { MetaFunction } from "react-router";
import { AboutPage } from "@/pages/AboutPage";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/about",
    title: "О компании — поставщик стоматологического оборудования",
    description:
      "МЕД-ИКС — поставщик стоматологического оборудования и расходников с инженерной поддержкой. Официальные бренды, сервис и подбор под задачи клиник и лабораторий.",
  });

export default AboutPage;
