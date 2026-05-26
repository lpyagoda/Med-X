import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

// Build a sliding window of visible page buttons so we never render more
// than ~7 buttons even for large catalogues. Always includes 1 and
// totalPages; collapses long gaps with "…".
function getVisiblePages(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Постраничная навигация"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => !isFirst && onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors",
          "hover:border-primary/40 hover:text-primary",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground",
        )}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visiblePages.map((entry, index) =>
        entry === "…" ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-sm text-muted"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-current={entry === currentPage ? "page" : undefined}
            className={cn(
              "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors",
              entry === currentPage
                ? "bg-primary text-white shadow-[0_12px_26px_rgba(7,55,99,0.18)]"
                : "border border-border bg-white text-foreground hover:border-primary/40 hover:text-primary",
            )}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => !isLast && onPageChange(currentPage + 1)}
        disabled={isLast}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors",
          "hover:border-primary/40 hover:text-primary",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground",
        )}
        aria-label="Следующая страница"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
