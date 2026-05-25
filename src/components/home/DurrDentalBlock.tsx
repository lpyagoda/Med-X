import { DurrDentalShowcase } from "@/components/home/DurrDentalShowcase";
import { Button } from "@/components/ui/Button";

const durrProducts = [
  {
    title: "Компрессорная система Tornado 2",
    category: "Компрессоры",
    priceLabel: "Цена по запросу",
    availabilityLabel: "Под заказ",
  },
  {
    title: "Аспирационная система VS 600",
    category: "Аспирация",
    priceLabel: "от 320 000 ₽",
    availabilityLabel: "Под заказ",
  },
  {
    title: "Hygoclave 90 для стерилизации",
    category: "Гигиена",
    priceLabel: "от 210 000 ₽",
    availabilityLabel: "В наличии",
  },
  {
    title: "VistaScan Mini Easy",
    category: "Диагностика",
    priceLabel: "Цена по запросу",
    availabilityLabel: "Под заказ",
  },
];

export function DurrDentalBlock() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-border/80 bg-[#FBFEFE] p-6 shadow-[0_28px_80px_rgba(7,55,99,0.08)] sm:p-8 lg:h-[500px] lg:p-10">
      <div className="grid h-full gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold text-accent">Брендовое направление</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.04] text-foreground sm:text-5xl">
            DÜRR Dental
          </h2>
          <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
            Отдельное направление каталога — оборудование и решения DÜRR Dental
            для стоматологических клиник и лабораторий.
          </p>
          <div className="mt-8">
            {/* Когда появится отдельная страница бренда, ссылку можно заменить на /catalog/durr-dental. */}
            <Button href="/catalog">Смотреть ассортимент</Button>
          </div>
        </div>

        <DurrDentalShowcase products={durrProducts} />
      </div>
    </div>
  );
}
