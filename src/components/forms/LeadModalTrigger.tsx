import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { useLeadModal } from "@/contexts/LeadModalContext";

type LeadModalTriggerProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

export function LeadModalTrigger({
  children,
  className,
  onClick,
  size = "md",
  variant = "primary",
}: LeadModalTriggerProps) {
  const { open } = useLeadModal();

  function handleClick() {
    onClick?.();
    open();
  }

  return (
    <button
      className={buttonVariants({ className, size, variant })}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  );
}
