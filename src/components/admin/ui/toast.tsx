import { Toaster as SonnerToaster } from "sonner";

export function AdminToaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "bg-admin-surface text-foreground border border-admin-border shadow-lg",
        },
      }}
    />
  );
}

export { toast } from "sonner";
