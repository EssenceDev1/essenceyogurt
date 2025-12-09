import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Smartphone, Shield, Check, X, Loader2, Key, Trash2 } from "lucide-react";
import { LuxeButton } from "./ui/luxe-button";
import {
  isPasskeySupported,
  isPlatformAuthenticatorAvailable,
  registerPasskey,
  listUserPasskeys,
  deletePasskey,
  PasskeyCredential,
} from "@/lib/passkeys";
import { cn } from "@/lib/utils";

interface PasskeySetupProps {
  userId: string;
  userName: string;
  displayName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  "data-testid"?: string;
}

export default function PasskeySetup({
  userId,
  userName,
  displayName,
  onSuccess,
  onError,
  "data-testid": testId = "passkey-setup",
}: PasskeySetupProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [hasPlatformAuth, setHasPlatformAuth] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [credentials, setCredentials] = useState<PasskeyCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkSupport() {
      const supported = isPasskeySupported();
      setIsSupported(supported);
      
      if (supported) {
        const platformAvailable = await isPlatformAuthenticatorAvailable();
        setHasPlatformAuth(platformAvailable);
      }
      
      if (userId) {
        const creds = await listUserPasskeys(userId);
        setCredentials(creds);
      }
      
      setIsLoading(false);
    }
    checkSupport();
  }, [userId]);

  const handleRegister = async () => {
    setIsRegistering(true);
    setError(null);
    
    const result = await registerPasskey(userId, userName, displayName);
    
    setIsRegistering(false);
    setShowConsent(false);
    
    if (result.success && result.credential) {
      setSuccess(true);
      setCredentials((prev) => [...prev, result.credential!]);
      onSuccess?.();
    } else {
      setError(result.error || "Registration failed");
      onError?.(result.error || "Registration failed");
    }
  };

  const handleDelete = async (credentialId: string) => {
    const success = await deletePasskey(credentialId);
    if (success) {
      setCredentials((prev) => prev.filter((c) => c.id !== credentialId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8" data-testid={testId}>
        <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div
        className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200"
        data-testid={testId}
      >
        <div className="flex items-center gap-3 text-neutral-500">
          <X className="w-5 h-5" />
          <p className="text-sm">Passkeys are not supported on this device or browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid={testId}>
      <div
        className={cn(
          "p-6 rounded-2xl border-2 transition-all duration-300",
          "bg-gradient-to-br from-white to-neutral-50",
          credentials.length > 0
            ? "border-emerald-200"
            : "border-neutral-200 hover:border-[#d4af37]/50"
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              credentials.length > 0
                ? "bg-gradient-to-br from-emerald-100 to-emerald-50"
                : "bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5"
            )}
          >
            {credentials.length > 0 ? (
              <Check className="w-6 h-6 text-emerald-600" />
            ) : hasPlatformAuth ? (
              <Fingerprint className="w-6 h-6 text-[#d4af37]" />
            ) : (
              <Key className="w-6 h-6 text-[#d4af37]" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900">
              {hasPlatformAuth ? "Face ID / Touch ID" : "Security Key"}
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              {credentials.length > 0
                ? `${credentials.length} passkey${credentials.length > 1 ? "s" : ""} registered`
                : "Sign in faster and more securely with biometrics"}
            </p>
            
            {!showConsent && credentials.length === 0 && (
              <LuxeButton
                variant="gold"
                size="md"
                icon={hasPlatformAuth ? Fingerprint : Key}
                onClick={() => setShowConsent(true)}
                className="mt-4"
                data-testid={`${testId}-setup-btn`}
              >
                Set Up Passkey
              </LuxeButton>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showConsent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-start gap-3 p-4 bg-[#d4af37]/5 rounded-xl mb-4">
                  <Shield className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">Privacy & Security</h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Your biometric data never leaves your device. We only store a secure cryptographic key
                      that verifies your identity. This meets the highest security standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl mb-4">
                  <Smartphone className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">How It Works</h4>
                    <ul className="text-xs text-neutral-600 mt-1 space-y-1">
                      <li>• Use Face ID, Touch ID, or your device PIN to sign in</li>
                      <li>• Works across all your synced devices</li>
                      <li>• More secure than passwords - no phishing risk</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <LuxeButton
                    variant="outline"
                    size="md"
                    onClick={() => setShowConsent(false)}
                    data-testid={`${testId}-cancel-btn`}
                  >
                    Cancel
                  </LuxeButton>
                  <LuxeButton
                    variant="gold"
                    size="md"
                    icon={hasPlatformAuth ? Fingerprint : Key}
                    loading={isRegistering}
                    onClick={handleRegister}
                    data-testid={`${testId}-confirm-btn`}
                  >
                    {isRegistering ? "Registering..." : "Enable Passkey"}
                  </LuxeButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
            >
              <X className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">Passkey registered successfully!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {credentials.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 px-1">
            Registered Passkeys
          </h4>
          {credentials.map((cred) => (
            <div
              key={cred.id}
              className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl"
              data-testid={`${testId}-credential-${cred.id}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                  {cred.deviceType === "platform" ? (
                    <Fingerprint className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <Key className="w-5 h-5 text-neutral-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{cred.name}</p>
                  <p className="text-xs text-neutral-500">
                    Added {new Date(cred.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cred.id)}
                className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                data-testid={`${testId}-delete-${cred.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
