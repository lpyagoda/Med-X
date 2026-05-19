export function PriceNotice() {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/45 px-5 py-3 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-primary"
        >
          ₽
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-foreground">
            Уточнение стоимости
          </p>
          <p className="mt-1 text-sm leading-5 text-muted">
            Стоимость зависит от курса валют на момент оформления. Финальную цену
            подтверждает менеджер при согласовании заказа.
          </p>
        </div>
      </div>
    </div>
  );
}
