import { Container } from "@/components/ui/Container";

const stats = [
  { value: "500+", label: "позиций в каталоге" },
  { value: "8 лет", label: "на рынке" },
  { value: "24ч", label: "оформление заявки" },
  { value: "100%", label: "оригинальная продукция" },
];

export function StatsSection() {
  return (
    <section className="bg-[#07376380] py-12 sm:py-14 lg:py-16" style={{ background: "linear-gradient(135deg, #073763 0%, #0d5ea6 100%)" }}>
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div className="flex flex-col items-center text-center" key={stat.label}>
              <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-medium text-white/70 sm:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
