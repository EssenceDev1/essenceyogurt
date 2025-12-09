import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";
import { Plane, Clock, ShieldCheck, Globe, CupSoda, Palette, Scale, Sparkles } from "lucide-react";
import airportImage from "@assets/generated_images/airport_luxury_yogurt_lounge.png";
import softServeImage from "@assets/generated_images/luxury_martini_yogurt_glass.png";

export default function AirportsPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <img 
            src={airportImage} 
            alt="Essence Yogurt Airport Bar" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          
          <div className="relative z-10 text-center text-white px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-4">
              Self-Serve Airport Concept
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Open Space Bars For Aviation
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
              DIY frozen yogurt designed for the modern terminal. Fast, fresh, and unforgettable.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-100 transition-colors"
            >
              Request Terminal Specifications
            </Link>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-3">
                The Experience
              </p>
              <h2 className="text-3xl font-semibold mb-4">Self-Serve Simplicity</h2>
              <p className="text-neutral-600">Perfect for time-pressed travelers - create your treat in under 2 minutes</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { step: "01", icon: CupSoda, title: "Grab a Cup", desc: "Start your journey" },
                { step: "02", icon: Sparkles, title: "Swirl Flavors", desc: "Self-serve machines" },
                { step: "03", icon: Palette, title: "Add Toppings", desc: "Fresh fruits & sauces" },
                { step: "04", icon: Scale, title: "Weigh & Go", desc: "Quick checkout" },
              ].map((item) => (
                <div key={item.step} className="text-center">
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

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Why Essence in your Terminal?</h2>
                <div className="space-y-6">
                  {[
                    { icon: Clock, title: "2 Minute Experience", desc: "Self-serve means passengers create their treat without staff bottlenecks." },
                    { icon: ShieldCheck, title: "HACCP & ISO Certified", desc: "Exceeding global aviation food safety standards with rigorous protocols." },
                    { icon: Globe, title: "Global Brand Appeal", desc: "Recognizable luxury aesthetic that appeals to international travelers." },
                    { icon: Plane, title: "Multiple Formats", desc: "From departure halls to business class lounges - flexible configurations." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#d4af37] shrink-0">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-neutral-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <img 
                src={softServeImage} 
                alt="Variety of frozen yogurt creations" 
                className="w-full rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <div className="bg-neutral-900 text-white p-8 rounded-3xl">
              <h3 className="text-xl font-semibold mb-6 text-[#d4af37]">Technical Requirements</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-neutral-400">Open Bar Footprint</span>
                  <span className="font-medium">25-50 sqm</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-neutral-400">Self-Serve Machines</span>
                  <span className="font-medium">4-8 Units</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-neutral-400">Power</span>
                  <span className="font-medium">3-Phase, 32A</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-neutral-400">Water Supply</span>
                  <span className="font-medium">Standard Potable</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-neutral-400">Staffing</span>
                  <span className="font-medium">1-2 (assistance only)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Partner With Us</h2>
            <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
              Bring the Essence experience to your terminal
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Contact Our Team
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
