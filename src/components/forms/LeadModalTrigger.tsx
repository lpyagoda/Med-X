import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { useLeadModal } from "@/contexts/LeadModalContext";

type LeadModalTriggerProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

export function LeadModalTrigger({
  children,
  className,
  size = "md",
  variant = "primary",
}: LeadModalTriggerProps) {
  const { open } = useLeadModal();

  return (
    <button
      className={buttonVariants({ className, size, variant })}
      onClick={open}
      type="button"
    >
      {children}
    </button>
  );
}
