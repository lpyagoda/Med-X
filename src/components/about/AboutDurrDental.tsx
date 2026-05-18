import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const durrAreas = [
  "Компрессорные системы",
  "Аспирационное оборудование",
  "Гигиена",
  "Диагностика",
] as const;

export function AboutDurrDental() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="relative overflow-hidden rounded-[34px] border border-border/70 bg-[linear-gradient(135deg,#ffffff_0%,#edf9fc_100%)] p-6 shadow-[0_26px_80px_rgba(7,55,99,0.08)] sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="durr-grid pointer-events-none absolute inset-0 opacity-70"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">DÜRR Dental</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Оригинальная продукция DÜRR Dental
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Подберём оборудование и комплектующие немецкого бренда с
                подтверждённым происхождением и документами.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                DÜRR Dental можно использовать как отдельное направление в
                каталоге: компрессорные системы, аспирационное оборудование,
                решения для гигиены, диагностики и сопутствующие позиции бренда.
              </p>
              <Button className="mt-7 w-full sm:w-fit" href="/catalog" size="lg">
                Смотреть ассортимент
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {durrAreas.map((area) => (
                <div
                  className="rounded-[24px] border border-white/80 bg-white/78 p-5 text-base font-semibold text-foreground shadow-[0_18px_48px_rgba(7,55,99,0.06)] backdrop-blur"
                  key={area}
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
