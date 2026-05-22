import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const steps = [
  {
    num: "01",
    title: "Тип оборудования",
    description: "Уточняем, с какой техникой нужна помощь.",
  },
  {
    num: "02",
    title: "Задача клиники",
    description: "Установка, настройка, диагностика или ремонт.",
  },
  {
    num: "03",
    title: "Профиль специалиста",
    description: "Подсказываем инженера под конкретное направление.",
  },
  {
    num: "04",
    title: "Дальнейшие шаги",
    description: "Помогаем понять, что подготовить перед обращением.",
  },
] as const;

const engineerImage = "/images/engineer-service.png";

export function AboutEngineers() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="grid gap-4 lg:grid-cols-[45fr_55fr]">

          {/* Left card — text */}
          <div className="flex flex-col justify-center rounded-[34px] border border-border/70 bg-[linear-gradient(135deg,#ffffff_0%,#eef9fc_100%)] p-6 shadow-[0_24px_72px_rgba(7,55,99,0.08)] sm:p-8 lg:p-12">
            <p className="w-fit rounded-full border border-accent/20 bg-[color-mix(in_srgb,var(--accent)_10%,white)] px-4 py-2 text-sm font-semibold text-primary">
              Инженеры
            </p>

            <h2 className="mt-5 text-3xl font-semibold leading-[1.08] text-foreground sm:text-4xl lg:text-5xl">
              Проверенные инженеры под конкретное оборудование
            </h2>

            <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Если потребуется установка, настройка, диагностика или ремонт
              оборудования, подскажем профильных специалистов под ваш тип
              техники.
            </p>

            <p className="mt-4 text-base leading-7 text-muted">
              Помогаем сориентироваться, к кому обратиться по стоматологическим
              установкам, компрессорам, рентген-оборудованию, наконечникам,
              стерилизационному оборудованию и другим направлениям.
            </p>

            <div className="mt-8">
              <LeadModalTrigger size="lg" className="w-full sm:w-fit">
                Получить консультацию
              </LeadModalTrigger>
            </div>
          </div>

          {/* Right card — photo only */}
          <div className="relative min-h-[280px] overflow-hidden rounded-[34px] border border-border/70 shadow-[0_24px_72px_rgba(7,55,99,0.10)] sm:min-h-[400px] lg:min-h-0">
            <img
              alt="Техническое обслуживание стоматологического оборудования"
              className="absolute inset-0 h-full w-full object-cover object-center"
              src={engineerImage}
            />
          </div>

        </div>
      </Container>
    </Section>
  );
}
