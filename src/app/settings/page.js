"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Save,
  Camera,
  Eye,
  EyeOff,
  User,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

// ── Password field with show/hide toggle ─────────────────────────────────────
function PasswordInput({ id, value, onChange, placeholder, testId }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="pr-10"
        data-testid={testId}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ── Password strength indicator ───────────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const levels = [
    { label: "Weak", color: "bg-red-400" },
    { label: "Fair", color: "bg-amber-400" },
    { label: "Good", color: "bg-blue-400" },
    { label: "Strong", color: "bg-emerald-500" },
  ];
  const { label, color } = levels[Math.max(0, score - 1)];

  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1">
        {levels.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? color : "bg-[var(--color-muted)]"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-[var(--color-muted-foreground)]">
        Strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-muted)]/30">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
          <Icon
            className="h-4.5 w-4.5 text-[var(--color-primary)]"
            strokeWidth={2}
          />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function SettingsInner() {
  const { user, updateProfile, updatePassword } = useAuth();

  // Profile state
  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatarPreview(user.picture || null);
    }
  }, [user]);

  // ── Avatar pick ────────────────────────────────────────────────────────────
  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Save profile ───────────────────────────────────────────────────────────
  const onSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty.");
    setSavingProfile(true);
    try {
      const formData = new FormData();

      formData.append("name", name.trim());

      if (avatarFile) {
        formData.append("file", avatarFile);
      }

      await updateProfile(formData);

      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.message || "Could not save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Save password ──────────────────────────────────────────────────────────
  const onSavePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword) return toast.error("Please enter your current password.");
    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match.");
    setSavingPassword(true);
    try {
      await updatePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully.");
    } catch (err) {
      toast.error(err.message || "Could not update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  // Initials fallback for avatar
  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="mx-auto max-w-2xl px-5 py-14 space-y-8"
      data-testid="settings-page"
    >
      {/* Page header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">
          Settings
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1.5">
          Manage your profile and account security.
        </p>
      </div>

      {/* ── Profile section ── */}
      <Section
        icon={User}
        title="Profile"
        subtitle="Update your display name and photo"
      >
        <form
          onSubmit={onSaveProfile}
          className="space-y-6"
          data-testid="profile-form"
        >
          {/* Avatar picker */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 ring-2 ring-[var(--color-border)]">
                <AvatarImage src={avatarPreview} alt={user?.name} />
                <AvatarFallback className="text-lg font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
                data-testid="settings-avatar-input"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                {user?.email}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs text-[var(--color-primary)] hover:underline font-medium"
              >
                Change photo
              </button>
            </div>
          </div>

          <Separator />

          {/* Name field only */}
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              data-testid="settings-name"
            />
          </div>

          {/* Email — read only */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[var(--color-muted-foreground)]"
            >
              Email address
              <span className="ml-2 text-[10px] bg-[var(--color-muted)] rounded px-1.5 py-0.5 font-normal">
                Cannot be changed
              </span>
            </Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-[var(--color-muted)]/50 cursor-not-allowed opacity-60"
              data-testid="settings-email"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={savingProfile}
              data-testid="settings-save-profile"
            >
              {savingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save changes
            </Button>
          </div>
        </form>
      </Section>

      {/* ── Password section ── */}
      <Section
        icon={Lock}
        title="Change Password"
        subtitle="Enter your current password to set a new one"
      >
        <form
          onSubmit={onSavePassword}
          className="space-y-4"
          data-testid="password-form"
        >
          {/* Old password */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current password</Label>
            <PasswordInput
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              testId="settings-old-password"
            />
          </div>

          <Separator />

          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              testId="settings-new-password"
            />
            <PasswordStrength password={newPassword} />
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              testId="settings-confirm-password"
            />
            {/* Match indicator */}
            {confirmPassword && (
              <p
                className={`text-[11px] flex items-center gap-1 mt-1 ${
                  newPassword === confirmPassword
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                {newPassword === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={savingPassword}
              data-testid="settings-save-password"
            >
              {savingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Update password
            </Button>
          </div>
        </form>
      </Section>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsInner />
    </ProtectedRoute>
  );
}
