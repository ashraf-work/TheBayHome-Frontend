import { rateCards } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Seasonal Rates | The Keys Vibe",
  description:
    "Review seasonal nightly rate ranges and minimum stays for The Keys Vibe Florida Keys vacation rentals.",
};

export default function RatePage() {
  return (
    <div>
      <section className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Seasonal Rates
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            Straightforward pricing, no hidden fees. Rates per night, minimum stay applies by season.
          </p>
        </div>
      </section>

      <div
        className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-5 py-16 md:grid-cols-2"
        data-testid="rate-list"
      >
        {rateCards.map((rate) => (
          <Card
            key={rate.season}
            className="transition-transform hover:-translate-y-1"
            data-testid={`rate-card-${rate.season.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <CardHeader>
              <CardTitle>{rate.season}</CardTitle>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {rate.range}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1">
                <span className="font-display text-4xl font-extrabold text-[var(--color-foreground)]">
                  ${rate.nightly}
                </span>
                <span className="mb-1.5 text-sm text-[var(--color-muted-foreground)]">
                  /night
                </span>
              </div>
              <div className="mt-2 text-sm text-[var(--color-primary)]">
                Minimum {rate.minNights} nights
              </div>
              <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
                {rate.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
