"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6" data-testid="not-found-page">
      <div className="text-center max-w-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
          <Compass className="h-10 w-10" />
        </div>
        <p className="font-script text-[var(--color-primary)] text-2xl leading-none mb-2">You drifted off course</p>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--color-foreground)]">404</h1>
        <p className="mt-4 text-[var(--color-muted-foreground)]">
          We couldn't find that page. The tide must have swept it out.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg"><Link href="/">Back to home</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/properties">Browse properties</Link></Button>
        </div>
      </div>
    </div>
  );
}
