import { CategoryCard, type CategoryVisual } from "@/components/catalog/CategoryCard";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

type CategoryGridProps = {
  categories: Category[];
  className?: string;
};

const categoryVisuals: Record<string, CategoryVisual> = {
  "stomatologicheskie-ustanovki": {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.08] object-cover",
    tone: "from-[#f5f7f8] via-[#eceff1] to-[#ffffff]",
  },
  kompressory: {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.02] object-cover",
    tone: "from-[#f3f8fb] via-[#e8f3f7] to-[#ffffff]",
  },
  "rentgen-oborudovanie": {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.18] object-cover",
    tone: "from-[#f6f8f8] via-[#eef2f3] to-[#ffffff]",
  },
  "nakonechniki-i-motory": {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.2] object-cover",
    tone: "from-[#f7f7f5] via-[#eef3f1] to-[#ffffff]",
  },
  "sterilizatsiya-i-dezinfektsiya": {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.02] object-cover",
    tone: "from-[#f5f9fb] via-[#edf7f9] to-[#ffffff]",
  },
  mebel: {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.1] object-cover",
    tone: "from-[#f6f6f3] via-[#edf3f0] to-[#ffffff]",
  },
  "raskhodnye-materialy": {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.16] object-cover",
    tone: "from-[#f8f8f5] via-[#eff5f2] to-[#ffffff]",
  },
  "zapchasti-dlya-oborudovaniya": {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.22] object-cover",
    tone: "from-[#f7f7f7] via-[#edf1f3] to-[#ffffff]",
  },
  "zubotekhnicheskoe-oborudovanie": {
    image: "/images/category.jpg",
    imageClassName: "scale-[1.06] object-cover",
    tone: "from-[#f4f8fa] via-[#eaf2f5] to-[#ffffff]",
  },
};

function getCategoryVisual(category: Category) {
  return (
    categoryVisuals[category.slug] ?? {
      image: "/images/category.jpg",
      imageClassName: "scale-[1.06] object-cover",
      tone: "from-[#f5f7f8] via-[#eceff1] to-[#ffffff]",
    }
  );
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5",
        className,
      )}
    >
      {categories.map((category) => (
        <CategoryCard
          category={category}
          key={category.id}
          visual={getCategoryVisual(category)}
        />
      ))}
    </div>
  );
}
