import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

const directions = [
  {
    title: "Стоматологическое оборудование",
    description:
      "Установки, компрессоры, аспирационные системы, рентген-оборудование и другие решения для оснащения кабинета.",
  },
  {
    title: "Запасные части",
    description:
      "Комплектующие для замены, ремонта, дооснащения и обслуживания стоматологического оборудования.",
  },
  {
    title: "Расходные материалы",
    description: "Позиции для регулярной работы клиник, кабинетов и лабораторий.",
  },
  {
    title: "Стерилизация и дезинфекция",
    description:
      "Оборудование и средства для обработки инструментов, поверхностей и рабочих зон.",
  },
] as const;

export function AboutDirections() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <SectionTitle title="Что можно заказать" />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {directions.map((direction, index) => (
            <article
              className="rounded-[30px] border border-border/70 bg-white/80 p-6 shadow-[0_20px_58px_rgba(7,55,99,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:p-7"
              key={direction.title}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_13%,white)] text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-7 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {direction.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-muted">
                {direction.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
