"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, ExternalLink, Loader2 } from "lucide-react";

import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmbedUrl } from "@/lib/utils";

export default function ThingToDoDetailPage() {
  const { id } = useParams();

  const [thing, setThing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadThing = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.getThingToDo(id);
        setThing(res.data ?? res);
      } catch (err) {
        setError(err.message || "Could not load thing to do.");
      } finally {
        setLoading(false);
      }
    };

    loadThing();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-10 space-y-6">
        <Skeleton className="h-[420px] rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    );
  }

  if (error || !thing) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-3xl font-bold">Thing to do not found</h1>

        <p className="mt-3 text-[var(--color-muted-foreground)]">
          {error || "This item is unavailable."}
        </p>

        <Button asChild className="mt-8 rounded-2xl">
          <Link href="/things-to-do">Back to Things To Do</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <Button asChild variant="ghost" className="mb-6 rounded-2xl">
          <Link href="/things-to-do">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Things To Do
          </Link>
        </Button>

        <section className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="relative h-[280px] md:h-[460px] bg-neutral-200">
            <Image
              src={thing.image}
              alt={thing.name}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute left-6 right-6 bottom-6 text-white">
              <div className="inline-flex mb-3 rounded-full bg-[var(--color-primary)] px-4 py-1 text-sm font-semibold">
                {thing.category}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold">{thing.name}</h1>

              <div className="flex gap-3 text-sm text-white mt-2">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 mb-6" />
                <p>{thing.location?.address || "Address unavailable"}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">About this place</h2>

              <p className="text-[var(--color-muted-foreground)] leading-7">
                {thing.description}
              </p>
            </div>

            <aside className="rounded-3xl border border-[var(--color-border)] bg-neutral-50 p-5 h-fit">
              {/* <h3 className="font-bold text-lg mb-4">Location</h3> */}

             

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
                  title={`Map of ${thing.location?.address || thing.name}`}
                  className="w-full h-[360px] border-0"
                  src={getEmbedUrl(thing.location.url)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoading(false)}
                />
              </div>

              {/* {thing.location?.url && (
                <Button asChild className="w-full mt-5 rounded-2xl h-12">
                  <a
                    href={thing.location.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )} */}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
