// In-memory "database" singleton. Survives across API requests within one
// Next.js server process (hot reloads preserve it using globalThis).
// Replace with a real DB when moving to production.

import { uid } from "@/lib/utils";

const BOOTSTRAP_USERS = [
  {
    id: "u_demo",
    name: "Demo Guest",
    email: "demo@thekeysvibe.com",
    // plain text in mock mode; never do this in production
    password: "password123",
    phone: "+1 (305) 265-6226",
    createdAt: new Date("2025-11-01T10:00:00Z").toISOString()
  }
];

function getStore() {
  if (!globalThis.__KEYS_VIBE_STORE__) {
    globalThis.__KEYS_VIBE_STORE__ = {
      users: [...BOOTSTRAP_USERS],
      bookings: [],
      passwordResetTokens: {}
    };
  }
  return globalThis.__KEYS_VIBE_STORE__;
}

export const store = {
  // Users
  findUserByEmail(email) {
    return getStore().users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  },
  findUserById(id) {
    return getStore().users.find((u) => u.id === id);
  },
  createUser({ name, email, password, phone }) {
    const s = getStore();
    const user = {
      id: uid("u"),
      name,
      email,
      password,
      phone: phone || "",
      createdAt: new Date().toISOString()
    };
    s.users.push(user);
    return user;
  },
  updateUser(id, patch) {
    const s = getStore();
    const idx = s.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    s.users[idx] = { ...s.users[idx], ...patch };
    return s.users[idx];
  },
  setPassword(id, password) {
    return this.updateUser(id, { password });
  },

  // Password reset tokens
  createResetToken(email) {
    const s = getStore();
    const token = uid("rst");
    s.passwordResetTokens[token] = { email, createdAt: Date.now() };
    return token;
  },
  consumeResetToken(token) {
    const s = getStore();
    const entry = s.passwordResetTokens[token];
    if (!entry) return null;
    // 30 min expiry
    if (Date.now() - entry.createdAt > 30 * 60 * 1000) {
      delete s.passwordResetTokens[token];
      return null;
    }
    delete s.passwordResetTokens[token];
    return entry;
  },

  // Bookings
  listBookingsByUser(userId) {
    return getStore()
      .bookings.filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  listBookingsByProperty(propertyId) {
    return getStore().bookings.filter((b) => b.propertyId === propertyId && b.status !== "cancelled");
  },
  getBooking(id) {
    return getStore().bookings.find((b) => b.id === id);
  },
  createBooking(payload) {
    const s = getStore();
    const booking = {
      id: uid("bk"),
      status: "confirmed",
      createdAt: new Date().toISOString(),
      ...payload
    };
    s.bookings.push(booking);
    return booking;
  }
};

export function publicUser(user) {
  if (!user) return null;
  // eslint-disable-next-line no-unused-vars
  const { password, ...rest } = user;
  return rest;
}
