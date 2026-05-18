import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

const benefits = [
  {
    title: "Консультация специалиста",
    description:
      "Поможем подобрать оборудование, комплектующие и расходные позиции под задачи вашей клиники.",
  },
  {
    title: "Оригинальная продукция",
    description:
      "В каталоге представлены проверенные позиции для стоматологических кабинетов, клиник и лабораторий.",
  },
  {
    title: "Быстрая поставка",
    description:
      "Уточним наличие, сроки и удобный способ доставки после оформления заявки.",
  },
  {
    title: "Запасные части в каталоге",
    description:
      "Подберём комплектующие и расходные позиции для стоматологического оборудования.",
  },
] as const;

export function AboutBenefits() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <SectionTitle
          description="Менеджер помогает быстро сузить выбор и передать в работу понятную заявку."
          title="Почему с нами удобно работать"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              className="rounded-[30px] border border-border/70 bg-white/78 p-6 shadow-[0_20px_54px_rgba(7,55,99,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              key={benefit.title}
            >
              <span className="mb-10 flex h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,#e7f8fb,#ffffff)]" />
              <h3 className="text-xl font-semibold leading-snug text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted">{benefit.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
