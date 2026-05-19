import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export function diffInNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export const getEmbedUrl = (url) => {
  if (!url) return "";

  const match = url.match(/place\/([^/]+)/);

  if (!match) return "";

  const place = match[1].replaceAll("+", " ");

  return `https://www.google.com/maps?q=${encodeURIComponent(
    place,
  )}&output=embed`;
};
