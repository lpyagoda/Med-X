import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

type CategoryListProps = {
  categories: Category[];
  className?: string;
};

export function CategoryList({ categories, className }: CategoryListProps) {
  return (
    <aside
      className={cn(
        "rounded-[28px] border border-border/80 bg-white/82 p-4 shadow-[0_18px_48px_rgba(7,55,99,0.06)] backdrop-blur",
        className,
      )}
    >
      <p className="px-2 text-sm font-semibold text-foreground">Категории</p>
      <div className="mt-4 grid gap-2">
        {categories.map((category) => (
          <div
            className="rounded-2xl border border-transparent bg-card-soft px-4 py-3 transition-colors hover:border-primary/25 hover:bg-white"
            key={category.id}
          >
            <p className="text-sm font-semibold text-foreground">{category.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
