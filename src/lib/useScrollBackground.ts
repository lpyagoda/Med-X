import { useEffect, useRef, useState } from "react";

export function useScrollBackground() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let rafId = 0;
    let previousDarkBackground: boolean | null = null;

    const syncBackground = () => {
      const rect = el.getBoundingClientRect();
      const shouldUseDarkBackground = rect.top < window.innerHeight * 0.55;

      if (previousDarkBackground === shouldUseDarkBackground) {
        return;
      }

      previousDarkBackground = shouldUseDarkBackground;
      document.body.classList.toggle("dark-bg", shouldUseDarkBackground);
      setIsDarkBackground(shouldUseDarkBackground);
    };

    // Throttle via rAF: fire at most once per frame on scroll, not every frame.
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        syncBackground();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount to set the initial state.
    syncBackground();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
      document.body.classList.remove("dark-bg");
      setIsDarkBackground(false);
    };
  }, []);

  return { darkSentinelRef: sentinelRef, isDarkBackground };
}
