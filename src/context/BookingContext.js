"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const BookingContext = createContext(null);

const STORAGE_KEY = "bayhome.bookingDraft.v1";

const DEFAULT = {
  propertyId: null,
  checkIn: null, // ISO yyyy-mm-dd
  checkOut: null,
  adults: 2,
  children: 1,
  infants: 1,
};

function loadFromStorage() {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}

export function BookingProvider({ children }) {
  // Start from DEFAULT on the server to keep SSR markup stable; rehydrate from
  // localStorage on the client immediately after mount.
  const [draft, setDraft] = useState(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(loadFromStorage());
    setHydrated(true);
  }, []);

  // Persist whenever draft changes (only after rehydration to avoid stomping
  // saved state with the initial DEFAULT on first mount).
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore quota errors */
    }
  }, [draft, hydrated]);

  const update = useCallback((patch) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setDraft(DEFAULT);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  return (
    <BookingContext.Provider value={{ draft, update, reset, hydrated }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
