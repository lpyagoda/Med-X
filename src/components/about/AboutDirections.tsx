import { useState, useRef, type ReactNode, type MouseEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

function IconDrill() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-300 ease-out group-hover:rotate-12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-300 ease-out group-hover:scale-110" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" x2="12" y1="22.08" y2="12" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-300 ease-out group-hover:scale-110" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

const directions: { title: string; description: string; icon: ReactNode; image: string }[] = [
  {
    title: "Стоматологическое оборудование",
    description: "Установки, компрессоры, аспирационные системы, рентген-оборудование и решения для оснащения кабинета.",
    icon: <IconDrill />,
    image: "/images/about-equipment-workshop.png",
  },
  {
    title: "Запасные части",
    description: "Комплектующие для замены, ремонта, дооснащения и обслуживания стоматологического оборудования.",
    icon: <IconWrench />,
    image: "/images/dental-spare-parts-catalog.png",
  },
  {
    title: "Расходные материалы",
    description: "Позиции для регулярной работы клиник, кабинетов и зуботехнических лабораторий.",
    icon: <IconBox />,
    image: "/images/original-dental-equipment.png",
  },
  {
    title: "Стерилизация и дезинфекция",
    description: "Оборудование и средства для обработки инструментов, поверхностей и рабочих зон.",
    icon: <IconShield />,
    image: "/images/specialist-consultation.png",
  },
];

function MagneticCard({ children }: { children: ReactNode }) {
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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-[20px] p-px transition-all duration-300"
      style={{
        background: hovered
          ? `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(59,130,246,0.55), rgba(220,232,243,0.4) 65%)`
          : "rgba(220,232,243,0.4)",
      }}
    >
      <div className="group flex h-full flex-col rounded-[19px] bg-white/85 backdrop-blur transition-colors duration-300 hover:bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function AboutDirections() {
  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div>
          <h2 className="text-4xl font-semibold text-foreground sm:text-5xl">
            Что можно заказать
          </h2>
          <p className="mt-4 text-lg text-muted">
            Подберём оборудование, запасные части и расходные материалы под задачу вашей клиники.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {directions.map((dir) => (
            <MagneticCard key={dir.title}>
              <div className="h-44 w-full overflow-hidden sm:h-48">
                <img
                  src={dir.image}
                  alt={dir.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/about-equipment-workshop.png";
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dbeafe,#e0f2fe)] shadow-sm">
                  {dir.icon}
                </span>
                <h3 className="text-lg font-semibold leading-snug text-foreground">
                  {dir.title}
                </h3>
                <p className="text-sm leading-6 text-muted">{dir.description}</p>
              </div>
            </MagneticCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
