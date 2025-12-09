import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import heroProductImage from "@assets/IMG_1150_1764625170544.jpeg";
import premiumToppings from "@assets/generated_images/premium_yogurt_with_toppings.png";
import discoverEssenceImage from "@assets/IMG_1190_1764662959420.jpeg";
import createEssenceImage from "@assets/IMG_1193_1764662959420.jpeg";
import luxuryPoolsideImage from "@assets/IMG_1191_1764662959420.jpeg";
import airportFamilyImage from "@assets/IMG_1194_1764662959420.jpeg";
import { ArrowRight, MapPin, Gift, Users, Sparkles, Coffee, IceCream2, Cherry, Scale, Star } from "lucide-react";

interface Flavor {
  id: number;
  name: string;
  category: string;
  description: string | null;
  isSignature: boolean;
  isAvailable: boolean;
}

const signatureFlavors = [
  { id: 1, name: "Original Greek", category: "Classic", description: "Our signature creamy Greek yogurt, pure and authentic", color: "#F5F5F0" },
  { id: 2, name: "Belgian Chocolate", category: "Indulgent", description: "Rich Belgian chocolate with velvety smoothness", color: "#4A3728" },
  { id: 3, name: "Mango Passion", category: "Tropical", description: "Exotic mango and passionfruit blend", color: "#FFB347" },
  { id: 4, name: "Pistachio Dream", category: "Premium", description: "Authentic Italian pistachio, rich and nutty", color: "#93C572" },
  { id: 5, name: "Strawberry Bliss", category: "Fruity", description: "Fresh strawberries with creamy yogurt base", color: "#FC8EAC" },
  { id: 6, name: "Salted Caramel", category: "Indulgent", description: "Sweet caramel with a touch of sea salt", color: "#C4A35A" },
];

export default function HomePage() {
  const { data: flavorsData } = useQuery({
    queryKey: ["featured-flavors"],
    queryFn: async () => {
      const res = await fetch("/api/flavors");
      if (!res.ok) return { flavors: [] };
      return res.json() as Promise<{ flavors: Flavor[] }>;
    },
  });

  const displayFlavors = flavorsData?.flavors?.length 
    ? flavorsData.flavors.slice(0, 6).map((f, i) => ({
        ...f,
        color: signatureFlavors[i % signatureFlavors.length].color
      }))
    : signatureFlavors;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white"></div>
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f6e7c8] to-[#d4af37]/20 text-sm">
                  <Sparkles size={16} className="text-[#d4af37]" />
                  <span className="text-neutral-700 font-medium">Luxury frozen yogurt experience</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                  Indulgence that's
                  <span className="block bg-gradient-to-r from-[#d4af37] to-[#a07c10] bg-clip-text text-transparent">
                    luxurious & healthy.
                  </span>
                </h1>
                <p className="text-lg text-neutral-600 max-w-lg">
                  Premium soft-serve yogurt crafted from the finest natural ingredients. 
                  Self-serve, pay by weight, available at the world's best airports and malls.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/locations"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl transition-all"
                    data-testid="btn-find-location"
                  >
                    Find a Location <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/loyalty"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
                    data-testid="btn-join-circle"
                  >
                    Join Essence Circle
                  </Link>
                </div>
              </div>

              {/* Hero Image - Main Product Shot */}
              <div className="relative">
                <div className="relative">
                  <img 
                    src={heroProductImage} 
                    alt="Essence Yogurt™ - Premium Soft Serve with Fresh Fruits" 
                    className="w-full rounded-3xl shadow-2xl object-cover aspect-square md:aspect-[4/5]"
                    data-testid="hero-product-image"
                  />
                  {/* Decorative gold ring */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-[#d4af37]/30 hidden lg:block"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent hidden lg:block"></div>
                </div>
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[90%] max-w-sm sm:max-w-none rounded-2xl bg-white shadow-xl border border-neutral-100 p-3 sm:p-4">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-[#d4af37]">8+</p>
                      <p className="text-[10px] sm:text-xs text-neutral-500">Locations</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-[#d4af37]">50K+</p>
                      <p className="text-[10px] sm:text-xs text-neutral-500">Members</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-[#d4af37]">46</p>
                      <p className="text-[10px] sm:text-xs text-neutral-500">Flavours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Flavors - Like Other Yogurt Companies */}
        <section className="border-y border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-2">
                  Our Menu
                </p>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Signature Flavours
                </h2>
              </div>
              <Link 
                href="/flavours" 
                className="inline-flex items-center gap-2 text-sm text-[#d4af37] font-semibold hover:gap-3 transition-all"
                data-testid="link-view-all-flavours"
              >
                View All Flavours <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {displayFlavors.map((flavor, index) => (
                <Link
                  key={flavor.id}
                  href="/flavours"
                  className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white hover:border-[#d4af37]/50 hover:shadow-xl transition-all duration-300"
                  data-testid={`featured-flavor-${flavor.id}`}
                >
                  {/* Color Circle representing flavor */}
                  <div className="aspect-square flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-white">
                    <div 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                      style={{ 
                        backgroundColor: flavor.color,
                        boxShadow: `0 8px 32px ${flavor.color}40`
                      }}
                    >
                      {index === 0 && (
                        <Star size={20} className="text-[#d4af37] fill-[#d4af37]" />
                      )}
                    </div>
                  </div>
                  {/* Flavor Info */}
                  <div className="p-3 sm:p-4 border-t border-neutral-100">
                    <p className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                      {flavor.category}
                    </p>
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 leading-tight">
                      {flavor.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 hidden sm:block">
                      {flavor.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Premium Toppings Banner */}
            <div className="mt-8 rounded-3xl bg-gradient-to-r from-neutral-900 to-neutral-800 overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-6 sm:p-8 md:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-2">
                    Premium Toppings
                  </p>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Fresh Fruits, Nuts & Sauces
                  </h3>
                  <p className="text-neutral-400 text-sm mb-4">
                    Choose from 30+ premium toppings including fresh seasonal fruits, 
                    Belgian chocolate chips, organic granola, and warm sauce taps.
                  </p>
                  <Link
                    href="/flavours"
                    className="inline-flex items-center gap-2 text-[#d4af37] font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Explore Toppings <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="hidden md:block h-full">
                  <img 
                    src={premiumToppings} 
                    alt="Premium Toppings" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ESSENCE YOGURT BAR - The Self-Serve Experience */}
        <section className="border-b border-neutral-200 bg-white" data-testid="essence-bar-section">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                Welcome to
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="bg-gradient-to-r from-[#d4af37] to-[#B8862D] bg-clip-text text-transparent">Essence Yogurt Bar</span>
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Our luxury self-serve frozen yogurt bars feature premium soft-serve machines, 
                fresh topping stations, and precision digital scales — all in an elegant gold and white setting.
              </p>
            </div>
            
            {/* Bar Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              {/* Soft-Serve Station */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#faf9f7] border border-[#d4af37]/20 p-6 hover:border-[#d4af37]/50 hover:shadow-xl transition-all duration-300" data-testid="bar-softserve">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#B8862D] flex items-center justify-center mb-4 shadow-lg">
                  <IceCream2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">Soft-Serve Station</h3>
                <p className="text-sm text-neutral-500">Premium Italian soft-serve machines with 6+ rotating flavours daily.</p>
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active"></div>
              </div>
              
              {/* Toppings Bar */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#faf9f7] border border-[#d4af37]/20 p-6 hover:border-[#d4af37]/50 hover:shadow-xl transition-all duration-300" data-testid="bar-toppings">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#B8862D] flex items-center justify-center mb-4 shadow-lg">
                  <Cherry className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">Fresh Toppings Bar</h3>
                <p className="text-sm text-neutral-500">30+ premium toppings including fresh fruits, nuts, and warm sauce taps.</p>
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active"></div>
              </div>
              
              {/* Digital Scale */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#faf9f7] border border-[#d4af37]/20 p-6 hover:border-[#d4af37]/50 hover:shadow-xl transition-all duration-300" data-testid="bar-scale">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#B8862D] flex items-center justify-center mb-4 shadow-lg">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">Digital Scale</h3>
                <p className="text-sm text-neutral-500">Precision weighing for fair pay-by-weight pricing. See your total instantly.</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 rounded-lg">
                  <span className="text-[#d4af37] font-mono text-sm font-semibold">$50/kg</span>
                </div>
              </div>
              
              {/* Cashier/Checkout */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#faf9f7] border border-[#d4af37]/20 p-6 hover:border-[#d4af37]/50 hover:shadow-xl transition-all duration-300" data-testid="bar-cashier">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#B8862D] flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">Express Checkout</h3>
                <p className="text-sm text-neutral-500">Tap & pay with card, mobile, or earn points with Essence Circle loyalty.</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 bg-neutral-100 rounded text-xs text-neutral-600">Apple Pay</span>
                  <span className="px-2 py-1 bg-neutral-100 rounded text-xs text-neutral-600">Card</span>
                  <span className="px-2 py-1 bg-[#d4af37]/10 rounded text-xs text-[#d4af37]">Loyalty</span>
                </div>
              </div>
            </div>
            
            {/* Bar Experience Visual */}
            <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-8 md:p-12 overflow-hidden relative">
              {/* Gold accent lines */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                    The Essence Bar Experience
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Self-Serve Luxury
                  </h3>
                  <p className="text-neutral-400 mb-6">
                    Walk in, grab a cup, fill it with your favourite flavours, add as many 
                    toppings as you like, then simply weigh and pay at our elegant cashier stations. 
                    Our staff are always on hand to ensure your experience is perfect.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <IceCream2 className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <span className="text-white text-sm">Fill</span>
                    </div>
                    <ArrowRight className="text-[#d4af37] hidden sm:block" size={20} />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <Cherry className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <span className="text-white text-sm">Top</span>
                    </div>
                    <ArrowRight className="text-[#d4af37] hidden sm:block" size={20} />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <Scale className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <span className="text-white text-sm">Weigh</span>
                    </div>
                    <ArrowRight className="text-[#d4af37] hidden sm:block" size={20} />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-white text-sm">Pay</span>
                    </div>
                  </div>
                </div>
                
                {/* Simulated POS Screen */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl border border-[#d4af37]/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wide">Essence POS</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-sm text-neutral-600">Belgian Chocolate</span>
                      <span className="text-sm font-medium">125g</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-sm text-neutral-600">Fresh Strawberries</span>
                      <span className="text-sm font-medium">45g</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-sm text-neutral-600">Organic Granola</span>
                      <span className="text-sm font-medium">30g</span>
                    </div>
                    <div className="pt-3 border-t-2 border-[#d4af37]/30">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-neutral-900">Total Weight</span>
                        <span className="font-bold text-lg">200g</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-neutral-900">Total</span>
                        <span className="font-bold text-2xl text-[#d4af37]">$10.00</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#B8862D] rounded-xl text-white font-semibold shadow-lg mt-4">
                      Tap to Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Step by Step */}
        <section className="border-b border-neutral-200 bg-gradient-to-b from-[#faf9f7] to-white">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                Simple Steps
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Create Your Perfect Cup
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Our self-serve model puts you in control. Mix flavours, add toppings, 
                and pay only for what you take.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              {[
                { 
                  id: "01", 
                  title: "Grab a Cup", 
                  subtitle: "Choose your size from our elegant white and gold bowls.",
                  Icon: Coffee
                },
                { 
                  id: "02", 
                  title: "Swirl & Fill", 
                  subtitle: "Dispense your chosen flavours from our premium soft-serve machines.",
                  Icon: IceCream2
                },
                { 
                  id: "03", 
                  title: "Add Toppings", 
                  subtitle: "Fresh fruits, granola, premium nuts, and warm sauce taps.",
                  Icon: Cherry
                },
                { 
                  id: "04", 
                  title: "Weigh & Pay", 
                  subtitle: "Fair pricing by weight — pay only for what you take.",
                  Icon: Scale
                },
              ].map((step, index) => (
                <div key={step.id} className="relative text-center group" data-testid={`how-it-works-step-${step.id}`}>
                  {/* Connector Line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#d4af37]/50 to-[#d4af37]/10"></div>
                  )}
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-bold shadow-md">
                      {step.id}
                    </span>
                  </div>
                  {/* Icon Circle */}
                  <div className="w-20 h-20 mx-auto mb-6 mt-4 rounded-full bg-white border-2 border-[#d4af37]/30 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-[#d4af37] transition-all duration-300">
                    <step.Icon size={32} className="text-[#d4af37]" strokeWidth={1.5} />
                  </div>
                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-2 text-neutral-900">{step.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{step.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* E-GIFT CARDS - Luxury Promotional Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" data-testid="egift-promo-section">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#d4af37]/20 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/20 rounded-full mb-4">
                  <Gift className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">Premium E-Gift Cards</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Gift a <span className="bg-gradient-to-r from-[#d4af37] to-[#B8862D] bg-clip-text text-transparent">Golden</span> Moment
                </h2>
                <p className="text-neutral-400 text-lg mb-6 max-w-xl mx-auto lg:mx-0">
                  Send the gift of luxury frozen yogurt to loved ones. Each e-gift includes a 
                  unique fraud-protected code and QR for instant in-store scanning.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-sm">Fraud Protected</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <span className="text-sm">QR Scan Redeem</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
                      </svg>
                    </div>
                    <span className="text-sm">Apple Wallet</span>
                  </div>
                </div>

                <Link
                  href="/egift"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d4af37] to-[#B8862D] text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-[#d4af37]/30 hover:shadow-xl hover:shadow-[#d4af37]/40 transition-all group"
                  data-testid="btn-buy-egift"
                >
                  <span>Buy E-Gift Card</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Visual - Floating Credit Cards */}
              <div className="relative">
                <div className="relative max-w-md mx-auto">
                  {/* Elite Card (back) */}
                  <div className="absolute -top-4 -left-4 w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-5 shadow-2xl border border-[#d4af37]/30 transform -rotate-6 opacity-70">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">E</span>
                        </div>
                        <span className="text-white text-xs font-medium">Essence</span>
                      </div>
                      <span className="text-[#d4af37] text-xs font-bold">ELITE</span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                      <span className="text-white/60 text-xs">EY-XXXX-XXXX</span>
                      <span className="text-white text-lg font-light">$200</span>
                    </div>
                  </div>

                  {/* Luxe Card (front) */}
                  <div className="relative w-full aspect-[1.586/1] rounded-3xl bg-gradient-to-br from-white via-[#fffef9] to-[#faf6eb] p-6 shadow-2xl border border-[#d4af37]/40 transform rotate-3">
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-3xl"></div>
                    </div>
                    <div className="relative flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a07c10] flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">E</span>
                        </div>
                        <span className="text-neutral-800 font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Essence</span>
                      </div>
                      <span className="text-[#d4af37] text-sm font-bold">LUXE</span>
                    </div>
                    <div className="w-12 h-8 bg-gradient-to-br from-[#d4af37] to-[#a07c10] rounded-md shadow-sm mt-4"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-neutral-500 mb-0.5">Gift Code</p>
                        <p className="text-sm font-mono text-neutral-700">EY-GOLD-2025</p>
                      </div>
                      <p className="text-3xl font-light text-neutral-900">$100</p>
                    </div>
                    
                    {/* QR Code overlay hint */}
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 transform rotate-6">
                      <div className="w-full h-full bg-neutral-100 rounded flex items-center justify-center">
                        <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-8 right-0 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full backdrop-blur-sm">
                  <span className="text-green-400 text-xs font-semibold">Instant Delivery</span>
                </div>
                <div className="absolute -bottom-4 left-0 px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full backdrop-blur-sm">
                  <span className="text-[#d4af37] text-xs font-semibold">No Login Required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle Showcase */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                The Essence Lifestyle
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Moments Worth Savouring
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="group relative overflow-hidden rounded-3xl aspect-square">
                <img 
                  src={discoverEssenceImage} 
                  alt="Discover Your Essence" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-semibold">Discover Your Essence</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl aspect-square">
                <img 
                  src={createEssenceImage} 
                  alt="Create Your Essence" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-semibold">Fresh. Natural. Delicious.</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl aspect-square">
                <img 
                  src={luxuryPoolsideImage} 
                  alt="VIP Moments" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-semibold">VIP Luxury Moments</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl aspect-square">
                <img 
                  src={airportFamilyImage} 
                  alt="Airport Moments" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-semibold">Global Airport Experiences</p>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link 
                href="/gallery" 
                className="inline-flex items-center gap-2 text-[#d4af37] font-semibold hover:gap-3 transition-all"
              >
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                  Why Essence?
                </p>
                <h2 className="text-3xl font-semibold mb-4">
                  A new standard for frozen yogurt
                </h2>
                <p className="text-neutral-400 mb-6">
                  We've reimagined what frozen yogurt can be. Premium ingredients, 
                  stunning design, and a global platform that connects everything.
                </p>
                <Link
                  href="/story"
                  className="inline-flex items-center gap-2 text-[#d4af37] font-medium hover:gap-3 transition-all"
                >
                  Read our story <ArrowRight size={16} />
                </Link>
              </div>
              <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
                {[
                  { 
                    icon: Sparkles, 
                    title: "Premium Quality", 
                    desc: "98% fat-free yogurt with live cultures. No artificial colours or preservatives." 
                  },
                  { 
                    icon: MapPin, 
                    title: "Global Presence", 
                    desc: "Located in the world's best airports, malls, and lifestyle destinations." 
                  },
                  { 
                    icon: Gift, 
                    title: "E-Gift Cards", 
                    desc: "Send a golden Essence moment via email, Apple Wallet, or QR code." 
                  },
                  { 
                    icon: Users, 
                    title: "Essence Circle", 
                    desc: "Join our loyalty program to earn points and unlock tiers." 
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 hover:border-[#d4af37]/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#a07c10]/20 flex items-center justify-center mb-4">
                      <feature.icon size={24} className="text-[#d4af37]" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-neutral-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                  Ready to experience Essence?
                </h2>
                <p className="text-white/90 mb-6">
                  Join thousands of members who've discovered a new way to enjoy 
                  frozen yogurt. Premium quality, stylish experience, worldwide.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <Link
                  href="/locations"
                  className="rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-100 transition-colors"
                >
                  Find a Location
                </Link>
                <Link
                  href="/franchise"
                  className="rounded-full border-2 border-white text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-white hover:text-neutral-900 transition-colors"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { href: "/flavours", label: "Explore Flavours", desc: "Discover our signature collection" },
                { href: "/loyalty", label: "Essence Circle", desc: "Join our loyalty program" },
                { href: "/egift", label: "Send an E-Gift", desc: "Give the gift of Essence" },
                { href: "/franchise", label: "Franchise", desc: "Partner with a global brand" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-neutral-200 p-5 hover:border-[#d4af37] hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold mb-1 group-hover:text-[#d4af37] transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-neutral-500">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
