import { useState, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr", flag: "🇬🇧" },
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", flag: "🇸🇦" },
  { code: "he", name: "Hebrew", nativeName: "עברית", direction: "rtl", flag: "🇮🇱" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", direction: "ltr", flag: "🇬🇷" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr", flag: "🇩🇪" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr", flag: "🇪🇸" },
  { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr", flag: "🇨🇳" },
  { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr", flag: "🇷🇺" },
];

interface LanguagePickerProps {
  variant?: "default" | "minimal" | "gold";
  showLabel?: boolean;
  className?: string;
}

export function LanguagePicker({ 
  variant = "default", 
  showLabel = true,
  className = ""
}: LanguagePickerProps) {
  const [currentLang, setCurrentLang] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("essence-lang");
    if (savedLang) {
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === savedLang);
      if (lang) setCurrentLang(lang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === browserLang);
      if (lang) setCurrentLang(lang);
    }
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem("essence-lang", lang.code);
    document.documentElement.dir = lang.direction;
    document.documentElement.lang = lang.code;
    setIsOpen(false);
  };

  const buttonStyles = {
    default: "border border-neutral-200 hover:border-neutral-300 bg-white text-black",
    minimal: "border-none bg-transparent text-current hover:bg-black/5",
    gold: "border border-[#d4af37]/30 bg-gradient-to-r from-[#f6e7c8]/20 to-[#d4af37]/10 hover:from-[#f6e7c8]/30 hover:to-[#d4af37]/20 text-[#8b7355]"
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 px-3 py-2 rounded-full ${buttonStyles[variant]} ${className}`}
          data-testid="language-picker-trigger"
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentLang.flag}</span>
          {showLabel && (
            <span className="text-xs font-medium hidden sm:inline">
              {currentLang.code.toUpperCase()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-neutral-200 shadow-xl rounded-xl p-1"
        data-testid="language-picker-menu"
      >
        <div className="px-3 py-2 border-b border-neutral-100 mb-1">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Select Language
          </p>
        </div>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelectLanguage(lang)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${
              currentLang.code === lang.code 
                ? "bg-gradient-to-r from-[#f6e7c8]/50 to-[#d4af37]/20 text-[#8b7355]" 
                : "hover:bg-neutral-50"
            }`}
            data-testid={`language-option-${lang.code}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lang.name}</span>
                <span className="text-xs text-neutral-500">{lang.nativeName}</span>
              </div>
            </div>
            {currentLang.code === lang.code && (
              <Check className="h-4 w-4 text-[#d4af37]" />
            )}
          </DropdownMenuItem>
        ))}
        <div className="px-3 py-2 border-t border-neutral-100 mt-1">
          <p className="text-[10px] text-neutral-400 text-center">
            Powered by Gemini AI Translation
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FloatingLanguagePicker() {
  return (
    <div 
      className="fixed bottom-24 left-4 z-50"
      data-testid="floating-language-picker"
    >
      <LanguagePicker variant="gold" showLabel={false} />
    </div>
  );
}

export default LanguagePicker;
