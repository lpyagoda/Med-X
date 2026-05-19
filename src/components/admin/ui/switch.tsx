import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminSwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

export function AdminSwitch({ className, ...props }: AdminSwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-admin-border",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

type AdminSwitchFieldProps = AdminSwitchProps & {
  label: ReactNode;
  description?: ReactNode;
};

export function AdminSwitchField({
  label,
  description,
  className,
  ...switchProps
}: AdminSwitchFieldProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3", className)}>
      <AdminSwitch {...switchProps} />
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="text-xs text-admin-muted-fg">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
