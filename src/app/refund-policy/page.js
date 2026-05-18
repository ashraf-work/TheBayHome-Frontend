export const metadata = {
  title: "Refund Policy | The Keys Vibe",
  description: "Refund and cancellation policy for The Keys Vibe vacation stays.",
};

const sections = [
  {
    title: "Reservation requests",
    body: "Submitting a reservation request does not charge your card immediately. Our team confirms availability and payment details before a booking is finalized.",
  },
  {
    title: "Cancellations",
    body: "This sample policy allows full refunds for eligible cancellations made at least 30 days before check-in, partial refunds between 14 and 29 days, and no refund inside 14 days.",
  },
  {
    title: "Weather and disruptions",
    body: "Weather-related refunds may depend on local emergency orders, property access, and the terms confirmed with the guest at booking time.",
  },
  {
    title: "Service add-ons",
    body: "Concierge add-ons such as chefs, captains, and grocery stocking may have separate vendor cancellation windows.",
  },
];

export default function RefundPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-bold text-[var(--color-primary)]">
        Refund Policy
      </h1>
      <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
        Last updated: May 17, 2026
      </p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted-foreground)]">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
