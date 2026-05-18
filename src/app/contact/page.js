"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setSubmitting(true);
    try {
      await api.sendContact(form);
      toast.success("Thanks! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Get in touch</h1>
          <p className="mt-3 text-white/90 max-w-2xl mx-auto">
            Questions about a stay, concierge add-ons, or local tips? Drop us a line — we answer fast.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-6" data-testid="contact-details">
          <InfoBlock Icon={Phone} title="Phone" value="+1 (305) 265-6226" href="tel:+13052656226" />
          <InfoBlock Icon={Mail} title="Email" value="hello@thekeysvibe.com" href="mailto:hello@thekeysvibe.com" />
          <InfoBlock Icon={MapPin} title="Location" value="Key Largo & Islamorada, Florida" />
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] h-64">
            <iframe
              title="Keys map"
              className="w-full h-full border-0"
              src="https://www.google.com/maps?q=Key+Largo,+FL&output=embed"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm space-y-5" data-testid="contact-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" data-testid="contact-name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" data-testid="contact-email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" data-testid="contact-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" data-testid="contact-subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" data-testid="contact-message" rows={6} value={form.message} onChange={(e) => set("message", e.target.value)} required />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto" data-testid="contact-submit">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}

function InfoBlock({ Icon, title, value, href }) {
  const inner = (
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-sm text-[var(--color-muted-foreground)]">{title}</div>
        <div className="text-[var(--color-foreground)] font-semibold mt-0.5">{value}</div>
      </div>
    </div>
  );
  if (href) return <a href={href} className="block">{inner}</a>;
  return inner;
}
