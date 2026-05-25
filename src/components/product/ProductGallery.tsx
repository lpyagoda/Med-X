import { useCallback, useEffect, useRef, useState } from "react";
import { PillBadge } from "@/components/ui/PillBadge";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

type ProductGalleryProps = {
  alt: string;
  brandLabel?: string;
  categoryLabel?: string;
  fallbackImage?: string;
  images: ProductImage[];
};

export function ProductGallery({ alt, brandLabel, categoryLabel, fallbackImage, images }: ProductGalleryProps) {
  const base = images.length > 0
    ? [...images].sort((a, b) => a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1)
    : fallbackImage
      ? [{ url: fallbackImage, isMain: true } as ProductImage]
      : [];

  const ordered = base.length === 1 ? [base[0], base[0]] : base;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstSlideRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    const slide = firstSlideRef.current;
    if (!container || !slide) return;
    const slideW = slide.offsetWidth + 8; // gap-2 = 8px
    setActiveIndex(Math.min(Math.round(container.scrollLeft / slideW), ordered.length - 1));
  }, [ordered.length]);

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current;
    const slide = firstSlideRef.current;
    if (!container || !slide) return;
    const wrapped = ((index % ordered.length) + ordered.length) % ordered.length;
    container.scrollTo({ left: wrapped * (slide.offsetWidth + 8), behavior: "smooth" });
  }, [ordered.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [base[0]?.url]);

  if (ordered.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-muted">
        Фото товара появится позже
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Labels — fixed over slider, never scroll */}
      {(categoryLabel || brandLabel) && (
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-1.5">
          {categoryLabel && (
            <PillBadge className="bg-[color-mix(in_srgb,var(--accent)_13%,white)] text-primary">
              {categoryLabel}
            </PillBadge>
          )}
          {brandLabel && (
            <PillBadge className="text-muted">{brandLabel}</PillBadge>
          )}
        </div>
      )}

      {/* Desktop prev arrow */}
      {ordered.length > 1 && (
        <button
          aria-label="Предыдущее фото"
          onClick={() => scrollTo(activeIndex - 1)}
          className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white/80 text-foreground/70 shadow-sm backdrop-blur-sm transition-all duration-150 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md active:scale-90 active:bg-primary/80 active:shadow-none lg:flex"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </button>
      )}

      {/* Desktop next arrow */}
      {ordered.length > 1 && (
        <button
          aria-label="Следующее фото"
          onClick={() => scrollTo(activeIndex + 1)}
          className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white/80 text-foreground/70 shadow-sm backdrop-blur-sm transition-all duration-150 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md active:scale-90 active:bg-primary/80 active:shadow-none lg:flex"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </button>
      )}

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ordered.map((image, i) => (
          <div
            key={`${image.url}-${i}`}
            ref={i === 0 ? firstSlideRef : undefined}
            className="relative flex min-h-[400px] w-[88%] shrink-0 items-center justify-center p-8 sm:min-h-[520px] lg:w-full"
            style={{ scrollSnapAlign: "start" }}
          >
            <img
              alt={i === 0 ? alt : ""}
              className="h-full w-full object-contain"
              style={{ maxHeight: "340px" }}
              fetchPriority={i === 0 ? "high" : undefined}
              loading={i === 0 ? undefined : "lazy"}
              src={image.url}
            />
          </div>
        ))}
        <div className="w-[12%] shrink-0 lg:hidden" aria-hidden="true" />
      </div>

      {/* Pagination dots */}
      {ordered.length > 1 && (
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {ordered.map((_, i) => (
            <button
              key={i}
              aria-label={`Фото ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "pointer-events-auto h-1.5 rounded-full transition-all duration-200",
                i === activeIndex
                  ? "w-5 bg-black/50"
                  : "w-1.5 bg-black/20 hover:bg-black/35",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
