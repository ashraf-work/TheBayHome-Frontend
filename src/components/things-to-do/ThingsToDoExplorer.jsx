"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function ThingsToDoExplorer({ data }) {
  const tabs = useMemo(() => Object.keys(data), [data]);
  const [tab, setTab] = useState(tabs[0] || "Restaurants");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const sections = data[tab] || {};
    if (!query.trim()) return sections;

    const q = query.trim().toLowerCase();
    const out = {};

    for (const [area, items] of Object.entries(sections)) {
      const matches = items.filter((item) =>
        [item.name, item.description, item.area]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q)),
      );

      if (matches.length) out[area] = matches;
    }

    return out;
  }, [data, query, tab]);

  return (
    <Tabs value={tab} onValueChange={setTab} data-testid="things-tabs">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {tabs.map((item) => (
          <TabsTrigger
            key={item}
            value={item}
            className="w-full"
            data-testid={`tab-${item.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {item}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-8 flex justify-end">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-primary)]" />
          <Input
            data-testid="things-search-input"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9 rounded-full border-[var(--color-primary)]/40"
          />
        </div>
      </div>

      {tabs.map((item) => (
        <TabsContent key={item} value={item}>
          {Object.keys(filtered).length === 0 ? (
            <div
              className="py-16 text-center text-[var(--color-muted-foreground)]"
              data-testid="things-empty-state"
            >
              No spots match your search.
            </div>
          ) : (
            Object.entries(filtered).map(([area, items]) => (
              <section key={area} className="mt-10">
                <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                  {area}
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((entry) => (
                    <article
                      key={entry._id || `${area}-${entry.name}`}
                      className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-md"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={entry.image}
                          alt={entry.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="flex min-h-[56px] items-center justify-center p-3 text-center text-sm font-medium leading-tight text-[var(--color-foreground)]">
                        {entry.name}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
