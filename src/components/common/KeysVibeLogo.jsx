import Link from "next/link";
import { cn } from "@/lib/utils";

// The Keys Vibe — text-and-symbol recreation so we don't depend on raster assets.
export default function KeysVibeLogo({ className, variant = "color" }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 group", className)} data-testid="brand-logo-link">
      <span
        aria-hidden="true"
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-sm transition-transform group-hover:-rotate-6"
      >
        {/* little palm + sun mark */}
        <svg viewBox="0 0 40 40" className="h-7 w-7">
          <circle cx="28" cy="12" r="5" fill="#f2a33a" />
          <path d="M6 30 Q14 22 22 30 T38 30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path
            d="M18 32 q-2 -10 8 -14 M18 32 q-10 -4 -14 -12 M18 32 q-1 -10 10 -10 M18 32 q-12 0 -14 6"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-script text-[1.35rem] text-[var(--color-primary)] -mb-0.5" style={{ letterSpacing: "0.02em" }}>
          The
        </span>
        <span className="font-display font-extrabold tracking-tight text-[1.15rem] text-[var(--color-primary)]">
          KEYS <span className="text-[var(--color-accent)]">VIBE</span>
        </span>
      </span>
    </Link>
  );
}
