import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillBadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent";
};

export function PillBadge({
  children,
  className,
  variant = "default",
}: PillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium leading-4 shadow-sm backdrop-blur",
        variant === "accent"
          ? "border-primary/10 bg-primary/5 text-primary"
          : "border-white/60 bg-white/85 text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
