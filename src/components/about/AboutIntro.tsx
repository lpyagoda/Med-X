import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function AboutIntro() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-primary">Подход</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.08] text-foreground sm:text-4xl lg:text-5xl">
              Оборудование и комплектующие для стоматологической практики
            </h2>
          </div>

          <div className="rounded-[32px] border border-border/70 bg-white/82 p-6 shadow-[0_22px_64px_rgba(7,55,99,0.07)] backdrop-blur sm:p-8">
            <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Компания помогает подобрать стоматологическое оборудование,
              запасные части, расходные материалы и сопутствующие позиции под
              задачи клиник, частных кабинетов и лабораторий. В каталоге можно
              найти как крупное оборудование, так и комплектующие для замены,
              дооснащения и регулярной работы.
            </p>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              После заявки менеджер уточняет задачу, помогает сориентироваться
              по характеристикам, стоимости, срокам поставки, оплате и доставке.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
