  import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const approachPoints = [
  "Подбор под оборудование клиники",
  "Проверка характеристик",
  "Персональное сопровождение заказа",
] as const;

const representativeImage = "/images/about/company-representative.jpg";
const representativeFallbackImage = "/images/specialist-consultation.png";

export function AboutApproach() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="grid gap-6 md:grid-cols-[0.82fr_1fr] md:items-stretch lg:gap-8">
          <figure className="relative min-h-0 overflow-hidden rounded-[32px] shadow-[0_28px_84px_rgba(7,55,99,0.12)]">
            <img
              alt="Представитель компании МЕД-ИКС консультирует клиента"
              className="h-[380px] w-full rounded-[32px] object-cover object-center sm:h-[460px] md:h-full"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = representativeFallbackImage;
              }}
              src={representativeImage}
            />
          </figure>

          <article className="flex flex-col justify-center rounded-[32px] border border-border/70 bg-white/82 p-6 shadow-[0_24px_72px_rgba(7,55,99,0.08)] backdrop-blur sm:p-8 lg:p-10">
            <p className="w-fit rounded-full border border-accent/20 bg-[color-mix(in_srgb,var(--accent)_10%,white)] px-4 py-2 text-sm font-semibold text-primary">
              Наш подход
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] text-foreground sm:text-4xl lg:text-5xl">
              Мы работаем не с заявками, а с задачами клиник
            </h2>

            <div className="mt-6 space-y-5 text-base leading-7 text-muted sm:text-lg sm:leading-[1.65]">
              <p>
                Мы ценим каждого клиента и понимаем, что при подборе
                стоматологического оборудования, запасных частей и комплектующих
                важна не только цена, но и точность решения. Поэтому мы уточняем
                задачу, проверяем характеристики, подбираем совместимые позиции
                и помогаем согласовать оптимальный вариант поставки.
              </p>
              <p>
                Новые клиенты получают понятную консультацию с первого
                обращения, а постоянные — более персональный подход, быстрые
                ответы и индивидуальные условия по заказам.
              </p>
            </div>

            <div className="mt-8 grid gap-3 xl:grid-cols-3">
              {approachPoints.map((point) => (
                <div
                  className="rounded-[20px] border border-border/70 bg-card-soft px-4 py-4 text-sm font-semibold leading-5 text-foreground shadow-[0_12px_30px_rgba(7,55,99,0.05)]"
                  key={point}
                >
                  {point}
                </div>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </Section>
  );
}
