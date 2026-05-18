import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  label: ReactNode;
};

export function Input({ className, disabled, error, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-2" htmlFor={inputId}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        className={cn(
          "h-12 rounded-2xl border border-border bg-white px-4 text-sm text-foreground shadow-inner outline-none transition placeholder:text-muted/62 focus:border-primary/35 focus:ring-4 focus:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-card-soft disabled:text-muted",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className,
        )}
        disabled={disabled}
        id={inputId}
        {...props}
      />
      {error ? <span className="text-sm leading-5 text-red-600">{error}</span> : null}
    </label>
  );
}
