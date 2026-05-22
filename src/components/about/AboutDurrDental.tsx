import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const durrAreas = [
  "Компрессорные системы",
  "Аспирационное оборудование",
  "Гигиена",
  "Диагностика",
] as const;

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export function AboutDurrDental() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Ellipse: normalised position (lerped)
  const posRef = useRef({ x: 0.82, y: 0.5 });
  const targetRef = useRef({ x: 0.82, y: 0.5 });
  const [pos, setPos] = useState({ x: 0.82, y: 0.5 });

  // Border: raw pixel position (direct, no lerp)
  const [borderPos, setBorderPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = useCallback(() => {
    const dx = targetRef.current.x - posRef.current.x;
    const dy = targetRef.current.y - posRef.current.y;
    if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
      posRef.current = {
        x: lerp(posRef.current.x, targetRef.current.x, 0.08),
        y: lerp(posRef.current.y, targetRef.current.y, 0.08),
      };
      setPos({ ...posRef.current });
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBorderPos({ x, y });
    targetRef.current = { x: x / rect.width, y: y / rect.height };
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { x: 0.82, y: 0.5 };
    setHovered(false);
  }, []);

  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        {/* Magnetic border wrapper */}
        <div
          ref={wrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="rounded-[34px] p-px shadow-[0_26px_80px_rgba(7,55,99,0.08)] transition-all duration-300"
          style={{
            background: hovered
              ? `radial-gradient(500px circle at ${borderPos.x}px ${borderPos.y}px, rgba(59,130,246,0.55), rgba(200,225,245,0.3) 70%)`
              : "rgba(200,225,245,0.35)",
          }}
        >
          {/* Inner block */}
          <div
            ref={blockRef}
            className="relative overflow-hidden rounded-[33px] bg-[linear-gradient(135deg,#ffffff_0%,#edf9fc_100%)] p-6 sm:p-8 lg:p-10"
          >
            {/* Grid background */}
            <div
              aria-hidden="true"
              className="durr-grid pointer-events-none absolute inset-0 opacity-70"
            />

            {/* Interactive ellipse */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-[1]"
              style={{
                width: 360,
                height: 200,
                borderRadius: "999px",
                background: "rgba(56,152,255,0.20)",
                filter: "blur(44px)",
                opacity: 0.75,
                left: `calc(${pos.x * 100}% - 180px)`,
                top: `calc(${pos.y * 100}% - 100px)`,
                willChange: "left, top",
              }}
            />

            <div className="relative z-[2] grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
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
        </div>
      </Container>
    </Section>
  );
}
