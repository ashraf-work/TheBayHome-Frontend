"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useCooldown } from "@/hooks/useCooldown";
import { signupSchema } from "@/validations/signupSchema";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/login";
  const { signup, sendOtp } = useAuth();

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const {
    coolingDown,
    remaining,
    start: startOtpCooldown,
    setRemaining,
  } = useCooldown(60);

  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirm: "",
  });

  const handleGoogleAuth = useGoogleAuth({ setLoading, router, next });

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const sendOtpFunc = async () => {
    if (!form.email) {
      toast.error("Please enter email first");
      return;
    }
    const emailValidation = signupSchema.shape.email.safeParse(form.email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      return;
    }
    setSendingOtp(true);

    try {
      const data = await sendOtp({
        name: form.name,
        email: form.email,
        otp: form.otp,
        password: form.password,
      });
      startOtpCooldown();
      toast.success(data.message || "OTP sent successfully");
      setOtpSent(true);
    } catch (err) {
      setRemaining(0);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      Object.values(errors).forEach((errArr) => {
        if (errArr?.[0]) toast.error(errArr[0]);
      });
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        otp: form.otp,
        password: form.password,
      });
      toast.success("Account created!");
      setRedirecting(true);
      router.replace(next);
    } catch (err) {
      if (err.details && err.details.length > 0) {
        toast.error(err.details[0].message || "Signup failed");
      } else {
        toast.error(err.message || "Signup failed");
      }
      setLoading(false);
    }
  };

  // redirect loader
  if (redirecting) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Setting up your account…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="signup-form">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
          data-testid="signup-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex sm:flex-row flex-col gap-2">
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
            data-testid="signup-email"
          />
          <Button
            type="button"
            onClick={sendOtpFunc}
            disabled={sendingOtp || loading || coolingDown}
          >
            {sendingOtp ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : coolingDown ? (
              `Resend in ${remaining}s`
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>
      </div>

      {otpSent && (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              value={form.otp}
              onChange={(e) => set("otp", e.target.value)}
              required
              data-testid="signup-otp"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
                data-testid="signup-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm</Label>
              <Input
                id="confirm"
                type="password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                required
                data-testid="signup-confirm"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
            data-testid="signup-submit"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </>
      )}

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full mt-6"
        onClick={() => handleGoogleAuth()}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Continue with Google"
        )}
      </Button>

      <p className="text-sm text-center text-[var(--color-muted-foreground)]">
        Already have an account?{" "}
        <Link
          href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-[var(--color-primary)] font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-16 bg-[var(--color-secondary)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[var(--color-primary)]/20 shadow-xl shadow-[var(--color-primary)]/10 px-8 py-10">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-[var(--color-foreground)]">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Save trips, track bookings, book faster.
            </p>
          </div>
          <Suspense fallback={<div>Loading…</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
