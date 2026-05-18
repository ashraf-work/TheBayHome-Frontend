"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = useGoogleAuth({ setLoading, router, next });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.replace(next); // redirect
    } catch (err) {
      toast.error(err.message || "Login failed");
      setLoading(false); // sirf error par reset karo
    }
    // success par loading true rehne do — page transition tak
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" data-testid="login-form">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="login-email"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--color-primary)] hover:underline"
            data-testid="forgot-password-link"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="login-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
        data-testid="login-submit"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
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
        New here?{" "}
        <Link
          href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-[var(--color-primary)] font-medium hover:underline"
          data-testid="go-signup"
        >
          Create an account
        </Link>
      </p>

    </form>
  );
}

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    let next = "/";
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      next = sp.get("next") || "/";
    }
    router.replace(next);
  }, [user, router]);

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-16 bg-[var(--color-secondary)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[var(--color-primary)]/20 shadow-xl shadow-[var(--color-primary)]/10 px-8 py-10">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-[var(--color-foreground)]">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Welcome back. Let's get you settled.
            </p>
          </div>
          <Suspense fallback={<div>Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}