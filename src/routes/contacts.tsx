import type { MetaFunction } from "react-router";
import { ContactsPage } from "@/pages/ContactsPage";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/contacts",
    title: "Контакты — телефон, e-mail и реквизиты",
    description:
      "Контакты МЕД-ИКС: телефоны, e-mail и реквизиты для заказа стоматологического оборудования и расходных материалов. Консультация и подбор — поможем с выбором.",
  });

export default ContactsPage;
