import { useEffect, useRef } from "react";

export function useParallax(factor = 0.25) {
  const ref = useRef<HTMLElement | null>(null);
  const rafId = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (el) {
          el.style.transform = `translateY(${window.scrollY * factor}px)`;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [factor]);

  return ref;
}
