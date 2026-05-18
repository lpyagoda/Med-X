import { Container } from "@/components/ui/Container";
import { MagneticLeadModalTrigger } from "@/components/forms/MagneticLeadModalTrigger";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Section } from "@/components/ui/Section";
import { CtaParticleCanvas } from "@/components/home/CtaParticleCanvas";

export function HomeCTA() {
  return (
    <Section className="pt-0">
      <Container>
        <div className="relative overflow-hidden rounded-[30px] border border-border/70 bg-white px-6 py-14 text-center shadow-[0_26px_80px_rgba(7,55,99,0.08)] sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <CtaParticleCanvas className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(65%_88%_at_50%_-20%,rgba(7,55,99,0.1),transparent_54%),radial-gradient(42%_60%_at_50%_-8%,rgba(34,184,207,0.1),transparent_62%)]"
          />

          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-white/78 px-4 py-2 text-sm font-medium text-foreground shadow-[0_10px_28px_rgba(7,55,99,0.06)] backdrop-blur">
              <svg
                aria-hidden="true"
                className="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4.75 6.75h14.5v10.5H4.75z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <path
                  d="m5.25 7.25 6.75 5 6.75-5"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
              Связаться
            </div>

            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-semibold leading-[1.06] text-foreground sm:text-4xl lg:text-5xl">
              Нужна помощь с подбором оборудования?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
              Оставьте заявку — менеджер уточнит задачу и поможет подобрать
              подходящее решение.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MagneticLeadModalTrigger>
                Оставить заявку
              </MagneticLeadModalTrigger>
              <MagneticButton href="/catalog" variant="ghost">
                Перейти в каталог
              </MagneticButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
