import { useEffect, useRef } from "react";

export function useScrollBackground() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      // Trigger when sentinel reaches 55% from top (a bit late), stays dark once passed
      if (rect.top < window.innerHeight * 0.55) {
        document.body.classList.add("dark-bg");
      } else {
        document.body.classList.remove("dark-bg");
      }
    };

    window.addEventListener("scroll", check, { passive: true });
    check();

    return () => {
      window.removeEventListener("scroll", check);
      document.body.classList.remove("dark-bg");
    };
  }, []);

  return sentinelRef;
}
