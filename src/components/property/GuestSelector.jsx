"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS = [
  { key: "adults", label: "Adults", hint: "Ages 13+", min: 1 },
  { key: "children", label: "Children", hint: "Ages 2–12", min: 0 },
  { key: "infants", label: "Infants", hint: "Under 2", min: 0 }
];

export default function GuestSelector({ value, onChange, max = 12, className, labelPrefix = "Guests" }) {
  const [open, setOpen] = useState(false);
  const total = value.adults + value.children + value.infants;
  const summary = `${value.adults} adult${value.adults !== 1 ? "s" : ""}, ${value.children} child${value.children !== 1 ? "ren" : ""}, ${value.infants} infant${value.infants !== 1 ? "s" : ""}`;

  const set = (key, delta) => {
    const next = { ...value, [key]: Math.max(ROWS.find((r) => r.key === key).min, value[key] + delta) };
    if (next.adults + next.children + next.infants > max) return;
    onChange(next);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-testid="guest-selector-trigger"
          className={cn(
            "group relative flex w-full flex-col items-start rounded-sm border border-[var(--color-input)] bg-white px-3.5 pt-2 pb-1.5 text-left transition-colors hover:border-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20",
            className
          )}
        >
          <span className="text-[11px] font-medium text-[var(--color-muted-foreground)]">{labelPrefix}</span>
          <span className="text-sm text-[var(--color-foreground)]">{summary}</span>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)]" />
          <span className="sr-only">{total} total guests</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          {ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between py-1.5">
              <div>
                <div className="text-sm font-medium text-[var(--color-foreground)]">{row.label}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">{row.hint}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set(row.key, -1)}
                  disabled={value[row.key] <= row.min}
                  aria-label={`Decrease ${row.label}`}
                  data-testid={`guest-${row.key}-decrease`}
                  className="h-8 w-8 rounded-full border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-secondary)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[18px] text-center text-sm font-medium" data-testid={`guest-${row.key}-count`}>{value[row.key]}</span>
                <button
                  type="button"
                  onClick={() => set(row.key, 1)}
                  aria-label={`Increase ${row.label}`}
                  data-testid={`guest-${row.key}-increase`}
                  className="h-8 w-8 rounded-full border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-secondary)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)} data-testid="guest-selector-done">Done</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
