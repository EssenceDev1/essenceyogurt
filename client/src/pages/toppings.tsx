import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Cherry, Nut, Droplets, Cookie, Sparkles, Star } from "lucide-react";

type ToppingCategory = "fruit" | "nut" | "sauce" | "chocolate" | "crunch" | "special";

interface Topping {
  id: string;
  name: string;
  type: ToppingCategory;
  description: string;
  allergens?: string[];
  isVegan?: boolean;
  isNew?: boolean;
}

const toppingsData: Topping[] = [
  {
    id: "berries",
    name: "Market Berries Selection",
    type: "fruit",
    description: "Fresh daily raspberries, blueberries and strawberries served on crushed ice trays.",
    isVegan: true,
  },
  {
    id: "tropical",
    name: "Tropical Mango Cubes",
    type: "fruit",
    description: "Hand-cut premium mango pieces, naturally sweet and refreshing.",
    isVegan: true,
  },
  {
    id: "passion",
    name: "Passion Fruit Pearls",
    type: "fruit",
    description: "Fresh passion fruit seeds with their signature tangy burst.",
    isVegan: true,
    isNew: true,
  },
  {
    id: "pineapple",
    name: "Golden Pineapple",
    type: "fruit",
    description: "Sweet golden pineapple chunks, perfectly ripened.",
    isVegan: true,
  },
  {
    id: "pistachio",
    name: "Golden Pistachio Crumble",
    type: "nut",
    description: "Slow roasted pistachios tossed with a dusting of gold sugar crystals.",
    allergens: ["nuts"],
  },
  {
    id: "almond",
    name: "Toasted Almond Slivers",
    type: "nut",
    description: "Caramelized almond slivers with a light honey glaze.",
    allergens: ["nuts"],
  },
  {
    id: "cashew",
    name: "Salted Cashew Pieces",
    type: "nut",
    description: "Premium cashews with a touch of sea salt.",
    allergens: ["nuts"],
  },
  {
    id: "chocolate-warm",
    name: "Warm Belgian Chocolate",
    type: "sauce",
    description: "Molten Belgian dark chocolate flowing from minimal brass taps.",
  },
  {
    id: "caramel",
    name: "Salted Caramel Drizzle",
    type: "sauce",
    description: "Rich caramel with fleur de sel, served warm.",
  },
  {
    id: "hazelnut",
    name: "Hazelnut Praline",
    type: "sauce",
    description: "Smooth hazelnut cream with praline crunch.",
    allergens: ["nuts"],
  },
  {
    id: "chocolate-chips",
    name: "Dark Chocolate Shards",
    type: "chocolate",
    description: "72% cocoa dark chocolate pieces, hand broken.",
  },
  {
    id: "white-choc",
    name: "White Chocolate Curls",
    type: "chocolate",
    description: "Delicate white chocolate curls, creamy and sweet.",
  },
  {
    id: "cocoa-nibs",
    name: "Raw Cocoa Nibs",
    type: "chocolate",
    description: "Unprocessed cacao for the true chocolate lover.",
    isVegan: true,
  },
  {
    id: "granola",
    name: "Honey Oat Granola",
    type: "crunch",
    description: "House-made granola clusters with oats and honey.",
  },
  {
    id: "cookie",
    name: "Vanilla Cookie Crumb",
    type: "crunch",
    description: "Crushed vanilla wafer cookies for added texture.",
  },
  {
    id: "coconut",
    name: "Toasted Coconut Flakes",
    type: "crunch",
    description: "Light coconut flakes, lightly toasted.",
    isVegan: true,
  },
  {
    id: "gold-dust",
    name: "Edible Gold Dust",
    type: "special",
    description: "24k edible gold shimmer for the ultimate luxury finish.",
    isVegan: true,
    isNew: true,
  },
  {
    id: "honeycomb",
    name: "Artisan Honeycomb",
    type: "special",
    description: "Handcrafted honeycomb pieces with natural raw honey.",
  },
];

const categoryInfo: Record<ToppingCategory, { label: string; icon: React.ReactNode; color: string }> = {
  fruit: { label: "Fresh Fruits", icon: <Cherry size={24} />, color: "from-rose-500 to-pink-600" },
  nut: { label: "Premium Nuts", icon: <Nut size={24} />, color: "from-amber-600 to-yellow-700" },
  sauce: { label: "Warm Sauces", icon: <Droplets size={24} />, color: "from-orange-500 to-red-600" },
  chocolate: { label: "Chocolate", icon: <Cookie size={24} />, color: "from-amber-800 to-stone-900" },
  crunch: { label: "Crunch & Texture", icon: <Sparkles size={24} />, color: "from-yellow-500 to-amber-600" },
  special: { label: "Luxury Special", icon: <Star size={24} />, color: "from-[#d4af37] to-[#a07c10]" },
};

const categories: ToppingCategory[] = ["fruit", "nut", "sauce", "chocolate", "crunch", "special"];

export default function ToppingsPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              The Toppings Bar
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6" data-testid="text-toppings-title">
              Finish with perfection.
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Our self-serve toppings bar features fresh fruits, premium nuts, warm sauces, 
              and luxury finishes. All included in your pay-by-weight experience.
            </p>
          </div>
        </section>

        {categories.map((category) => {
          const info = categoryInfo[category];
          const items = toppingsData.filter((t) => t.type === category);
          
          return (
            <section key={category} className="border-b border-neutral-200" data-testid={`section-${category}`}>
              <div className="mx-auto max-w-7xl px-4 py-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white`}>
                    {info.icon}
                  </div>
                  <h2 className="text-2xl font-semibold">{info.label}</h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {items.map((topping) => (
                    <div
                      key={topping.id}
                      className="rounded-3xl border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow relative"
                      data-testid={`card-topping-${topping.id}`}
                    >
                      {topping.isNew && (
                        <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-[#d4af37] text-white px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                      <h3 className="font-semibold text-lg mb-2">{topping.name}</h3>
                      <p className="text-sm text-neutral-600 mb-4">{topping.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {topping.isVegan && (
                          <span className="text-[10px] font-medium uppercase tracking-wide bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Vegan
                          </span>
                        )}
                        {topping.allergens?.includes("nuts") && (
                          <span className="text-[10px] font-medium uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                            Contains Nuts
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section className="bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center">
            <h2 className="text-3xl font-semibold mb-4">
              All toppings. One simple price.
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Unlike other frozen yogurt shops, all our toppings are included in the pay-by-weight price. 
              No extra charges, no surprises. Just pure indulgence.
            </p>
            <a
              href="/locations"
              className="inline-flex rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-100 transition-colors"
              data-testid="btn-find-location"
            >
              Find a Location
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
