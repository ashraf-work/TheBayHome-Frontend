"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Loader2,
  MapPin,
  Users,
  CheckCircle2,
  Tag,
  CalendarDays,
  Pencil,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import { toast } from "sonner";

import BookingCalendar from "@/components/property/BookingCalendar";
import GuestSelector from "@/components/property/GuestSelector";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";

import { api } from "@/services/api";

import {
  diffInNights,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { useCooldown } from "@/hooks/useCooldown";
import { signupSchema } from "@/validations/signupSchema";

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
  if (!date || !Array.isArray(seasons)) return null;

  const d = startOfDay(date);

  for (const season of seasons) {
    for (const range of season.dateRanges ?? []) {
      const start = parseISODateLocal(range.startDate);
      const end = parseISODateLocal(range.endDate);

      if (start && end && d >= start && d <= end) {
        return season;
      }
    }
  }

  return null;
}

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

function buildPricing(checkIn, checkOut, seasons, property) {
  const nights = checkIn && checkOut ? diffInNights(checkIn, checkOut) : 0;

  if (!checkIn || !checkOut || nights <= 0) return null;

  const fallbackNightly = property?.price?.nightly ?? 0;
  const cleaningFee = property?.price?.cleaningFee ?? 0;
  const serviceFee = property?.price?.serviceFee ?? 0;
  const taxRate = property?.price?.taxRate ?? 0;

  const segments = computeSeasonSegments(
    checkIn,
    checkOut,
    seasons ?? [],
    fallbackNightly
  );

  const subTotal = segments.reduce((s, seg) => s + seg.subtotal, 0);

  const taxes = Math.round(
    ((subTotal + cleaningFee + serviceFee) * taxRate) / 100
  );

  const total = subTotal + cleaningFee + serviceFee + taxes;

  return {
    segments,
    subTotal,
    cleaningFee,
    serviceFee,
    taxes,
    taxRate,
    total,
    nights,
  };
}

function StepHeader({ step, title, required = false }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold shadow-md">
          {step}
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
        </div>
      </div>

      {required && (
        <div className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-semibold">
          Required
        </div>
      )}
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-4">
      <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] text-sm mb-2">
        {icon}
        {label}
      </div>

      <div className="font-semibold text-[15px]">{value}</div>
    </div>
  );
}

function Row({ label, value, bold = false }) {
  return (
    <div
      className={`flex justify-between items-center ${
        bold
          ? "font-semibold text-base"
          : "text-sm text-[var(--color-muted-foreground)]"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function AccountSection() {
  const { user, login, signup, sendOtp, logout } = useAuth();

  const [tab, setTab] = useState("signin");

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const {
    coolingDown,
    remaining,
    start: startOtpCooldown,
    setRemaining,
  } = useCooldown(60);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirm: "",
  });

  const isLoggedIn = !!user;

  const setLogin = (key, value) => {
    setLoginForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setSignup = (key, value) => {
    setSignupForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    setLoginLoading(true);

    try {
      await login(loginForm.email.trim(), loginForm.password);
      toast.success("Signed in successfully");

      setLoginForm({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const sendOtpFunc = async () => {
    if (!signupForm.email.trim()) {
      toast.error("Please enter email first");
      return;
    }

    const emailValidation = signupSchema.shape.email.safeParse(
      signupForm.email.trim()
    );

    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      return;
    }

    setSendingOtp(true);

    try {
      const data = await sendOtp({
        name: signupForm.name,
        email: signupForm.email.trim(),
        otp: signupForm.otp,
        password: signupForm.password,
      });

      startOtpCooldown();
      setOtpSent(true);

      toast.success(data?.message || "OTP sent successfully");
    } catch (error) {
      setRemaining(0);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const result = signupSchema.safeParse(signupForm);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      Object.values(errors).forEach((errArr) => {
        if (errArr?.[0]) toast.error(errArr[0]);
      });

      return;
    }

    setSignupLoading(true);

    try {
      await signup({
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        otp: signupForm.otp.trim(),
        password: signupForm.password,
      });

      toast.success("Account created successfully");

      setSignupForm({
        name: "",
        email: "",
        otp: "",
        password: "",
        confirm: "",
      });

      setOtpSent(false);
    } catch (error) {
      if (error?.details?.length > 0) {
        toast.error(error.details[0].message || "Signup failed");
      } else {
        toast.error(error?.message || "Signup failed");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await logout();
      setTab("signin");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Could not logout");
    }
  };

  return (
    <section className="mb-10">


      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-7 shadow-sm max-w-4xl">

         <StepHeader step="1" title="Your Account" />

        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={145}
            height={70}
            className="object-contain"
            priority
          />
        </div>

        {isLoggedIn ? (
          <div className="max-w-[560px] mx-auto">
            <Input
              value={user?.email || ""}
              readOnly
              className="h-12 rounded-2xl bg-white"
            />

            <div className="flex justify-end mt-2 text-xs text-[var(--color-muted-foreground)]">
              Not you?
              <button
                type="button"
                onClick={handleSwitchAccount}
                className="ml-1 text-[var(--color-primary)] underline font-medium"
              >
                Switch account
              </button>
            </div>

            <Button
              type="button"
              className="w-full mt-5 h-12 rounded-2xl"
              disabled
            >
              My Account
            </Button>
          </div>
        ) : (
          <div className="max-w-[560px] mx-auto">
            <div className="mx-auto mb-7 grid grid-cols-2 rounded-full bg-neutral-100 p-1 shadow-inner max-w-[390px]">
              <button
                type="button"
                onClick={() => setTab("signin")}
                className={`h-11 rounded-full text-sm font-semibold transition-all ${
                  tab === "signin"
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "text-[var(--color-muted-foreground)]"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`h-11 rounded-full text-sm font-semibold transition-all ${
                  tab === "signup"
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "text-[var(--color-muted-foreground)]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {tab === "signin" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={loginForm.email}
                  onChange={(e) => setLogin("email", e.target.value)}
                  className="h-12 rounded-2xl"
                  autoComplete="email"
                />

                <div className="relative">
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLogin("password", e.target.value)}
                    className="h-12 rounded-2xl pr-11"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full h-12 rounded-2xl"
                >
                  {loginLoading && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={signupForm.name}
                  onChange={(e) => setSignup("name", e.target.value)}
                  className="h-12 rounded-2xl"
                  autoComplete="name"
                />

                <div className="flex sm:flex-row flex-col gap-2">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={signupForm.email}
                    onChange={(e) => setSignup("email", e.target.value)}
                    className="h-12 rounded-2xl"
                    autoComplete="email"
                  />

                  <Button
                    type="button"
                    onClick={sendOtpFunc}
                    disabled={sendingOtp || signupLoading || coolingDown}
                    className="h-12 rounded-2xl sm:w-36"
                  >
                    {sendingOtp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : coolingDown ? (
                      `Resend ${remaining}s`
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </div>

                {otpSent && (
                  <>
                    <Input
                      type="text"
                      placeholder="OTP"
                      value={signupForm.otp}
                      onChange={(e) => setSignup("otp", e.target.value)}
                      className="h-12 rounded-2xl"
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Input
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Password"
                          value={signupForm.password}
                          onChange={(e) =>
                            setSignup("password", e.target.value)
                          }
                          className="h-12 rounded-2xl pr-11"
                          autoComplete="new-password"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowSignupPassword((prev) => !prev)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={signupForm.confirm}
                          onChange={(e) => setSignup("confirm", e.target.value)}
                          className="h-12 rounded-2xl pr-11"
                          autoComplete="new-password"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={signupLoading}
                      className="w-full h-12 rounded-2xl"
                    >
                      {signupLoading && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Create Account
                    </Button>
                  </>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CheckoutInner() {
  const { user, loading: authLoading } = useAuth();
  const { draft, update, reset } = useBooking();

  const isLoggedIn = !!user;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [property, setProperty] = useState(null);
  const [seasons, setSeasons] = useState([]);

  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");

  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const [editingDates, setEditingDates] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [editingGuests, setEditingGuests] = useState(false);

  const [localCheckIn, setLocalCheckIn] = useState(draft.checkIn);
  const [localCheckOut, setLocalCheckOut] = useState(draft.checkOut);

  const [localGuests, setLocalGuests] = useState({
    adults: draft.adults,
    children: draft.children,
    infants: draft.infants,
  });

  useEffect(() => {
    if (editingDates) return;
    setLocalCheckIn(draft.checkIn);
    setLocalCheckOut(draft.checkOut);
  }, [draft.checkIn, draft.checkOut, editingDates]);

  useEffect(() => {
    if (editingGuests) return;

    setLocalGuests({
      adults: draft.adults,
      children: draft.children,
      infants: draft.infants,
    });
  }, [draft.adults, draft.children, draft.infants, editingGuests]);

  useEffect(() => {
    setGuestName(user?.name || "");
    setGuestEmail(user?.email || "");
  }, [user?.email, user?.name]);

  useEffect(() => {
    if (!draft.propertyId || !draft.checkIn || !draft.checkOut) {
      setLoadError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    Promise.all([
      api.getProperty(draft.propertyId),
      api.getPropertySeasons(draft.propertyId).catch(() => ({ data: [] })),
    ])
      .then(([propRes, seasonRes]) => {
        const prop = propRes.data ?? propRes.property ?? propRes;

        setProperty(prop);
        setSeasons(seasonRes?.data ?? prop?.seasons ?? []);
      })
      .catch((error) => {
        setLoadError(error.message || "Could not load checkout details.");
      })
      .finally(() => setLoading(false));
  }, [draft.propertyId, draft.checkIn, draft.checkOut]);

  const pricing = useMemo(
    () => buildPricing(localCheckIn, localCheckOut, seasons, property),
    [localCheckIn, localCheckOut, seasons, property]
  );

  const handleDateChange = useCallback(({ checkIn, checkOut }) => {
    setLocalCheckIn(checkIn);
    setLocalCheckOut(checkOut);
  }, []);

  const applyDates = () => {
    update({
      propertyId: draft.propertyId,
      checkIn: localCheckIn,
      checkOut: localCheckOut,
    });

    setEditingDates(false);
    setCalendarOpen(false);
  };

  const applyGuests = () => {
    update({
      propertyId: draft.propertyId,
      ...localGuests,
    });

    setEditingGuests(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please sign in or create an account before booking.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.createBooking(
        {
          checkIn: localCheckIn,
          checkOut: localCheckOut,

          adults: localGuests.adults,
          children: localGuests.children,
          infants: localGuests.infants,

          guests:
            (localGuests.adults || 0) +
            (localGuests.children || 0) +
            (localGuests.infants || 0),

          guestInfo: {
            name: guestName,
            email: guestEmail,
            phone,
            country,
          },

          notes,
        },
        property._id
      );

      toast.success("Booking confirmed");
      setConfirmation(res.data);
      reset();
    } catch (err) {
      toast.error(err.message || "Could not complete booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-10 space-y-6">
        <Skeleton className="h-52 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    );
  }

  if (
    loadError ||
    !draft.propertyId ||
    !draft.checkIn ||
    !draft.checkOut ||
    !property
  ) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">
          Booking details unavailable
        </h1>

        <p className="mt-3 text-[var(--color-muted-foreground)]">
          {loadError || "Please choose your dates again before checkout."}
        </p>

        <Button asChild className="mt-8">
          <Link href="/properties">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto text-green-600" />

        <h1 className="text-4xl font-bold mt-5">Booking Confirmed</h1>

        <p className="mt-4 text-[var(--color-muted-foreground)]">
          Confirmation sent to{" "}
          <span className="font-semibold text-black">
            {confirmation.guestInfo?.email}
          </span>
        </p>

        <Button asChild className="mt-8 rounded-2xl h-12 px-8">
          <Link href="/bookings">View My Bookings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold">
            Complete your booking
          </h1>

          <p className="mt-2 text-[var(--color-muted-foreground)]">
            Secure your stay in just a few steps
          </p>
        </div>

        <AccountSection />

        <form onSubmit={onSubmit} className="space-y-8">
          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-7 shadow-sm">
            <StepHeader step="2" title="Trip Details" />

            <div className="grid lg:grid-cols-[320px_1fr] gap-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src={property.images?.thumbnail || property.heroImage}
                  alt={property.title || property.name || "Property"}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold">
                  {property.title || property.name}
                </h3>

                <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] mt-2">
                  <MapPin className="h-4 w-4" />
                  {property.location?.address || property.location}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <DetailCard
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Check In"
                    value={formatDate(localCheckIn)}
                  />

                  <DetailCard
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Check Out"
                    value={formatDate(localCheckOut)}
                  />

                  <DetailCard
                    icon={<Users className="h-4 w-4" />}
                    label="Guests"
                    value={`${
                      localGuests.adults + localGuests.children
                    } Guests`}
                  />

                  <DetailCard
                    icon={<Tag className="h-4 w-4" />}
                    label="Nights"
                    value={`${pricing?.nights || 0} Nights`}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => {
                      setEditingDates(true);
                      setCalendarOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Dates
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => setEditingGuests(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Edit Guests
                  </Button>
                </div>

                {editingDates && (
                  <div className="mt-6 border rounded-3xl p-5">
                    <BookingCalendar
                      propertyId={draft.propertyId}
                      seasons={seasons}
                      checkIn={localCheckIn}
                      checkOut={localCheckOut}
                      minNights={property?.minNights || 2}
                      onChange={handleDateChange}
                      open={calendarOpen}
                      onOpenChange={setCalendarOpen}
                    />

                    <div className="flex gap-3 mt-5">
                      <Button type="button" onClick={applyDates}>
                        Apply
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingDates(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {editingGuests && (
                  <div className="mt-6 border rounded-3xl p-5">
                    <GuestSelector
                      value={localGuests}
                      onChange={(next) => setLocalGuests(next)}
                      max={property.guests}
                    />

                    <div className="flex gap-3 mt-5">
                      <Button type="button" onClick={applyGuests}>
                        Apply
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingGuests(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-7 shadow-sm">
            <StepHeader step="3" title="Guest Information" required />

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Full Name</Label>

                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="h-12 rounded-2xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>

                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="h-12 rounded-2xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>

                <div className="border rounded-2xl px-4 py-3 bg-white">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phone}
                    onChange={setPhone}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Country</Label>

                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-12 rounded-2xl"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>Special Requests</Label>

                <Textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-2xl resize-none"
                />
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                By proceeding, you agree to our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[var(--color-primary)] font-medium underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/refund-policy"
                  className="text-[var(--color-primary)] font-medium underline"
                >
                  Refund Policy
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-7 shadow-sm">
            <StepHeader step="4" title="Booking Summary" />

            <div className="space-y-4">
              {pricing?.segments?.map((seg, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[var(--color-primary)]" />

                    <span className="text-sm">
                      {formatCurrency(seg.pricePerNight)} × {seg.nights} nights
                    </span>
                  </div>

                  <div className="font-medium">
                    {formatCurrency(seg.subtotal)}
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-3">
                <Row
                  label="Cleaning Fee"
                  value={formatCurrency(pricing?.cleaningFee || 0)}
                />

                <Row
                  label="Service Fee"
                  value={formatCurrency(pricing?.serviceFee || 0)}
                />

                <Row
                  label={`Taxes (${pricing?.taxRate || 0}%)`}
                  value={formatCurrency(pricing?.taxes || 0)}
                />

                <div className="border-t pt-4">
                  <Row
                    label="Total"
                    value={formatCurrency(pricing?.total || 0)}
                    bold
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-7 shadow-sm">
            <StepHeader step="5" title="Payment" />

            <div className="rounded-3xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-[var(--color-primary)]" />
                </div>

                <div>
                  <h3 className="font-semibold text-xl">
                    No payment required today
                  </h3>

                  <p className="mt-2 text-[var(--color-muted-foreground)] leading-relaxed">
                    Your reservation request will be securely submitted. Our
                    concierge team will contact you shortly to confirm
                    availability and arrange payment.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-3xl text-base font-semibold shadow-lg"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin mr-2" />}

            {isLoggedIn
              ? `Reserve Now • ${formatCurrency(pricing?.total || 0)}`
              : "Sign In To Reserve"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutInner />;
}