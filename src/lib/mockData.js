// Mock data source for The Keys Vibe
// Unsplash images used for realism — all remote and served via next/image

export const properties = [
  {
    id: "castaway",
    name: "Castaway",
    location: "Miami, Florida",
    tagline: "Dock out back. Sandbar up ahead.",
    description:
      "Step into effortless waterfront living with a brand-new, two-story modern retreat on the bayside, featuring three bedrooms and two bathrooms upstairs along with a private 1/1 guest suite below. Enjoy your own 60-ft private dock set along a calm canal with easy access to open water, perfect for fishing adventures. A fully reserved boat awaits you at the dock cleaned, fueled, and ready for your next sunrise run. The experience is designed for pure relaxation, from built-in Sonos audio to a resort-style pool and beach area, where every detail invites you to unwind. Here, the only thing you'll need to plan is what drink to pour at sunset, while enjoying the highlights of this exceptional escape.",
    rating: 4.96,
    reviews: 187,
    basePrice: 899,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    beds: 5,
    heroImage:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551727974-8af20a3322f5?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop"
    ],
    amenityGroups: [
      "Parking & facilities",
      "Policies",
      "Bathroom & laundry",
      "Heating & cooling",
      "Internet & office",
      "Kitchen & dining"
    ],
    amenityChips: [
      "Parking",
      "Air conditioning",
      "Internet & office",
      "Kitchen & dining",
      "Bathroom & laundry",
      "Children welcome, Pets allowed"
    ],
    highlights: [
      { label: "Private Dock", icon: "anchor" },
      { label: "Ocean Access", icon: "waves" },
      { label: "Wifi", icon: "wifi" },
      { label: "Sleeps 8", icon: "users" },
      { label: "4 Bedroom", icon: "bed" }
    ],
    startingFrom: 1500,
    startingFromList: 1500,
    mapQuery: "Key Largo, FL",
    // Seasonal pricing ranges (inclusive). Applied in order of match.
    seasonalPricing: [
      { label: "Peak Winter (Dec 15 - Apr 15)", from: "2025-12-15", to: "2026-04-15", nightly: 1100 },
      { label: "High Season (Apr 16 - Jun 30)", from: "2026-04-16", to: "2026-06-30", nightly: 899 },
      { label: "Summer (Jul 1 - Aug 31)", from: "2026-07-01", to: "2026-08-31", nightly: 799 },
      { label: "Low Season (Sep 1 - Dec 14)", from: "2026-09-01", to: "2026-12-14", nightly: 649 }
    ],
    // Pre-booked date ranges
    prebookedRanges: [
      { from: "2026-05-02", to: "2026-05-09" },
      { from: "2026-05-24", to: "2026-05-28" },
      { from: "2026-06-10", to: "2026-06-14" },
      { from: "2026-07-03", to: "2026-07-07" }
    ]
  },
  {
    id: "unit-seven",
    name: "Unit Seven",
    location: "Miami, Florida",
    tagline: "Pool-view suite with a panoramic ocean outlook.",
    description:
      "A serene top-floor corner unit with wraparound balconies facing both pool and marina. Unwind in the open plan living room, soak in the oversized tub, or head straight to the community beach just steps away. Every inch is crafted for quiet Keys mornings and long, golden evenings.",
    rating: 4.96,
    reviews: 124,
    basePrice: 749,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    beds: 4,
    heroImage:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559599238-308793637427?w=1200&q=80&auto=format&fit=crop"
    ],
    amenityGroups: [
      "Parking & facilities",
      "Policies",
      "Bathroom & laundry",
      "Heating & cooling",
      "Internet & office",
      "Kitchen & dining"
    ],
    amenityChips: [
      "Parking",
      "Air conditioning",
      "Internet & office",
      "Kitchen & dining",
      "Bathroom & laundry"
    ],
    highlights: [
      { label: "Pool Access", icon: "waves" },
      { label: "Ocean View", icon: "waves" },
      { label: "Wifi", icon: "wifi" },
      { label: "Sleeps 6", icon: "users" },
      { label: "3 Bedroom", icon: "bed" }
    ],
    startingFrom: 1500,
    startingFromList: 1500,
    mapQuery: "Islamorada, FL",
    seasonalPricing: [
      { label: "Peak Winter (Dec 15 - Apr 15)", from: "2025-12-15", to: "2026-04-15", nightly: 949 },
      { label: "High Season (Apr 16 - Jun 30)", from: "2026-04-16", to: "2026-06-30", nightly: 749 },
      { label: "Summer (Jul 1 - Aug 31)", from: "2026-07-01", to: "2026-08-31", nightly: 679 },
      { label: "Low Season (Sep 1 - Dec 14)", from: "2026-09-01", to: "2026-12-14", nightly: 549 }
    ],
    prebookedRanges: [
      { from: "2026-04-22", to: "2026-04-27" },
      { from: "2026-05-14", to: "2026-05-19" },
      { from: "2026-06-20", to: "2026-06-26" }
    ]
  }
];

export const thingsToDo = {
  Restaurants: {
    "Key Largo": [
      { name: "Key Largo Fisheries Backyard Cafe", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80" },
      { name: "Hobo's Restaurant (great for lunch/dinner)", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" },
      { name: "C&C Wood Fire", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
      { name: "Fish House (great for lunch and dinner)", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80" },
      { name: "Keys Bites local hangout", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" },
      { name: "Sharky's local hangout", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" },
      { name: "Lazy Lobster (great for lunch and dinner)", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80" },
      { name: "Harriette's (great for breakfast)", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" },
      { name: "Tower of pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80" },
      { name: "Snooks (water access / lunch and dinner)", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" },
      { name: "Chocolate, cakes and ice cream", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80" },
      { name: "Doc B (great for breakfast)", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80" }
    ],
    "Islamorada": [
      { name: "Mile marker 88 (water access, great for luncheon dinner)", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
      { name: "Gardenia's bistro", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80" },
      { name: "Islamorada fish company", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" },
      { name: "Bitton bistro", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80" },
      { name: "Flagler steak house (Water view great dinner)", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" },
      { name: "Chef Michael's", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" },
      { name: "Twisted shrimp", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" }
    ],
    "Tavernier": [
      { name: "Crooked palm", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80" },
      { name: "Italian food company", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" }
    ],
    "Upper Matecumbe": [
      { name: "Papa Joe's waterfront", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
      { name: "Ziggie's Mad Dog", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" },
      { name: "Square Grouper (water access great for lunch and dinner)", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" }
    ]
  },
  "Deep sea Fishing": {
    "Key Largo": [
      { name: "Blackwater Charters", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
      { name: "Marlin Hunter Fleet", image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80" },
      { name: "Gulfstream Pro Tours", image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&q=80" }
    ]
  },
  "Backcountry fishing": {
    "Islamorada": [
      { name: "Backcountry Grand Slam Guides", image: "https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=800&q=80" },
      { name: "Flats Stalker Charters", image: "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80" }
    ]
  },
  "Bird watching": {
    "Key Largo": [
      { name: "Dagny Johnson Hammock Trail", image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80" },
      { name: "Pennekamp Coral Reef Park", image: "https://images.unsplash.com/photo-1549888834-1ff21fe63396?w=800&q=80" }
    ]
  }
};

export const services = [
  {
    id: "fishing-charter",
    title: "Inshore or offshore Fishing 26' Yellow fin Hybrid",
    price: 1200,
    priceNote: "single charge, per stay",
    image: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=1200&q=80&auto=format&fit=crop",
    shortDescription: "Enjoy a 4-5 hour morning trip, dependent on weather conditions. Captain included.",
    description:
      "Spend 4 to 5 hours on a twin-engine 26' Yellowfin hybrid chasing mahi, snapper, or trophy offshore species. Licensed captain, gear and bait provided. Bring snacks and sunscreen — we handle the rest."
  },
  {
    id: "seafood-chef",
    title: "Seafood chef",
    price: 550,
    priceNote: "single charge, per stay",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
    shortDescription: "Choose to include a private chef who will prepare your fresh catch and any seafood dishes you desire.",
    description:
      "Our private chef will shop for the freshest local catch (or cook your own) and serve a 3-course dockside meal for up to 8 guests. Full clean-up included, dietary preferences welcome."
  },
  {
    id: "grocery",
    title: "Grocery stocking",
    price: 175,
    priceNote: "single charge, per stay",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80&auto=format&fit=crop",
    shortDescription: "Arrive to a fully stocked fridge, pantry, and bar with your pre-selected items waiting for you.",
    description:
      "Send us your grocery list 48 hours before arrival and we'll handle the shopping. Ideal for long weekends when you don't want to lose an afternoon to errands."
  },
  {
    id: "private-captain",
    title: "Private captain for boat day",
    price: 650,
    priceNote: "per 6-hour session",
    image: "https://images.unsplash.com/photo-1506016476100-de90b2b40893?w=1200&q=80&auto=format&fit=crop",
    shortDescription: "Let a certified local captain drive while you relax. Sandbar, snorkel spots, sunset runs.",
    description:
      "USCG-licensed captain takes the helm for 6 hours so you can swim, snorkel, or drink at the sandbar without worrying about navigation. Fuel is extra and billed at cost."
  }
];

export const rateCards = [
  {
    season: "Peak Winter",
    range: "Dec 15 – Apr 15",
    nightly: 1100,
    minNights: 5,
    note: "Includes holidays and spring break weeks. Book at least 6 months out."
  },
  {
    season: "High Season",
    range: "Apr 16 – Jun 30",
    nightly: 899,
    minNights: 4,
    note: "Sunny skies, light crowds. The locals' favorite time of year."
  },
  {
    season: "Summer",
    range: "Jul 1 – Aug 31",
    nightly: 799,
    minNights: 3,
    note: "Family-friendly rates with strong fishing and diving conditions."
  },
  {
    season: "Low Season",
    range: "Sep 1 – Dec 14",
    nightly: 649,
    minNights: 2,
    note: "Best value of the year. Perfect for long weekends."
  }
];

export const testimonials = [
  {
    id: "t1",
    name: "Maxin Will",
    role: "Product Manager",
    rating: 4,
    initials: "MW",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do."
  },
  {
    id: "t2",
    name: "Ava Linton",
    role: "Founder, Linton Studio",
    rating: 5,
    initials: "AL",
    text: "We came for a long weekend and ended up rebooking before we left. The dock, the sandbar, the quiet mornings — this is the Florida Keys you always pictured but never quite found."
  },
  {
    id: "t3",
    name: "Jordan Reyes",
    role: "Photographer",
    rating: 5,
    initials: "JR",
    text: "The concierge handled everything — charter, chef, even a sunset dinner. We didn't plan anything after landing and it was still the best trip of the year."
  }
];
