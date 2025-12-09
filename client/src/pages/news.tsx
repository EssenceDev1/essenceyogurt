import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface NewsItem {
  id: string;
  type: "opening" | "announcement" | "partnership" | "seasonal";
  title: string;
  excerpt: string;
  date: string;
  location?: string;
  featured?: boolean;
}

const newsData: NewsItem[] = [
  {
    id: "dubai-mall-opening",
    type: "opening",
    title: "Essence Yogurt Opens at Dubai Mall Fashion Avenue",
    excerpt: "Our flagship mall location brings the full Essence experience to one of the world's most iconic shopping destinations. White marble counters, gold accents, and our complete toppings bar.",
    date: "2025-03-15",
    location: "Dubai, UAE",
    featured: true,
  },
  {
    id: "riyadh-airport",
    type: "opening",
    title: "King Khalid International Airport - Now Open",
    excerpt: "Premium self-serve frozen yogurt is now available at Riyadh's main airport. Located in Terminal 5, departures level.",
    date: "2025-02-28",
    location: "Riyadh, Saudi Arabia",
  },
  {
    id: "summer-flavours",
    type: "seasonal",
    title: "Summer 2025 Limited Edition Flavours",
    excerpt: "Introducing Desert Rose and Saffron Honey - two new flavours inspired by the Arabian Gulf. Available at all locations through September.",
    date: "2025-06-01",
    featured: true,
  },
  {
    id: "jeddah-mall",
    type: "opening",
    title: "Red Sea Mall Jeddah - Coming Soon",
    excerpt: "Our third Saudi location will open in Red Sea Mall, featuring a dedicated VIP lounge area for Essence Circle members.",
    date: "2025-04-10",
    location: "Jeddah, Saudi Arabia",
  },
  {
    id: "checkout-partnership",
    type: "partnership",
    title: "Checkout.com Powers Seamless Payments",
    excerpt: "We've partnered with Checkout.com to bring you the fastest, most secure payment experience across all our locations in the Middle East and Europe.",
    date: "2025-01-15",
  },
  {
    id: "mykonos-summer",
    type: "opening",
    title: "Mykonos Pop-Up - Summer Season",
    excerpt: "Experience Essence Yogurt at our exclusive beach club pop-up in Mykonos. Open May through October at Scorpios Beach Club.",
    date: "2025-05-01",
    location: "Mykonos, Greece",
  },
  {
    id: "loyalty-launch",
    type: "announcement",
    title: "Essence Circle Loyalty Program Launches",
    excerpt: "Earn points with every cup and track your visits. Three membership tiers: White, Gold, and Black.",
    date: "2025-01-01",
  },
  {
    id: "tel-aviv-airport",
    type: "opening",
    title: "Ben Gurion Airport Terminal 3",
    excerpt: "Our first Israel location opens airside at Ben Gurion Airport. Premium frozen yogurt for travelers.",
    date: "2025-05-20",
    location: "Tel Aviv, Israel",
  },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  opening: { label: "New Opening", color: "bg-green-100 text-green-700" },
  announcement: { label: "Announcement", color: "bg-blue-100 text-blue-700" },
  partnership: { label: "Partnership", color: "bg-purple-100 text-purple-700" },
  seasonal: { label: "Seasonal", color: "bg-amber-100 text-amber-700" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function NewsPage() {
  const featuredNews = newsData.filter((n) => n.featured);
  const regularNews = newsData.filter((n) => !n.featured);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              News & Openings
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6" data-testid="text-news-title">
              What's new at Essence.
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Stay updated with our latest store openings, seasonal flavours, 
              partnerships, and announcements from around the world.
            </p>
          </div>
        </section>

        {featuredNews.length > 0 && (
          <section className="border-b border-neutral-200 bg-gradient-to-b from-[#faf7f2] to-white">
            <div className="mx-auto max-w-7xl px-4 py-16">
              <div className="flex items-center gap-2 mb-8">
                <Sparkles size={20} className="text-[#d4af37]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                  Featured Stories
                </h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                {featuredNews.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-[#d4af37]/30 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
                    data-testid={`card-news-${item.id}`}
                  >
                    <span className={`inline-flex text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${typeLabels[item.type].color}`}>
                      {typeLabels[item.type].label}
                    </span>
                    <h3 className="text-xl font-semibold mt-4 mb-3">{item.title}</h3>
                    <p className="text-neutral-600 mb-4">{item.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(item.date)}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-2xl font-semibold mb-8">All News</h2>
            
            <div className="space-y-6">
              {regularNews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-[#d4af37]/50 hover:shadow-md transition-all flex flex-col md:flex-row md:items-start gap-4"
                  data-testid={`card-news-${item.id}`}
                >
                  <div className="md:w-32 shrink-0">
                    <span className={`inline-flex text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${typeLabels[item.type].color}`}>
                      {typeLabels[item.type].label}
                    </span>
                    <p className="text-sm text-neutral-500 mt-2">
                      {formatDate(item.date)}
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-neutral-600 text-sm mb-3">{item.excerpt}</p>
                    {item.location && (
                      <span className="flex items-center gap-1 text-sm text-neutral-500">
                        <MapPin size={14} />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-neutral-200 bg-white p-8">
                <h3 className="font-semibold text-lg mb-2">Press Inquiries</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  For media requests, interviews, and press kits.
                </p>
                <Link
                  href="/press"
                  className="inline-flex items-center gap-2 text-[#d4af37] font-medium hover:gap-3 transition-all"
                >
                  Visit Press Room <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="rounded-3xl border border-neutral-200 bg-white p-8">
                <h3 className="font-semibold text-lg mb-2">Join Essence Circle</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  Be the first to know about new openings and updates.
                </p>
                <Link
                  href="/loyalty"
                  className="inline-flex items-center gap-2 text-[#d4af37] font-medium hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="rounded-3xl border border-neutral-200 bg-white p-8">
                <h3 className="font-semibold text-lg mb-2">Franchise Opportunities</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  Bring Essence Yogurt to your city or venue.
                </p>
                <Link
                  href="/franchise"
                  className="inline-flex items-center gap-2 text-[#d4af37] font-medium hover:gap-3 transition-all"
                >
                  Partner With Us <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
