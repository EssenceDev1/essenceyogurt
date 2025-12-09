import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";
import { TrendingUp, Building2, Globe, Users, ArrowRight, Mail } from "lucide-react";

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 mb-4">
              Investor Relations
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Invest in the future of frozen yogurt.
            </h1>
            <p className="text-sm text-neutral-600 max-w-xl">
              Essence Yogurt is redefining the premium frozen dessert category. 
              We're building a global brand positioned in the world's finest airports, 
              malls, and lifestyle destinations.
            </p>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { value: "8+", label: "Global Locations", icon: Globe },
                { value: "$2M+", label: "Annual Revenue Target", icon: TrendingUp },
                { value: "50K+", label: "Loyalty Members", icon: Users },
                { value: "3", label: "Regional HQs", icon: Building2 },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#a07c10]/20 flex items-center justify-center">
                    <stat.icon size={24} className="text-[#d4af37]" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Investment Thesis
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Premium Positioning",
                  desc: "7-star luxury brand targeting high-net-worth travelers and discerning consumers in premium locations worldwide.",
                },
                {
                  title: "Scalable Model",
                  desc: "Self-serve, pay-by-weight format with proven unit economics. Low labor costs, high margins, and franchise-ready operations.",
                },
                {
                  title: "Global Expansion",
                  desc: "Strategic focus on airports, malls, and VIP venues across Middle East, Europe, and Asia Pacific markets.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-neutral-200 p-6">
                  <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Partnership Models
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="font-semibold text-lg mb-3">Revenue Share JV</h3>
                <p className="text-sm text-neutral-600">
                  For Airport Authorities and Mall Groups. We operate, you provide the location, 
                  we share the net revenue. Ideal for landlords seeking premium F&B tenants.
                </p>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="font-semibold text-lg mb-3">Master Franchise</h3>
                <p className="text-sm text-neutral-600">
                  For experienced F&B operators. Exclusive rights to a country or region with 
                  full training, operations support, and brand guidelines.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Interested in learning more?</h2>
            <p className="text-neutral-400 max-w-xl mx-auto mb-6">
              For investor inquiries, partnership discussions, or to receive our investor deck, 
              please contact our investor relations team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                <Mail size={16} /> Contact Investor Relations
              </Link>
              <Link
                href="/franchise"
                className="inline-flex items-center gap-2 rounded-full border border-white text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-white hover:text-neutral-900 transition-colors"
              >
                Franchise Opportunities <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
