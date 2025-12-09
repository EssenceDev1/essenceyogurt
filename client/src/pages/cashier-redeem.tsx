import { useState, useRef, useEffect } from "react";
import { QrCode, Search, CheckCircle, XCircle, AlertCircle, Gift, DollarSign, User, Clock } from "lucide-react";
import { toast } from "sonner";

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
  status?: "valid" | "redeemed" | "expired";
}

export default function CashierRedeemPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<GiftCard | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function lookupCard() {
    if (!code.trim()) {
      toast.error("Please enter a gift card code");
      return;
    }

    setLoading(true);
    setCard(null);
    setLookupError(null);
    setRedeemSuccess(false);

    try {
      const res = await fetch(`/api/egift/lookup/${code.trim().toUpperCase()}`);
      const data = await res.json();
      
      if (data.success) {
        setCard(data.card);
        toast.success("Gift card found!");
      } else {
        setLookupError(data.error || "Card not found");
        if (data.card) {
          setCard(data.card);
        }
      }
    } catch {
      setLookupError("Failed to lookup card");
    } finally {
      setLoading(false);
    }
  }

  async function redeemCard() {
    if (!card || card.status !== "valid") return;

    setLoading(true);
    try {
      const res = await fetch("/api/egift/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: card.code }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setRedeemSuccess(true);
        setCard({ ...data.card, status: "redeemed" });
        toast.success("Gift card redeemed successfully!");
      } else {
        toast.error(data.error || "Failed to redeem card");
      }
    } catch {
      toast.error("Failed to redeem card");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setCode("");
    setCard(null);
    setLookupError(null);
    setRedeemSuccess(false);
    inputRef.current?.focus();
  }

  const amount = card ? parseFloat(card.amount) : 0;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-neutral-800 to-neutral-900 border-b border-[#d4af37]/30 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a07c10] flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <div>
              <h1 className="font-semibold">Essence Yogurt</h1>
              <p className="text-xs text-neutral-400">Cashier Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/20 rounded-full">
            <Gift className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm font-medium text-[#d4af37]">E-Gift Redemption</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Code Input Section */}
        <div className="bg-neutral-800 rounded-2xl p-6 mb-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Scan or Enter Code</h2>
              <p className="text-sm text-neutral-400">Customer shows QR code on phone or tells you the code</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && lookupCard()}
                placeholder="EY-XXXX-XXXX"
                className="w-full h-14 px-4 bg-neutral-900 border-2 border-neutral-600 rounded-xl text-lg font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                data-testid="code-input"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            </div>
            <button
              onClick={lookupCard}
              disabled={loading || !code.trim()}
              className="px-6 h-14 bg-gradient-to-r from-[#d4af37] to-[#a07c10] rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              data-testid="lookup-btn"
            >
              {loading ? "Searching..." : "Look Up"}
            </button>
          </div>
        </div>

        {/* Error State */}
        {lookupError && !card && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-400">Card Not Found</h3>
              <p className="text-neutral-300">{lookupError}</p>
            </div>
          </div>
        )}

        {/* Card Display */}
        {card && (
          <div className={`rounded-2xl p-6 mb-6 border ${
            card.status === "valid" 
              ? "bg-green-900/20 border-green-500/50" 
              : card.status === "redeemed"
              ? "bg-neutral-800 border-neutral-600"
              : "bg-amber-900/20 border-amber-500/50"
          }`}>
            {/* Status Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {card.status === "valid" ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400">Valid Gift Card</h3>
                      <p className="text-sm text-neutral-400">Ready to redeem</p>
                    </div>
                  </>
                ) : card.status === "redeemed" ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-neutral-600/50 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-300">Card Redeemed</h3>
                      <p className="text-sm text-neutral-500">
                        {redeemSuccess ? "Just now" : card.redeemedAt ? new Date(card.redeemedAt).toLocaleDateString() : "Previously used"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-400">Card Expired</h3>
                      <p className="text-sm text-neutral-400">Cannot be redeemed</p>
                    </div>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Code</p>
                <p className="font-mono text-lg" data-testid="card-code">{card.code}</p>
              </div>
            </div>

            {/* Card Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-neutral-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Amount</span>
                </div>
                <p className="text-2xl font-bold text-[#d4af37]" data-testid="card-amount">${amount.toFixed(2)}</p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-neutral-400 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Recipient</span>
                </div>
                <p className="font-medium truncate" data-testid="card-recipient">{card.recipientName}</p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-neutral-400 mb-1">
                  <Gift className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">From</span>
                </div>
                <p className="font-medium truncate">{card.senderName || "Anonymous"}</p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-neutral-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Created</span>
                </div>
                <p className="font-medium">{new Date(card.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {card.status === "valid" && (
                <button
                  onClick={redeemCard}
                  disabled={loading}
                  className="flex-1 h-14 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  data-testid="redeem-btn"
                >
                  <CheckCircle className="w-5 h-5" />
                  {loading ? "Processing..." : `Redeem $${amount.toFixed(2)}`}
                </button>
              )}
              <button
                onClick={resetForm}
                className={`${card.status === "valid" ? "w-32" : "flex-1"} h-14 bg-neutral-700 rounded-xl font-semibold hover:bg-neutral-600 transition-all`}
                data-testid="reset-btn"
              >
                {redeemSuccess ? "Next Customer" : "Clear"}
              </button>
            </div>

            {/* Success Message */}
            {redeemSuccess && (
              <div className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="font-semibold text-green-400">Gift Card Successfully Redeemed!</p>
                <p className="text-sm text-neutral-300 mt-1">Apply ${amount.toFixed(2)} credit to this transaction</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Tips */}
        <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#d4af37]" />
            Quick Redemption Tips
          </h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-[#d4af37]">•</span>
              <span>Customer shows QR code on phone - you can scan or manually enter the code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#d4af37]">•</span>
              <span>Codes start with "EY-" followed by random letters/numbers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#d4af37]">•</span>
              <span>After redeeming, apply the credit to the customer's purchase total</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#d4af37]">•</span>
              <span>If card balance exceeds purchase, remainder is lost (no change given)</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
