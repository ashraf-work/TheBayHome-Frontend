"use client";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6" data-testid="global-error">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Something didn't sail right</h1>
        <p className="mt-3 text-[var(--color-muted-foreground)] text-sm">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={() => reset()} className="mt-6" size="lg">Retry</Button>
      </div>
    </div>
  );
}
