import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PillBadge } from "@/components/ui/PillBadge";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE_TAGS_COUNT = 4;
const MIN_VISIBLE_TAGS_COUNT = 1;

type CategoryTagsProps = {
  onVisibleTagsChange?: (visibleTags: string[]) => void;
  promotedTag?: string;
  tags: string[];
};

function getVisibleSubcategories(tags: string[], visibleCount: number) {
  const visible = tags.slice(0, visibleCount);
  const hiddenCount = Math.max(tags.length - visibleCount, 0);

  return {
    hasHidden: hiddenCount > 0,
    hiddenCount,
    visible,
  };
}

function getRowCount(container: HTMLDivElement) {
  return new Set(
    Array.from(container.children)
      .filter((child) => (child as HTMLElement).offsetParent !== null)
      .map((child) => Math.round((child as HTMLElement).offsetTop)),
  ).size;
}

function CategoryTag({
  children,
  variant = "default",
}: {
  children: string;
  variant?: "default" | "more";
}) {
  return (
    <PillBadge
      className={cn(variant === "more" ? "border-primary/10 bg-primary/5 text-primary" : "")}
      variant={variant === "more" ? "accent" : "default"}
    >
      {children}
    </PillBadge>
  );
}

export function CategoryTags({ onVisibleTagsChange, promotedTag, tags }: CategoryTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMeasuredWidthRef = useRef(0);
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(INITIAL_VISIBLE_TAGS_COUNT, tags.length),
  );
  const { hasHidden, hiddenCount, visible } = getVisibleSubcategories(
    tags,
    visibleCount,
  );

  const resetVisibleCount = useCallback(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE_TAGS_COUNT, tags.length));
  }, [tags.length]);

  const shrinkRenderedTags = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (getRowCount(container) > 2) {
      setVisibleCount((currentVisibleCount) =>
        currentVisibleCount > MIN_VISIBLE_TAGS_COUNT
          ? currentVisibleCount - 1
          : currentVisibleCount,
      );
    }
  }, []);

  useLayoutEffect(() => {
    shrinkRenderedTags();
  }, [shrinkRenderedTags, tags, visibleCount]);

  useEffect(() => {
    let isMounted = true;
    const immediateCheck = window.setTimeout(() => {
      if (isMounted) {
        shrinkRenderedTags();
      }
    }, 0);
    const settledCheck = window.setTimeout(() => {
      if (isMounted) {
        shrinkRenderedTags();
      }
    }, 150);

    document.fonts.ready.then(() => {
      if (isMounted) {
        shrinkRenderedTags();
      }
    });

    return () => {
      isMounted = false;
      window.clearTimeout(immediateCheck);
      window.clearTimeout(settledCheck);
    };
  }, [shrinkRenderedTags, tags]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }

    lastMeasuredWidthRef.current = Math.round(container.getBoundingClientRect().width);

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);

      if (nextWidth !== lastMeasuredWidthRef.current) {
        lastMeasuredWidthRef.current = nextWidth;
        resetVisibleCount();
      }

      window.requestAnimationFrame(shrinkRenderedTags);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [resetVisibleCount, shrinkRenderedTags]);

  useEffect(() => {
    onVisibleTagsChange?.(tags.slice(0, visibleCount));
  }, [onVisibleTagsChange, tags, visibleCount]);

  return (
    <div
      data-category-tags="compact"
      className="flex max-h-[3.75rem] flex-wrap gap-2 overflow-hidden pr-1"
      ref={containerRef}
    >
      {visible.map((tag) => (
        <CategoryTag key={tag}>{tag}</CategoryTag>
      ))}
      {hasHidden ? (
        <>
          <span className="lg:group-hover:hidden">
            <CategoryTag variant="more">{`Ещё +${hiddenCount}`}</CategoryTag>
          </span>
          {promotedTag && (
            <span className="hidden lg:group-hover:inline-flex">
              <CategoryTag>{promotedTag}</CategoryTag>
            </span>
          )}
        </>
      ) : null}
    </div>
  );
}
