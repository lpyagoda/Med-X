import { Button } from "@/components/ui/Button";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function AboutCTA() {
  return (
    <Section className="pt-8">
      <Container>
        <div className="relative overflow-hidden rounded-[30px] border border-border/70 bg-white px-6 py-10 shadow-[0_26px_80px_rgba(7,55,99,0.08)] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_80%_at_0%_50%,rgba(7,55,99,0.06),transparent_54%),radial-gradient(50%_70%_at_100%_30%,rgba(34,184,207,0.09),transparent_60%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Заявка</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                Нужно подобрать оборудование или запасные части?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Оставьте заявку — менеджер уточнит задачу и поможет подобрать
                подходящие позиции для вашей клиники, кабинета или лаборатории.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <LeadModalTrigger size="lg">
                Оставить заявку
              </LeadModalTrigger>
              <Button href="/catalog" size="lg" variant="outline">
                Перейти в каталог
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
