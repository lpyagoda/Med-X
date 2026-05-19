import { useEffect, useState } from "react";

type HeroReview = {
  text: string;
  name: string;
  role: string;
  initials: string;
};

const reviewIntervalMs = 6000;
const ratingStars = ["1", "2", "3", "4", "5"];

const heroReviews: HeroReview[] = [
  {
    text: "Помогли быстро подобрать оборудование и комплектующие под задачи клиники. Всё понятно по наличию, срокам и заявке.",
    name: "Анна К.",
    role: "управляющая стоматологической клиники",
    initials: "АК",
  },
  {
    text: "Оперативно нашли нужные запасные части и предложили несколько вариантов по срокам поставки. Заявку обработали без лишних уточнений.",
    name: "Илья С.",
    role: "главный врач стоматологии",
    initials: "ИС",
  },
  {
    text: "Удобно, что можно отправить заявку сразу с сайта: менеджер быстро вернулся с подбором расходных материалов и оборудования.",
    name: "Марина П.",
    role: "администратор клиники",
    initials: "МП",
  },
];

export function HeroReviewCard() {
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const activeReview = heroReviews[activeReviewIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveReviewIndex((currentIndex) => (currentIndex + 1) % heroReviews.length);
    }, reviewIntervalMs);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="pointer-events-none absolute bottom-8 right-8 z-20 hidden lg:block">
      <div className="hero-glass flex w-[520px] flex-col gap-4 rounded-[28px] p-5 2xl:w-[600px]">
        <div className="flex gap-1" aria-label="Рейтинг 5 из 5">
          {ratingStars.map((star) => (
            <svg
              aria-hidden="true"
              className="h-5 w-5 fill-accent text-accent"
              fill="currentColor"
              key={star}
              viewBox="0 0 24 24"
            >
              <path d="M11.53 2.3a.53.53 0 0 1 .94 0l2.31 4.67a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.61-2.43a2.12 2.12 0 0 0-1.98 0l-4.61 2.43a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.79a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z" />
            </svg>
          ))}
        </div>

        <div
          aria-live="polite"
          className="hero-review-content"
          key={activeReview.name}
        >
          <p className="text-base leading-6 text-foreground">{activeReview.text}</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white shadow-[0_12px_28px_rgba(7,55,99,0.22)]">
              {activeReview.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold leading-tight text-foreground">
                {activeReview.name}
              </p>
              <p className="truncate text-sm leading-tight text-muted">
                {activeReview.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
