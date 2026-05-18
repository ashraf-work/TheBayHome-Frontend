"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster(props) {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "group toast rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-foreground)] shadow-lg",
          title: "font-medium",
          description: "text-[var(--color-muted-foreground)]",
          actionButton: "bg-[var(--color-primary)] text-white",
          cancelButton: "bg-[var(--color-muted)]",
          success: "!bg-[var(--color-primary)] !text-white !border-transparent",
          error: "!bg-[var(--color-destructive)] !text-white !border-transparent"
        }
      }}
      {...props}
    />
  );
}
