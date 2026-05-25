import { useEffect, useRef, useState } from "react";

export function PriceNotice() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex items-center gap-1.5">
      <span className="text-sm text-muted">Уточнение стоимости</span>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Подробнее об уточнении стоимости"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted/60 transition hover:border-primary/40 hover:text-primary"
      >
        <svg aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[200] mt-2 w-72 rounded-2xl border border-border/60 bg-white p-4 shadow-[0_16px_40px_rgba(7,55,99,0.12)]">
          <p className="text-sm font-semibold text-foreground">Уточнение стоимости</p>
          <p className="mt-2 text-sm leading-5 text-muted">
            Стоимость зависит от курса валют на момент оформления. Финальную цену
            подтверждает менеджер при согласовании заказа.
          </p>
        </div>
      )}
    </div>
  );
}
