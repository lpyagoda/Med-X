import { Link } from "react-router-dom";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { BANK_DETAILS, LEGAL_ENTITY, SITE } from "@/lib/legal";
import {
  EMAIL,
  PRIMARY_PHONE,
  SECONDARY_PHONE,
  WORK_HOURS,
} from "@/lib/contacts";

type Row = { label: string; value: string; href?: string };

const requisiteRows: Row[] = [
  { label: "Наименование", value: LEGAL_ENTITY.name },
  { label: "ИНН", value: LEGAL_ENTITY.inn },
  { label: "ОГРНИП", value: LEGAL_ENTITY.ogrnip },
  { label: "Юридический адрес", value: LEGAL_ENTITY.address },
];

const bankRows: Row[] = [
  { label: "Расчётный счёт", value: BANK_DETAILS.account },
  { label: "Банк", value: BANK_DETAILS.bankName },
  { label: "БИК", value: BANK_DETAILS.bik },
  { label: "Корреспондентский счёт", value: BANK_DETAILS.correspondentAccount },
];

const contactRows: Row[] = [
  { label: "Телефон", value: PRIMARY_PHONE.label, href: PRIMARY_PHONE.href },
  { label: "Доп. телефон", value: SECONDARY_PHONE.label, href: SECONDARY_PHONE.href },
  { label: "Email", value: EMAIL.label, href: EMAIL.href },
  {
    label: "Сайт",
    value: SITE.domain,
    href: SITE.url,
  },
  { label: "Режим работы", value: `${WORK_HOURS.hours}. ${WORK_HOURS.weekend}` },
];

function DetailList({ rows, title }: { rows: Row[]; title: string }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <dl className="mt-4 divide-y divide-border/60 rounded-2xl border border-border/60 bg-white/80">
        {rows.map((row) => (
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr] sm:gap-4" key={row.label}>
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="text-sm font-medium break-all text-foreground">
              {row.href ? (
                <a className="hover:text-primary" href={row.href}>
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function RequisitesPage() {
  return (
    <LegalLayout
      badge="Реквизиты"
      description="Юридическая и платёжная информация для договоров и счетов."
      title="Реквизиты"
    >
      <DetailList rows={requisiteRows} title="Реквизиты ИП" />
      <DetailList rows={bankRows} title="Банковские реквизиты" />
      <DetailList rows={contactRows} title="Контакты" />

      <p className="text-sm leading-6 text-muted">
        Документы для контрагентов и счета на оплату можно запросить у менеджера —{" "}
        <Link className="font-semibold text-primary hover:underline" to="/contacts">
          раздел «Контакты»
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
