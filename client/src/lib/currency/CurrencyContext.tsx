import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CurrencyCode = 
  | "USD" | "EUR" | "GBP" | "SAR" | "AED" | "ILS" 
  | "AUD" | "CAD" | "JPY" | "CNY" | "CHF" | "HKD"
  | "SGD" | "INR" | "THB" | "KRW" | "RUB" | "BRL"
  | "MXN" | "ZAR" | "NZD" | "SEK" | "NOK" | "DKK";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rate: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", rate: 1.00 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", rate: 0.79 },
  SAR: { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦", rate: 3.75 },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪", rate: 3.67 },
  ILS: { code: "ILS", symbol: "₪", name: "Israeli Shekel", flag: "🇮🇱", rate: 3.70 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺", rate: 1.53 },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦", rate: 1.36 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵", rate: 149.50 },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳", rate: 7.24 },
  CHF: { code: "CHF", symbol: "Fr", name: "Swiss Franc", flag: "🇨🇭", rate: 0.88 },
  HKD: { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", flag: "🇭🇰", rate: 7.82 },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬", rate: 1.34 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳", rate: 83.12 },
  THB: { code: "THB", symbol: "฿", name: "Thai Baht", flag: "🇹🇭", rate: 35.50 },
  KRW: { code: "KRW", symbol: "₩", name: "Korean Won", flag: "🇰🇷", rate: 1320.00 },
  RUB: { code: "RUB", symbol: "₽", name: "Russian Ruble", flag: "🇷🇺", rate: 92.50 },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", flag: "🇧🇷", rate: 4.97 },
  MXN: { code: "MXN", symbol: "$", name: "Mexican Peso", flag: "🇲🇽", rate: 17.15 },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦", rate: 18.75 },
  NZD: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", flag: "🇳🇿", rate: 1.65 },
  SEK: { code: "SEK", symbol: "kr", name: "Swedish Krona", flag: "🇸🇪", rate: 10.45 },
  NOK: { code: "NOK", symbol: "kr", name: "Norwegian Krone", flag: "🇳🇴", rate: 10.85 },
  DKK: { code: "DKK", symbol: "kr", name: "Danish Krone", flag: "🇩🇰", rate: 6.88 },
};

const TOP_CURRENCIES: CurrencyCode[] = [
  "USD", "EUR", "GBP", "AED", "SAR", "AUD", 
  "CAD", "JPY", "CHF", "CNY", "ILS", "SGD"
];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  currencyInfo: CurrencyInfo;
  formatPrice: (amountUSD: number) => string;
  convertPrice: (amountUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("essence_currency") as CurrencyCode | null;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem("essence_currency", curr);
  };

  const currencyInfo = CURRENCIES[currency];

  const convertPrice = (amountUSD: number): number => {
    return amountUSD * currencyInfo.rate;
  };

  const formatPrice = (amountUSD: number): string => {
    const converted = convertPrice(amountUSD);
    
    if (currency === "JPY" || currency === "KRW") {
      return `${currencyInfo.symbol}${Math.round(converted).toLocaleString()}`;
    }
    
    return `${currencyInfo.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyInfo, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const topCurrencies = TOP_CURRENCIES.map(code => CURRENCIES[code]);
  const otherCurrencies = Object.values(CURRENCIES).filter(c => !TOP_CURRENCIES.includes(c.code));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="group flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest bg-gradient-to-r from-[#fdfcf9] to-[#f9f7f2] border border-[#e8e4dc] rounded-full hover:border-[#D6A743] hover:shadow-[0_0_12px_rgba(214,167,67,0.15)] transition-all duration-300"
        data-testid="currency-selector"
      >
        <span className="text-lg drop-shadow-sm">{CURRENCIES[currency].flag}</span>
        <span className="bg-gradient-to-r from-[#B08D57] to-[#D6A743] bg-clip-text text-transparent font-bold">{currency}</span>
        <span className="text-[#D6A743] font-bold">{CURRENCIES[currency].symbol}</span>
        <svg className={`w-3 h-3 text-[#B08D57] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-72 bg-gradient-to-b from-white to-[#fdfcf9] rounded-2xl shadow-2xl border border-[#e8e4dc] overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-gradient-to-r from-[#B08D57] via-[#D6A743] to-[#B08D57] h-1" />
          <div className="px-4 py-3 border-b border-[#f0ece4] bg-[#fdfcf9]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-[#B08D57] to-[#D6A743] bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-sm">✦</span> Popular Currencies
            </p>
          </div>
          <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e8e4dc] scrollbar-track-transparent">
            {topCurrencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                  currency === curr.code 
                    ? 'bg-gradient-to-r from-[#faf7f0] to-[#f5efe5] border-l-2 border-[#D6A743]' 
                    : 'hover:bg-[#faf7f0] border-l-2 border-transparent hover:border-[#e8e4dc]'
                }`}
                data-testid={`currency-option-${curr.code}`}
              >
                <span className="text-xl drop-shadow-sm">{curr.flag}</span>
                <span className={`flex-1 ${currency === curr.code ? 'text-[#8B7355] font-semibold' : 'text-neutral-700'}`}>
                  {curr.name}
                </span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                  currency === curr.code 
                    ? 'bg-gradient-to-r from-[#B08D57] to-[#D6A743] text-white' 
                    : 'bg-[#f5efe5] text-[#B08D57]'
                }`}>
                  {curr.symbol}
                </span>
              </button>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-b border-[#f0ece4] bg-[#fdfcf9]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-[#B08D57] to-[#D6A743] bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-sm">◇</span> All Currencies
            </p>
          </div>
          <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e8e4dc] scrollbar-track-transparent">
            {otherCurrencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => { setCurrency(curr.code); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                  currency === curr.code 
                    ? 'bg-gradient-to-r from-[#faf7f0] to-[#f5efe5] border-l-2 border-[#D6A743]' 
                    : 'hover:bg-[#faf7f0] border-l-2 border-transparent hover:border-[#e8e4dc]'
                }`}
                data-testid={`currency-option-${curr.code}`}
              >
                <span className="text-lg drop-shadow-sm">{curr.flag}</span>
                <span className={`flex-1 ${currency === curr.code ? 'text-[#8B7355] font-semibold' : 'text-neutral-600'}`}>
                  {curr.name}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  currency === curr.code 
                    ? 'bg-gradient-to-r from-[#B08D57] to-[#D6A743] text-white' 
                    : 'bg-[#f5efe5] text-[#B08D57]'
                }`}>
                  {curr.symbol}
                </span>
              </button>
            ))}
          </div>
          <div className="p-3 bg-[#fdfcf9] border-t border-[#f0ece4] text-center">
            <p className="text-[9px] text-[#B08D57] font-medium tracking-wide">
              ✦ Prices update in real-time ✦
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrencyContext;
