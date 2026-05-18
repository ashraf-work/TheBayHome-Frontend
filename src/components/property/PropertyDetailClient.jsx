"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import AvailabilityCard from "@/components/property/AvailabilityCard";
import { api } from "@/services/api";
import ImagePreviewModal from "@/components/property/ImagePreviewModel";

export default function PropertyDetailClient({
  propertyId,
  initialProperty,
  initialSeasons = [],
}) {
  const id = propertyId;

  const [property, setProperty] = useState(initialProperty);
  const [mapLoading, setMapLoading] = useState(true);
  const [seasons, setSeasons] = useState(initialSeasons);
  const [error, setError] = useState("");

  const [visibleImages, setVisibleImages] = useState(9);
  const [previewImage, setPreviewImage] = useState(null);

  const getEmbedUrl = (url) => {
    if (!url) return "";

    const match = url.match(/place\/([^/]+)/);

    if (!match) return "";

    const place = match[1].replaceAll("+", " ");

    return `https://www.google.com/maps?q=${encodeURIComponent(
      place,
    )}&output=embed`;
  };

  useEffect(() => {
    if (!id || initialProperty) return;

    let cancelled = false;

    api
      .getProperty(id)
      .then((d) => !cancelled && setProperty(d.data))
      .catch((e) => {
        if (!cancelled) {
          if (e.status === 404) setError("not-found");
          else setError(e.message || "Failed to load property.");
        }
      });

    api
      .getSeasonsData(id)
      .then((d) => {
        if (!cancelled) setSeasons(d.data || []);
      })
      .catch(() => !cancelled && setSeasons([]));

    return () => {
      cancelled = true;
    };
  }, [id, initialProperty]);

  if (error === "not-found") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Property not found</h1>
        <p className="mt-3 text-[var(--color-muted-foreground)]">
          This property is no longer available.
        </p>
      </div>
    );
  }

  const galleryImages = property?.images?.gallery || [];
  const thumbnail = property?.images?.thumbnail;
  const shownImages = galleryImages.slice(0, visibleImages);
  const hasMoreImages = visibleImages < galleryImages.length;
  const allImages = property
    ? [thumbnail, ...galleryImages].filter(Boolean)
    : [];
  const visibleSeasons = (seasons || []).filter((season) => season.dateRanges?.[0]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-10 items-start">
        {/* Gallery */}
        <div>
          {!property ? (
            <>
              <Skeleton className="h-[380px] w-full rounded-2xl" />
              <div className="mt-3 grid grid-cols-3 gap-3">
                <Skeleton className="h-42 w-full rounded-2xl" />
                <Skeleton className="h-42 w-full rounded-2xl" />
                <Skeleton className="h-42 w-full rounded-2xl" />
              </div>
            </>
          ) : (
            <>
              {thumbnail && (
                <button
                  type="button"
                  onClick={() => setPreviewImage(thumbnail)}
                  className="relative h-[380px] w-full overflow-hidden rounded-2xl"
                  data-testid="property-hero-image"
                >
                  <Image
                    src={thumbnail}
                    alt={property.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </button>
              )}

              <div className="mt-3 grid grid-cols-3 gap-3">
                {galleryImages.slice(0, 3).map((src, i) => (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(src)}
                    key={src + i}
                    className="relative aspect-[3/2] overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={src}
                      alt={`${property.title} photo ${i + 1}`}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Availability card */}
        <div className="lg:sticky lg:top-28">
          {property ? (
            <AvailabilityCard property={property} seasons={seasons} />
          ) : (
            <Skeleton className="h-[540px] w-full rounded-2xl" />
          )}
        </div>
      </div>

      {/* Title + description */}
      <div className="mt-12 max-w-3xl">
        {!property ? (
          <>
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--color-primary)]">
              {property.title}
            </h1>

            <p
              className="mt-5 text-[var(--color-muted-foreground)] leading-relaxed"
              data-testid="property-description"
            >
              {property.description}
            </p>
          </>
        )}
      </div>

      {/* Amenities chips */}
      {property && (
        <div className="mt-10" data-testid="amenity-chips">
          <div className="flex max-w-5xl mx-auto justify-center flex-wrap gap-3">
            {(property.amenities || []).map((chip) => (
              <Badge
                key={chip}
                variant="outline"
                className="px-5 py-2 rounded-full text-sm"
              >
                {chip}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Photo grid */}
      {property && (
        <div className="mt-12" data-testid="property-gallery-grid">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shownImages.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setPreviewImage(src)}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl group bg-gray-100"
              >
                <Image
                  src={src}
                  alt={`${property.title} photo ${i + 1}`}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </button>
            ))}
          </div>

          {hasMoreImages && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleImages((prev) => prev + 9)}
                className="rounded-full bg-[var(--color-primary)] px-8 py-3 text-white font-semibold hover:opacity-90 transition"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}

      {/* Map */}
      {property && (
        <div
          className="mt-12 overflow-hidden rounded-2xl border border-[var(--color-border)]"
          data-testid="property-map"
        >
          <div className="relative w-full h-[360px]">
            {/* Loading Skeleton */}
            {mapLoading && (
              <div className="absolute inset-0 z-10 animate-pulse bg-[var(--color-secondary)] flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-10 w-10 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Loading map...
                  </p>
                </div>
              </div>
            )}

            <iframe
              title={`Map of ${property.location?.address || property.title}`}
              className="w-full h-[360px] border-0"
              src={getEmbedUrl(property.location.url)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoading(false)}
            />
          </div>
        </div>
      )}

      {/* Seasonal pricing table */}
      <div className="mt-12" data-testid="seasonal-pricing">
        <h2 className="font-display text-2xl font-semibold mb-5">
          Seasonal Rates
        </h2>

        {visibleSeasons.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)] px-6 py-12 text-center">
            <p className="text-4xl mb-3">🏖️</p>
            <p className="font-semibold text-[var(--color-foreground)]">
              No seasonal rates yet
            </p>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
              This property uses a standard nightly rate all year round.
            </p>
          </div>
        ) : (
          <div className="overflow-x-scroll rounded-2xl border border-[var(--color-border)] shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-primary)] text-white text-left text-nowrap">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Season</th>
                  <th className="px-5 py-3.5 font-semibold">Check-in</th>
                  <th className="px-5 py-3.5 font-semibold">Check-out</th>
                  <th className="px-5 py-3.5 font-semibold text-center">
                    Min Nights
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-center">
                    Max Nights
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-right">
                    Per Night
                  </th>
                </tr>
              </thead>

              <tbody className="text-nowrap">
                {visibleSeasons.map((s, i) => (
                  <tr
                    key={s._id}
                    className={`border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-secondary)] ${
                      i % 2 === 0
                        ? "bg-white"
                        : "bg-[var(--color-secondary)]/40"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-semibold text-[var(--color-foreground)] capitalize">
                      {s.name}
                    </td>

                    <td className="px-5 py-3.5 text-[var(--color-muted-foreground)]">
                      {new Date(s.dateRanges[0].startDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-[var(--color-muted-foreground)]">
                      {new Date(s.dateRanges[0].endDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-center text-[var(--color-muted-foreground)]">
                      {s.minNights} nights
                    </td>

                    <td className="px-5 py-3.5 text-center text-[var(--color-muted-foreground)]">
                      {s.maxNights} nights
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <span className="font-bold text-[var(--color-primary)] text-base">
                        ${s.pricePerNight}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          images={allImages}
          currentImage={previewImage}
          onClose={() => setPreviewImage(null)}
          onNavigate={(img) => setPreviewImage(img)}
        />
      )}
    </div>
  );
}
