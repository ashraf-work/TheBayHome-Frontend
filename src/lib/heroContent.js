// lib/heroContent.js
import {
  Anchor, Bed, Users, Waves, Wifi,
  Sunset, TreePalm, Wind, MapPin
} from "lucide-react";

export const PROPERTY_HERO_CONTENT = [
  {
    eyebrow: "Live The Keys Vibe",
    headline: ["DOCK OUT BACK.", "SAND BAR UP AHEAD"],
    script: "Unwind. Explore. Repeat",
    body: "Your private waterfront escape in the heart of the Florida Keys.",
    bgImage: "/images/hero-bg.png",
    highlights: [
      { label: "Private Dock", Icon: Anchor },
      { label: "Ocean Access", Icon: Waves },
      { label: "Wifi", Icon: Wifi },
      { label: "Sleeps 8", Icon: Users },
      { label: "4 Bedroom", Icon: Bed },
    ],
  },
  {
    eyebrow: "Your Island Hideaway",
    headline: ["PALMS OUTSIDE.", "PEACE INSIDE"],
    script: "Arrive. Breathe. Stay.",
    body: "A secluded Keys retreat where golden sunsets meet your private terrace.",
    bgImage: "/images/hero-bg2.png",
    highlights: [
      { label: "Ocean Views", Icon: Sunset },
      { label: "Beachfront", Icon: TreePalm },
      { label: "Wifi", Icon: Wifi },
      { label: "Sea Breeze", Icon: Wind },
      { label: "Prime Location", Icon: MapPin },
    ],
  },
];