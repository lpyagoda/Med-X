import type { ProductCharacteristic } from "@/types/product";

type ProductCharacteristicsProps = {
  characteristics: ProductCharacteristic[];
};

export function ProductCharacteristics({ characteristics }: ProductCharacteristicsProps) {
  return (
    <section className="rounded-[30px] border border-border/70 bg-white/82 p-6 shadow-[0_22px_60px_rgba(7,55,99,0.07)] backdrop-blur sm:p-8">
      <h2 className="text-2xl font-semibold text-foreground">Характеристики</h2>
      {characteristics.length > 0 ? (
        <dl className="mt-6 divide-y divide-border/70">
          {characteristics.map((item) => (
            <div className="grid gap-2 py-4 sm:grid-cols-[220px_1fr] sm:gap-6" key={`${item.name}-${item.value}`}>
              <dt className="text-sm font-semibold text-muted">{item.name}</dt>
              <dd className="text-sm font-medium leading-6 text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">Характеристики уточняются.</p>
      )}
    </section>
  );
}
