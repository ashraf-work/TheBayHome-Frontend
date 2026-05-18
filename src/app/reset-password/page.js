"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const email = params.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Missing or invalid token.");
    if (password !== confirm) return toast.error("Passwords do not match.");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await api.resetPassword({ token, email, password });
      toast.success("Password updated. You can now sign in.");
      router.replace("/login");
    } catch (err) {
      toast.error(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="reset-form">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          data-testid="reset-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          data-testid="reset-confirm"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
        data-testid="reset-submit"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Set new
        password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
          <KeyRound className="h-5 w-5" />
        </span>
        <h1 className="font-display text-3xl font-bold">Set a new password</h1>
      </div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-8">
        Pick something you'll remember. Minimum 6 characters.
      </p>
      <Suspense fallback={<div>Loading…</div>}>
        <ResetForm />
      </Suspense>
      <p className="mt-8 text-sm text-center text-[var(--color-muted-foreground)]">
        <Link
          href="/login"
          className="text-[var(--color-primary)] font-medium hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
