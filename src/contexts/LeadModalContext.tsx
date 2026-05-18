"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type LeadModalContextValue = {
  close: () => void;
  isOpen: boolean;
  open: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LeadModalContext.Provider
      value={{ close: () => setIsOpen(false), isOpen, open: () => setIsOpen(true) }}
    >
      {children}
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal must be used within LeadModalProvider");
  return ctx;
}
