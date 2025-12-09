import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageCode, LANGUAGES, getDirection, detectBrowserLanguage, t } from "./index";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  direction: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("essence_language") as LanguageCode | null;
    if (saved && LANGUAGES[saved]) {
      setLanguageState(saved);
    } else {
      const detected = detectBrowserLanguage();
      setLanguageState(detected);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("essence_language", lang);
    }
    document.documentElement.dir = getDirection(lang);
    document.documentElement.lang = lang;
  };

  const translate = (key: string) => t(language, key);
  const direction = getDirection(language);
  const isRTL = direction === "rtl";

  useEffect(() => {
    if (isClient) {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
    }
  }, [language, direction, isClient]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate, direction, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded-full hover:border-neutral-300 transition-all"
        data-testid="language-selector"
      >
        <span>{LANGUAGES[language].flag}</span>
        <span>{language.toUpperCase()}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 max-h-64 overflow-y-auto">
          {Object.values(LANGUAGES).map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-neutral-50 flex items-center gap-3 ${
                language === lang.code ? 'text-[#d4af37] bg-neutral-50' : 'text-neutral-600'
              }`}
              data-testid={`language-option-${lang.code}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageContext;
