import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";
import { Palette, Users, Clock, Sparkles, CupSoda, Scale } from "lucide-react";
import mallImage from "@assets/generated_images/mall_luxury_yogurt_kiosk.png";
import storeInteriorImage from "@assets/generated_images/franchise_store_interior.png";
import yogurtCupsImage from "@assets/generated_images/luxury_martini_yogurt_glass.png";

export default function MallsPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <img 
            src={mallImage} 
            alt="Essence Yogurt Mall Store" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="relative z-10 text-center text-white px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-4">
              Open Space Concept
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Self-Serve Mall Shops
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Walk in. Create your masterpiece. Pay by weight. The premium DIY frozen yogurt experience.
            </p>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-3">
                  The Experience
                </p>
                <h2 className="text-3xl font-semibold mb-4">Do It Yourself</h2>
                <p className="text-neutral-600 mb-6">
                  Our open-space mall shops put you in control. Grab a cup, dispense your favorite flavors from sleek self-serve machines, pile on fresh toppings, drizzle warm sauces, and pay by weight.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Palette, label: "Your Creation", desc: "Mix flavors and toppings your way" },
                    { icon: Users, label: "Social Space", desc: "Central islands for groups" },
                    { icon: Clock, label: "No Wait", desc: "Self-serve means instant service" },
                    { icon: Sparkles, label: "Fresh Daily", desc: "Toppings prepared on-site" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-2xl bg-neutral-50">
                      <item.icon className="w-5 h-5 text-[#d4af37] mb-2" />
                      <p className="font-semibold text-sm mb-1">{item.label}</p>
                      <p className="text-xs text-neutral-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <img 
                src={storeInteriorImage} 
                alt="Self-serve yogurt machines" 
                className="w-full rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
              <p className="text-neutral-600">Simple steps to frozen yogurt perfection</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { step: "01", icon: CupSoda, title: "Grab a Cup", desc: "Pick your size from our cup station" },
                { step: "02", icon: Sparkles, title: "Swirl & Fill", desc: "Dispense from our flavor machines" },
                { step: "03", icon: Palette, title: "Top It Off", desc: "Fresh fruits, sauces, crunchy bits" },
                { step: "04", icon: Scale, title: "Weigh & Pay", desc: "Fair pricing by weight" },
              ].map((item) => (
                <div key={item.step} className="text-center bg-white p-6 rounded-2xl">
                  <div className="relative mb-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#a07c10]/20 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <span className="absolute -top-1 right-1/4 w-6 h-6 rounded-full bg-[#d4af37] text-white text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl font-semibold mb-3">Unlimited Creations</h2>
              <p className="text-neutral-600">
                From classic to creative - every visit is a new masterpiece
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <img 
                src={yogurtCupsImage} 
                alt="Variety of frozen yogurt creations" 
                className="w-full rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-3">
                Store Design
              </p>
              <h2 className="text-2xl font-semibold mb-3">Open Corner Format</h2>
              <p className="text-neutral-600">
                Designed to draw customers in with visibility from all angles
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Corner Position", desc: "Maximum visibility in high-traffic mall areas" },
                { title: "Central Island", desc: "Topping bar as the social centerpiece" },
                { title: "Light Wood & White", desc: "Clean, premium aesthetic that stands out" },
              ].map((item, i) => (
                <div key={item.title} className="p-6 rounded-2xl border border-neutral-200 bg-white text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#a07c10]/20 flex items-center justify-center">
                    <span className="text-lg font-semibold text-[#d4af37]">0{i + 1}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Bring Essence to Your Mall</h2>
            <p className="text-neutral-400 mb-6 max-w-xl mx-auto">
              We're seeking premium mall locations in key markets worldwide
            </p>
            <Link
              href="/franchise"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-100 transition-colors"
            >
              Franchise Inquiry
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
