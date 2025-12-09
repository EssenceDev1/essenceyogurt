"use client";

import { useState, useEffect } from "react";
import { X, Cookie, Settings, Shield } from "lucide-react";
import { Link } from "wouter";

const COOKIE_CONSENT_KEY = "essence_cookie_consent";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    });
  };

  const acceptEssential = () => {
    saveConsent(defaultPreferences);
  };

  const savePreferences = () => {
    saveConsent(preferences);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-x-0 bottom-0 z-[9000] animate-in slide-in-from-bottom-full duration-500"
      role="dialog"
      aria-label="Cookie consent"
      data-testid="cookie-consent-banner"
    >
      <div className="mx-auto max-w-7xl px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
          {showSettings ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a07c10] flex items-center justify-center">
                    <Settings size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Cookie Preferences</h2>
                    <p className="text-xs text-neutral-500">Customize your cookie settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Close settings"
                  data-testid="btn-close-cookie-settings"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <CookieOption
                  title="Essential Cookies"
                  description="Required for the website to function properly. Cannot be disabled."
                  checked={preferences.essential}
                  disabled
                  testId="toggle-essential"
                />
                <CookieOption
                  title="Analytics Cookies"
                  description="Help us understand how visitors interact with our website."
                  checked={preferences.analytics}
                  onChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                  testId="toggle-analytics"
                />
                <CookieOption
                  title="Marketing Cookies"
                  description="Used to deliver personalized advertisements."
                  checked={preferences.marketing}
                  onChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                  testId="toggle-marketing"
                />
                <CookieOption
                  title="Personalization Cookies"
                  description="Remember your preferences and enhance your experience."
                  checked={preferences.personalization}
                  onChange={(checked) => setPreferences(p => ({ ...p, personalization: checked }))}
                  testId="toggle-personalization"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={savePreferences}
                  className="flex-1 min-w-[140px] py-2.5 px-5 bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  data-testid="btn-save-preferences"
                >
                  Save Preferences
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 min-w-[140px] py-2.5 px-5 bg-neutral-900 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  data-testid="btn-accept-all-settings"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 relative">
              {/* Close X Button */}
              <button
                onClick={acceptEssential}
                className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#D6A743] text-neutral-400 hover:text-white transition-all"
                aria-label="Close and accept essential cookies"
                data-testid="btn-close-cookie-banner"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 pr-8 sm:pr-0">
                <div className="flex items-start gap-4 flex-1">
                  <div className="hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br from-[#f6e7c8] via-[#d4af37] to-[#a07c10] items-center justify-center flex-shrink-0 shadow-md">
                    <Cookie size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base sm:text-lg font-semibold text-neutral-900">We Value Your Privacy</h2>
                      <Shield size={16} className="text-[#d4af37]" />
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies.{' '}
                      <Link href="/cookies" className="text-[#d4af37] hover:underline font-medium">
                        Learn more
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="py-2.5 px-5 border border-neutral-200 text-neutral-700 rounded-full text-xs sm:text-sm font-semibold hover:bg-neutral-50 transition-all order-3 sm:order-1"
                    data-testid="btn-cookie-settings"
                  >
                    Cookie Settings
                  </button>
                  <button
                    onClick={acceptEssential}
                    className="py-2.5 px-5 bg-neutral-100 text-neutral-700 rounded-full text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-all order-2"
                    data-testid="btn-accept-essential"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={acceptAll}
                    className="py-2.5 px-5 bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white rounded-full text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all order-1 sm:order-3"
                    data-testid="btn-accept-all"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CookieOptionProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  testId: string;
}

function CookieOption({ title, description, checked, disabled, onChange, testId }: CookieOptionProps) {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
        checked ? 'border-[#d4af37]/30 bg-[#faf6ec]' : 'border-neutral-200 bg-neutral-50'
      } ${disabled ? 'opacity-75' : 'cursor-pointer hover:border-[#d4af37]/50'}`}
      onClick={handleToggle}
      role="switch"
      aria-checked={checked}
      aria-label={title}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">{title}</span>
          {disabled && (
            <span className="text-[10px] font-medium text-[#d4af37] uppercase tracking-wide">Required</span>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
      </div>
      <div className="relative pointer-events-none">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
          data-testid={testId}
          tabIndex={-1}
        />
        <div className={`w-11 h-6 rounded-full transition-all ${
          checked 
            ? 'bg-gradient-to-r from-[#d4af37] to-[#a07c10]' 
            : 'bg-neutral-300'
        }`}>
          <div className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transition-transform top-0.5 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`} />
        </div>
      </div>
    </div>
  );
}

export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } catch {
        setPreferences(null);
      }
    }
  }, []);

  return preferences;
}

export function resetCookieConsent() {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.location.reload();
}
