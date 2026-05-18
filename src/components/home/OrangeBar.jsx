// components/home/OrangeBar.jsx
import { Umbrella, Ship, Fish, Sun } from "lucide-react";

const ORANGE_BAR = [
  { big: "3 MINUTES", small: "TO THE SANDBAR", Icon: Umbrella },
  { big: "PRIVATE DOCK", small: "DRIVE YOUR BOAT", Icon: Ship },
  { big: "WORLD CLASS", small: "FISHING & DIVING", Icon: Fish },
  { big: "BREATHTAKING", small: "SUNRISE", Icon: Sun },
];

export default function OrangeBar() {
  return (
    <section className="bg-[var(--color-accent)]">
      <div className="mx-auto max-w-7xl px-5 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-white">
        {ORANGE_BAR.map(({ big, small, Icon }) => (
          <div key={big} className="flex items-center gap-3">
            <Icon className="h-8 w-8 shrink-0" />
            <div className="leading-tight">
              <div className="font-semibold text-base">{big}</div>
              <div className="text-white/90 text-xs">{small}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}