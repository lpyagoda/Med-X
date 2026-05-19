import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function AdminInput({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm text-foreground placeholder:text-admin-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
