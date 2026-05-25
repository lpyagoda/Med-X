type CatalogToolbarProps = {
  count: number;
  onFilterClick?: () => void;
  onQueryChange: (value: string) => void;
  placeholder?: string;
  query: string;
  total: number;
};

export function CatalogToolbar({
  count,
  onFilterClick,
  onQueryChange,
  placeholder = "Поиск по товарам",
  query,
}: CatalogToolbarProps) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-white/82 p-4 shadow-[0_18px_48px_rgba(7,55,99,0.06)] backdrop-blur">
      {/* Search input */}
      <div className="flex items-center gap-3">
        <label className="relative block flex-1">
          <span className="sr-only">Поиск по товарам</span>
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-primary/55">
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
        {/* Count — desktop only, right of search */}
        <span className="hidden shrink-0 text-sm font-semibold text-foreground lg:block">{count} найдено</span>
      </div>

      {/* Row 2 (mobile): filter button + count */}
      <div className="mt-3 flex items-center justify-between lg:hidden">
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary shadow-inner transition hover:border-primary/40"
          aria-label="Фильтр по категориям"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          Фильтры
        </button>
        <span className="text-sm font-semibold text-foreground">{count} найдено</span>
      </div>
    </div>
  );
}
