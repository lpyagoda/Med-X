"use client";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/contexts/LeadModalContext";
import type { ReactNode } from "react";

export function MagneticLeadModalTrigger({ children }: { children: ReactNode }) {
  const { open } = useLeadModal();
  return <MagneticButton onClick={open}>{children}</MagneticButton>;
}
