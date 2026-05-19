import { Link } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { CategoryTags } from "@/components/catalog/CategoryTags";
import { PillBadge } from "@/components/ui/PillBadge";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

export type CategoryVisual = {
  image: string;
  imageClassName: string;
  tone: string;
};

type CategoryCardProps = {
  category: Category;
  visual: CategoryVisual;
};

function areSameTags(current: string[], next: string[]) {
  return current.length === next.length && current.every((tag, index) => tag === next[index]);
}

function CategoryTag({ children }: { children: string }) {
  return (
    <PillBadge>
      {children}
    </PillBadge>
  );
}


export function CategoryCard({ category, visual }: CategoryCardProps) {
  const tags = useMemo(
    () =>
      category.subcategories?.map((s) => s.label ?? s.title) ??
      category.tags ??
      [],
    [category.subcategories, category.tags],
  );
  const [visibleTags, setVisibleTags] = useState(() => tags.slice(0, 4));
  const hiddenTags = useMemo(
    () => tags.slice(visibleTags.length),
    [tags, visibleTags.length],
  );
  const promotedTag = hiddenTags[0];
  const overlayTags = useMemo(() => hiddenTags.slice(1), [hiddenTags]);

  const handleVisibleTagsChange = useCallback((nextVisibleTags: string[]) => {
    setVisibleTags((currentVisibleTags) =>
      areSameTags(currentVisibleTags, nextVisibleTags)
        ? currentVisibleTags
        : nextVisibleTags,
    );
  }, []);

  return (
    <Link
      className="group relative flex min-h-[390px] overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_20px_54px_rgba(7,55,99,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(7,55,99,0.13)]"
      to={`/catalog/${category.slug}`}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-0 bg-gradient-to-b", visual.tone)}
      />

      <img
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center opacity-60 transition duration-300 group-hover:scale-[1.03] lg:group-hover:blur-sm lg:group-hover:opacity-40",
          visual.imageClassName,
        )}
        height={260}
        src={category.image ?? visual.image}
        width={260}
        loading="lazy"
      />

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_48%,#ffffff_100%)]"
      />

      <span className="relative z-[2] flex w-full flex-col p-4 sm:p-5">
        <div>
          <CategoryTags
            onVisibleTagsChange={handleVisibleTagsChange}
            promotedTag={promotedTag}
            tags={tags}
          />
          {overlayTags.length > 0 && (
            <div className="mt-2 hidden flex-wrap gap-2 opacity-0 transition-opacity duration-300 lg:flex lg:group-hover:opacity-100">
              {overlayTags.map((tag) => (
                <CategoryTag key={tag}>{tag}</CategoryTag>
              ))}
            </div>
          )}
        </div>

        <span className="mt-auto block pt-8">
          <span className="block text-2xl font-semibold leading-[1.05] text-foreground transition-colors group-hover:text-primary">
            {category.title}
          </span>
          <span className="mt-5 block text-sm font-semibold text-primary">
            Смотреть
          </span>
        </span>
      </span>
    </Link>
  );
}
