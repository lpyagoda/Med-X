export function PriceNotice() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/45 p-5 shadow-sm backdrop-blur-md">
      <div className="flex gap-4">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-primary"
        >
          ₽
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Уточнение стоимости</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Стоимость товаров может изменяться в зависимости от курса валют на
            момент оформления заказа. Финальная цена уточняется при подтверждении
            заказа менеджером.
          </p>
        </div>
      </div>
    </div>
  );
}
