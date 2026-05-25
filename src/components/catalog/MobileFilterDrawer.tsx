import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { categoryIcons } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

type Props = {
  categories: Category[];
  onClose: () => void;
  open: boolean;
};

function CategoryRow({ cat, onClose }: { cat: Category; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const icon = categoryIcons[cat.slug];
  const hasSubs = !!cat.subcategories?.length;

  return (
    <li>
      <button
        type="button"
        onClick={() => hasSubs ? setExpanded((v) => !v) : null}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition",
          expanded ? "bg-[#ebf2fc] text-primary" : "text-[#2d3d50] hover:bg-[#f0f5fb] hover:text-primary",
        )}
      >
        <span className={cn(
          "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg transition-colors",
          expanded ? "bg-primary/15 text-primary" : "bg-[#f0f3f7] text-[#7a8fa6]",
        )}>
          {icon}
        </span>
        <span className="flex-1 text-[15px] font-medium leading-[1.4]">{cat.title}</span>
        {hasSubs && (
          <ChevronDown className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            expanded ? "rotate-180 text-primary" : "text-[#aab8c6]",
          )} />
        )}
      </button>

      {/* Subcategories — CSS grid animation */}
      {hasSubs && (
        <div
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
            transition: "grid-template-rows 300ms ease",
          }}
        >
          <ul className="overflow-hidden">
            <li className="ml-3 mt-0.5">
              <Link
                to={`/catalog/${cat.slug}`}
                onClick={onClose}
                className="block rounded-lg px-2.5 py-2 text-[15px] font-medium text-[#607083] transition hover:bg-[#f5f8fb] hover:text-primary"
              >
                Все в «{cat.title}»
              </Link>
            </li>
            {cat.subcategories!.map((sub) => (
              <li key={sub.id} className="ml-3">
                <Link
                  to={`/catalog/${cat.slug}?subcategory=${sub.slug}`}
                  onClick={onClose}
                  className="block rounded-lg px-2.5 py-2 text-[15px] text-[#607083] transition hover:bg-[#f0f5fb] hover:text-primary"
                >
                  {sub.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function MobileFilterDrawer({ categories, onClose, open }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-white lg:hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-[#edf3f9] px-4 py-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>
        <p className="flex-1 text-center text-[15px] font-semibold text-foreground">Категории</p>
        <div className="w-14" />
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-3">
        <Link
          to="/catalog"
          onClick={onClose}
          className="mb-2 flex items-center rounded-xl px-3 py-3 text-sm font-semibold text-primary transition hover:bg-[#f0f5fb]"
        >
          Все товары
        </Link>

        <ul className="space-y-0.5">
          {categories.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} onClose={onClose} />
          ))}
        </ul>
      </div>
    </div>
  );
}
