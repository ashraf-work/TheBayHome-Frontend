import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-[var(--color-secondary)] text-[var(--color-primary)] border-[var(--color-primary)]/20",
    destructive: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200"
  };
  return (
    <div
      role="alert"
      className={cn("relative w-full rounded-lg border px-4 py-3 text-sm", variants[variant], className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }) {
  return <h5 className={cn("mb-1 font-medium leading-none", className)} {...props} />;
}

export function AlertDescription({ className, ...props }) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />;
}
