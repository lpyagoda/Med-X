type CatalogToolbarProps = {
  count: number;
  onQueryChange: (value: string) => void;
  placeholder?: string;
  query: string;
  total: number;
};

export function CatalogToolbar({
  count,
  onQueryChange,
  placeholder = "Поиск по товарам",
  query,
  total,
}: CatalogToolbarProps) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-white/82 p-4 shadow-[0_18px_48px_rgba(7,55,99,0.06)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block flex-1">
          <span className="sr-only">Поиск по товарам</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-primary/55"
          >
            <span className="absolute -bottom-1 -right-1 h-1.5 w-px rotate-[-45deg] rounded-full bg-primary" />
          </span>
          <input
            className="h-12 w-full rounded-full border border-border bg-white px-11 text-sm text-foreground shadow-inner outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/10"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            type="search"
            value={query}
          />
        </label>

        <div className="flex shrink-0 items-center justify-between gap-4 text-sm lg:min-w-48 lg:justify-end">
          <span className="font-semibold text-foreground">{count} найдено</span>
          <span className="text-muted">из {total}</span>
        </div>
      </div>
    </div>
  );
}
