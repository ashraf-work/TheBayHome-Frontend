"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-teal-deep)] shadow-sm",
        outline: "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-secondary)]",
        ghost: "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline rounded-none",
        secondary: "bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-secondary)_85%,black)]",
        accent: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-orange-deep)]",
        destructive: "bg-[var(--color-destructive)] text-white hover:opacity-90"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

export { buttonVariants };
