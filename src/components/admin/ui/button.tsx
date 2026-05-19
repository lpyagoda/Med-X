import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const adminButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white! hover:bg-primary-hover hover:text-white! shadow-sm",
        destructive:
          "bg-destructive text-white! hover:opacity-90 shadow-sm",
        outline:
          "border border-admin-border bg-admin-surface text-foreground hover:bg-admin-bg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-admin-bg text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type AdminButtonProps = ComponentProps<"button"> &
  VariantProps<typeof adminButtonVariants> & {
    asChild?: boolean;
  };

export function AdminButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: AdminButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(adminButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { adminButtonVariants };
