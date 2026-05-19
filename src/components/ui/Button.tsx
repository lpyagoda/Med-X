import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type ButtonLinkProps = ButtonBaseProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps | "href">;

type ButtonNativeProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps | "className"> & {
    href?: never;
  };

export type ButtonProps = ButtonLinkProps | ButtonNativeProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white! shadow-[0_18px_38px_rgba(7,55,99,0.18)] hover:-translate-y-0.5 hover:bg-primary-hover hover:text-white! hover:shadow-[0_22px_44px_rgba(7,55,99,0.22)]",
  secondary:
    "border border-white/70 bg-white text-primary shadow-[0_16px_32px_rgba(7,55,99,0.12)] hover:-translate-y-0.5 hover:bg-card-soft",
  outline:
    "border border-border bg-white/72 text-primary shadow-[0_12px_28px_rgba(7,55,99,0.06)] backdrop-blur hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white",
  ghost: "text-primary hover:bg-[color-mix(in_srgb,var(--primary)_7%,white)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
};

function isExternalHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  );
}

export function buttonVariants({
  className,
  size = "md",
  variant = "primary",
}: {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button(props: ButtonProps) {
  const { children, className, size = "md", variant = "primary", ...restProps } = props;
  const classes = buttonVariants({ className, size, variant });

  if ("href" in restProps && restProps.href !== undefined) {
    const { href, ...rest } = restProps;
    if (isExternalHref(href)) {
      return (
        <a className={classes} href={href} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} to={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...restProps}>
      {children}
    </button>
  );
}
