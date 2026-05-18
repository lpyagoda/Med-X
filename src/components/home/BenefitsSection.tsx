import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

function IconHeadset() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconShieldCheck() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect height="13" rx="1" width="15" x="1" y="3" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-primary transition-transform duration-500 ease-in-out group-hover:rotate-[30deg]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const benefits = [
  {
    title: "Консультация специалиста",
    description:
      "Поможем подобрать оборудование под задачу клиники, уточнить характеристики, стоимость и условия заказа.",
    icon: <IconHeadset />,
  },
  {
    title: "Оригинальная продукция",
    description:
      "Поставляем оригинальные изделия DÜRR Dental и других производителей с подтверждёнными документами.",
    icon: <IconShieldCheck />,
  },
  {
    title: "Быстрая поставка",
    description:
      "Для позиций в наличии — оперативное согласование заявки и отгрузка в короткие сроки.",
    icon: <IconTruck />,
  },
  {
    title: "Запасные части в каталоге",
    description:
      "В каталоге представлено крупное оборудование, комплектующие, расходные позиции и запчасти.",
    icon: <IconSettings />,
  },
];

export function BenefitsSection() {
  return (
    <Section>
      <Container>
        <SectionTitle title="Почему с нами удобно работать" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              className="group rounded-[30px] border border-border/80 bg-white/78 p-6 shadow-[0_20px_54px_rgba(7,55,99,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_28px_64px_rgba(7,55,99,0.10)]"
              key={benefit.title}
            >
              <span className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/80 shadow-sm backdrop-blur-sm">
                {benefit.icon}
              </span>
              <h3 className="text-xl font-semibold leading-snug text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
