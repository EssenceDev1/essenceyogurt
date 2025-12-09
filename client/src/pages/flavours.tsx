import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import flavourShowcaseImage from "@assets/IMG_2622_1764626731265.jpeg";

interface Flavor {
  id: string;
  internalCode: string | null;
  name: string;
  marketingName: string | null;
  description: string;
  type: string;
  tier: string | null;
  accentColor: string | null;
  imagePrompt: string | null;
  priority: number | null;
}

const COLLECTIONS = [
  { 
    id: "Core", 
    name: "Core Collection", 
    count: 11,
    badge: "Always Available",
    description: "The Essence Yogurt™ identity. Our signature flavours, perfected for luxury palates."
  },
  { 
    id: "Aussie Natives", 
    name: "Aussie Natives", 
    count: 6,
    badge: "Australian Exclusive",
    description: "Uniquely Australian flavours inspired by native fruits and local favourites."
  },
  { 
    id: "Dessert Remix", 
    name: "Dessert Remix", 
    count: 7,
    badge: "Indulgence Line",
    description: "Classic desserts reimagined as frozen yogurt. Pure indulgence in every swirl."
  },
  { 
    id: "City Signature", 
    name: "City Signature", 
    count: 1,
    badge: "Location Exclusive",
    description: "Special flavours exclusive to each Essence Yogurt location worldwide."
  },
];

export default function FlavoursPage() {
  const { data: flavorsData, isLoading: flavorsLoading } = useQuery({
    queryKey: ["flavors"],
    queryFn: async () => {
      const response = await fetch("/api/flavors");
      if (!response.ok) throw new Error("Failed to fetch flavors");
      return response.json() as Promise<{ flavors: Flavor[] }>;
    },
  });

  const flavorsByCollection = COLLECTIONS.map(collection => ({
    ...collection,
    flavors: flavorsData?.flavors.filter(f => f.tier === collection.id) || []
  }));

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Header with Flavour Showcase */}
        <section className="border-b border-[#d4af37]/20 bg-gradient-to-b from-[#faf9f7] to-white">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              {/* Left - Text Content */}
              <div className="text-center md:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
                  Essence Yogurt™ 2026 Collection
                </p>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  46 Signature Flavours
                </h1>
                <p className="text-base text-neutral-500 max-w-xl mb-6">
                  Explore our full luxury flavour collections. From signature classics to ultra-premium airport specials.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {COLLECTIONS.slice(0, 3).map((col) => (
                    <a
                      key={col.id}
                      href={`#${col.id.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1.5 rounded-full border border-[#d4af37]/30 text-[10px] font-medium text-neutral-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
                      data-testid={`nav-${col.id}`}
                    >
                      {col.name}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Right - Flavour Showcase Image */}
              <div className="flex justify-center">
                <img 
                  src={flavourShowcaseImage} 
                  alt="Essence Yogurt™ Signature Flavours - Coconut, Açai, Mango, Vanilla" 
                  className="w-full max-w-md rounded-3xl shadow-xl object-contain"
                  data-testid="flavour-showcase-image"
                />
              </div>
            </div>
            
            {/* Collection Quick Links */}
            <div className="mt-10 pt-8 border-t border-[#d4af37]/10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 text-center mb-4">
                Jump to Collection
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {COLLECTIONS.map((col) => (
                  <a
                    key={col.id}
                    href={`#${col.id.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 rounded-full border border-[#d4af37]/30 text-xs font-medium text-neutral-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
                    data-testid={`nav-link-${col.id}`}
                  >
                    {col.name} ({col.count})
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Flavour Collections - Scrolling Sections with Grid Layout */}
        {flavorsLoading ? (
          <section className="bg-neutral-50">
            <div className="mx-auto max-w-6xl px-4 py-16">
              <div className="text-center text-neutral-400 py-10">Loading flavours...</div>
            </div>
          </section>
        ) : (
          flavorsByCollection.map((collection, idx) => (
            <section 
              key={collection.id}
              id={collection.id.toLowerCase().replace(/\s+/g, '-')}
              className={`border-b border-[#d4af37]/10 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#faf9f7]'}`}
              data-testid={`section-${collection.id}`}
            >
              <div className="mx-auto max-w-6xl px-4 py-14">
                {/* Collection Header */}
                <div className="mb-10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <h2 className="text-2xl font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {collection.name}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37]/20 to-[#f4e4bc]/30 text-[#a08530] text-[10px] font-semibold uppercase tracking-wider border border-[#d4af37]/30">
                      {collection.badge}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 max-w-xl mx-auto">
                    {collection.description}
                  </p>
                  <p className="text-xs text-[#d4af37] mt-2 font-medium">
                    {collection.flavors.length} Flavours
                  </p>
                </div>
                
                {/* Flavour Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {collection.flavors.map((flavor) => (
                    <div
                      key={flavor.id}
                      className="group rounded-2xl border border-[#d4af37]/20 bg-white p-5 shadow-sm hover:shadow-lg hover:border-[#d4af37] transition-all duration-300"
                      data-testid={`flavor-card-${flavor.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-14 h-14 rounded-2xl border-2 border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors shadow-inner flex-shrink-0"
                          style={{ 
                            background: `linear-gradient(135deg, ${flavor.accentColor || '#f5f5f5'} 0%, ${flavor.accentColor || '#f5f5f5'}88 100%)` 
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="text-base font-medium mb-1 text-neutral-800 group-hover:text-[#d4af37] transition-colors truncate"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                          >
                            {flavor.marketingName || flavor.name}
                          </h3>
                          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                            {flavor.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))
        )}

        {/* Toppings Bar Section - DIY Self-Serve Experience */}
        <section className="bg-[#faf9f7] border-y border-[#d4af37]/10" data-testid="toppings-bar-section">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                Create Your Own
              </p>
              <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                The Toppings Bar
              </h2>
              <p className="text-sm text-neutral-500 max-w-xl mx-auto">
                Choose from over 30 premium toppings. Fresh fruits, crunchy granolas, nuts, sauces, and more — all included.
              </p>
            </div>

            {/* How It Works Steps */}
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <div className="text-center p-6 rounded-2xl bg-white border border-[#d4af37]/20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f4e4bc]/30 flex items-center justify-center text-2xl font-light text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  1
                </div>
                <h3 className="font-medium text-neutral-800 mb-2">Start Here</h3>
                <p className="text-xs text-neutral-500">Dispense your frozen yogurt from our self-serve machines. Mix flavours or go classic.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border border-[#d4af37]/20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f4e4bc]/30 flex items-center justify-center text-2xl font-light text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  2
                </div>
                <h3 className="font-medium text-neutral-800 mb-2">Add Toppings</h3>
                <p className="text-xs text-neutral-500">Visit the toppings bar. Layer on fresh fruits, granolas, nuts, sauces, and treats.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border border-[#d4af37]/20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f4e4bc]/30 flex items-center justify-center text-2xl font-light text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  3
                </div>
                <h3 className="font-medium text-neutral-800 mb-2">Weigh & Pay</h3>
                <p className="text-xs text-neutral-500">Pay by weight. Create as little or as much as you like — your creation, your price.</p>
              </div>
            </div>

            {/* Toppings Categories */}
            <div className="bg-white rounded-3xl border border-[#d4af37]/20 p-8">
              <h3 className="text-lg font-medium text-center mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Premium Toppings Selection
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[
                  { 
                    category: "Fresh Fruits", 
                    items: ["Strawberries", "Blueberries", "Mango", "Passionfruit", "Kiwi", "Banana"],
                    color: "#e57373"
                  },
                  { 
                    category: "Crunchy", 
                    items: ["House Granola", "Fruit-Nut Granola", "Crushed Peanuts", "Roasted Hazelnuts", "Coconut Flakes"],
                    color: "#bcaaa4"
                  },
                  { 
                    category: "Sweet Treats", 
                    items: ["Mochi Bites", "Cookie Crumbs", "Brownie Pieces", "Meringue Kisses", "Chocolate Chips"],
                    color: "#ce93d8"
                  },
                  { 
                    category: "Sauces", 
                    items: ["Chocolate Drizzle", "Caramel", "Strawberry", "Passionfruit Coulis", "Honey"],
                    color: "#ffb74d"
                  },
                ].map((topping) => (
                  <div key={topping.category} className="p-4 rounded-xl border border-neutral-100 hover:border-[#d4af37]/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-[#d4af37]/20"
                        style={{ backgroundColor: topping.color }}
                      />
                      <h4 className="font-medium text-sm text-neutral-800">{topping.category}</h4>
                    </div>
                    <ul className="space-y-1">
                      {topping.items.map((item) => (
                        <li key={item} className="text-xs text-neutral-500">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-white to-[#faf9f7]">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Quality Promise
            </p>
            <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Every flavour crafted with care.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs mb-10">
              {[
                { icon: "🥛", title: "Real Australian Milk", desc: "Premium dairy base" },
                { icon: "🦠", title: "Live Cultures", desc: "Beneficial probiotics" },
                { icon: "💚", title: "98% Fat Free", desc: "Great source of calcium" },
                { icon: "✅", title: "Halal Certified", desc: "All products approved" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-[#d4af37]/20 bg-white p-5 hover:border-[#d4af37] transition-all">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="font-medium text-neutral-800 mb-1">{item.title}</p>
                  <p className="text-neutral-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <a 
              href="/locations" 
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all"
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
