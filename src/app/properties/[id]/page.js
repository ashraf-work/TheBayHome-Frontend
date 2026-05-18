import { notFound } from "next/navigation";
import { api } from "@/services/api";
import PropertyDetailClient from "@/components/property/PropertyDetailClient";

export const revalidate = 300;

async function getPropertyPayload(id) {
  try {
    const [propertyRes, seasonsRes] = await Promise.all([
      api.getProperty(id),
      api.getSeasonsData(id).catch(() => ({ data: [] })),
    ]);

    return {
      property: propertyRes.data,
      seasons: seasonsRes.data || [],
    };
  } catch (error) {
    if (error.status === 404) notFound();
    console.error("Failed to load property", error);
    return { property: null, seasons: [] };
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { property } = await getPropertyPayload(id);

  if (!property) {
    return {
      title: "Property Not Found | The Keys Vibe",
    };
  }

  return {
    title: `${property.title} | The Keys Vibe`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images?.thumbnail ? [property.images.thumbnail] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const { property, seasons } = await getPropertyPayload(id);

  if (!property) notFound();

  return (
    <PropertyDetailClient
      propertyId={id}
      initialProperty={property}
      initialSeasons={seasons}
    />
  );
}
