"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingCalendar from "@/components/property/BookingCalendar";
import GuestSelector from "@/components/property/GuestSelector";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, diffInNights } from "@/lib/utils";

// ─────────────────────────── date helpers (local) ───────────────────────────

const MS_DAY = 86_400_000;

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(date, n) {
  return new Date(startOfDay(date).getTime() + n * MS_DAY);
}

function parseISODateLocal(iso) {
  if (!iso) return null;
  if (iso instanceof Date) return startOfDay(iso);
  const ymd = String(iso).slice(0, 10);
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function getSeasonForDate(date, seasons) {
  if (!date || !Array.isArray(seasons) || seasons.length === 0) return null;
  const d = startOfDay(date);
  for (const season of seasons) {
    for (const range of season.dateRanges ?? []) {
      const start = parseISODateLocal(range.startDate);
      const end = parseISODateLocal(range.endDate);
      if (start && end && d >= start && d <= end) return season;
    }
  }
  return null;
}

// ──────────────────────── season pricing engine ──────────────────────────────

function computeSeasonSegments(checkIn, checkOut, seasons, fallbackNightly) {
  const start = parseISODateLocal(checkIn);
  const end = parseISODateLocal(checkOut);
  if (!start || !end || end <= start) return [];

  const segments = [];
  let cursor = startOfDay(start);

  while (cursor < end) {
    const season = getSeasonForDate(cursor, seasons);
    const seasonId = season?._id ?? "__default__";
    const seasonName = season?.name ?? null;
    const pricePerNight = season?.pricePerNight ?? fallbackNightly;

    const last = segments[segments.length - 1];
    if (last && last.seasonId === seasonId) {
      last.nights += 1;
      last.subtotal += pricePerNight;
    } else {
      segments.push({
        seasonId,
        seasonName,
        pricePerNight,
        nights: 1,
        subtotal: pricePerNight,
      });
    }
    cursor = addDays(cursor, 1);
  }

  return segments;
}

// ─────────────────────────────── component ──────────────────────────────────

export default function AvailabilityCard({
  property,
  seasons,
  className,
  title = "Check Availability",
}) {
  const router = useRouter();
  const { draft, update } = useBooking();
  const { isAuthenticated } = useAuth();

  const [calendarOpen, setCalendarOpen] = useState(false); // ← add karo

  const propertyId = property._id;

  const checkIn = draft.propertyId === propertyId ? draft.checkIn : null;
  const checkOut = draft.propertyId === propertyId ? draft.checkOut : null;

  const guests = useMemo(
    () => ({
      adults: draft.adults,
      children: draft.children,
      infants: draft.infants,
    }),
    [draft.adults, draft.children, draft.infants],
  );

  const nights = checkIn && checkOut ? diffInNights(checkIn, checkOut) : 0;

  const fallbackNightly = property?.price?.nightly ?? 0;
  const cleaningFee = property?.price?.cleaningFee ?? 0;
  const serviceFee = property?.price?.serviceFee ?? 0;
  const taxRate = property?.price?.taxRate ?? 0;

  // ── season segments ───────────────────────────────────────────────────────
  const segments = useMemo(
    () =>
      checkIn && checkOut
        ? computeSeasonSegments(
            checkIn,
            checkOut,
            seasons ?? [],
            fallbackNightly,
          )
        : [],
    [checkIn, checkOut, seasons, fallbackNightly],
  );

  // ── full pricing object ───────────────────────────────────────────────────
  const pricing = useMemo(() => {
    if (!checkIn || !checkOut || nights <= 0 || segments.length === 0)
      return null;

    const subTotal = segments.reduce((sum, s) => sum + s.subtotal, 0);
    const taxes = Math.round(
      ((subTotal + cleaningFee + serviceFee) * taxRate) / 100,
    );
    const total = subTotal + cleaningFee + serviceFee + taxes;
    const averageNightly = Math.round(subTotal / nights);
    const hasMultipleSeasons =
      segments.length > 1 || segments[0]?.seasonId !== "__default__";

    return {
      segments,
      subTotal,
      cleaningFee,
      serviceFee,
      taxes,
      total,
      averageNightly,
      hasMultipleSeasons,
    };
  }, [checkIn, checkOut, nights, segments, cleaningFee, serviceFee, taxRate]);

  // ── sync calculated pricing into BookingContext ───────────────────────────
  // Runs whenever pricing changes so checkout always has the latest numbers.
  useEffect(() => {
    // Only save when this card owns the draft (same propertyId)
    if (draft.propertyId !== propertyId) return;
    update({ pricing: pricing ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricing]);

  // ── displayed "per night" price in header ─────────────────────────────────
  const displayNightly = useMemo(() => {
    if (!pricing) return fallbackNightly;
    if (segments.length === 1) return segments[0].pricePerNight;
    return pricing.averageNightly;
  }, [pricing, segments, fallbackNightly]);

  const nightlyLabel = useMemo(() => {
    if (!pricing) return "/night";
    if (segments.length > 1) return "/night avg.";
    return "/night";
  }, [pricing, segments]);

  // ── book handler ──────────────────────────────────────────────────────────
  const handleBook = () => {
    if (!checkIn || !checkOut) {
      setCalendarOpen(true);
      return;
    }
    update({
      propertyId,
      checkIn,
      checkOut,
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants,
    });
    // if (!isAuthenticated) {
    //   router.push(`/login?next=${encodeURIComponent("/checkout")}`);
    //   return;
    // }
    router.push("/checkout");
  };

  // ─────────────────────────────── render ───────────────────────────────────
  return (
    <div
      id="check-availability"
      data-testid="availability-card"
      className={`rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_30px_rgba(13,142,142,0.12)] ${className || ""}`}
    >
      <h3 className="text-center font-display text-2xl font-semibold tracking-tight">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        <BookingCalendar
          seasons={seasons}
          propertyId={propertyId}
          checkIn={checkIn}
          checkOut={checkOut}
          minNights={property?.minNights || 2}
          onChange={({ checkIn, checkOut }) =>
            update({ propertyId, checkIn, checkOut })
          }
          open={calendarOpen} 
          onOpenChange={setCalendarOpen} 
        />
        <GuestSelector
          value={guests}
          onChange={(next) => update({ propertyId, ...next })}
          max={property.guests}
        />
      </div>

      {/* ── Price header ──────────────────────────────────────────────────── */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <div className="flex items-end gap-1">
            <span className="font-display text-4xl font-extrabold text-[var(--color-foreground)]">
              {formatCurrency(displayNightly)}
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)] mb-1.5">
              {nightlyLabel}
            </span>
          </div>
          <div
            className="mt-1.5 flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]"
            data-testid="property-rating"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]"
              />
            ))}
            <span className="ml-1 text-[var(--color-foreground)] font-medium">
              {property.rating ?? 4.9}
            </span>
          </div>
        </div>
      </div>

      {/* ── Pricing breakdown ─────────────────────────────────────────────── */}
      {pricing && (
        <div
          className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-3 text-sm space-y-1"
          data-testid="pricing-breakdown"
        >
          {pricing.segments.map((seg, i) => (
            <div
              key={`${seg.seasonId}-${i}`}
              className="flex justify-between items-start gap-2"
            >
              <span className="flex items-center gap-1.5 text-[var(--color-foreground)]">
                {seg.seasonName && (
                  <Tag className="h-3 w-3 shrink-0 text-[var(--color-primary)]" />
                )}
                <span>
                  {formatCurrency(seg.pricePerNight)} × {seg.nights}{" "}
                  {seg.nights === 1 ? "night" : "nights"}
                  {seg.seasonName && (
                    <span className="ml-1 text-[10px] font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded px-1 py-0.5">
                      {seg.seasonName}
                    </span>
                  )}
                </span>
              </span>
              <span className="shrink-0 font-medium">
                {formatCurrency(seg.subtotal)}
              </span>
            </div>
          ))}

          {pricing.segments.length > 1 && (
            <div className="flex justify-between pt-1.5  border-t border-dashed border-[var(--color-border)] text-[var(--color-muted-foreground)]">
              <span>Subtotal ({nights} nights)</span>
              <span>{formatCurrency(pricing.subTotal)}</span>
            </div>
          )}

          <div className="flex justify-between  text-[var(--color-muted-foreground)]">
            <span>Cleaning fee</span>
            <span>{formatCurrency(pricing.cleaningFee)}</span>
          </div>
          <div className="flex justify-between  text-[var(--color-muted-foreground)]">
            <span>Service fee</span>
            <span>{formatCurrency(pricing.serviceFee)}</span>
          </div>
          {/* <div className="flex justify-between text-[var(--color-muted-foreground)]">
            <span>Taxes ({taxRate}%)</span>
            <span>{formatCurrency(pricing.taxes)}</span>
          </div> */}

          <div className="flex justify-between pt-2 border-t border-[var(--color-border)] font-semibold text-[var(--color-foreground)]">
            <span>Total</span>
            <span>{formatCurrency(pricing.total)}</span>
          </div>
        </div>
      )}

      <Button
        size="lg"
        className="mt-5 w-full"
        onClick={handleBook}
        data-testid="book-now-btn"
      >
        {checkIn && checkOut ? "Book Now" : "Check Availability"}
      </Button>
    </div>
  );
}
