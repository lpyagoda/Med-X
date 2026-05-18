import Link from "next/link";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const heroBenefits = [
  {
    title: "Подбор оборудования",
    description:
      "Поможем выбрать подходящие позиции для клиники, кабинета или лаборатории.",
  },
  {
    title: "Запасные части",
    description: "Сориентируем по комплектующим и расходным позициям.",
  },
  {
    title: "DÜRR Dental",
    description: "Подскажем по оригинальной продукции и решениям бренда.",
  },
] as const;

const requestSteps = [
  {
    title: "Вы оставляете заявку",
    description: "Указываете имя, телефон и коротко описываете задачу.",
  },
  {
    title: "Менеджер уточняет детали",
    description:
      "Разбираемся, какое оборудование, запчасти или расходные позиции нужны.",
  },
  {
    title: "Подбираем решение",
    description:
      "Сориентируем по характеристикам, стоимости и доступным вариантам.",
  },
  {
    title: "Согласовываем заказ",
    description:
      "Уточняем оплату, сроки поставки и удобный способ доставки.",
  },
] as const;

const contactCardClass =
  "rounded-[26px] border border-border/70 bg-white/78 p-5 shadow-[0_18px_48px_rgba(7,55,99,0.06)] backdrop-blur";
const labelClass = "text-xs font-semibold uppercase tracking-[0.14em] text-muted";
const valueClass = "mt-4 text-lg font-semibold leading-snug text-foreground";
const noteClass = "mt-3 text-sm leading-6 text-muted";

export default function ContactsPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pb-8 pt-24 sm:pb-8 sm:pt-28 lg:pb-10 lg:pt-28">
        <Container>
          <div className="relative overflow-hidden rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,#ffffff_0%,#eef9fc_58%,#f8fcff_100%)] p-6 shadow-[0_28px_84px_rgba(7,55,99,0.08)] sm:p-8 lg:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(34,184,207,0.14),transparent_36%),radial-gradient(circle_at_15%_90%,rgba(7,55,99,0.07),transparent_30%)]"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              {/* Left */}
              <div>
                <p className="text-sm font-semibold text-primary">Контакты</p>
                <h1 className="mt-4 text-3xl font-semibold leading-[1.06] text-foreground sm:text-4xl lg:text-5xl">
                  Свяжитесь с нами — поможем подобрать оборудование под вашу
                  задачу
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                  Оставьте заявку или свяжитесь с менеджером в Telegram / MAX.
                  Уточним нужную позицию, стоимость, сроки поставки и условия
                  заказа.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {heroBenefits.map((b) => (
                    <div
                      className="rounded-2xl border border-white/80 bg-white/70 px-4 py-4 backdrop-blur-sm"
                      key={b.title}
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {b.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted">
                        {b.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — form */}
              <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_20px_58px_rgba(7,55,99,0.08)] backdrop-blur sm:p-8">
                <p className="text-sm font-semibold text-primary">
                  Быстрая заявка
                </p>
                <h2 className="mt-2 text-xl font-semibold leading-snug text-foreground">
                  Опишите, что нужно подобрать
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Менеджер свяжется и уточнит детали.
                </p>
                <div className="mt-6">
                  <ConsultationForm />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contacts */}
      <Section className="py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">Связь</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Как с нами связаться
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Выберите удобный способ связи или оставьте заявку через форму.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Телефон */}
            <article className={contactCardClass}>
              <p className={labelClass}>Телефон</p>
              <div className="mt-4 flex flex-col gap-1">
                <Link
                  className="text-lg font-semibold leading-snug text-foreground transition-colors hover:text-primary"
                  href="tel:+79821981521"
                >
                  +7 982 198-15-21
                </Link>
                <Link
                  className="text-lg font-semibold leading-snug text-foreground transition-colors hover:text-primary"
                  href="tel:+79180844462"
                >
                  +7 918 084-44-62
                </Link>
              </div>
              <p className={noteClass}>Для консультаций и заявок</p>
            </article>

            {/* Мессенджеры */}
            <article className={contactCardClass}>
              <p className={labelClass}>Мессенджеры</p>
              <p className={valueClass}>Telegram / MAX</p>
              <p className={noteClass}>Удобный способ для быстрой связи</p>
            </article>

            {/* Почта */}
            <article className={contactCardClass}>
              <p className={labelClass}>Почта</p>
              <Link
                className="mt-4 block text-lg font-semibold leading-snug text-foreground transition-colors hover:text-primary"
                href="mailto:Rada-Med-X@yandex.ru"
              >
                Rada-Med-X@yandex.ru
              </Link>
              <p className={noteClass}>Для коммерческих запросов</p>
            </article>

            {/* Режим работы */}
            <article className={contactCardClass}>
              <p className={labelClass}>Режим работы</p>
              <div className="mt-4">
                <p className="text-lg font-semibold leading-snug text-foreground">
                  10:00–19:00
                </p>
                <p className="mt-1 text-sm font-medium text-muted">
                  Сб–Вс — выходные
                </p>
              </div>
              <p className={noteClass}>Заявки с сайта принимаются круглосуточно</p>
            </article>
          </div>
        </Container>
      </Section>

      {/* Steps */}
      <Section className="py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold text-primary">Процесс</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Как обрабатывается заявка
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {requestSteps.map((step, index) => (
              <article
                className="rounded-[28px] border border-border/70 bg-white/80 p-6 shadow-[0_20px_58px_rgba(7,55,99,0.06)] backdrop-blur"
                key={step.title}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_13%,white)] text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl font-semibold leading-snug text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
