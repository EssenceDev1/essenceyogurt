import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Fingerprint, 
  QrCode, 
  X, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight
} from "lucide-react";
import essenceLogo from "@assets/IMG_1164_1764829626171.jpeg";

const API_BASE = "";

type Mode = "select" | "magic" | "phone" | "google" | "passkey" | "qr";

type Step =
  | "idle"
  | "magic-sent"
  | "magic-verifying"
  | "magic-done"
  | "phone-code-sent"
  | "phone-verifying"
  | "phone-done"
  | "qr-waiting"
  | "qr-logged-in"
  | "passkey-registering"
  | "passkey-done";

type AuthResponse = {
  token: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    tier: string;
    points: number;
  };
  riskScore?: number;
};

async function postJson<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

async function logUxEvent(event: any) {
  try {
    await fetch(`${API_BASE}/auth/ux/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        device: {
          agent: navigator.userAgent,
          platform: navigator.platform,
        },
      }),
    });
  } catch {
    // Ignore
  }
}

interface AuthExperience2025Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: (resp: AuthResponse) => void;
}

export const AuthExperience2025: React.FC<AuthExperience2025Props> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<Mode>("select");
  const [step, setStep] = useState<Step>("idle");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [phoneSessionId, setPhoneSessionId] = useState("");
  const [qrId, setQrId] = useState("");
  const [qrPolling, setQrPolling] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setMode("select");
    setStep("idle");
    setEmail("");
    setPhone("");
    setSmsCode("");
    setPhoneSessionId("");
    setQrId("");
    setQrPolling(false);
    setError(null);
    setInfo(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  const setModeWithReset = (m: Mode) => {
    setMode(m);
    setStep("idle");
    setError(null);
    setInfo(null);
    setSmsCode("");
  };

  // Magic Link - Start
  const handleMagicStart = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!email.trim()) throw new Error("Please enter your email");

      await postJson<{ ok: boolean }>("/auth/magic/start", { 
        email: email.trim(),
        device: { agent: navigator.userAgent }
      });
      
      setStep("magic-sent");
      setInfo("We sent you a secure login link. Check your email.");
      logUxEvent({ path: "/auth/magic/start", status: 200 });
    } catch (err: any) {
      setError(err?.message || "Could not send magic link");
    } finally {
      setLoading(false);
    }
  };

  // Phone/SMS - Start
  const handlePhoneStart = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!phone.trim()) throw new Error("Enter your phone number");

      const resp = await postJson<{ sessionId: string }>("/auth/phone/start", { 
        phone: phone.trim(),
        device: { agent: navigator.userAgent }
      });

      setPhoneSessionId(resp.sessionId);
      setStep("phone-code-sent");
      setInfo("We sent you a 6-digit SMS code.");
      logUxEvent({ path: "/auth/phone/start", status: 200 });
    } catch (err: any) {
      setError(err?.message || "Could not send SMS code");
    } finally {
      setLoading(false);
    }
  };

  // Phone/SMS - Verify
  const handlePhoneVerify = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!smsCode.trim()) throw new Error("Enter the verification code");

      const resp = await postJson<AuthResponse>("/auth/phone/verify", {
        sessionId: phoneSessionId,
        code: smsCode.trim(),
        device: { agent: navigator.userAgent }
      });

      setStep("phone-done");
      setInfo("You are signed in!");
      logUxEvent({ path: "/auth/phone/verify", status: 200 });
      onAuthenticated?.(resp);
      setTimeout(onClose, 1000);
    } catch (err: any) {
      setError(err?.message || "Could not verify SMS code");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/social/google/start`;
  };

  // Passkey - Register
  const handlePasskeyRegister = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!email.trim()) throw new Error("Enter your email first");

      setStep("passkey-registering");

      const options = await postJson<any>("/auth/passkey/register-options", {
        email: email.trim(),
        device: { agent: navigator.userAgent }
      });

      const publicKey = {
        challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
        rp: { name: options.rpName, id: options.rpId },
        user: {
          id: Uint8Array.from(options.user.id, (c: string) => c.charCodeAt(0)),
          name: options.user.name,
          displayName: options.user.displayName
        },
        pubKeyCredParams: options.pubKeyCredParams,
        timeout: options.timeout,
        authenticatorSelection: options.authenticatorSelection
      };

      const cred = await navigator.credentials.create({ publicKey });
      if (!cred) throw new Error("Passkey creation cancelled");

      const resp = await postJson<AuthResponse>("/auth/passkey/register-verify", {
        email: email.trim(),
        credential: cred,
        challengeId: options.challengeId,
        device: { agent: navigator.userAgent }
      });

      setStep("passkey-done");
      setInfo("Passkey created and you are signed in!");
      logUxEvent({ path: "/auth/passkey/register-verify", status: 200 });
      onAuthenticated?.(resp);
      setTimeout(onClose, 1000);
    } catch (err: any) {
      setError(err?.message || "Could not register passkey");
      setStep("idle");
    } finally {
      setLoading(false);
    }
  };

  // Passkey - Login
  const handlePasskeyLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const options = await postJson<any>("/auth/passkey/login-options", {
        device: { agent: navigator.userAgent }
      });

      const publicKey = {
        challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
        rpId: options.rpId,
        timeout: options.timeout,
        userVerification: options.userVerification
      };

      const assertion = await navigator.credentials.get({ publicKey });
      if (!assertion) throw new Error("Passkey login cancelled");

      const resp = await postJson<AuthResponse>("/auth/passkey/login-verify", {
        assertion,
        challengeId: options.challengeId,
        device: { agent: navigator.userAgent }
      });

      setStep("passkey-done");
      setInfo("You are signed in with passkey!");
      logUxEvent({ path: "/auth/passkey/login-verify", status: 200 });
      onAuthenticated?.(resp);
      setTimeout(onClose, 1000);
    } catch (err: any) {
      setError(err?.message || "Could not sign in with passkey");
    } finally {
      setLoading(false);
    }
  };

  // QR Code - Start
  const handleQrStart = async () => {
    try {
      setLoading(true);
      setError(null);

      const resp = await postJson<{ id: string }>("/auth/qr/start", {
        device: { agent: navigator.userAgent }
      });

      setQrId(resp.id);
      setStep("qr-waiting");
      setInfo("Scan this QR code from your Essence mobile app.");
      setQrPolling(true);
      logUxEvent({ path: "/auth/qr/start", status: 200 });
    } catch (err: any) {
      setError(err?.message || "Could not start QR session");
    } finally {
      setLoading(false);
    }
  };

  // QR Code Polling
  useEffect(() => {
    if (!qrPolling || !qrId) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`${API_BASE}/auth/qr/status?id=${encodeURIComponent(qrId)}`, {
          credentials: "include"
        });
        
        if (!res.ok) throw new Error("QR status error");
        
        const data = await res.json();
        if (cancelled) return;

        if (data.status === "approved" && data.token) {
          setStep("qr-logged-in");
          setInfo("You are signed in!");
          setQrPolling(false);
          onAuthenticated?.({
            token: data.token,
            user: { id: data.userId || "user", tier: "Gold", points: 0 }
          });
          setTimeout(onClose, 1000);
          return;
        }

        setTimeout(poll, 2000);
      } catch {
        if (!cancelled) setTimeout(poll, 3000);
      }
    }

    poll();
    return () => { cancelled = true; };
  }, [qrPolling, qrId, onAuthenticated, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.25)] overflow-hidden"
      >
        {/* Gold accent */}
        <div className="h-2 bg-gradient-to-r from-[#B8862D] via-[#F7E3A3] to-[#B8862D]" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors z-10"
          data-testid="btn-close-auth"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* Mode Selection */}
            {mode === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-lg border-2 border-[#D6A743]/30">
                    <img src={essenceLogo} alt="Essence Yogurt" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Sign in to Essence</h1>
                  <p className="mt-1 text-sm text-neutral-500">Luxury soft serve. One membership, all locations.</p>
                </div>

                {/* Auth Options */}
                <div className="space-y-3">
                  {/* Google */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 px-4 bg-white border border-neutral-200 rounded-xl hover:border-[#D6A743]/50 hover:shadow-md transition-all flex items-center gap-4 group"
                    data-testid="btn-auth-google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-neutral-700">Continue with Google</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-[#D6A743] transition-colors" />
                  </button>

                  {/* Magic Link */}
                  <button
                    onClick={() => setModeWithReset("magic")}
                    className="w-full py-3.5 px-4 bg-white border border-neutral-200 rounded-xl hover:border-[#D6A743]/50 hover:shadow-md transition-all flex items-center gap-4 group"
                    data-testid="btn-auth-magic"
                  >
                    <Mail className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700">Sign in with Email Link</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-[#D6A743] transition-colors" />
                  </button>

                  {/* Phone/SMS */}
                  <button
                    onClick={() => setModeWithReset("phone")}
                    className="w-full py-3.5 px-4 bg-white border border-neutral-200 rounded-xl hover:border-[#D6A743]/50 hover:shadow-md transition-all flex items-center gap-4 group"
                    data-testid="btn-auth-phone"
                  >
                    <Phone className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700">Sign in with SMS Code</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-[#D6A743] transition-colors" />
                  </button>

                  {/* Passkey */}
                  <button
                    onClick={() => setModeWithReset("passkey")}
                    className="w-full py-3.5 px-4 bg-white border border-neutral-200 rounded-xl hover:border-[#D6A743]/50 hover:shadow-md transition-all flex items-center gap-4 group"
                    data-testid="btn-auth-passkey"
                  >
                    <Fingerprint className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700">Sign in with Passkey</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-[#D6A743] transition-colors" />
                  </button>

                  {/* QR Code */}
                  <button
                    onClick={() => { setModeWithReset("qr"); handleQrStart(); }}
                    className="w-full py-3.5 px-4 bg-white border border-neutral-200 rounded-xl hover:border-[#D6A743]/50 hover:shadow-md transition-all flex items-center gap-4 group"
                    data-testid="btn-auth-qr"
                  >
                    <QrCode className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700">Sign in with QR Code</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-neutral-400 group-hover:text-[#D6A743] transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Magic Link Form */}
            {mode === "magic" && (
              <motion.div
                key="magic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setModeWithReset("select")}
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
                  data-testid="btn-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Magic Link</h2>
                  <p className="text-sm text-neutral-500 mt-1">We'll email you a secure sign-in link</p>
                </div>

                {step === "idle" && (
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20"
                      data-testid="input-email"
                    />
                    <button
                      onClick={handleMagicStart}
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-[#D6A743] to-[#B8862D] text-black font-semibold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      data-testid="btn-send-magic"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Magic Link"}
                    </button>
                  </div>
                )}

                {step === "magic-sent" && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <p className="text-neutral-600">{info}</p>
                    <p className="text-sm text-neutral-400 mt-2">Check your email and click the link to sign in.</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* Phone/SMS Form */}
            {mode === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setModeWithReset("select")}
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
                  data-testid="btn-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Phone Sign In</h2>
                  <p className="text-sm text-neutral-500 mt-1">We'll text you a verification code</p>
                </div>

                {step === "idle" && (
                  <div className="space-y-4">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20"
                      data-testid="input-phone"
                    />
                    <p className="text-xs text-neutral-400">Include country code (e.g., +1 for US)</p>
                    <button
                      onClick={handlePhoneStart}
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-[#D6A743] to-[#B8862D] text-black font-semibold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      data-testid="btn-send-sms"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Code"}
                    </button>
                  </div>
                )}

                {step === "phone-code-sent" && (
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-600 text-center">{info}</p>
                    <input
                      type="text"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-xl text-center text-2xl tracking-[0.5em] font-medium focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20"
                      data-testid="input-sms-code"
                    />
                    <button
                      onClick={handlePhoneVerify}
                      disabled={loading || smsCode.length !== 6}
                      className="w-full py-3.5 bg-gradient-to-r from-[#D6A743] to-[#B8862D] text-black font-semibold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      data-testid="btn-verify-sms"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
                    </button>
                    <button
                      onClick={() => setStep("idle")}
                      className="w-full text-sm text-neutral-500 hover:text-[#D6A743]"
                    >
                      Change phone number
                    </button>
                  </div>
                )}

                {step === "phone-done" && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <p className="text-neutral-600">{info}</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* Passkey Form */}
            {mode === "passkey" && (
              <motion.div
                key="passkey"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setModeWithReset("select")}
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
                  data-testid="btn-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                    <Fingerprint className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Passkey</h2>
                  <p className="text-sm text-neutral-500 mt-1">Use biometric or security key</p>
                </div>

                {(step === "idle" || step === "passkey-registering") && (
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 px-4 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20"
                      data-testid="input-email"
                    />
                    <button
                      onClick={handlePasskeyLogin}
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-[#D6A743] to-[#B8862D] text-black font-semibold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      data-testid="btn-passkey-login"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in with Passkey"}
                    </button>
                    <button
                      onClick={handlePasskeyRegister}
                      disabled={loading}
                      className="w-full py-3 border border-neutral-200 rounded-xl text-neutral-600 hover:border-[#D6A743]/50 disabled:opacity-50"
                      data-testid="btn-passkey-register"
                    >
                      Create new passkey
                    </button>
                  </div>
                )}

                {step === "passkey-done" && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <p className="text-neutral-600">{info}</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* QR Code */}
            {mode === "qr" && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => { setModeWithReset("select"); setQrPolling(false); }}
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
                  data-testid="btn-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                    <QrCode className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">QR Code Sign In</h2>
                  <p className="text-sm text-neutral-500 mt-1">Scan from your Essence mobile app</p>
                </div>

                {step === "qr-waiting" && (
                  <div className="text-center py-6">
                    <div className="w-48 h-48 mx-auto bg-neutral-100 rounded-2xl flex items-center justify-center mb-4 p-4">
                      {qrId ? (
                        <div className="text-center">
                          <QrCode className="w-24 h-24 text-neutral-700 mx-auto" />
                          <p className="text-xs text-neutral-400 mt-2 break-all">{qrId.slice(0, 16)}...</p>
                        </div>
                      ) : (
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">{info}</p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Waiting for approval...
                    </div>
                  </div>
                )}

                {step === "qr-logged-in" && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <p className="text-neutral-600">{info}</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-[#B8862D] via-[#F7E3A3] to-[#B8862D]" />
      </motion.div>
    </div>
  );
};

export default AuthExperience2025;
