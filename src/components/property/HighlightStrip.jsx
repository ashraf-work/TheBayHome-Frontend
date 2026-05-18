"use client";

import { Anchor, Bed, Users, Waves, Wifi, Car } from "lucide-react";

const ICONS = { anchor: Anchor, waves: Waves, wifi: Wifi, users: Users, bed: Bed, car: Car };

export default function HighlightStrip({ highlights = [] }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-5 gap-4" data-testid="highlights-strip">
      {highlights.map((h) => {
        const Icon = ICONS[h.icon] || Anchor;
        return (
          <li key={h.label} className="flex flex-col items-center text-center text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm mb-2">
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium">{h.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
