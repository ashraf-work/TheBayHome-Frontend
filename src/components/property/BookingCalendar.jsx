"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import {
  CalendarDays,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MS_DAY = 86_400_000;

function startOfDay(date) {
  if (!date) return null;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseISODateLocal(value) {
  if (!value) return null;
  if (value instanceof Date) return startOfDay(value);

  const ymd = String(value).slice(0, 10);
  const [y, m, d] = ymd.split("-").map(Number);

  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISODate(date) {
  if (!date) return null;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  return new Date(startOfDay(date).getTime() + days * MS_DAY);
}

function diffDays(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / MS_DAY);
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function dateKey(date) {
  return toISODate(startOfDay(date));
}

function formatPretty(date) {
  if (!date) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function rangeContainsBlocked(from, to, blockedDates) {
  if (!from || !to) return false;

  return blockedDates.some((date) => {
    const d = startOfDay(date);
    return d > startOfDay(from) && d < startOfDay(to);
  });
}

function getSeasonForDate(date, seasons) {
  if (!date || !Array.isArray(seasons)) return null;

  const selectedDate = startOfDay(date);

  for (const season of seasons) {
    for (const range of season.dateRanges ?? []) {
      const start = parseISODateLocal(range.startDate);
      const end = parseISODateLocal(range.endDate);

      if (start && end && selectedDate >= start && selectedDate <= end) {
        return season;
      }
    }
  }

  return null;
}

export default function BookingCalendar({
  propertyId,
  seasons = [],
  checkIn,
  checkOut,
  onChange,
  minNights = 2,
  className,
  open,
  onOpenChange,
}) {
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoverDate, setHoverDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(null);
  const [popoverStyle, setPopoverStyle] = useState({});

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const today = useMemo(() => startOfDay(new Date()), []);

  const fromDate = useMemo(() => parseISODateLocal(checkIn), [checkIn]);

  const rawToDate = useMemo(() => parseISODateLocal(checkOut), [checkOut]);

  const toDate = useMemo(() => {
    if (!fromDate || !rawToDate) return null;
    if (rawToDate <= fromDate) return null;
    return rawToDate;
  }, [fromDate, rawToDate]);

  const selectingCheckout = Boolean(fromDate && !toDate);

  const activeSeason = useMemo(
    () => getSeasonForDate(fromDate, seasons),
    [fromDate, seasons],
  );

  const effectiveMinNights = activeSeason?.minNights ?? minNights;
  const effectiveMaxNights = activeSeason?.maxNights ?? null;

  const bookedSet = useMemo(() => {
    return new Set(bookedDates.map(dateKey));
  }, [bookedDates]);

  const isBooked = useCallback(
    (date) => bookedSet.has(dateKey(date)),
    [bookedSet],
  );

  const nextBookedAfter = useCallback(
    (date) => {
      if (!date) return null;

      const from = startOfDay(date);
      return bookedDates.find((booked) => booked > from) || null;
    },
    [bookedDates],
  );

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const width = isMobile ? window.innerWidth - 24 : 680;

    setPopoverStyle({
      position: "fixed",
      top: Math.min(rect.bottom + 8, window.innerHeight - 20),
      left: isMobile ? 12 : "auto",
      right: isMobile ? 12 : window.innerWidth - rect.right,
      width: isMobile ? width : "auto",
      zIndex: 99,
    });
  }, [isMobile]);

  const clearSelection = useCallback(
    (event) => {
      event?.stopPropagation?.();

      setHoverDate(null);
      onChange?.({ checkIn: null, checkOut: null });
    },
    [onChange, today],
  );

  useEffect(() => {
    if (!open) {
      setHoverDate(null);
      setCalendarMonth(null);
      return;
    }

    setCalendarMonth((currentMonth) => {
      if (currentMonth) return currentMonth;

      const monthSource = fromDate || today;

      return new Date(monthSource.getFullYear(), monthSource.getMonth(), 1);
    });
  }, [open, today]);

  useEffect(() => {
    if (!open || !propertyId) return;

    let cancelled = false;

    setLoading(true);
    setError("");

    api
      .getBookedDates(propertyId)
      .then((res) => {
        if (cancelled) return;

        const unique = new Map();

        for (const item of res?.data || []) {
          const parsed = parseISODateLocal(item);
          if (parsed) unique.set(dateKey(parsed), parsed);
        }

        const sorted = Array.from(unique.values()).sort((a, b) => a - b);
        setBookedDates(sorted);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "Could not load availability.");
          setBookedDates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, propertyId]);

  useEffect(() => {
    if (!open) return;

    const id = requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event) => {
      const target = event.target;

      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      setHoverDate(null);
      onOpenChange?.(false);
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setHoverDate(null);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  const disabledDays = useMemo(() => {
    const disabled = [{ before: today }, ...bookedDates];

    if (selectingCheckout && fromDate) {
      disabled.push({
        from: fromDate,
        to: addDays(fromDate, effectiveMinNights - 1),
      });

      const nextBooked = nextBookedAfter(fromDate);

      if (nextBooked) {
        disabled.push({
          from: nextBooked,
          to: new Date(2999, 11, 31),
        });
      }

      if (effectiveMaxNights !== null) {
        const maxCheckout = addDays(fromDate, effectiveMaxNights);

        disabled.push({
          from: addDays(maxCheckout, 1),
          to: new Date(2999, 11, 31),
        });
      }
    }

    return disabled;
  }, [
    today,
    bookedDates,
    selectingCheckout,
    fromDate,
    effectiveMinNights,
    effectiveMaxNights,
    nextBookedAfter,
  ]);

  const previewEnd = useMemo(() => {
    if (!selectingCheckout || !fromDate || !hoverDate) return null;
    if (hoverDate <= fromDate) return null;
    if (isBooked(hoverDate)) return null;

    const nights = diffDays(fromDate, hoverDate);

    if (nights < effectiveMinNights) return null;

    if (effectiveMaxNights !== null && nights > effectiveMaxNights) {
      return addDays(fromDate, effectiveMaxNights);
    }

    if (rangeContainsBlocked(fromDate, hoverDate, bookedDates)) return null;

    return hoverDate;
  }, [
    selectingCheckout,
    fromDate,
    hoverDate,
    isBooked,
    effectiveMinNights,
    effectiveMaxNights,
    bookedDates,
  ]);

  const modifiers = useMemo(() => {
    const result = {
      booked: bookedDates,
      rangeStart: fromDate ? [fromDate] : [],
      rangeEnd: [],
    };

    if (fromDate && toDate) {
      result.rangeEnd = [toDate];
      result.inRange = { from: fromDate, to: toDate };
    } else if (fromDate && previewEnd) {
      result.rangeEnd = [previewEnd];
      result.inRange = { from: fromDate, to: previewEnd };
    }

    return result;
  }, [bookedDates, fromDate, toDate, previewEnd]);

  const handleDayClick = useCallback(
    (day, modifiers) => {
      if (modifiers?.disabled || modifiers?.booked) return;

      const clickedDate = startOfDay(day);

      if (!fromDate || toDate) {
        setHoverDate(null);
        onChange?.({
          checkIn: toISODate(clickedDate),
          checkOut: null,
        });
        return;
      }

      if (clickedDate <= fromDate) {
        setHoverDate(null);
        onChange?.({
          checkIn: toISODate(clickedDate),
          checkOut: null,
        });
        return;
      }

      const nights = diffDays(fromDate, clickedDate);

      if (nights < effectiveMinNights) return;
      if (effectiveMaxNights !== null && nights > effectiveMaxNights) return;

      if (rangeContainsBlocked(fromDate, clickedDate, bookedDates)) {
        setHoverDate(null);
        onChange?.({
          checkIn: toISODate(clickedDate),
          checkOut: null,
        });
        return;
      }

      setHoverDate(null);

      onChange?.({
        checkIn: toISODate(fromDate),
        checkOut: toISODate(clickedDate),
      });

      window.setTimeout(() => {
        onOpenChange?.(false);
      }, 160);
    },
    [
      fromDate,
      toDate,
      effectiveMinNights,
      effectiveMaxNights,
      bookedDates,
      onChange,
      onOpenChange,
    ],
  );

  const handleDayMouseEnter = useCallback(
    (day, modifiers) => {
      if (!selectingCheckout) return;
      if (modifiers?.disabled || modifiers?.booked) {
        setHoverDate(null);
        return;
      }

      setHoverDate(startOfDay(day));
    },
    [selectingCheckout],
  );

  const selectedNights = fromDate && toDate ? diffDays(fromDate, toDate) : 0;

  const statusLine = useMemo(() => {
    if (loading) return "Loading availability…";
    if (error) return error;

    if (fromDate && toDate) {
      return `${selectedNights} ${
        selectedNights === 1 ? "night" : "nights"
      } selected`;
    }

    if (selectingCheckout) {
      const minLabel = `min. ${effectiveMinNights} night${
        effectiveMinNights === 1 ? "" : "s"
      }`;

      const maxLabel =
        effectiveMaxNights !== null
          ? ` · max. ${effectiveMaxNights} night${
              effectiveMaxNights === 1 ? "" : "s"
            }`
          : "";

      const seasonLabel = activeSeason ? ` (${activeSeason.name})` : "";

      return `Pick checkout · ${minLabel}${maxLabel}${seasonLabel}`;
    }

    return "Select your check-in date";
  }, [
    loading,
    error,
    fromDate,
    toDate,
    selectedNights,
    selectingCheckout,
    effectiveMinNights,
    effectiveMaxNights,
    activeSeason,
  ]);

  const dayPickerProps = {
    onDayClick: handleDayClick,
    onDayMouseEnter: handleDayMouseEnter,
    onDayMouseLeave: () => setHoverDate(null),
    disabled: disabledDays,
    modifiers,
    modifiersClassNames: {
      booked: "rdp-booked",
      rangeStart: "rdp-custom-range-start",
      rangeEnd: "rdp-custom-range-end",
      inRange: "rdp-custom-in-range",
    },
    showOutsideDays: false,
    weekStartsOn: 0,
    fromDate: today,
    month: calendarMonth || undefined,
    onMonthChange: setCalendarMonth,
    components: {
      Chevron: ({ orientation }) =>
        orientation === "left" ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        ),
    },
  };

  const popoverContent =
    open &&
    typeof window !== "undefined" &&
    createPortal(
      <div
        ref={popoverRef}
        role="dialog"
        aria-label="Choose your dates"
        data-testid="booking-calendar-popover"
        style={popoverStyle}
        className={cn(
          "overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150",
        )}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5 border-b border-[var(--color-border)]">
          <div className="min-w-0">
            <h4 className="font-display text-sm font-semibold text-[var(--color-foreground)]">
              {fromDate && toDate
                ? `${selectedNights} ${
                    selectedNights === 1 ? "night" : "nights"
                  }`
                : "Select dates"}
            </h4>

            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5 truncate">
              {statusLine}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={clearSelection}
                data-testid="booking-calendar-clear-popover"
                className="text-xs font-medium text-[var(--color-muted-foreground)] underline-offset-4 hover:text-[var(--color-foreground)] hover:underline"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setHoverDate(null);
                onOpenChange?.(false);
              }}
              className="h-7 w-7 rounded-full hover:bg-[var(--color-muted)] flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "booking-calendar-wrapper",
            isMobile && "booking-calendar-mobile",
            isMobile ? "p-2" : "p-3 sm:p-4",
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center h-56 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-muted-foreground)]">
                Loading availability…
              </span>
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ) : (
            <DayPicker numberOfMonths={isMobile ? 1 : 2} {...dayPickerProps} />
          )}
        </div>

        <Footer />
      </div>,
      document.body,
    );

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange?.(!open)}
        data-testid="booking-calendar-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "group relative grid w-full grid-cols-2 rounded-sm border border-[var(--color-input)] bg-white text-left transition-all",
          "hover:border-[var(--color-primary)] hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)]",
          open &&
            "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25",
          className,
        )}
      >
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-r border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <CalendarDays className="h-3 w-3 text-[var(--color-muted-foreground)]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Check-in
            </span>
          </div>

          <div
            className={cn(
              "text-sm font-medium truncate",
              fromDate
                ? "text-[var(--color-foreground)]"
                : "text-[var(--color-muted-foreground)]",
            )}
          >
            {fromDate ? formatPretty(fromDate) : "Add date"}
          </div>
        </div>

        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 pr-9">
          <div className="flex items-center gap-1.5 mb-0.5">
            <CalendarDays className="h-3 w-3 text-[var(--color-muted-foreground)]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Check-out
            </span>
          </div>

          <div
            className={cn(
              "text-sm font-medium truncate",
              selectingCheckout && open
                ? "text-[var(--color-primary)] italic"
                : toDate
                  ? "text-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)]",
            )}
          >
            {toDate
              ? formatPretty(toDate)
              : selectingCheckout && open
                ? "Pick date…"
                : "Add date"}
          </div>
        </div>

        {(fromDate || toDate) && (
          <span
            role="button"
            tabIndex={0}
            onClick={clearSelection}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                clearSelection(event);
              }
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[var(--color-muted)] flex items-center justify-center hover:bg-[var(--color-muted-foreground)]/20 transition-colors"
            aria-label="Clear dates"
            data-testid="booking-calendar-clear"
          >
            <X className="h-3 w-3 text-[var(--color-muted-foreground)]" />
          </span>
        )}
      </button>

      {popoverContent}
    </div>
  );
}

function Footer() {
  return (
    <div className="px-4 py-2.5 border-t border-[var(--color-border)] bg-[var(--color-muted)]/40 flex items-center gap-5 text-[11px] text-[var(--color-muted-foreground)]">
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-primary)]" />
        Selected
      </span>

      <span className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-secondary)] border border-[var(--color-primary)]/20" />
        In range
      </span>

      <span className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-full bg-[#fff5f5] border border-[#f4b4b4]" />
        Booked
      </span>
    </div>
  );
}
