"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays, Users, MoonStar, CreditCard, Clock } from "lucide-react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/api";
import { formatCurrency, formatDate, diffInNights } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// ── Status config ─────────────────────────────────────────────────────────────
const BOOKING_STATUS = {
  pending:   { label: "Pending",   variant: "secondary",    className: "bg-amber-50  text-amber-700  border-amber-200"  },
  confirmed: { label: "Confirmed", variant: "default",      className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", variant: "destructive",  className: "bg-red-50    text-red-700    border-red-200"    },
  completed: { label: "Completed", variant: "outline",      className: "bg-blue-50   text-blue-700   border-blue-200"   },
};

const PAYMENT_STATUS = {
  pending:  { label: "Payment Pending",  className: "bg-amber-50  text-amber-700  border-amber-200"  },
  paid:     { label: "Paid",             className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed:   { label: "Payment Failed",   className: "bg-red-50    text-red-700    border-red-200"    },
  refunded: { label: "Refunded",         className: "bg-purple-50 text-purple-700  border-purple-200" },
};

function StatusBadge({ status, map }) {
  const cfg = map[status?.toLowerCase()] ?? {
    label: status ?? "—",
    className: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Single booking card ───────────────────────────────────────────────────────
function BookingCard({ b }) {
  const nights = diffInNights(b.checkIn, b.checkOut);
  const property = b.propertyId;

  return (
    <article
      key={b._id}
      data-testid={`booking-row-${b._id}`}
      className="group rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="grid sm:grid-cols-[220px_1fr] gap-0">
        {/* ── Thumbnail ── */}
        {property?.images?.thumbnail ? (
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full min-h-[160px] overflow-hidden">
            <Image
              src={property.images.thumbnail}
              alt={property.title ?? "Property"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="220px"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] sm:aspect-auto sm:h-full min-h-[160px] bg-[var(--color-muted)]" />
        )}

        {/* ── Content ── */}
        <div className="p-5 flex flex-col gap-3">
          {/* Top row: title + statuses */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-foreground)] leading-tight">
                {property?.title ?? "Property"}
              </h3>
              {property?.location && (
                <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {property.location.address}
                  {property.location.city ? `, ${property.location.city}` : ""}
                </p>
              )}
            </div>
            {/* Status badges */}
            <div className="flex flex-wrap gap-1.5 shrink-0">
              <StatusBadge status={b.bookingStatus} map={BOOKING_STATUS} />
              <StatusBadge status={b.paymentStatus} map={PAYMENT_STATUS} />
            </div>
          </div>

          <Separator />

          {/* Details row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
              <CalendarDays className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wide font-medium text-[var(--color-muted-foreground)]">Check-in</div>
                <div className="font-medium text-[var(--color-foreground)]">{formatDate(b.checkIn)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
              <CalendarDays className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wide font-medium text-[var(--color-muted-foreground)]">Check-out</div>
                <div className="font-medium text-[var(--color-foreground)]">{formatDate(b.checkOut)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
              <MoonStar className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wide font-medium text-[var(--color-muted-foreground)]">Nights</div>
                <div className="font-medium text-[var(--color-foreground)]">{nights ?? "—"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
              <Users className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wide font-medium text-[var(--color-muted-foreground)]">Guests</div>
                <div className="font-medium text-[var(--color-foreground)]">{b.guests}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
              <Clock className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wide font-medium text-[var(--color-muted-foreground)]">Booking ID</div>
                <div className="font-mono text-xs text-[var(--color-foreground)]">{b.bookingId}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
              <CreditCard className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wide font-medium text-[var(--color-muted-foreground)]">Total</div>
                <div className="font-display text-base font-bold text-[var(--color-foreground)]">
                  {formatCurrency(b.totalAmount ?? 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {property?._id && (
            <div className="mt-auto pt-1 flex justify-end">
              <Button asChild size="sm" variant="outline">
                <Link href={`/properties/${property._id}`}>View property →</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
function BookingsInner() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listMyBookings(user._id)
      .then((d) => {
        if (cancelled) return;
        // handle both { data: { bookings: [] } } and { bookings: [] }
        const list = d?.data?.bookings ?? d?.bookings ?? d?.data ?? [];
        setBookings(Array.isArray(list) ? list : []);
      })
      .catch(() => !cancelled && setBookings([]));
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-14" data-testid="my-bookings-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">My Bookings</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
          All your upcoming and past stays in one place.
        </p>
      </div>

      {/* Loading */}
      {!bookings ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>

      /* Empty */
      ) : bookings.length === 0 ? (
        <div
          className="rounded-2xl border border-[var(--color-border)] p-16 text-center"
          data-testid="bookings-empty-state"
        >
          <p className="text-[var(--color-muted-foreground)] text-base">
            You don't have any bookings yet.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/properties">Find your stay</Link>
          </Button>
        </div>

      /* List */
      ) : (
        <div className="space-y-5">
          {bookings.map((b) => (
            <BookingCard key={b._id ?? b.bookingId} b={b} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsInner />
    </ProtectedRoute>
  );
}