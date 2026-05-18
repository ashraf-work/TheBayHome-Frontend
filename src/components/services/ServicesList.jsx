"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export default function ServicesList({ services }) {
  const [expanded, setExpanded] = useState({});

  return (
    <div
      className="mx-auto max-w-4xl space-y-6 px-5 py-16"
      data-testid="services-list"
    >
      {services.map((service) => (
        <article
          key={service.id}
          data-testid={`service-item-${service.id}`}
          className="grid overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm sm:grid-cols-[260px_1fr]"
        >
          <div className="relative aspect-[4/3] sm:aspect-auto">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 260px"
            />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-[var(--color-foreground)]">
                {service.title}
              </h3>
              <span className="font-display text-xl font-extrabold text-[var(--color-foreground)]">
                {formatCurrency(service.price)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {expanded[service.id]
                ? service.description
                : service.shortDescription}
            </p>
            <button
              type="button"
              onClick={() =>
                setExpanded((value) => ({
                  ...value,
                  [service.id]: !value[service.id],
                }))
              }
              className="mt-2 text-sm font-medium text-[var(--color-foreground)] underline underline-offset-4 hover:text-[var(--color-primary)]"
              data-testid={`service-view-more-${service.id}`}
            >
              {expanded[service.id] ? "View less" : "View more"}
            </button>
            <div className="mt-4 text-sm text-[var(--color-muted-foreground)]">
              {formatCurrency(service.price)} ({service.priceNote})
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
