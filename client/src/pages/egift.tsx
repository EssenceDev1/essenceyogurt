"use client";

import { useState } from "react";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { toast } from "sonner";
import { Check, CreditCard, Sparkles, Crown, Gem, Gift, Wifi } from "lucide-react";
import logoLight from "@/assets/brand/logo-light.jpeg";

interface EGiftPackage {
  id: string;
  name: string;
  tier: string;
  amount: number;
  perks: string[];
  cardStyle: 'ivory' | 'noir' | 'rose';
  icon: React.ElementType;
}

const egiftPackages: EGiftPackage[] = [
  {
    id: "silver",
    name: "Maison",
    tier: "Classic",
    amount: 50,
    perks: ["$50 Store Credit", "Digital Card", "Email Delivery", "1 Year Validity"],
    cardStyle: "ivory",
    icon: CreditCard,
  },
  {
    id: "gold",
    name: "Prestige",
    tier: "Luxe",
    amount: 100,
    perks: ["$100 Store Credit", "Premium Card Design", "Apple Wallet", "2 Year Validity"],
    cardStyle: "rose",
    icon: Crown,
  },
  {
    id: "platinum",
    name: "Haute",
    tier: "Elite",
    amount: 200,
    perks: ["$200 Store Credit", "Exclusive Design", "Apple Wallet + QR", "Unlimited Validity"],
    cardStyle: "noir",
    icon: Gem,
  },
];

function LuxuryGiftCard({ 
  style, 
  recipientName, 
  amount, 
  isSelected,
  tier 
}: { 
  style: 'ivory' | 'noir' | 'rose';
  recipientName?: string;
  amount: number;
  isSelected?: boolean;
  tier?: string;
}) {
  const cardNum = `4532 •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`;
  
  const styles = {
    ivory: {
      bg: "bg-gradient-to-br from-[#fdfbf7] via-[#f8f4ed] to-[#f0ebe0]",
      text: "text-[#1a1a1a]",
      accent: "text-[#b8a589]",
      chip: "from-[#d4c4a8] via-[#e8dcc8] to-[#c4b494]",
      border: "border-[#d4c4a8]/50",
      pattern: "rgba(180,160,130,0.04)",
      shine: "from-white/60 via-transparent to-transparent",
      highlight: "#d4c4a8",
    },
    noir: {
      bg: "bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#000000]",
      text: "text-white",
      accent: "text-[#d4af37]",
      chip: "from-[#d4af37] via-[#f0d875] to-[#a07c10]",
      border: "border-[#d4af37]/40",
      pattern: "rgba(212,175,55,0.03)",
      shine: "from-white/10 via-transparent to-transparent",
      highlight: "#d4af37",
    },
    rose: {
      bg: "bg-gradient-to-br from-[#f8f0ed] via-[#f5e9e4] to-[#eeddd5]",
      text: "text-[#3d2c28]",
      accent: "text-[#b8860b]",
      chip: "from-[#e8c4a8] via-[#f0d4c0] to-[#d4a888]",
      border: "border-[#d4a888]/50",
      pattern: "rgba(184,134,11,0.03)",
      shine: "from-white/50 via-transparent to-transparent",
      highlight: "#b8860b",
    },
  };
  
  const s = styles[style];
  
  return (
    <div 
      className={`relative w-full aspect-[1.586/1] rounded-[20px] ${s.bg} overflow-hidden transition-all duration-500 ${
        isSelected ? 'ring-2 ring-offset-4 ring-[#d4af37] scale-[1.02]' : ''
      }`}
      style={{
        boxShadow: style === 'noir' 
          ? '0 25px 60px -15px rgba(0,0,0,0.5), 0 10px 20px -10px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
          : '0 25px 60px -15px rgba(0,0,0,0.15), 0 10px 20px -10px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.9)',
        border: `1px solid ${style === 'noir' ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.08)'}`,
      }}
    >
      {/* Luxury Monogram Pattern - LV/Gucci inspired */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            ${s.pattern} 20px,
            ${s.pattern} 21px
          ), repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            ${s.pattern} 20px,
            ${s.pattern} 21px
          )`,
        }}
      />
      
      {/* Holographic shimmer effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            ${style === 'noir' ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.4)'} 25%,
            transparent 50%,
            ${style === 'noir' ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.2)'} 75%,
            transparent 100%
          )`,
        }}
      />
      
      {/* Top shine */}
      <div className={`absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b ${s.shine} pointer-events-none`} />
      
      {/* Card Content */}
      <div className="relative h-full p-5 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: style === 'noir' 
                  ? 'linear-gradient(135deg, #d4af37 0%, #f0d875 50%, #a07c10 100%)'
                  : 'linear-gradient(135deg, #d4af37 0%, #c4a030 100%)',
              }}
            >
              <span className="text-white text-sm font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>E</span>
            </div>
            <div>
              <p className={`text-sm font-semibold tracking-wide ${s.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                Essence
              </p>
              <p className={`text-[9px] uppercase tracking-[0.2em] ${s.accent}`}>Yogurt</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${s.accent} rotate-90`} style={{ opacity: 0.7 }} />
            {tier && (
              <span className={`text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${
                style === 'noir' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-black/5 ' + s.accent
              }`}>
                {tier}
              </span>
            )}
          </div>
        </div>
        
        {/* Premium EMV Chip */}
        <div className="relative">
          <div 
            className={`w-12 h-9 rounded-lg bg-gradient-to-br ${s.chip} shadow-md`}
            style={{
              backgroundImage: `
                linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 30%)
              `,
            }}
          >
            {/* Chip lines */}
            <div className="absolute inset-1 opacity-40">
              <div className="absolute left-0 top-1/2 w-full h-px bg-black/30" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-black/30" />
              <div className="absolute left-1/4 top-0 h-full w-px bg-black/20" />
              <div className="absolute left-3/4 top-0 h-full w-px bg-black/20" />
            </div>
          </div>
        </div>
        
        {/* Card Number - Embossed style */}
        <p 
          className={`text-sm tracking-[0.2em] ${s.text} opacity-70`}
          style={{ 
            fontFamily: 'ui-monospace, monospace',
            textShadow: style === 'noir' ? '0 1px 0 rgba(255,255,255,0.1)' : '0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          {cardNum}
        </p>
        
        {/* Bottom Row */}
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-[8px] uppercase tracking-[0.15em] mb-0.5 ${s.accent}`}>
              Cardholder
            </p>
            <p 
              className={`text-base font-medium tracking-wide truncate max-w-[140px] ${s.text}`}
              style={{ 
                fontFamily: 'system-ui, sans-serif',
                textShadow: style === 'noir' ? '0 1px 0 rgba(255,255,255,0.05)' : 'none',
              }}
            >
              {recipientName || "YOUR NAME"}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-[8px] uppercase tracking-[0.15em] mb-0.5 ${s.accent}`}>Value</p>
            <p 
              className={`text-3xl font-light ${s.text}`}
              style={{ 
                fontFamily: 'Playfair Display, serif',
                textShadow: style === 'noir' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              ${amount}
            </p>
          </div>
        </div>
      </div>
      
      {/* Edge highlight */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      />
    </div>
  );
}

export default function EgiftPage() {
  const [selectedPackage, setSelectedPackage] = useState<EGiftPackage>(egiftPackages[1]);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const activeAmount = customAmount ?? selectedPackage.amount;

  async function submit() {
    if (!buyerName || !buyerEmail) {
      toast.error("Please fill in your details");
      return;
    }
    if (!recipient || !recipientName) {
      toast.error("Please fill in recipient details");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/egift/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: String(activeAmount),
          currency: "USD",
          buyerName,
          buyerEmail,
          recipientEmail: recipient,
          recipientName,
          message: message || undefined,
        }),
      });
      
      if (res.ok) {
        toast.success("E-Gift card purchased!", {
          description: `A confirmation has been sent to ${buyerEmail}. The gift will be delivered to ${recipient}.`,
        });
        setBuyerName("");
        setBuyerEmail("");
        setRecipient("");
        setRecipientName("");
        setMessage("");
      } else {
        toast.error("Failed to process payment");
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
        <section className="bg-gradient-to-b from-neutral-50 to-white border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37]/10 to-[#a07c10]/10 rounded-full mb-4">
              <Gift className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#a07c10]">E-Gift Cards</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Send a <span className="bg-gradient-to-r from-[#d4af37] to-[#a07c10] bg-clip-text text-transparent">golden</span> Essence moment
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Choose from our premium e-gift packages. Each card is beautifully designed and delivered instantly via email, Apple Wallet, or QR code.
            </p>
          </div>
        </section>

        {/* Package Selection - Ultra-Luxury Credit Card Style */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-white via-neutral-50/50 to-white">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#b8a589] mb-2">Curated Collection</p>
              <h2 className="text-2xl md:text-3xl font-light tracking-wide text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Select Your <span className="italic">Carte Cadeau</span>
              </h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              {egiftPackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                
                return (
                  <button
                    key={pkg.id}
                    onClick={() => { setSelectedPackage(pkg); setCustomAmount(null); }}
                    className="relative group text-left transition-all duration-500 hover:-translate-y-1"
                    data-testid={`package-${pkg.id}`}
                  >
                    <LuxuryGiftCard 
                      style={pkg.cardStyle}
                      amount={pkg.amount}
                      tier={pkg.tier}
                      isSelected={isSelected}
                    />
                    
                    {/* Selection Check */}
                    {isSelected && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#a07c10] rounded-full flex items-center justify-center shadow-lg z-10">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    {/* Package Info */}
                    <div className={`mt-6 space-y-2 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>{pkg.name}</h3>
                        <span className="text-xs uppercase tracking-wider text-[#b8a589]">{pkg.tier}</span>
                      </div>
                      <div className="space-y-1.5">
                        {pkg.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                            <div className="w-1 h-1 rounded-full bg-[#d4af37]" />
                            {perk}
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Option */}
            <div className="max-w-md mx-auto mb-12 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-700">Or enter custom amount:</span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-neutral-500">$</span>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={customAmount ?? ""}
                    onChange={(e) => setCustomAmount(e.target.value ? parseInt(e.target.value, 10) : null)}
                    placeholder="10-500"
                    className="flex-1 bg-white border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#d4af37]"
                    style={{ borderColor: "rgba(212,181,140,0.7)" }}
                    data-testid="custom-amount"
                  />
                  <span className="text-neutral-400 text-sm">USD</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Express Checkout Form */}
        <section className="bg-neutral-50 border-y border-neutral-200 py-12 md:py-16">
          <div className="mx-auto max-w-2xl px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-200 rounded-full mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">Express Checkout • No Login Required</span>
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Complete Your Purchase
              </h2>
            </div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200">
              {/* Live Card Preview - Ultra-Luxury Gucci/LV Style */}
              <div className="mb-8">
                <div className="max-w-sm mx-auto">
                  <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#b8a589] mb-4">Live Preview</p>
                  <LuxuryGiftCard 
                    style={selectedPackage.cardStyle}
                    recipientName={recipientName}
                    amount={activeAmount}
                    tier={selectedPackage.tier}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Your Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a07c10] flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Your Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full h-11 px-4 bg-white border rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all"
                        style={{ borderColor: "rgba(212,181,140,0.7)" }}
                        data-testid="buyer-name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-11 px-4 bg-white border rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all"
                        style={{ borderColor: "rgba(212,181,140,0.7)" }}
                        data-testid="buyer-email"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a07c10] flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Recipient Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-11 px-4 bg-white border rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all"
                        style={{ borderColor: "rgba(212,181,140,0.7)" }}
                        data-testid="recipient-name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="friend@example.com"
                        className="w-full h-11 px-4 bg-white border rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all"
                        style={{ borderColor: "rgba(212,181,140,0.7)" }}
                        data-testid="recipient-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Personal Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Add a heartfelt note for their Essence moment..."
                      className="w-full px-4 py-3 bg-white border rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] transition-all resize-none"
                      style={{ borderColor: "rgba(212,181,140,0.7)" }}
                      data-testid="gift-message"
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a07c10] flex items-center justify-center text-white text-xs font-bold">3</div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Order Summary</span>
                  </div>
                  
                  {/* Summary */}
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div>
                      <p className="text-xs text-neutral-500">Total Amount</p>
                      <p className="text-2xl font-bold text-neutral-900">${activeAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">{selectedPackage.name} Package</p>
                      <p className="text-sm font-medium text-[#d4af37]">Instant Delivery</p>
                    </div>
                  </div>

                  <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white font-semibold rounded-xl shadow-lg shadow-[#d4af37]/25 hover:shadow-xl hover:shadow-[#d4af37]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    data-testid="submit-egift"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Pay ${activeAmount.toFixed(2)} Securely</span>
                      </>
                    )}
                  </button>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                      <span className="text-[10px] font-medium">SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                      <span className="text-[10px] font-medium">Visa • Mastercard • Amex</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/></svg>
                      <span className="text-[10px] font-medium">Apple Pay</span>
                    </div>
                  </div>
                  
                  <p className="text-center text-[11px] text-neutral-500">
                    E-gift cards are valid at all participating Essence Yogurt locations worldwide.
                    <a href="/legal/egift-terms" className="text-[#d4af37] hover:underline ml-1">Terms apply</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Gift, title: "Instant Delivery", desc: "Delivered via email within minutes" },
                { icon: CreditCard, title: "Apple Wallet", desc: "Add to Apple Wallet for easy access" },
                { icon: Sparkles, title: "Premium Design", desc: "Beautiful card designs for any occasion" },
              ].map((feature) => (
                <div key={feature.title} className="text-center p-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-[#a07c10]/10 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-[#d4af37]" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-neutral-500">{feature.desc}</p>
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
