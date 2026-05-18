// components/home/TealBand.jsx
import { KeyRound, Headphones, ShieldCheck, Hand } from "lucide-react";

const TEAL_BAND = [
  { big: "EASY CHECK-IN", small: "Self check-in with key", Icon: KeyRound },
  { big: "24/7 SUPPORT", small: "We're here to help anytime", Icon: Headphones },
  { big: "CLEAN & SAFE", small: "Professionally clean for your safety", Icon: ShieldCheck },
  { big: "BOOK WITH CONFIDENCE", small: "Secure booking and instant confirmation", Icon: Hand },
];

export default function TealBand() {
  return (
    <section className="bg-[var(--color-primary)] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAL_BAND.map(({ big, small, Icon }) => (
          <div key={big} className="flex items-center gap-3">
            <Icon className="h-9 w-9 shrink-0" />
            <div>
              <div className="font-semibold">{big}</div>
              <div className="text-white/85 text-sm">{small}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}