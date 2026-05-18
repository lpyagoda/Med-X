import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const cards = [
  {
    id: "01",
    title: "Установка оборудования",
    description:
      "Подскажем специалистов для подключения и первичной настройки оборудования в кабинете или лаборатории.",
  },
  {
    id: "02",
    title: "Диагностика неисправностей",
    description:
      "Поможем найти инженера, который сможет определить причину сбоя и предложить решение.",
  },
  {
    id: "03",
    title: "Замена комплектующих",
    description:
      "Сориентируем по специалистам для замены деталей, узлов и расходных элементов оборудования.",
  },
  {
    id: "04",
    title: "Настройка и обслуживание",
    description:
      "Подскажем профильных инженеров для настройки оборудования и планового технического обслуживания.",
  },
] as const;

export function AboutEngineers() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="grid gap-8 rounded-[34px] border border-border/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(7,55,99,0.07)] backdrop-blur sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:p-10">

          <div>
            <p className="text-sm font-semibold text-primary">Техническая поддержка</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Проверенные инженеры под конкретное оборудование
            </h2>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Если потребуется установка, настройка, диагностика или ремонт
              оборудования, подскажем профильных специалистов под ваш тип
              техники и задачу.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Поможем сориентироваться, к кому обратиться по вопросам
              подключения, обслуживания, замены комплектующих или диагностики
              неисправностей.
            </p>
            <div className="mt-8">
              <LeadModalTrigger size="lg">
                Получить консультацию
              </LeadModalTrigger>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <div
                className="rounded-2xl border border-border/60 bg-card-soft p-5 transition-colors hover:bg-white"
                key={card.id}
              >
                <p className="text-xs font-semibold text-primary/60">{card.id}</p>
                <p className="mt-3 text-base font-semibold leading-snug text-foreground">
                  {card.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </Section>
  );
}
