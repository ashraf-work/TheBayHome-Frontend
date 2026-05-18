const SERVER_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api";

const CLIENT_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function getBaseUrl() {
  const base = typeof window === "undefined" ? SERVER_BASE : CLIENT_BASE;
  return base.replace(/\/$/, "");
}

function withQuery(path, query = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function request(
  path,
  { method = "GET", body, headers = {}, signal, cache, revalidate = 300 } = {},
) {

 
  const isFormData = body instanceof FormData;
  const isServer = typeof window === "undefined";
  const isGet = method.toUpperCase() === "GET";
  const fetchOptions = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    credentials: "include",
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal,
  };

  if (isServer && isGet) {
    fetchOptions.cache = cache ?? "force-cache";
    if (fetchOptions.cache !== "no-store") {
      fetchOptions.next = { revalidate };
    }
  }

  if (!isGet) {
    fetchOptions.cache = "no-store";
  }
  const res = await fetch(`${getBaseUrl()}/api${path}`, fetchOptions);

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || "Invalid server response" };
  }

  if (!res.ok) {
    const err = new Error(
      (data && (data.message || data.error)) ||
        `Request failed (${res.status})`,
    );

    err.status = res.status;
    err.data = data;
    err.details = data?.details;

    throw err;
  }

  return data;
}

export const api = {
  // Auth
  me: () => request("/user", { cache: "no-store" }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  signup: (payload) =>
    request("/auth/register", { method: "POST", body: payload }),
  sendOtp: (payload) =>
    request("/otp/send-otp", { method: "POST", body: payload }),
  logout: () => request("/user/logout", { method: "POST" }),
  forgotPassword: (payload) =>
    request("/auth/forgotPassword", { method: "POST", body: payload }),
  resetPassword: (payload) =>
    request("/auth/resetPassword", { method: "POST", body: payload }),
  updateProfile: (payload) =>
    request("/user/updateProfile", { method: "POST", body: payload }),
  updatePassword: (payload) =>
    request("/user/updatePassword", { method: "PATCH", body: payload }),

  // Properties
  listProperties: () => request("/property"),
  getProperty: (id) => request(`/property/${id}`),
  getSeasonsData: (propertyId) => request(`/season/${propertyId}`),
  getPropertySeasons: (propertyId) => request(`/season/${propertyId}`),
  getBookedDates: (id) => request(`/property/${id}/booked-dates`),
  getPricing: (id, { from, to }) =>
    request(
      `/property/${id}/pricing?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),

  // Content
  listThingsToDo: () => request("/thingtodo"),
  listBlogs: (query) => request(withQuery("/blog", query)),
  getBlog: (id) => request(`/blog/${id}`),

  // Bookings
  listMyBookings: (userId) =>
    request(`/user/${userId}/bookings`, { cache: "no-store" }),
  createBooking: (payload, propertyId) =>
    request(`/booking/${propertyId}`, { method: "POST", body: payload }),

  // Contact
  sendContact: (payload) =>
    request("/contact", { method: "POST", body: payload }),
};
