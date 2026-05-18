// components/home/LifestyleSection.jsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LIFESTYLE_IMAGES = [
  "/images/lifestyle-image-1.png",
  "/images/lifestyle-image-2.png",
  "/images/lifestyle-image-3.png",
  "/images/lifestyle-image-4.png",
];

export default function LifestyleSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 grid lg:grid-cols-2 gap-14 items-center">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl font-semi-bold text-[var(--color-primary)] leading-tight">
          Not just a stay.
        </h2>
        <p className="font-script text-6xl sm:text-7xl text-[var(--color-primary)] mt-3 leading-none">
          A LIFESTYLE
        </p>
        <div className="mt-8 space-y-5 text-[var(--color-muted-foreground)] text-base leading-relaxed max-w-xl">
          <p>
            Wake up to calm bay waters. Paddle out before breakfast. Spend
            your afternoons at the sandbar, and your evenings dockside under
            the lights.
          </p>
          <p>
            Want a private chef after a long day on the water? Done. Need the
            fridge stocked before you arrive? Already handled.
          </p>
          <p className="text-[var(--color-foreground)] font-semibold">
            This isn't a vacation rental.
            <br />
            It's your Keys routine.
          </p>
        </div>
        <Button asChild size="lg" className="mt-8">
          <Link href="/properties">Read more about HOME</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {LIFESTYLE_IMAGES.map((src, i) => (
          <div key={src}
            className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${i % 2 ? "translate-y-6" : ""}`}>
            <Image src={src} alt="Lifestyle" fill className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw" />
          </div>
        ))}
      </div>
    </section>
  );
}