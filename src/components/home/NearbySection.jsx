
import Image from "next/image";

const NEARBY = [
  { name: "Robber's Marina", note: "5 minutes drive", image: "/images/robbers.png" },
  { name: "World Class Fishing", note: "Right at your doorstep", image: "/images/fishing.png" },
  { name: "Islamorada Sandbar", note: "3 minutes by boat", image: "/images/islamorada.png" },
];

export default function NearbySection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {NEARBY.map((n) => (
        <div key={n.name} className="flex flex-col">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src={n.image} alt={n.name} fill className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw" />
          </div>
          <div className="mt-3 text-center">
            <div className="font-semibold md:text-lg text-[var(--color-primary)]">{n.name}</div>
            <div className="text-sm font-semibold text-[var(--color-foreground)]">{n.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}