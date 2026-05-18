"use client";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center text-sm font-semibold text-[var(--color-foreground)]",
        caption_label: "font-display",
        nav: "flex items-center gap-1",
        button_previous: "h-7 w-7 rounded-full text-[var(--color-primary)] hover:bg-[var(--color-secondary)] inline-flex items-center justify-center transition-colors absolute left-1 top-1",
        button_next: "h-7 w-7 rounded-full text-[var(--color-primary)] hover:bg-[var(--color-secondary)] inline-flex items-center justify-center transition-colors absolute right-1 top-1",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[var(--color-muted-foreground)] rounded-md w-9 font-normal text-[0.7rem]",
        week: "flex w-full mt-1.5",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: "h-9 w-9 p-0 font-normal rounded-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] inline-flex items-center justify-center transition-colors disabled:opacity-40 disabled:line-through disabled:hover:bg-transparent disabled:cursor-not-allowed",
        selected: "[&>button]:bg-[var(--color-primary)] [&>button]:text-white [&>button]:hover:bg-[var(--color-teal-deep)] [&>button]:hover:text-white",
        today: "[&>button]:border [&>button]:border-[var(--color-primary)] [&>button]:text-[var(--color-primary)]",
        outside: "text-[var(--color-muted-foreground)] opacity-40",
        disabled: "opacity-40",
        range_start: "[&>button]:rounded-l-full",
        range_end: "[&>button]:rounded-r-full",
        range_middle: "[&>button]:bg-[var(--color-secondary)] [&>button]:text-[var(--color-primary)] [&>button]:rounded-none",
        hidden: "invisible",
        ...classNames
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeft className="h-4 w-4" />;
          return <ChevronRight className="h-4 w-4" />;
        }
      }}
      {...props}
    />
  );
}
