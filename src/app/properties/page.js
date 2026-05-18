import { Star, ShieldCheck, Headphones } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { api } from "@/services/api";

export const revalidate = 300;

export const metadata = {
  title: "Florida Keys Vacation Rentals | The Keys Vibe",
  description:
    "Browse handpicked Florida Keys vacation homes with private docks, ocean access, and local concierge support.",
};

async function getProperties() {
  try {
    const response = await api.listProperties();
    return { properties: response.data || [], error: "" };
  } catch (error) {
    console.error("Failed to load properties", error);
    return {
      properties: [],
      error: "Properties are temporarily unavailable. Please check back soon.",
    };
  }
}

export default async function PropertiesPage() {
  const { properties, error } = await getProperties();

  return (
    <div>
      <section
        className="bg-[var(--color-primary)] text-white"
        data-testid="properties-banner"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 lg:grid-cols-[1.2fr_1fr]">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Find your slice of paradise
          </h1>
          <ul className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-3">
            <Feat Icon={Star} title="Handpicked" sub="Only the best stays" />
            <Feat Icon={ShieldCheck} title="Stress Free" sub="Easy booking" />
            <Feat Icon={Headphones} title="Local Support" sub="Here for you" />
          </ul>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 py-14"
        data-testid="properties-list"
      >
        {error && <div className="mb-4 text-sm text-red-700">{error}</div>}

        {properties.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-[var(--color-muted-foreground)]">
              No properties available right now. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Feat({ Icon, title, sub }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-white/85">{sub}</div>
      </div>
    </li>
  );
}
