import { useState, useEffect, useCallback, useRef, type ReactNode, type MouseEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const DURATION = 5000;

function IconHeadset() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconShieldCheck() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-300 ease-out group-hover:scale-110" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect height="13" rx="1" width="15" x="1" y="3" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-500 ease-in-out group-hover:rotate-[30deg]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const benefits: { title: string; description: string; icon: ReactNode; image: string }[] = [
  {
    title: "Консультация специалиста",
    description: "Поможем подобрать оборудование под задачу клиники, уточнить характеристики, стоимость и условия заказа.",
    icon: <IconHeadset />,
    image: "/images/specialist-consultation.png",
  },
  {
    title: "Оригинальная продукция",
    description: "Поставляем оригинальные изделия DÜRR Dental и других производителей с подтверждёнными документами.",
    icon: <IconShieldCheck />,
    image: "/images/original-dental-equipment.png",
  },
  {
    title: "Быстрая поставка",
    description: "Для позиций в наличии — оперативное согласование заявки и отгрузка в короткие сроки.",
    icon: <IconTruck />,
    image: "/images/fast-equipment-delivery.png",
  },
  {
    title: "Запасные части в каталоге",
    description: "В каталоге представлено крупное оборудование, комплектующие, расходные позиции и запчасти.",
    icon: <IconSettings />,
    image: "/images/dental-spare-parts-catalog.png",
  },
];

function MagneticCard({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer rounded-[20px] p-px transition-all duration-300"
      style={{
        background: hovered
          ? `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(59,130,246,0.55), rgba(220,232,243,0.4) 65%)`
          : "rgba(220,232,243,0.4)",
      }}
    >
      <div className="group flex h-full flex-col gap-4 rounded-[19px] bg-white/85 p-6 backdrop-blur transition-colors duration-300 hover:bg-white lg:p-7">
        {children}
      </div>
    </div>
  );
}

export function BenefitsSection() {
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => setActive(i), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % benefits.length);
    }, DURATION);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <Section>
      <Container>
        <div>
          <h2 className="text-4xl font-semibold text-foreground sm:text-5xl">
            Почему с нами удобно работать
          </h2>
          <p className="mt-4 text-lg text-muted">
            Менеджер помогает быстро сузить выбор и передать в работу понятную заявку
          </p>
        </div>

        {/* Image carousel */}
        <div className="relative mt-8 h-[360px] overflow-hidden rounded-[24px] shadow-[0_24px_64px_rgba(7,55,99,0.10)] sm:h-[460px] lg:h-[560px]">
          {benefits.map((b, i) => (
            <img
              key={b.image}
              src={b.image}
              alt={b.title}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              loading={i === 0 ? "eager" : "lazy"}
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => (
            <MagneticCard key={benefit.title} onClick={() => goTo(i)}>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dbeafe,#e0f2fe)] shadow-sm">
                {benefit.icon}
              </span>
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                {benefit.title}
              </h3>
              <p className="text-sm leading-6 text-muted">{benefit.description}</p>

              {/* Progress bar */}
              <div className="mt-auto h-0.5 w-full overflow-hidden rounded-full bg-border/60">
                {i === active && (
                  <div
                    key={active}
                    className="h-full rounded-full bg-primary"
                    style={{ animation: `progress-fill ${DURATION}ms linear forwards` }}
                  />
                )}
              </div>
            </MagneticCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
