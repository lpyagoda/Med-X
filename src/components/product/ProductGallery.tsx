import { useEffect, useState } from "react";
import type { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  alt: string;
  images: ProductImage[];
  fallbackImage?: string;
};

export function ProductGallery({ alt, images, fallbackImage }: ProductGalleryProps) {
  const hasImages = images.length > 0;
  const ordered = hasImages
    ? [...images].sort((a, b) => {
        if (a.isMain === b.isMain) return 0;
        return a.isMain ? -1 : 1;
      })
    : fallbackImage
      ? [{ url: fallbackImage, isMain: true } satisfies ProductImage]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [ordered.length, ordered[0]?.url]);

  if (ordered.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,#f8fcff,#eef7fb)] text-sm text-muted">
        Фото товара появится позже
      </div>
    );
  }

  const active = ordered[activeIndex] ?? ordered[0];
  const showThumbs = ordered.length > 1;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex min-h-[340px] flex-1 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,#f8fcff,#eef7fb)] p-8 sm:min-h-[460px]">
        <div className="relative h-72 w-full max-w-lg sm:h-96">
          <img
            alt={alt}
            className="absolute inset-0 h-full w-full object-contain"
            src={active.url}
            fetchPriority="high"
          />
        </div>
      </div>

      {showThumbs ? (
        <div className="flex flex-wrap gap-2.5">
          {ordered.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                aria-label={`Фото ${index + 1}`}
                aria-pressed={isActive}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-[linear-gradient(145deg,#f8fcff,#eef7fb)] transition",
                  isActive
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/70 hover:border-primary/50",
                )}
                key={`${image.url}-${index}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <img
                  alt=""
                  className="h-full w-full object-contain p-2"
                  loading="lazy"
                  src={image.url}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
