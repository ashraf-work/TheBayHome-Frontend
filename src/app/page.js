import { api } from "@/services/api";
import HeroSection from "@/components/home/HeroSection";
import OrangeBar from "@/components/home/OrangeBar";
import LifestyleSection from "@/components/home/LifestyleSection";
import NearbySection from "@/components/home/NearbySection";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import TealBand from "@/components/home/TealBand";
import { testimonials } from "@/lib/mockData";

export const revalidate = 300;

export default async function HomePage() {
  let properties = [];

  try {
    const response = await api.listProperties();
    properties = response.data ?? [];
  } catch (error) {
    console.error("Failed to load homepage properties", error);
  }

  return (
    <div>
      <HeroSection initialProperties={properties} />
      <OrangeBar />
      <LifestyleSection />
      <div className="mx-auto max-w-7xl px-5 pb-20 grid lg:grid-cols-[2fr_1fr] gap-10 items-stretch">
        <NearbySection />
        <TestimonialSlider testimonials={testimonials} />
      </div>
      <TealBand />
    </div>
  );
}
