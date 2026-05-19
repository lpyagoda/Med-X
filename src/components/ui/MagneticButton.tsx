import { Link } from "react-router-dom";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

type MagneticLinkProps = {
  href: string;
  onClick?: never;
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type MagneticButtonProps = {
  href?: never;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  variant?: Variant;
  type?: "button" | "submit";
};

export type MagneticProps = MagneticLinkProps | MagneticButtonProps;

function useMagnetic() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setIsReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (isReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - rect.left - rect.width / 2) * 0.16,
      y: (event.clientY - rect.top - rect.height / 2) * 0.24,
    });
  };

  const onMouseLeave = () => setOffset({ x: 0, y: 0 });

  const faceStyle = {
    "--magnetic-x": `${offset.x}px`,
    "--magnetic-y": `${offset.y}px`,
  } as CSSProperties;

  return { faceStyle, onMouseLeave, onMouseMove };
}

function isExternalHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  );
}

export function MagneticButton(props: MagneticProps) {
  const { children, className, variant = "primary" } = props;
  const { faceStyle, onMouseLeave, onMouseMove } = useMagnetic();

  const wrapperClass = cn(
    "magnetic-button inline-flex h-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    className,
  );

  const face = (
    <span
      className={cn("magnetic-button-face px-7", `magnetic-button-face-${variant}`)}
      style={faceStyle}
    >
      {children}
    </span>
  );

  if (props.href !== undefined) {
    const { href } = props as MagneticLinkProps;
    if (isExternalHref(href)) {
      return (
        <a
          className={wrapperClass}
          href={href}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          {face}
        </a>
      );
    }
    return (
      <Link
        className={wrapperClass}
        to={href}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {face}
      </Link>
    );
  }

  const { onClick, type = "button" } = props as MagneticButtonProps;
  return (
    <button
      className={wrapperClass}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      type={type}
    >
      {face}
    </button>
  );
}
