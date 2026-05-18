export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thekeysvibe.com";
  const lastModified = new Date();

  return [
    "",
    "/properties",
    "/things-to-do",
    "/blogs",
    "/services",
    "/rate",
    "/contact",
    "/privacy-policy",
    "/refund-policy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
