"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PropertyCard({ property }) {
  const thumbnail = property.images?.thumbnail;
  const gallery = property.images?.gallery || [];

  return (
    <article
      className="group rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[0_2px_8px_rgba(12,43,60,0.04)] transition-all hover:shadow-[0_12px_30px_rgba(13,142,142,0.15)] hover:-translate-y-1"
      data-testid={`property-card-${property._id}`}
    >
      <Link href={`/properties/${property._id}`} className="block">
        <div className="relative h-[320px] w-full overflow-hidden rounded-xl">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={property.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {gallery.slice(0, 3).map((src, i) => (
            <div key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image src={src} alt={`${property.title} photo ${i + 1}`} fill priority className="object-cover" sizes="200px" />
            </div>
          ))}
        </div>

        <header className="mt-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl font-semibold text-[var(--color-primary)]">{property.title}</h3>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{property.location?.address}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
            {property.rating ?? 4.9}
          </div>
        </header>

        <div className="mt-4">
          <h4 className="font-semibold text-sm text-[var(--color-foreground)] mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {(property.amenities || []).map((a) => (
              <Badge key={a} variant="outline" className="rounded-full px-3 py-1 text-xs">
                {a}
              </Badge>
            ))}
          </div>
        </div>
      </Link>

      <footer className="mt-5 flex items-center justify-between gap-3">
        <Button asChild size="lg" data-testid={`view-details-${property._id}`}>
          <Link href={`/properties/${property._id}`}>View Details</Link>
        </Button>
        <div className="text-right">
          <span className="text-sm text-[var(--color-muted-foreground)] mr-2">Starting From</span>
          <span className="font-display text-2xl font-extrabold text-[var(--color-foreground)]">
            ${property.price?.nightly ?? 0}
          </span>
        </div>
      </footer>
    </article>
  );
}
