import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Gift, Smartphone, QrCode, CheckCircle, XCircle, Clock, Wifi, Shield } from "lucide-react";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";

interface GiftCard {
  id: string;
  code: string;
  amount: string;
  currency: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string | null;
  message: string | null;
  isRedeemed: boolean;
  redeemedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

function LuxuryDisplayCard({ 
  recipientName, 
  amount,
  code,
  status
}: { 
  recipientName: string;
  amount: number;
  code: string;
  status: 'valid' | 'redeemed' | 'expired';
}) {
  const isNoir = amount >= 150;
  
  const cardStyles = isNoir ? {
    bg: "bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#000000]",
    text: "text-white",
    accent: "text-[#d4af37]",
    chip: "from-[#d4af37] via-[#f0d875] to-[#a07c10]",
    pattern: "rgba(212,175,55,0.03)",
    shine: "from-white/10 via-transparent to-transparent",
  } : {
    bg: "bg-gradient-to-br from-[#fdfbf7] via-[#f8f4ed] to-[#f0ebe0]",
    text: "text-[#1a1a1a]",
    accent: "text-[#b8a589]",
    chip: "from-[#d4c4a8] via-[#e8dcc8] to-[#c4b494]",
    pattern: "rgba(180,160,130,0.04)",
    shine: "from-white/60 via-transparent to-transparent",
  };
  
  return (
    <div 
      className={`relative w-full aspect-[1.586/1] rounded-[24px] ${cardStyles.bg} overflow-hidden`}
      style={{
        boxShadow: isNoir 
          ? '0 30px 80px -20px rgba(0,0,0,0.6), 0 15px 30px -15px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
          : '0 30px 80px -20px rgba(0,0,0,0.2), 0 15px 30px -15px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.9)',
        border: isNoir ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {/* Luxury Monogram Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 25px, ${cardStyles.pattern} 25px, ${cardStyles.pattern} 26px), repeating-linear-gradient(-45deg, transparent, transparent 25px, ${cardStyles.pattern} 25px, ${cardStyles.pattern} 26px)`,
        }}
      />
      
      {/* Holographic shimmer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${isNoir ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.5)'} 30%, transparent 50%, ${isNoir ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.3)'} 70%, transparent 100%)`,
        }}
      />
      
      {/* Top shine */}
      <div className={`absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b ${cardStyles.shine} pointer-events-none`} />
      
      {/* Card Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #f0d875 50%, #a07c10 100%)',
              }}
            >
              <span className="text-white text-base font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>E</span>
            </div>
            <div>
              <p className={`text-lg font-semibold tracking-wide ${cardStyles.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                Essence
              </p>
              <p className={`text-[10px] uppercase tracking-[0.25em] ${cardStyles.accent}`}>Yogurt™</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className={`w-5 h-5 ${cardStyles.accent} rotate-90`} style={{ opacity: 0.7 }} />
            <div className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
              status === 'valid' ? 'bg-green-500/20 text-green-400' :
              status === 'redeemed' ? (isNoir ? 'bg-white/10 text-white/60' : 'bg-neutral-200 text-neutral-500') :
              'bg-red-500/20 text-red-400'
            }`}>
              {status}
            </div>
          </div>
        </div>
        
        {/* Premium EMV Chip */}
        <div className="relative">
          <div 
            className={`w-14 h-11 rounded-xl bg-gradient-to-br ${cardStyles.chip} shadow-lg`}
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%), linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 30%)',
            }}
          >
            <div className="absolute inset-1.5 opacity-40">
              <div className="absolute left-0 top-1/2 w-full h-px bg-black/30" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-black/30" />
              <div className="absolute left-1/4 top-0 h-full w-px bg-black/20" />
              <div className="absolute left-3/4 top-0 h-full w-px bg-black/20" />
            </div>
          </div>
        </div>
        
        {/* Card Number */}
        <p 
          className={`text-base tracking-[0.25em] ${cardStyles.text} opacity-60`}
          style={{ 
            fontFamily: 'ui-monospace, monospace',
            textShadow: isNoir ? '0 1px 0 rgba(255,255,255,0.08)' : '0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          {code}
        </p>
        
        {/* Bottom Row */}
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-[9px] uppercase tracking-[0.2em] mb-1 ${cardStyles.accent}`}>
              Cardholder
            </p>
            <p 
              className={`text-xl font-medium tracking-wide ${cardStyles.text}`}
              style={{ textShadow: isNoir ? '0 1px 0 rgba(255,255,255,0.05)' : 'none' }}
            >
              {recipientName}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-[9px] uppercase tracking-[0.2em] mb-1 ${cardStyles.accent}`}>Value</p>
            <p 
              className={`text-4xl font-light ${cardStyles.text}`}
              style={{ 
                fontFamily: 'Playfair Display, serif',
                textShadow: isNoir ? '0 2px 4px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              ${amount}
            </p>
          </div>
        </div>
      </div>
      
      {/* Edge highlight */}
      <div className="absolute inset-0 pointer-events-none rounded-[24px]" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }} />
    </div>
  );
}

export default function GiftViewPage() {
  const params = useParams<{ code: string }>();
  const [card, setCard] = useState<GiftCard | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCard() {
      if (!params.code) return;
      
      try {
        const [cardRes, qrRes] = await Promise.all([
          fetch(`/api/egift/${params.code}`),
          fetch(`/api/egift/${params.code}/qr`)
        ]);
        
        const cardData = await cardRes.json();
        if (cardData.card) {
          setCard(cardData.card);
        } else {
          setError("Gift card not found");
        }
        
        const qrData = await qrRes.json();
        if (qrData.qrCode) {
          setQrCode(qrData.qrCode);
        }
      } catch {
        setError("Failed to load gift card");
      } finally {
        setLoading(false);
      }
    }
    
    loadCard();
  }, [params.code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
              <Gift className="w-8 h-8 text-[#d4af37]" />
            </div>
            <p className="text-neutral-500">Loading your gift card...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Gift Card Not Found</h1>
            <p className="text-neutral-500">This gift card code is invalid or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isExpired = card.expiresAt && new Date(card.expiresAt) < new Date();
  const amount = parseFloat(card.amount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 md:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/10 rounded-full mb-4">
              <Gift className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#a07c10]">Your E-Gift Card</span>
            </div>
            {card.senderName && (
              <p className="text-neutral-600">
                A gift from <span className="font-semibold text-neutral-900">{card.senderName}</span>
              </p>
            )}
          </div>

          {/* Ultra-Luxury Card Display */}
          <div className="relative mb-8">
            <LuxuryDisplayCard 
              recipientName={card.recipientName}
              amount={amount}
              code={card.code}
              status={card.isRedeemed ? 'redeemed' : isExpired ? 'expired' : 'valid'}
            />
          </div>

          {/* QR Code Section */}
          {!card.isRedeemed && !isExpired && qrCode && (
            <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 p-6 mb-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 text-[#d4af37] mb-2">
                  <QrCode className="w-5 h-5" />
                  <span className="font-semibold">Scan to Redeem</span>
                </div>
                <p className="text-sm text-neutral-500">Show this QR code at any Essence Yogurt cashier</p>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white rounded-2xl shadow-inner border-2 border-neutral-100">
                  <img src={qrCode} alt="Gift Card QR Code" className="w-48 h-48" data-testid="gift-qr-code" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-neutral-400 mb-2">Or use code:</p>
                <p className="font-mono text-lg font-bold text-neutral-900 bg-neutral-100 px-4 py-2 rounded-xl inline-block" data-testid="gift-code">
                  {card.code}
                </p>
              </div>
            </div>
          )}

          {/* Personal Message */}
          {card.message && (
            <div className="bg-gradient-to-br from-[#d4af37]/5 to-[#a07c10]/5 rounded-2xl p-6 border border-[#d4af37]/20 mb-6">
              <p className="text-sm text-neutral-600 italic text-center">"{card.message}"</p>
              {card.senderName && (
                <p className="text-right text-sm font-medium text-[#d4af37] mt-3">— {card.senderName}</p>
              )}
            </div>
          )}

          {/* Mobile Instructions */}
          <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">How to Redeem</h3>
                <p className="text-sm text-neutral-500">Quick & easy at any location</p>
              </div>
            </div>
            <ol className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d4af37] text-white text-xs font-bold flex items-center justify-center">1</span>
                <span>Visit any Essence Yogurt location</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d4af37] text-white text-xs font-bold flex items-center justify-center">2</span>
                <span>Show your QR code or tell the cashier your code</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d4af37] text-white text-xs font-bold flex items-center justify-center">3</span>
                <span>Enjoy your luxury frozen yogurt experience!</span>
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
