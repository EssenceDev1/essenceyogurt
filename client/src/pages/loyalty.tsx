import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import loyaltyImage from "@assets/IMG_2622_1764626731265.jpeg";
import { ActiveCampaigns, sampleCampaigns, getActiveCampaigns } from "@/components/CampaignBadges";

interface LoyaltyTier {
  id: string;
  name: string;
  requiredPoints: number;
  perksDescription: string;
  freeCupsPerYear: number | null;
  freeToppingUpgrades: number | null;
  birthdayGiftValue: string | null;
}

interface CreditPackage {
  id: string;
  name: string;
  description: string;
  numberOfCups: number;
  basePrice: string;
  discountPercent: string;
  currency: string;
}

export default function Loyalty() {
  const { data: tiersData, isLoading: tiersLoading } = useQuery({
    queryKey: ["loyalty-tiers"],
    queryFn: async () => {
      const res = await fetch("/api/loyalty-tiers");
      return res.json() as Promise<{ tiers: LoyaltyTier[] }>;
    },
  });

  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ["credit-packages"],
    queryFn: async () => {
      const res = await fetch("/api/credit-packages");
      return res.json() as Promise<{ packages: CreditPackage[] }>;
    },
  });

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-14">
            <div className="flex flex-col md:grid md:grid-cols-2 md:items-center gap-6 md:gap-10">
              {/* Image - First on mobile, second on desktop */}
              <div className="md:order-2">
                <img 
                  src={loyaltyImage}
                  alt="Premium Membership"
                  className="w-full rounded-2xl md:rounded-3xl shadow-lg object-cover aspect-[4/3]"
                />
              </div>
              {/* Text - Second on mobile, first on desktop */}
              <div className="md:order-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 mb-3 md:mb-4">
                  Essence Circle
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-3 md:mb-4">
                  Join the circle of indulgence.
                </h1>
                <p className="text-sm text-neutral-600 max-w-xl">
                  The Essence Circle is our loyalty program for those who appreciate
                  the finer things. Earn points with every visit and be the first to 
                  know about new locations.
                </p>
                <div className="mt-5 md:mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/app"
                    className="rounded-full bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide shadow-sm hover:opacity-90 inline-block"
                    data-testid="btn-join-now"
                  >
                    Join Essence Circle
                  </Link>
                  <Link
                    href="/admin-login"
                    className="rounded-full border border-neutral-300 bg-white text-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wide hover:bg-neutral-50 inline-block"
                    data-testid="btn-member-login"
                  >
                    Member Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4 md:mb-6">
              Membership Tiers
            </h2>
            {tiersLoading ? (
              <div className="text-center text-neutral-400 py-10">Loading tiers...</div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {tiersData?.tiers?.map((tier, i) => {
                  const isHighlight = i === (tiersData.tiers?.length || 0) - 1;
                  return (
                    <div
                      key={tier.id}
                      className={`rounded-2xl border p-6 hover:border-neutral-400 transition ${
                        isHighlight
                          ? "border-[#d4af37] bg-gradient-to-br from-[#f6e7c8]/10 to-white"
                          : "border-neutral-200 bg-white"
                      }`}
                      data-testid={`tier-${tier.id}`}
                    >
                      <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-[#f6e7c8] via-[#d4af37] to-[#a07c10] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {tier.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                      <p className="text-xs text-amber-600 font-medium mb-3">
                        {tier.requiredPoints === 0 ? "Starter" : `${tier.requiredPoints.toLocaleString()}+ points`}
                      </p>
                      <p className="text-xs text-neutral-600 mb-4">{tier.perksDescription}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[#d4af37]">✓</span>
                          <span>Earn points on purchases</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#d4af37]">✓</span>
                          <span>Track visit history</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Credit Packages */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Premium Credit Packages
            </h2>
            <p className="text-xs text-neutral-600 mb-4 md:mb-6">
              Pre-purchase loyalty credits for your visits
            </p>
            {packagesLoading ? (
              <div className="text-center text-neutral-400 py-6">Loading packages...</div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                {packagesData?.packages?.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-400 transition"
                    data-testid={`package-${pkg.id}`}
                  >
                    <h3 className="text-lg font-semibold mb-1">{pkg.name}</h3>
                    <p className="text-xs text-neutral-600 mb-4">{pkg.description}</p>
                    <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-semibold">{pkg.currency} {pkg.basePrice}</span>
                        <span className="text-xs font-semibold text-green-600">{pkg.discountPercent}% off</span>
                      </div>
                      <p className="text-xs text-neutral-500">{pkg.numberOfCups} Cups</p>
                    </div>
                    <button className="rounded-full bg-black text-white px-5 py-2 text-xs font-semibold uppercase tracking-wide hover:opacity-90 w-full">
                      Purchase Package
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4 md:mb-6">
              How it works
            </h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4 text-xs">
              {[
                { step: "01", title: "Join", desc: "Sign up at any location or online" },
                { step: "02", title: "Earn", desc: "1 point for every $1 spent on yogurt" },
                { step: "03", title: "Level Up", desc: "Reach new tiers as you earn points" },
                { step: "04", title: "Track", desc: "View your points and visit history" },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
                  <p className="text-lg font-semibold text-neutral-300 mb-2">{item.step}</p>
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Active Campaigns */}
        <section className="border-b border-neutral-200 bg-gradient-to-b from-[#faf7f2] to-white">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">
              Current Promotions & Campaigns
            </h2>
            <p className="text-xs text-neutral-600 mb-4 md:mb-6">
              Updates for Essence Circle members
            </p>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              <ActiveCampaigns 
                campaigns={getActiveCampaigns(sampleCampaigns)} 
                title="Active Offers"
              />
              <div className="rounded-3xl border border-[#d4af37]/30 bg-white p-6">
                <h3 className="font-semibold text-lg mb-4">Seasonal Calendar</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                    <span>Birthday Month</span>
                    <span className="text-[#d4af37] font-medium">Special recognition</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                    <span>Black Friday</span>
                    <span className="text-[#d4af37] font-medium">Member event</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                    <span>Winter Evenings</span>
                    <span className="text-[#d4af37] font-medium">Seasonal flavours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                    <span>Summer Launch</span>
                    <span className="text-[#d4af37] font-medium">New flavour previews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-neutral-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">Member Benefits</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              {[
                { title: "Birthday Recognition", desc: "Special acknowledgment on your birthday month" },
                { title: "Early Access", desc: "First to know about new flavours and locations" },
                { title: "Personal Inbox", desc: "Personalised updates and notifications" },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-700 bg-neutral-800 p-5">
                  <p className="font-semibold mb-2">{item.title}</p>
                  <p className="text-neutral-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
