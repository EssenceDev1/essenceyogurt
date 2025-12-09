"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import logoColorful from "@/assets/brand/logo-colorful-gold.jpeg";

interface LoyaltyFormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

const titles = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];

const countries = [
  "United Arab Emirates",
  "Saudi Arabia",
  "United States",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Japan",
  "South Korea",
  "Israel",
  "Greece",
  "Netherlands",
  "Spain",
  "China",
  "Thailand",
  "Other",
];

export default function LoyaltySignupPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState<LoyaltyFormData>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    country: "",
    acceptTerms: true,
    acceptMarketing: true,
  });

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("essence_loyalty_popup_seen");
    const isLoggedIn = localStorage.getItem("essence_user_token");
    
    if (!hasSeenPopup && !isLoggedIn) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const registerMutation = useMutation({
    mutationFn: async (data: LoyaltyFormData) => {
      const now = new Date().toISOString();
      const response = await fetch("/api/loyalty-registration/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
          dateOfBirth: data.dateOfBirth || null,
          country: data.country,
          title: data.title || null,
          termsAcceptedAt: now,
          privacyPolicyAcceptedAt: now,
          gdprConsentAt: data.acceptMarketing ? now : null,
          marketingEmailEnabled: data.acceptMarketing,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || "Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setStep("success");
      toast.success("Welcome to Essence Circle!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("essence_loyalty_popup_seen", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    registerMutation.mutate(formData);
  };

  const updateField = (field: keyof LoyaltyFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 md:p-6"
          style={{ zIndex: 9500 }}
          data-testid="loyalty-popup-overlay"
        >
          {/* Backdrop - Soft cream tint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#f8f6f3]/95 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal - Luxury White & Gold Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-[95vw] sm:max-w-md md:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden bg-white rounded-2xl"
            style={{ 
              boxShadow: "0 8px 60px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(135deg, #D6A743 0%, #F7E3A3 50%, #B8862D 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
            data-testid="loyalty-popup-modal"
          >
            {/* Close Button - Prominent Luxury Style */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#D6A743] text-neutral-500 hover:text-white transition-all group shadow-sm"
              data-testid="popup-close-btn"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">Close</span>
            </button>

            {step === "form" ? (
              <div className="overflow-y-auto overscroll-contain max-h-[90vh] sm:max-h-[85vh]">
                <div className="p-6 sm:p-8 md:p-10">
                  {/* Logo - Dominant Luxury Display */}
                  <div className="flex items-center justify-center mb-4">
                    <div 
                      className="relative p-2 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(180, 139, 59, 0.08) 100%)',
                      }}
                    >
                      <img
                        src={logoColorful}
                        alt="Essence Yogurt"
                        className="h-28 sm:h-36 w-auto rounded-xl object-cover shadow-xl"
                        style={{
                          boxShadow: '0 12px 40px rgba(180, 139, 59, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Header - Elegant Typography */}
                  <div className="text-center mb-8">
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400 mb-2">
                      Exclusive Membership
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-light text-neutral-800 mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      Join Essence Circle
                    </h2>
                    <p className="text-sm text-neutral-400">
                      Premium rewards await
                    </p>
                  </div>

                  {/* Form - Clean Gucci Style */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title Select */}
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-2">
                        Title
                      </label>
                      <div className="relative">
                        <select
                          value={formData.title}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="w-full h-12 px-4 pr-10 bg-white border border-neutral-200 rounded-none text-sm text-neutral-700 appearance-none focus:outline-none focus:border-neutral-400 transition-colors"
                          data-testid="input-title"
                        >
                          <option value="">Select</option>
                          {titles.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                      </div>
                    </div>

                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          required
                          placeholder="John"
                          className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-none text-sm text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          required
                          placeholder="Smith"
                          className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-none text-sm text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                        placeholder="john@example.com"
                        className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-none text-sm text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
                        data-testid="input-email"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-none text-sm text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
                        data-testid="input-phone"
                      />
                    </div>

                    {/* DOB and Country Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateField("dateOfBirth", e.target.value)}
                          className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-none text-sm text-neutral-700 focus:outline-none focus:border-neutral-400 transition-colors"
                          data-testid="input-dob"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-2">
                          Country
                        </label>
                        <div className="relative">
                          <select
                            value={formData.country}
                            onChange={(e) => updateField("country", e.target.value)}
                            required
                            className="w-full h-12 px-4 pr-10 bg-white border border-neutral-200 rounded-none text-sm text-neutral-700 appearance-none focus:outline-none focus:border-neutral-400 transition-colors"
                            data-testid="input-country"
                          >
                            <option value="">Select</option>
                            {countries.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Checkboxes - Minimal Style */}
                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={formData.acceptTerms}
                            onChange={(e) => updateField("acceptTerms", e.target.checked)}
                            className="sr-only"
                            data-testid="checkbox-terms"
                          />
                          <div className={`w-5 h-5 border ${formData.acceptTerms ? 'bg-neutral-800 border-neutral-800' : 'bg-white border-neutral-300'} flex items-center justify-center transition-colors`}>
                            {formData.acceptTerms && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <span className="text-xs text-neutral-500 leading-relaxed">
                          I agree to the{" "}
                          <a href="/terms" className="text-neutral-700 underline underline-offset-2">Terms of Service</a>
                          {" "}and{" "}
                          <a href="/privacy" className="text-neutral-700 underline underline-offset-2">Privacy Policy</a>
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={formData.acceptMarketing}
                            onChange={(e) => updateField("acceptMarketing", e.target.checked)}
                            className="sr-only"
                            data-testid="checkbox-marketing"
                          />
                          <div className={`w-5 h-5 border ${formData.acceptMarketing ? 'bg-neutral-800 border-neutral-800' : 'bg-white border-neutral-300'} flex items-center justify-center transition-colors`}>
                            {formData.acceptMarketing && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <span className="text-xs text-neutral-500 leading-relaxed">
                          Receive exclusive offers, new flavors, and special invitations
                        </span>
                      </label>
                    </div>

                    {/* Submit Button - Elegant Black */}
                    <motion.button
                      type="submit"
                      disabled={registerMutation.isPending}
                      whileHover={{ opacity: 0.9 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full h-12 mt-4 bg-neutral-900 text-white text-xs font-medium uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="btn-join-loyalty"
                    >
                      {registerMutation.isPending ? "Joining..." : "Join Now"}
                    </motion.button>

                    {/* Sign In Link */}
                    <p className="text-center text-xs text-neutral-400 pt-2">
                      Already a member?{" "}
                      <a href="/admin-login" className="text-neutral-600 underline underline-offset-2">
                        Sign in
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 sm:p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-900 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>

                <div className="flex justify-center mb-6">
                  <div 
                    className="p-2 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(180, 139, 59, 0.08) 100%)',
                    }}
                  >
                    <img
                      src={logoColorful}
                      alt="Essence Yogurt"
                      className="h-24 w-auto rounded-lg object-cover shadow-lg"
                      style={{
                        boxShadow: '0 8px 30px rgba(180, 139, 59, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-light text-neutral-800 mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Welcome
                </h2>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto mb-8">
                  Thank you for joining Essence Circle. Check your email for confirmation.
                </p>

                <div className="space-y-3 max-w-xs mx-auto">
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ opacity: 0.9 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full h-12 bg-neutral-900 text-white text-xs font-medium uppercase tracking-[0.2em]"
                    data-testid="btn-start-exploring"
                  >
                    Start Exploring
                  </motion.button>
                  <a
                    href="/loyalty"
                    className="block w-full h-12 leading-[48px] text-center text-xs font-medium uppercase tracking-[0.15em] text-neutral-500 border border-neutral-200 hover:border-neutral-400 transition-colors"
                  >
                    View Benefits
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
