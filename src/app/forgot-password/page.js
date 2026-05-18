"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useCooldown } from "@/hooks/useCooldown";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(null);
  const { coolingDown, remaining, start: startResetCooldown } = useCooldown(60);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    startResetCooldown();
    try {
      const res = await api.forgotPassword({ email });
      setSent(res);
      toast.success("If that email matches an account, we've sent a reset link.");
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
          <Mail className="h-5 w-5" />
        </span>
        <h1 className="font-display text-3xl font-bold">Forgot password?</h1>
      </div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-8">
        No worries — enter the email tied to your account and we'll send you a reset link.
      </p>
      <form onSubmit={onSubmit} className="space-y-4" data-testid="forgot-form">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="forgot-email" />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading || coolingDown}
          data-testid="forgot-submit"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {coolingDown && !loading ? `Try again in ${remaining}s` : "Send reset link"}
        </Button>
      </form>

      {sent?.devToken && (
        <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" data-testid="dev-reset-link">
          <p className="font-medium mb-1">Dev mode</p>
          <p>
            Since this is a mock environment, use this link to reset: {" "}
            <Link href={`/reset-password?token=${sent.devToken}`} className="text-[var(--color-primary)] underline">
              /reset-password?token={sent.devToken.slice(0, 12)}…
            </Link>
          </p>
        </div>
      )}

      <p className="mt-8 text-sm text-center text-[var(--color-muted-foreground)]">
        Remembered?{" "}
        <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
