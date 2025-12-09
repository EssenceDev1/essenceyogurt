"use client";

import { useState } from "react";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { toast } from "sonner";
import { 
  Building2, 
  Plane, 
  Store, 
  Crown, 
  CheckCircle, 
  Globe, 
  TrendingUp, 
  Users,
  Award,
  Zap,
  MapPin
} from "lucide-react";
import { PlacePicker, type PlaceResult } from "@/components/maps";

const INVESTMENT_TIERS = [
  {
    id: "tier_kiosk",
    name: "Essence Kiosk",
    icon: Store,
    minInvestment: 75000,
    maxInvestment: 150000,
    locations: ["Kiosk"],
    royaltyPercentage: 5,
    marketingFeePercentage: 2,
    exclusiveTerritory: false,
    trainingIncluded: true,
    equipmentPackage: "Compact Kiosk Package",
    estimatedRoi: "18-24 months",
    description: "Perfect for high-traffic areas. Compact footprint with maximum efficiency.",
    highlights: ["Low entry point", "Quick setup", "High volume potential"]
  },
  {
    id: "tier_mall",
    name: "Essence Mall Store",
    icon: Building2,
    minInvestment: 200000,
    maxInvestment: 400000,
    locations: ["Mall"],
    royaltyPercentage: 5,
    marketingFeePercentage: 2,
    exclusiveTerritory: false,
    trainingIncluded: true,
    equipmentPackage: "Standard Store Package",
    estimatedRoi: "24-36 months",
    description: "Full-service store experience in premium shopping destinations.",
    highlights: ["Prime mall locations", "Full menu offering", "Brand visibility"]
  },
  {
    id: "tier_airport",
    name: "Essence Airport Lounge",
    icon: Plane,
    minInvestment: 350000,
    maxInvestment: 600000,
    locations: ["Airport"],
    royaltyPercentage: 6,
    marketingFeePercentage: 2.5,
    exclusiveTerritory: true,
    trainingIncluded: true,
    equipmentPackage: "Premium Airport Package",
    estimatedRoi: "18-30 months",
    description: "Capture international travelers in premium airport terminals.",
    highlights: ["24/7 operation", "International clientele", "Premium pricing"]
  },
  {
    id: "tier_flagship",
    name: "Essence Flagship",
    icon: Crown,
    minInvestment: 500000,
    maxInvestment: 1000000,
    locations: ["Flagship"],
    royaltyPercentage: 4.5,
    marketingFeePercentage: 2,
    exclusiveTerritory: true,
    trainingIncluded: true,
    equipmentPackage: "Flagship Experience Package",
    estimatedRoi: "30-48 months",
    description: "The ultimate Essence experience. Destination locations in luxury districts.",
    highlights: ["Exclusive territory", "Lowest royalty", "VIP experiences"]
  }
];

const WHY_PARTNER = [
  {
    icon: Zap,
    title: "Technology-First Brand",
    description: "Octopus Brain backend connects loyalty, AI, POS, and operations across all locations."
  },
  {
    icon: Globe,
    title: "Global Vision",
    description: "Strategic expansion in airports, premium malls, and luxury destinations worldwide."
  },
  {
    icon: TrendingUp,
    title: "Proven Model",
    description: "Self-serve pay-by-weight concept with low staff requirements and high margins."
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Comprehensive training, ongoing operational support, and marketing assistance."
  },
  {
    icon: Award,
    title: "Premium Brand",
    description: "Pure white and gold aesthetic designed for luxury-focused consumers."
  }
];

export default function FranchisePage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    proposedLocation: "",
    proposedLocationCoords: null as { lat: number; lng: number } | null,
    capital: "",
    tier: "",
    experience: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (place: PlaceResult | null) => {
    if (place) {
      setForm(f => ({
        ...f,
        proposedLocation: place.address,
        proposedLocationCoords: { lat: place.latitude, lng: place.longitude },
        city: place.city || f.city,
        country: place.country || f.country,
      }));
    } else {
      setForm(f => ({
        ...f,
        proposedLocation: "",
        proposedLocationCoords: null,
      }));
    }
  };

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (!form.name || !form.email || !form.country) {
      toast.error("Please fill in required fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/franchise/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tier: selectedTier || form.tier }),
      });
      
      if (res.ok) {
        toast.success("Franchise enquiry submitted!", {
          description: "Our headquarters team will contact you within 48 hours.",
        });
        setForm({ name: "", email: "", phone: "", country: "", city: "", proposedLocation: "", proposedLocationCoords: null, capital: "", tier: "", experience: "", notes: "" });
        setSelectedTier(null);
      } else {
        toast.error("Failed to submit enquiry");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-400 border border-amber-400/30 px-4 py-2 rounded-full mb-6">
                Luxury Franchise Opportunity
              </p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Partner with the Future of
                <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                  Premium Soft Serve
                </span>
              </h1>
              <p className="text-lg text-neutral-300 mb-8">
                Join Essence Yogurt and bring luxury frozen yogurt to airports, 
                premium malls, and elite destinations in your market.
              </p>
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span>Technology-Driven</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span>Premium Locations</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span>Proven Model</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">Why Partner with Essence?</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                We've built a next-generation frozen yogurt brand designed for scale and efficiency.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {WHY_PARTNER.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-neutral-200 p-5 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Tiers */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">Investment Tiers</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Choose the partnership level that matches your investment capacity and market opportunity.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {INVESTMENT_TIERS.map((tier) => {
                const Icon = tier.icon;
                const isSelected = selectedTier === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                      isSelected 
                        ? "border-amber-500 bg-amber-50 shadow-lg" 
                        : "border-neutral-200 bg-white hover:border-amber-300"
                    }`}
                    data-testid={`tier-card-${tier.id}`}
                  >
                    {tier.exclusiveTerritory && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Exclusive Territory
                      </div>
                    )}
                    <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-amber-500" : "bg-neutral-100"
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-neutral-700"}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                    <p className="text-xs text-neutral-600 mb-4">{tier.description}</p>
                    
                    <div className="text-xl font-bold text-amber-600 mb-1">
                      ${(tier.minInvestment / 1000).toFixed(0)}K - ${(tier.maxInvestment / 1000).toFixed(0)}K
                    </div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-4">Investment Range</p>
                    
                    <div className="space-y-2 text-xs border-t border-neutral-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Royalty</span>
                        <span className="font-semibold">{tier.royaltyPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Marketing Fee</span>
                        <span className="font-semibold">{tier.marketingFeePercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Est. ROI</span>
                        <span className="font-semibold text-green-600">{tier.estimatedRoi}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      {tier.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 mb-1">
                          <CheckCircle className="w-3 h-3 text-amber-500" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-6 h-6 text-amber-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="bg-neutral-900 text-white">
          <div className="mx-auto max-w-4xl px-4 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">Apply for a Franchise</h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                Complete the form below and our franchise development team will contact you within 48 hours.
              </p>
            </div>
            
            <div className="bg-white text-black rounded-3xl shadow-2xl p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Full Name *</label>
                  <input
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name"
                    data-testid="franchise-name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Email Address *</label>
                  <input
                    type="email"
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="email@example.com"
                    data-testid="franchise-email"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Phone Number</label>
                  <input
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    data-testid="franchise-phone"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Country *</label>
                  <select
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    data-testid="franchise-country"
                  >
                    <option value="">Select country</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="IL">Israel</option>
                    <option value="GR">Greece</option>
                    <option value="AU">Australia</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">City</label>
                  <input
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Your city"
                    data-testid="franchise-city"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold flex items-center gap-2">
                    <MapPin size={14} className="text-amber-500" />
                    Proposed Location
                  </label>
                  <PlacePicker
                    placeholder="Search for your proposed store location..."
                    value={form.proposedLocation}
                    onChange={handleLocationChange}
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Search for the specific address or venue where you'd like to open your Essence location
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Investment Tier</label>
                  <select
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                    value={selectedTier || form.tier}
                    onChange={(e) => {
                      update("tier", e.target.value);
                      setSelectedTier(e.target.value);
                    }}
                    data-testid="franchise-tier"
                  >
                    <option value="">Select tier</option>
                    {INVESTMENT_TIERS.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name} (${(tier.minInvestment / 1000).toFixed(0)}K - ${(tier.maxInvestment / 1000).toFixed(0)}K)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Available Capital (USD)</label>
                  <select
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                    value={form.capital}
                    onChange={(e) => update("capital", e.target.value)}
                    data-testid="franchise-capital"
                  >
                    <option value="">Select range</option>
                    <option value="75-150k">$75,000 - $150,000</option>
                    <option value="150-300k">$150,000 - $300,000</option>
                    <option value="300-500k">$300,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value="1m+">$1,000,000+</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">F&B Experience</label>
                  <select
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                    data-testid="franchise-experience"
                  >
                    <option value="">Select experience level</option>
                    <option value="none">No F&B Experience</option>
                    <option value="some">Some F&B Experience</option>
                    <option value="extensive">Extensive F&B Experience</option>
                    <option value="franchise">Current Franchise Owner</option>
                    <option value="multi-unit">Multi-Unit Operator</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                <label className="text-xs font-semibold">Additional Notes</label>
                <textarea
                  rows={4}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Tell us about yourself, your background, and why you're interested in Essence Yogurt..."
                  data-testid="franchise-notes"
                />
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={submit}
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-semibold uppercase tracking-wide text-sm hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 shadow-lg"
                  data-testid="franchise-submit"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
                <p className="text-xs text-neutral-500 text-center sm:text-left">
                  By submitting, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
