import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";
import { Wine, Gem, Users, Sparkles } from "lucide-react";
import sauceImage from "@assets/IMG_2543_1764403425497.jpeg";
import cupsImage from "@assets/image_1764403114736.jpeg";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-4">
              Mobile Self-Serve Bars
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              The Essence Pop-Up Experience
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
              DIY frozen yogurt bars for exclusive events, galas, and private parties
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-100 transition-colors"
            >
              Check Availability
            </Link>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-3">
                  The Experience
                </p>
                <h2 className="text-3xl font-semibold mb-4">Interactive Dessert For Your Guests</h2>
                <p className="text-neutral-600 mb-6">
                  Forget heavy cakes and pastries. Our mobile self-serve bars let guests create their own frozen yogurt masterpieces with premium toppings and warm drizzle sauces. It's entertainment and dessert in one.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Wine, title: "Unlimited Refills", desc: "Flat fee packages for all guests" },
                    { icon: Gem, title: "Luxury Setup", desc: "Gold & white bar with Essence staff" },
                    { icon: Users, title: "Self-Serve Fun", desc: "Guests create their own treats" },
                    { icon: Sparkles, title: "Fresh Toppings", desc: "Prepared on-site for freshness" },
                  ].map((item) => (
                    <div key={item.title} className="flex flex-col gap-2">
                      <item.icon className="text-[#d4af37] w-5 h-5" />
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-neutral-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <img 
                src={sauceImage} 
                alt="Warm sauce tap" 
                className="w-full rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl font-semibold mb-3">Guest Creations</h2>
              <p className="text-neutral-600">
                Every guest leaves with a unique creation - and an unforgettable memory
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <img 
                src={cupsImage} 
                alt="Variety of frozen yogurt creations" 
                className="w-full rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <div className="bg-neutral-900 text-white p-8 rounded-3xl">
              <h3 className="text-xl font-semibold mb-6 text-[#d4af37]">Event Packages</h3>
              
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="font-semibold">The Gold Tier</h4>
                    <span className="text-[#d4af37] font-semibold">$2,500+</span>
                  </div>
                  <p className="text-sm text-neutral-400">Up to 100 guests. 2 hours service. 2 Flavors + 6 Toppings + Warm Sauces.</p>
                </div>
                
                <div className="border-b border-white/10 pb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="font-semibold">The Platinum Tier</h4>
                    <span className="text-[#d4af37] font-semibold">$4,500+</span>
                  </div>
                  <p className="text-sm text-neutral-400">Up to 250 guests. 4 hours service. 4 Flavors + Full Topping Bar + Fresh Fruit.</p>
                </div>
                
                <div className="pb-2">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="font-semibold">The Black Label</h4>
                    <span className="text-[#d4af37] font-semibold">Custom</span>
                  </div>
                  <p className="text-sm text-neutral-400">Unlimited guests. Full day. Custom branding on cups and mobile bar unit.</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="block w-full text-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
                >
                  Contact Events Manager
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Book Your Pop-Up Bar</h2>
            <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
              Perfect for weddings, corporate galas, and exclusive private events
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Check Availability
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
