import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { AlertTriangle, Leaf, Milk, Wheat, TreeDeciduous, Fish, Egg, ShieldCheck, Droplets, Bean, type LucideIcon } from "lucide-react";

interface AllergenInfo {
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  present: string[];
  mayContain: string[];
}

const allergenData: AllergenInfo[] = [
  {
    name: "Milk & Dairy",
    icon: Milk,
    color: "#87ceeb",
    description: "All frozen yogurt contains milk. Not suitable for dairy allergies or severe lactose intolerance.",
    present: ["All Frozen Yogurt Flavours", "White Chocolate Chips", "Cheesecake Bites"],
    mayContain: ["All products due to shared equipment"],
  },
  {
    name: "Tree Nuts",
    icon: TreeDeciduous,
    color: "#8b4513",
    description: "Various tree nuts are available as toppings. Cross-contamination may occur at the bar.",
    present: ["Roasted Hazelnuts", "Almond Flakes", "Pistachio Crumbs", "Macadamia", "Cashews"],
    mayContain: ["Granola toppings", "Chocolate selections", "All toppings bar items"],
  },
  {
    name: "Peanuts",
    icon: Bean,
    color: "#deb887",
    description: "Peanuts and peanut products are available. Cross-contamination is likely.",
    present: ["Crushed Peanuts", "Peanut Butter Sauce"],
    mayContain: ["All nut-based toppings", "Granola products"],
  },
  {
    name: "Gluten",
    icon: Wheat,
    color: "#d4a574",
    description: "Found in wheat, barley, rye and oats. Present in many baked toppings.",
    present: ["Cookie Crumbs", "Brownie Pieces", "Waffle Cone", "House Granola", "Fruit-Nut Granola"],
    mayContain: ["All toppings due to shared utensils"],
  },
  {
    name: "Eggs",
    icon: Egg,
    color: "#ffd700",
    description: "Found in some baked goods and meringue products on our toppings bar.",
    present: ["Meringue Kisses", "Brownie Pieces"],
    mayContain: ["Cookie toppings", "Waffle cones", "Cake pieces"],
  },
  {
    name: "Soy",
    icon: Leaf,
    color: "#90ee90",
    description: "Soy lecithin may be present in chocolate products and confectionery items.",
    present: [],
    mayContain: ["Chocolate Chips", "Chocolate Sauce", "Mochi Bites", "Some candy toppings"],
  },
];

interface NutritionFact {
  flavour: string;
  per100g: {
    calories: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    protein: number;
    salt: number;
  };
  tags: string[];
}

const nutritionData: NutritionFact[] = [
  {
    flavour: "Yogurt Core (Natural)",
    per100g: { calories: 95, fat: 1.8, saturatedFat: 1.2, carbs: 18, sugars: 15, protein: 3.5, salt: 0.1 },
    tags: ["98% Fat Free", "Live Cultures"],
  },
  {
    flavour: "Halo Cloud (Vanilla)",
    per100g: { calories: 98, fat: 1.9, saturatedFat: 1.3, carbs: 18.5, sugars: 15.5, protein: 3.4, salt: 0.1 },
    tags: ["98% Fat Free", "Live Cultures"],
  },
  {
    flavour: "Dark Shadow (Chocolate)",
    per100g: { calories: 105, fat: 2.2, saturatedFat: 1.5, carbs: 19, sugars: 16, protein: 3.8, salt: 0.12 },
    tags: ["98% Fat Free", "Belgian Cocoa"],
  },
  {
    flavour: "Açaí Burst",
    per100g: { calories: 85, fat: 2.0, saturatedFat: 0.5, carbs: 14, sugars: 10, protein: 2.8, salt: 0.08 },
    tags: ["High Antioxidants", "Lower Sugar"],
  },
  {
    flavour: "Mango Flux",
    per100g: { calories: 92, fat: 1.5, saturatedFat: 1.0, carbs: 17, sugars: 14, protein: 3.2, salt: 0.09 },
    tags: ["98% Fat Free", "Real Fruit"],
  },
  {
    flavour: "Strawberry Prime",
    per100g: { calories: 88, fat: 1.6, saturatedFat: 1.1, carbs: 16, sugars: 13, protein: 3.0, salt: 0.08 },
    tags: ["98% Fat Free", "Natural Colour"],
  },
  {
    flavour: "Coconut Zenith",
    per100g: { calories: 110, fat: 4.5, saturatedFat: 4.0, carbs: 16, sugars: 12, protein: 1.2, salt: 0.05 },
    tags: ["Vegan Option", "Dairy Free Base"],
  },
];

export default function AllergenPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Header - Luxury White/Gold Style */}
        <section className="bg-gradient-to-b from-[#fff5f5] to-white border-b border-red-100">
          <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
              Your Safety Matters
            </p>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }} data-testid="text-allergen-title">
              Allergy & Nutrition Information
            </h1>
            <p className="text-base text-neutral-500 max-w-2xl mx-auto">
              We believe in full transparency. Please review this information carefully before visiting our self-serve bar.
            </p>
          </div>
        </section>

        {/* Important Self-Serve Notice */}
        <section className="bg-red-50 border-y border-red-100">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-red-200 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 text-red-600" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-800 mb-2">Important Self-Serve Notice</h2>
                <p className="text-sm text-red-700 leading-relaxed">
                  Essence Yogurt operates a <strong>self-serve toppings bar</strong> where customers add their own toppings. 
                  Due to the nature of our service, <strong>cross-contamination between allergens is highly likely</strong>. 
                  Shared utensils, customer handling, and close proximity of products may result in trace amounts of allergens in any product. 
                  <strong> If you have a severe allergy, please speak with our staff before consuming any products.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-Contamination Risks */}
        <section className="bg-[#faf9f7] border-b border-[#d4af37]/10">
          <div className="mx-auto max-w-4xl px-4 py-10">
            <h3 className="text-lg font-medium text-center mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cross-Contamination Risks at Self-Serve Bar
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {[
                { title: "Shared Utensils", desc: "Spoons and tongs transfer between products" },
                { title: "Product Proximity", desc: "Toppings stored close together" },
                { title: "Customer Handling", desc: "Other customers may cross-contaminate" },
                { title: "Airborne Particles", desc: "Fine nut particles in the air" }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
                  <h4 className="font-medium text-neutral-800 mb-1 text-sm">{item.title}</h4>
                  <p className="text-[11px] text-neutral-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Allergens Grid */}
        <section className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                Know Before You Go
              </p>
              <h2 className="text-2xl font-light" style={{ fontFamily: 'Playfair Display, serif' }}>
                Common Allergens in Our Products
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allergenData.map((allergen) => {
                const IconComponent = allergen.icon;
                return (
                  <div
                    key={allergen.name}
                    className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-[#d4af37]/50 hover:shadow-lg transition-all duration-300"
                    data-testid={`card-allergen-${allergen.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${allergen.color}20` }}
                      >
                        <IconComponent 
                          className="w-7 h-7" 
                          style={{ color: allergen.color }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className="text-lg font-medium text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {allergen.name}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
                      {allergen.description}
                    </p>
                    
                    {allergen.present.length > 0 && (
                      <div className="mb-4 pt-4 border-t border-neutral-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600 mb-2">
                          Present In
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {allergen.present.map((item) => (
                            <span 
                              key={item}
                              className="px-2 py-1 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-100"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {allergen.mayContain.length > 0 && (
                      <div className={allergen.present.length === 0 ? "pt-4 border-t border-neutral-100" : ""}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-2">
                          May Contain Traces
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {allergen.mayContain.map((item) => (
                            <span 
                              key={item}
                              className="px-2 py-1 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dietary Options */}
        <section className="bg-[#faf9f7] border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                Special Requirements
              </p>
              <h2 className="text-2xl font-light" style={{ fontFamily: 'Playfair Display, serif' }}>
                Dietary Options Available
              </h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Halal Certified",
                  desc: "All Essence Yogurt products are Halal certified. No pork gelatin or alcohol in our base yogurts.",
                  color: "#2e7d32"
                },
                {
                  icon: Wheat,
                  title: "Gluten-Free Base",
                  desc: "All frozen yogurt bases are gluten-free. Fresh fruit toppings are safe alternatives.",
                  color: "#d4a574"
                },
                {
                  icon: Leaf,
                  title: "Vegan Options",
                  desc: "Coconut Zenith and select sorbets are dairy-free. Ask staff for current availability.",
                  color: "#7b1fa2"
                },
                {
                  icon: Droplets,
                  title: "98% Fat Free",
                  desc: "All frozen yogurt is 98% fat-free with live probiotic cultures for digestive health.",
                  color: "#1565c0"
                }
              ].map((option, i) => {
                const IconComponent = option.icon;
                return (
                  <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center hover:border-[#d4af37]/30 transition-all">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${option.color}15` }}
                    >
                      <IconComponent 
                        className="w-8 h-8" 
                        style={{ color: option.color }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-medium mb-2 text-neutral-800">{option.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {option.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Nutrition Table */}
        <section className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                Nutritional Facts
              </p>
              <h2 className="text-2xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Per 100g Serving
              </h2>
              <p className="text-sm text-neutral-500">Values may vary slightly. Toppings add additional nutrition.</p>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="w-full min-w-[800px]" data-testid="table-nutrition">
                <thead>
                  <tr className="bg-[#faf9f7] border-b border-neutral-200">
                    <th className="text-left py-4 px-4 font-medium text-neutral-800">Flavour</th>
                    <th className="text-center py-4 px-3 font-medium text-neutral-800 text-sm">Cal</th>
                    <th className="text-center py-4 px-3 font-medium text-neutral-800 text-sm">Fat (g)</th>
                    <th className="text-center py-4 px-3 font-medium text-neutral-800 text-sm">Sat Fat (g)</th>
                    <th className="text-center py-4 px-3 font-medium text-neutral-800 text-sm">Carbs (g)</th>
                    <th className="text-center py-4 px-3 font-medium text-neutral-800 text-sm">Sugar (g)</th>
                    <th className="text-center py-4 px-3 font-medium text-neutral-800 text-sm">Protein (g)</th>
                    <th className="text-left py-4 px-4 font-medium text-neutral-800 text-sm">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {nutritionData.map((item, idx) => (
                    <tr key={item.flavour} className={`border-b border-neutral-100 hover:bg-[#faf9f7] transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}`}>
                      <td className="py-4 px-4 font-medium text-neutral-800">{item.flavour}</td>
                      <td className="text-center py-4 px-3 text-neutral-600">{item.per100g.calories}</td>
                      <td className="text-center py-4 px-3 text-neutral-600">{item.per100g.fat}</td>
                      <td className="text-center py-4 px-3 text-neutral-600">{item.per100g.saturatedFat}</td>
                      <td className="text-center py-4 px-3 text-neutral-600">{item.per100g.carbs}</td>
                      <td className="text-center py-4 px-3 text-neutral-600">{item.per100g.sugars}</td>
                      <td className="text-center py-4 px-3 text-neutral-600">{item.per100g.protein}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-medium uppercase tracking-wide bg-[#d4af37]/10 text-[#a07c10] px-2 py-0.5 rounded-full border border-[#d4af37]/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Staff Assistance CTA */}
        <section className="bg-gradient-to-b from-[#faf9f7] to-white border-t border-[#d4af37]/10">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center">
            <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Have Questions About Ingredients?
            </h2>
            <p className="text-sm text-neutral-500 mb-8 max-w-xl mx-auto">
              Our trained staff are here to help you make informed choices. 
              Don't hesitate to ask about any specific dietary requirements or allergy concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/locations" 
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all"
                data-testid="btn-find-location"
              >
                Find Your Nearest Store
              </a>
              <a 
                href="/contact" 
                className="inline-block px-8 py-3 rounded-full border-2 border-[#d4af37] text-[#d4af37] text-sm font-medium tracking-wide hover:bg-[#d4af37] hover:text-white transition-all"
                data-testid="btn-contact"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-neutral-50 border-t border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-8 text-center">
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              The information provided on this page is for guidance only and may be subject to change. 
              Always inform our staff of any allergies or dietary requirements before ordering. 
              Essence Yogurt cannot guarantee that any product is completely free from allergens due to the nature of our self-serve environment. 
              For the most current allergen information, please ask our in-store team.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
