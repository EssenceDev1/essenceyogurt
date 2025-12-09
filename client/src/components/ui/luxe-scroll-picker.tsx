import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollPickerOption {
  value: string;
  label: string;
  icon?: string;
  sublabel?: string;
}

interface LuxeScrollPickerProps {
  options: ScrollPickerOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  showSearch?: boolean;
  height?: number;
  "data-testid"?: string;
}

export function LuxeScrollPicker({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  className,
  showSearch = false,
  height = 280,
  "data-testid": testId,
}: LuxeScrollPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.sublabel?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const scrollToSelected = useCallback(() => {
    if (listRef.current && value) {
      const index = filteredOptions.findIndex((opt) => opt.value === value);
      if (index >= 0) {
        const itemHeight = 56;
        listRef.current.scrollTop = index * itemHeight - height / 2 + itemHeight / 2;
        setHighlightedIndex(index);
      }
    }
  }, [value, filteredOptions, height]);

  useEffect(() => {
    if (isOpen) {
      scrollToSelected();
    }
  }, [isOpen, scrollToSelected]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          setSearch("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearch("");
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)} data-testid={testId}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3.5",
          "bg-white border-2 border-neutral-200 rounded-2xl",
          "text-left transition-all duration-300",
          "hover:border-[#d4af37]/50 hover:shadow-lg",
          "focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10",
          isOpen && "border-[#d4af37] shadow-lg ring-4 ring-[#d4af37]/10"
        )}
        data-testid={`${testId}-trigger`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedOption?.icon && (
            <span className="text-xl flex-shrink-0">{selectedOption.icon}</span>
          )}
          <div className="flex-1 min-w-0">
            <span className={cn(
              "block text-sm font-medium truncate",
              selectedOption ? "text-neutral-900" : "text-neutral-400"
            )}>
              {selectedOption?.label || placeholder}
            </span>
            {selectedOption?.sublabel && (
              <span className="block text-xs text-neutral-500 truncate">
                {selectedOption.sublabel}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
            style={{ maxHeight: height + 60 }}
          >
            {showSearch && (
              <div className="p-3 border-b border-neutral-100">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder="Search..."
                  className="w-full px-4 py-2.5 bg-neutral-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
                  autoFocus
                  data-testid={`${testId}-search`}
                />
              </div>
            )}
            
            <div
              ref={listRef}
              className="overflow-y-auto overscroll-contain scroll-smooth"
              style={{ maxHeight: height }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-neutral-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-150",
                      "hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-transparent",
                      highlightedIndex === index && "bg-gradient-to-r from-[#d4af37]/10 to-transparent",
                      option.value === value && "bg-gradient-to-r from-[#d4af37]/15 to-[#d4af37]/5"
                    )}
                    data-testid={`${testId}-option-${option.value}`}
                  >
                    {option.icon && (
                      <span className="text-xl flex-shrink-0">{option.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "block text-sm font-medium truncate",
                        option.value === value ? "text-[#d4af37]" : "text-neutral-900"
                      )}>
                        {option.label}
                      </span>
                      {option.sublabel && (
                        <span className="block text-xs text-neutral-500 truncate">
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                    {option.value === value && (
                      <Check className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DateScrollPickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  minYear?: number;
  maxYear?: number;
  className?: string;
  "data-testid"?: string;
}

export function LuxeDatePicker({
  value,
  onChange,
  label,
  minYear = 1950,
  maxYear = 2100,
  className,
  "data-testid": testId,
}: DateScrollPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState({
    day: value?.getDate() || new Date().getDate(),
    month: value?.getMonth() || new Date().getMonth(),
    year: value?.getFullYear() || new Date().getFullYear(),
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(tempDate.month, tempDate.year) }, (_, i) => i + 1);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirm = () => {
    const maxDay = getDaysInMonth(tempDate.month, tempDate.year);
    const day = Math.min(tempDate.day, maxDay);
    onChange(new Date(tempDate.year, tempDate.month, day));
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div ref={containerRef} className={cn("relative", className)} data-testid={testId}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3.5",
          "bg-white border-2 border-neutral-200 rounded-2xl",
          "text-left transition-all duration-300",
          "hover:border-[#d4af37]/50 hover:shadow-lg",
          "focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10",
          isOpen && "border-[#d4af37] shadow-lg ring-4 ring-[#d4af37]/10"
        )}
        data-testid={`${testId}-trigger`}
      >
        <span className={cn(
          "text-sm font-medium",
          value ? "text-neutral-900" : "text-neutral-400"
        )}>
          {value ? formatDate(value) : "Select date..."}
        </span>
        <ChevronDown className={cn(
          "w-5 h-5 text-neutral-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-100 bg-gradient-to-r from-[#d4af37]/5 to-transparent">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                Select Date
              </p>
            </div>

            <div className="flex gap-2 p-4">
              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Day
                </label>
                <div className="h-40 overflow-y-auto rounded-xl bg-neutral-50 scroll-smooth">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setTempDate((prev) => ({ ...prev, day }))}
                      className={cn(
                        "w-full py-2.5 text-sm font-medium text-center transition-all",
                        tempDate.day === day
                          ? "bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-white"
                          : "text-neutral-700 hover:bg-[#d4af37]/10"
                      )}
                      data-testid={`${testId}-day-${day}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-[1.5]">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Month
                </label>
                <div className="h-40 overflow-y-auto rounded-xl bg-neutral-50 scroll-smooth">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => setTempDate((prev) => ({ ...prev, month: index }))}
                      className={cn(
                        "w-full py-2.5 text-sm font-medium text-center transition-all",
                        tempDate.month === index
                          ? "bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-white"
                          : "text-neutral-700 hover:bg-[#d4af37]/10"
                      )}
                      data-testid={`${testId}-month-${index}`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Year
                </label>
                <div className="h-40 overflow-y-auto rounded-xl bg-neutral-50 scroll-smooth">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setTempDate((prev) => ({ ...prev, year }))}
                      className={cn(
                        "w-full py-2.5 text-sm font-medium text-center transition-all",
                        tempDate.year === year
                          ? "bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-white"
                          : "text-neutral-700 hover:bg-[#d4af37]/10"
                      )}
                      data-testid={`${testId}-year-${year}`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                data-testid={`${testId}-cancel`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#d4af37] to-[#c5a059] rounded-xl hover:shadow-lg transition-all"
                data-testid={`${testId}-confirm`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const COUNTRIES = [
  { value: "SA", label: "Saudi Arabia", icon: "🇸🇦", sublabel: "Kingdom of Saudi Arabia" },
  { value: "AE", label: "United Arab Emirates", icon: "🇦🇪", sublabel: "UAE" },
  { value: "IL", label: "Israel", icon: "🇮🇱", sublabel: "State of Israel" },
  { value: "GR", label: "Greece", icon: "🇬🇷", sublabel: "Hellenic Republic" },
  { value: "US", label: "United States", icon: "🇺🇸", sublabel: "USA" },
  { value: "GB", label: "United Kingdom", icon: "🇬🇧", sublabel: "UK" },
  { value: "FR", label: "France", icon: "🇫🇷", sublabel: "French Republic" },
  { value: "DE", label: "Germany", icon: "🇩🇪", sublabel: "Federal Republic of Germany" },
  { value: "NL", label: "Netherlands", icon: "🇳🇱", sublabel: "Kingdom of the Netherlands" },
  { value: "JP", label: "Japan", icon: "🇯🇵", sublabel: "日本" },
  { value: "CN", label: "China", icon: "🇨🇳", sublabel: "中华人民共和国" },
  { value: "TH", label: "Thailand", icon: "🇹🇭", sublabel: "ราชอาณาจักรไทย" },
  { value: "AU", label: "Australia", icon: "🇦🇺", sublabel: "Commonwealth of Australia" },
  { value: "SG", label: "Singapore", icon: "🇸🇬", sublabel: "Republic of Singapore" },
  { value: "MY", label: "Malaysia", icon: "🇲🇾", sublabel: "Federation of Malaysia" },
  { value: "IN", label: "India", icon: "🇮🇳", sublabel: "Republic of India" },
  { value: "BR", label: "Brazil", icon: "🇧🇷", sublabel: "Federative Republic of Brazil" },
  { value: "MX", label: "Mexico", icon: "🇲🇽", sublabel: "United Mexican States" },
  { value: "ES", label: "Spain", icon: "🇪🇸", sublabel: "Kingdom of Spain" },
  { value: "IT", label: "Italy", icon: "🇮🇹", sublabel: "Italian Republic" },
  { value: "CA", label: "Canada", icon: "🇨🇦", sublabel: "Dominion of Canada" },
  { value: "KR", label: "South Korea", icon: "🇰🇷", sublabel: "Republic of Korea" },
  { value: "EG", label: "Egypt", icon: "🇪🇬", sublabel: "Arab Republic of Egypt" },
  { value: "TR", label: "Turkey", icon: "🇹🇷", sublabel: "Republic of Türkiye" },
  { value: "QA", label: "Qatar", icon: "🇶🇦", sublabel: "State of Qatar" },
  { value: "KW", label: "Kuwait", icon: "🇰🇼", sublabel: "State of Kuwait" },
  { value: "BH", label: "Bahrain", icon: "🇧🇭", sublabel: "Kingdom of Bahrain" },
  { value: "OM", label: "Oman", icon: "🇴🇲", sublabel: "Sultanate of Oman" },
];

export const LANGUAGES = [
  { value: "en", label: "English", icon: "🇬🇧", sublabel: "English" },
  { value: "ar", label: "Arabic", icon: "🇸🇦", sublabel: "العربية" },
  { value: "he", label: "Hebrew", icon: "🇮🇱", sublabel: "עברית" },
  { value: "fr", label: "French", icon: "🇫🇷", sublabel: "Français" },
  { value: "es", label: "Spanish", icon: "🇪🇸", sublabel: "Español" },
  { value: "de", label: "German", icon: "🇩🇪", sublabel: "Deutsch" },
  { value: "nl", label: "Dutch", icon: "🇳🇱", sublabel: "Nederlands" },
  { value: "ja", label: "Japanese", icon: "🇯🇵", sublabel: "日本語" },
  { value: "zh", label: "Chinese", icon: "🇨🇳", sublabel: "中文" },
  { value: "th", label: "Thai", icon: "🇹🇭", sublabel: "ไทย" },
  { value: "el", label: "Greek", icon: "🇬🇷", sublabel: "Ελληνικά" },
];

export function CountryPicker(props: Omit<LuxeScrollPickerProps, "options">) {
  return <LuxeScrollPicker {...props} options={COUNTRIES} showSearch />;
}

export function LanguagePicker(props: Omit<LuxeScrollPickerProps, "options">) {
  return <LuxeScrollPicker {...props} options={LANGUAGES} showSearch />;
}
