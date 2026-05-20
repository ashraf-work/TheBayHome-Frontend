import { api } from "@/services/api";
import { thingsToDoData } from "@/data/thingsToDo";
import ThingsToDoExplorer from "@/components/things-to-do/ThingsToDoExplorer";

export const metadata = {
  title: "Things To Do in the Florida Keys | The Keys Vibe",
  description:
    "Explore restaurants, fishing, bird watching, and local Florida Keys favorites near The Keys Vibe vacation rentals.",
};

function groupThingsToDo(items) {
  if (!Array.isArray(items) || items.length === 0) return thingsToDoData;

  const categoryOrder = [
    "Restaurants",
    "Deep sea Fishing",
    "Backcountry fishing",
    "Bird watching",
  ];

  const activeItems = items.filter((item) => {
    return !item.status || item.status === "active";
  });

  const groups = {};

  categoryOrder.forEach((category) => {
    const categoryItems = activeItems.filter(
      (item) => item.category === category
    );

    if (categoryItems.length > 0) {
      groups[category] = {
        All: categoryItems.reverse(),
      };
    }
  });

  activeItems.forEach((item) => {
    const category = item.category || "Local Favorites";

    if (categoryOrder.includes(category)) return;

    groups[category] ||= {
      All: [],
    };

    groups[category].All.push(item);
  });

  return groups;
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