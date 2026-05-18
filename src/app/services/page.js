import ServicesList from "@/components/services/ServicesList";
import { servicesData } from "@/data/services";

export const metadata = {
  title: "Vacation Concierge Services | The Keys Vibe",
  description:
    "Add private fishing, chef, and concierge services to your Florida Keys vacation rental stay.",
};

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Services We Offer
          </h1>
        </div>
      </section>

      <ServicesList services={servicesData} />
    </div>
  );
}
