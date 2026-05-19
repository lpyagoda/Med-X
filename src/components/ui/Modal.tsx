import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ModalProps = {
  children: ReactNode;
  className?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function Modal({ children, className, onClose, open, title }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      aria-label={title}
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-lg rounded-[28px] border border-border/80 bg-white p-6 shadow-[0_32px_96px_rgba(7,55,99,0.2)] sm:p-8",
          className,
        )}
        ref={panelRef}
        tabIndex={-1}
      >
        <button
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-card-soft hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
}
