import { api } from "@/services/api";
import { thingsToDoData } from "@/data/thingsToDo";
import ThingsToDoExplorer from "@/components/things-to-do/ThingsToDoExplorer";

export const revalidate = 300;

export const metadata = {
  title: "Things To Do in the Florida Keys | The Keys Vibe",
  description:
    "Explore restaurants, fishing, bird watching, and local Florida Keys favorites near The Keys Vibe vacation rentals.",
};

function groupThingsToDo(items) {
  if (!Array.isArray(items) || items.length === 0) return thingsToDoData;

  return items.reduce((groups, item) => {
    if (item.status && item.status !== "active") return groups;

    const category = item.category || "Local Favorites";
    const area = item.area || "Florida Keys";

    groups[category] ||= {};
    groups[category][area] ||= [];
    groups[category][area].push(item);

    return groups;
  }, {});
}

async function getThingsToDo() {
  try {
    const response = await api.listThingsToDo();
    return groupThingsToDo(response.data);
  } catch (error) {
    console.error("Failed to load things to do", error);
    return thingsToDoData;
  }
}

export default async function ThingsToDoPage() {
  const data = await getThingsToDo();

  return (
    <div>
      <section className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Whats Your Vibe?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            Handpicked Florida Keys spots, sorted by the kind of day you want.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12">
        <ThingsToDoExplorer data={data} />
      </div>
    </div>
  );
}
