import { useState, useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
};

export function MagneticBorder({ children, className, innerClassName, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("p-px", className)}
      style={{
        background: hovered
          ? `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(59,130,246,0.5), rgba(220,232,243,0.35) 65%)`
          : "rgba(220,232,243,0.35)",
        ...style,
      }}
    >
      <div className={cn("h-full w-full", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
