import { useEffect, useMemo, useRef } from "react";

type DurrProduct = {
  title: string;
  category: string;
  priceLabel: string;
  availabilityLabel: string;
};

type DurrDentalShowcaseProps = {
  products: DurrProduct[];
};

const productPreviewImage = "/images/products/1dental-product-render.png";
const normalSpeed = 0.32;
const hoverSpeed = 0.12;

export function DurrDentalShowcase({ products }: DurrDentalShowcaseProps) {
  return (
    <>
      <DesktopShowcase products={products} />
      <MobileCollage products={products} />
    </>
  );
}

function DesktopShowcase({ products }: DurrDentalShowcaseProps) {
  const cards = useMemo(() => [...products, ...products], [products]);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const targetSpeedRef = useRef(normalSpeed);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) return;

    let animationFrameId = 0;
    let offset = 0;
    let currentSpeed = normalSpeed;

    const animate = () => {
      const leftColumn = leftColumnRef.current;
      const rightColumn = rightColumnRef.current;
      if (leftColumn && rightColumn) {
        const loopHeight = leftColumn.scrollHeight / 2;
        if (loopHeight > 0) {
          currentSpeed += (targetSpeedRef.current - currentSpeed) * 0.06;
          offset = (offset + currentSpeed) % loopHeight;
          leftColumn.style.transform = `translate3d(0, ${-offset}px, 0)`;
          rightColumn.style.transform = `translate3d(0, ${offset - loopHeight}px, 0)`;
        }
      }
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      className="durr-showcase relative z-10 hidden h-full overflow-hidden bg-[#FBFEFE] lg:block"
      onMouseEnter={() => { targetSpeedRef.current = hoverSpeed; }}
      onMouseLeave={() => { targetSpeedRef.current = normalSpeed; }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-[#FBFEFE] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-[#FBFEFE] to-transparent" />
      <div className="relative z-10 -my-16 grid h-[calc(100%+8rem)] grid-cols-2 gap-5 bg-[#FBFEFE]">
        <div className="durr-card-column flex flex-col gap-5" ref={leftColumnRef}>
          {cards.map((product, index) => (
            <DurrProductCard index={index} key={`left-${product.title}-${index}`} product={product} />
          ))}
        </div>
        <div className="durr-card-column durr-card-column-reverse flex flex-col gap-5 pt-20" ref={rightColumnRef}>
          {cards.map((product, index) => (
            <DurrProductCard index={index + 2} key={`right-${product.title}-${index}`} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileCollage({ products }: DurrDentalShowcaseProps) {
  const [p1, p2, p3] = products;
  return (
    <div className="relative z-10 h-[200px] lg:hidden">
      {/* Card left */}
      <div
        className="absolute left-0 top-0 z-10 w-[48%]"
        style={{ animation: "premium-float-subtle 4.8s ease-in-out infinite" }}
      >
        <DurrProductCardSmall index={0} product={p1} />
      </div>
      {/* Card right */}
      <div
        className="absolute right-0 top-0 z-20 w-[48%]"
        style={{ animation: "premium-float-subtle 6.2s ease-in-out 0.8s infinite" }}
      >
        <DurrProductCardSmall index={1} product={p2} />
      </div>
    </div>
  );
}

function DurrProductCardSmall({ index, product }: { index: number; product: DurrProduct }) {
  return (
    <article className="rounded-[22px] border border-white/60 bg-white/70 p-4 shadow-[0_8px_24px_rgba(7,55,99,0.10)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-primary">DÜRR Dental</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-[10px] font-semibold text-primary">
          0{(index % 4) + 1}
        </span>
      </div>
      <div className="mt-3 flex h-16 items-center justify-center">
        <img alt="" className="h-full w-full object-contain" src={productPreviewImage} loading="lazy" />
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {product.category}
      </p>
      <h3 className="mt-1 text-xs font-semibold leading-snug text-foreground">
        {product.title}
      </h3>
    </article>
  );
}

function DurrProductCard({ index, product }: { index: number; product: DurrProduct }) {
  return (
    <article className="min-h-64 rounded-[28px] border border-border/45 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-primary">DÜRR Dental</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-xs font-semibold text-primary">
          0{(index % 4) + 1}
        </span>
      </div>
      <div className="mt-5 flex h-28 items-center justify-center">
        <div className="relative h-28 w-40">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            src={productPreviewImage}
            loading="lazy"
          />
        </div>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {product.category}
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">
        {product.title}
      </h3>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-primary">{product.priceLabel}</span>
        <span className="text-muted">{product.availabilityLabel}</span>
      </div>
    </article>
  );
}
