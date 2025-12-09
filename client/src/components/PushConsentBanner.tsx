import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PushConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("essence_push_consent_dismissed");
    const accepted = localStorage.getItem("essence_push_consent_accepted");
    
    if (!dismissed && !accepted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    try {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          localStorage.setItem("essence_push_consent_accepted", "true");
        }
      }
    } catch (error) {
      console.log("Push notifications not supported");
    }
    setHasResponded(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDismiss = () => {
    localStorage.setItem("essence_push_consent_dismissed", "true");
    setHasResponded(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[400px] z-50"
          data-testid="push-consent-banner"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#d4af37] to-[#a07c10] p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Stay in the loop</h3>
                <p className="text-white/80 text-xs">Get notified about offers & openings</p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/60 hover:text-white transition-colors p-1"
                aria-label="Dismiss"
                data-testid="btn-dismiss-push"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-neutral-600 mb-4">
                Enable notifications to receive exclusive Essence Circle offers, 
                birthday rewards, and be first to know about new store openings near you.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  disabled={hasResponded}
                  className="flex-1 rounded-full bg-neutral-900 text-white py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  data-testid="btn-accept-push"
                >
                  Enable Notifications
                </button>
                <button
                  onClick={handleDismiss}
                  disabled={hasResponded}
                  className="rounded-full border border-neutral-300 text-neutral-600 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50"
                  data-testid="btn-later-push"
                >
                  Maybe Later
                </button>
              </div>
              
              <p className="text-[10px] text-neutral-400 mt-3 text-center">
                You can change this anytime in your browser settings
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
