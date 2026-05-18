import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  error?: string;
  label: ReactNode;
};

export function Textarea({
  className,
  disabled,
  error,
  id,
  label,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="grid gap-2" htmlFor={textareaId}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <textarea
        className={cn(
          "min-h-32 resize-y rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-6 text-foreground shadow-inner outline-none transition placeholder:text-muted/62 focus:border-primary/35 focus:ring-4 focus:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-card-soft disabled:text-muted",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className,
        )}
        disabled={disabled}
        id={textareaId}
        {...props}
      />
      {error ? <span className="text-sm leading-5 text-red-600">{error}</span> : null}
    </label>
  );
}
