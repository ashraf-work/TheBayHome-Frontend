import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-[var(--color-secondary)] text-[var(--color-primary)] border border-transparent",
    outline: "border border-[var(--color-border)] text-[var(--color-foreground)] bg-white",
    teal: "bg-[var(--color-primary)] text-white",
    soft: "bg-white border border-[var(--color-border)] text-[var(--color-foreground)]"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
