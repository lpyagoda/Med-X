import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "med-x-cookie-consent-v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable — show banner anyway, dismissing won't persist.
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // Ignore — banner just won't remember the dismissal.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
      role="dialog"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex w-full max-w-3xl flex-col items-start gap-3 rounded-2xl border border-border/80 bg-white/95 px-4 py-3.5 shadow-[0_24px_60px_rgba(7,55,99,0.18)] backdrop-blur sm:flex-row sm:items-center sm:gap-4 sm:px-5">
        <p className="text-sm leading-5 text-foreground">
          Сайт использует cookies для работы корзины и анонимной аналитики. Продолжая
          пользоваться сайтом, вы соглашаетесь с{" "}
          <Link
            className="font-semibold text-primary underline-offset-2 hover:underline"
            to="/privacy"
          >
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          className="ml-auto inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white! shadow-[0_8px_18px_rgba(7,55,99,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
          onClick={accept}
          type="button"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
