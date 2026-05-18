export const metadata = {
  title: "Privacy Policy | The Keys Vibe",
  description: "Privacy policy for The Keys Vibe vacation rental guests.",
};

const sections = [
  {
    title: "Information we collect",
    body: "We may collect booking details, contact information, payment-related references, and messages you send through this website. This placeholder policy should be reviewed by legal counsel before production use.",
  },
  {
    title: "How we use information",
    body: "We use guest information to respond to inquiries, manage reservations, provide concierge services, improve the website, and send important booking updates.",
  },
  {
    title: "Sharing",
    body: "We only share information with service providers when needed to operate the reservation, support, email, analytics, or security parts of the business.",
  },
  {
    title: "Your choices",
    body: "You can request corrections or deletion of your personal information where applicable by contacting our support team.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-bold text-[var(--color-primary)]">
        Privacy Policy
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
