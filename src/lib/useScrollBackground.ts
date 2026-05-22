import { useEffect, useRef, useState } from "react";

export function useScrollBackground() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let animationFrameId = 0;
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

    const tick = () => {
      syncBackground();
      animationFrameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", syncBackground, { passive: true });
    syncBackground();
    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", syncBackground);
      window.cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("dark-bg");
      setIsDarkBackground(false);
    };
  }, []);

  return { darkSentinelRef: sentinelRef, isDarkBackground };
}
