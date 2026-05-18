// components/home/HeroSection.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AvailabilityCard from "@/components/property/AvailabilityCard";
import { api } from "@/services/api";
import { PROPERTY_HERO_CONTENT } from "@/lib/heroContent";

export default function HeroSection({ initialProperties = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [properties, setProperties] = useState(initialProperties);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [seasonsMap, setSeasonsMap] = useState({});
  const [seasonsLoading, setSeasonsLoading] = useState(false);

  const total = properties.length;
  const activeProperty = properties[activeIndex] ?? null;
  const activePropertyId = activeProperty?._id ?? null;
  const activeSeasons = activePropertyId ? (seasonsMap[activePropertyId] ?? null) : null;
  const heroContent = PROPERTY_HERO_CONTENT[activeIndex] ?? PROPERTY_HERO_CONTENT[0];

  useEffect(() => {
    if (initialProperties.length > 0) return undefined;

    let cancelled = false;
    api.listProperties()
      .then((d) => {
        if (!cancelled) setProperties(d.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      });
    return () => { cancelled = true; };
  }, [initialProperties.length])


  useEffect(() => {
    if (!activePropertyId || seasonsMap[activePropertyId] !== undefined) return;
    let cancelled = false;
    setSeasonsLoading(true);
    api.getSeasonsData(activePropertyId)
      .then((d) => {
        if (!cancelled)
          setSeasonsMap((prev) => ({ ...prev, [activePropertyId]: d.data ?? [] }));
      })
      .catch(() => {
        if (!cancelled)
          setSeasonsMap((prev) => ({ ...prev, [activePropertyId]: [] }));
      })
      .finally(() => {
        if (!cancelled) setSeasonsLoading(false);
      });
    return () => { cancelled = true; };
  }, [activePropertyId]);

  const goTo = useCallback((newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 250);
  }, [isTransitioning]);

  const prev = () => goTo((activeIndex - 1 + total) % total);
  const next = () => goTo((activeIndex + 1) % total);

  return (
    <section className="relative xl:h-[676px] lg:py-12 py-16 overflow-hidden" data-testid="home-hero">
      <Image
        key={heroContent.bgImage + activeIndex}
        src={heroContent.bgImage}
        alt="Property background"
        fill priority
        className={`object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto max-w-7xl px-5 h-full items-start lg:grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Left copy */}
        <div className={`text-white mb-12 transition-opacity duration-400 ${isTransitioning ? "opacity-0" : "opacity-100 animate-fade-up"}`}>
          <p className="text-[var(--color-accent)] font-bold tracking-[0.3em] text-xs sm:text-sm uppercase mb-4">
            {heroContent.eyebrow}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.3] tracking-tight max-w-3xl">
            {heroContent.headline.map((line, i) => (
              <span key={i}>
                {line}
                {i < heroContent.headline.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="font-script text-4xl sm:text-5xl text-[#8fdce0] mt-6">{heroContent.script}</p>
          <p className="mt-4 text-white max-w-xl text-base sm:text-lg">{heroContent.body}</p>

          {/* Highlights */}
          <div className="mt-10 max-w-3xl">
            <ul className="flex items-center gap-0 sm:gap-8 flex-wrap justify-between md:justify-start md:flex-nowrap md:gap-18">
              {heroContent.highlights.map(({ label, Icon }) => (
                <li key={label} className="flex flex-col items-center text-center">
                  <span className="flex h-8 sm:h-12 w-8 sm:w-12 items-center justify-center rounded-full bg-white/12 backdrop-blur-sm">
                    <Icon className="sm:h-6 h-4 sm:w-6 w-4 text-white" />
                  </span>
                  <span className="mt-2 sm:text-sm text-xs font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slider controls */}
          {total > 1 && (
            <div className="flex items-center justify-between sm:justify-start gap-6 mt-8">
              <button onClick={prev} aria-label="Previous property"
                className="z-20 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {properties.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} aria-label={`Go to property ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/70"}`} />
                ))}
              </div>
              <button onClick={next} aria-label="Next property"
                className="z-20 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <Button asChild size="lg" variant="secondary"
            className="mt-8 bg-white text-[var(--color-foreground)] hover:bg-white/90"
            data-testid="view-photos-btn">
            <Link href={activePropertyId ? `/properties/${activePropertyId}` : "#"}>
              View More
            </Link>
          </Button>
        </div>

        {/* Booking card */}
        <div className="lg:sticky lg:top-12">
          {activeProperty ? (
            <AvailabilityCard key={activePropertyId} property={activeProperty} seasons={activeSeasons} />
          ) : (
            <Skeleton className="h-[340px] w-full rounded-2xl" />
          )}
          {seasonsLoading && activeProperty && (
            <p className="text-center text-xs text-white/70 mt-2 animate-pulse">
              Loading availability…
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
