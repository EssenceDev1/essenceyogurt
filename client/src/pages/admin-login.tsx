import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { 
  signInWithGoogle, 
  signUpWithEmail, 
  signInWithEmail, 
  resetPassword,
  initRecaptcha,
  sendSmsCode,
  verifySmsCode,
  logOut 
} from "@/lib/firebase";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Loader2, 
  LogOut, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  Mail, 
  Phone, 
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import essenceLogo from "@assets/IMG_1164_1764829626171.jpeg";

type AuthMode = 'select' | 'email-signup' | 'email-signin' | 'phone' | 'phone-verify' | 'forgot-password';

export default function AdminLogin() {
  const { user, isLoading, isAuthenticated } = useFirebaseAuth();
  const [, setLocation] = useLocation();
  
  // Auth state
  const [authMode, setAuthMode] = useState<AuthMode>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const smsButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize reCAPTCHA when phone mode is selected
  useEffect(() => {
    if (authMode === 'phone' && smsButtonRef.current) {
      initRecaptcha('sms-button');
    }
  }, [authMode]);

  // Reset form when changing modes
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setVerificationCode('');
    setShowPassword(false);
  };

  const changeMode = (mode: AuthMode) => {
    resetForm();
    setAuthMode(mode);
  };

  // Google Sign In
  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    const { user, error } = await signInWithGoogle();
    setIsProcessing(false);
    
    if (error) {
      toast.error(error);
    } else if (user) {
      toast.success(`Welcome to Essence, ${user.displayName || user.email}!`);
    }
  };

  // Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsProcessing(true);
    const displayName = `${firstName} ${lastName}`.trim() || undefined;
    const { user, error } = await signUpWithEmail(email, password, displayName);
    setIsProcessing(false);
    
    if (error) {
      toast.error(error);
    } else if (user) {
      toast.success(`Welcome to Essence, ${displayName || email}!`);
    }
  };

  // Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const { user, error } = await signInWithEmail(email, password);
    setIsProcessing(false);
    
    if (error) {
      toast.error(error);
    } else if (user) {
      toast.success(`Welcome back, ${user.displayName || user.email}!`);
    }
  };

  // Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsProcessing(true);
    const { success, error } = await resetPassword(email);
    setIsProcessing(false);
    
    if (success) {
      toast.success("Password reset email sent! Check your inbox.");
      changeMode('email-signin');
    } else {
      toast.error(error || "Failed to send reset email");
    }
  };

  // Phone - Send SMS
  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number with country code");
      return;
    }
    
    setIsProcessing(true);
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const { success, error } = await sendSmsCode(formattedPhone);
    setIsProcessing(false);
    
    if (success) {
      toast.success("Verification code sent!");
      setAuthMode('phone-verify');
    } else {
      toast.error(error || "Failed to send verification code");
    }
  };

  // Phone - Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    
    setIsProcessing(true);
    const { user, error } = await verifySmsCode(verificationCode);
    setIsProcessing(false);
    
    if (error) {
      toast.error(error);
    } else if (user) {
      toast.success(`Welcome to Essence!`);
    }
  };

  // Logout
  const handleLogout = async () => {
    const { success, error } = await logOut();
    if (success) {
      toast.success("Signed out successfully");
    } else {
      toast.error("Logout failed: " + error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#D6A743] via-[#F3D27A] to-[#B8862D] flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm text-[#6b7280] tracking-widest uppercase">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Authenticated - Dashboard
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6A743] to-transparent opacity-50" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#F7E3A3]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#F7E3A3]/20 to-transparent blur-3xl" />
        
        <div className="relative flex items-center justify-center min-h-screen px-3 py-4 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md mx-1 sm:mx-0"
          >
            <div className="relative mx-1">
              <div className="absolute inset-0 sm:-inset-[2px] bg-gradient-to-b from-[#D6A743] via-[#F7E3A3] to-[#B8862D] rounded-3xl opacity-60 blur-sm" />
              
              <div className="relative bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#B8862D] via-[#F7E3A3] to-[#B8862D]" />
                
                <div className="p-5 sm:p-8 md:p-10">
                  <div className="text-center mb-8">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="relative w-24 h-24 mx-auto mb-5"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#D6A743] via-[#F7E3A3] to-[#B8862D] p-[3px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#F7E3A3] to-[#D6A743] flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">
                                {(user.displayName || user.email || 'A')[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#D6A743] to-[#B8862D] rounded-full flex items-center justify-center shadow-lg">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                    
                    <h1 className="text-2xl font-semibold text-[#111827] mb-1">Welcome back</h1>
                    <p className="text-xl bg-gradient-to-r from-[#D6A743] to-[#B8862D] bg-clip-text text-transparent font-medium">
                      {user.displayName || user.email?.split('@')[0] || 'Valued Member'}
                    </p>
                    <p className="text-sm text-[#6b7280] mt-2">{user.email || user.phoneNumber}</p>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLocation('/command-center')}
                      className="w-full py-4 px-6 bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] text-black font-semibold rounded-xl shadow-[0_15px_40px_rgba(214,167,67,0.4)] hover:shadow-[0_20px_50px_rgba(214,167,67,0.5)] transition-all flex items-center justify-between group"
                      data-testid="btn-command-center"
                    >
                      <span className="tracking-wide">Command Center</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    
                    {[
                      { path: '/hr-command', label: 'HR Management', icon: '👥' },
                      { path: '/pos', label: 'POS System', icon: '💳' },
                      { path: '/inventory-command', label: 'Inventory Control', icon: '📦' },
                      { path: '/compliance-command', label: 'Compliance', icon: '📋' },
                    ].map((item) => (
                      <motion.button
                        key={item.path}
                        whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setLocation(item.path)}
                        className="w-full py-3.5 px-5 bg-white border border-[#e5e7eb] text-[#374151] font-medium rounded-xl hover:border-[#D6A743]/30 transition-all flex items-center gap-3 group"
                        data-testid={`btn-${item.path.slice(1)}`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#D6A743] transition-colors" />
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 text-sm text-[#9ca3af] hover:text-[#ef4444] transition-colors mx-auto group"
                      data-testid="btn-logout"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-[#9ca3af] tracking-widest uppercase">
                Essence Yogurt™ Executive Portal
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Login page - Luxury Auth Form
  return (
    <div className="min-h-screen bg-[#FDFCF9] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6A743] to-transparent opacity-40" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-[#F7E3A3]/30 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[#F7E3A3]/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6A743] to-transparent opacity-40" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-3 py-4 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-1 sm:mx-0"
        >
          <div className="relative mx-1">
            <div className="absolute -inset-1 bg-gradient-to-b from-[#D6A743]/40 via-[#F7E3A3]/30 to-[#B8862D]/40 rounded-[28px] blur-xl opacity-60 hidden sm:block" />
            <div className="absolute inset-0 sm:-inset-[2px] bg-gradient-to-b from-[#D6A743] via-[#F7E3A3] to-[#B8862D] rounded-3xl opacity-80" />
            
            <div className="relative bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#B8862D] via-[#F7E3A3] to-[#B8862D]" />
              
              <div className="p-5 sm:p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {/* Method Selection */}
                  {authMode === 'select' && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Logo */}
                      <div className="text-center mb-8">
                        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-[0_10px_40px_rgba(214,167,67,0.4)]">
                          <img src={essenceLogo} alt="Essence Yogurt" className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-6">
                          <h1 className="text-sm uppercase tracking-[0.3em] text-[#6b7280] mb-2">Welcome to</h1>
                          <h2 className="text-3xl font-semibold tracking-tight text-[#111827]">
                            Essence<span className="bg-gradient-to-r from-[#D6A743] to-[#B8862D] bg-clip-text text-transparent"> Yogurt</span>
                            <span className="text-sm align-super text-[#D6A743]">™</span>
                          </h2>
                          <p className="text-sm text-[#6b7280] mt-3">Sign in to access your account</p>
                        </div>
                      </div>

                      {/* Auth Options */}
                      <div className="space-y-3">
                        {/* Google */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleGoogleLogin}
                          disabled={isProcessing}
                          className="w-full py-4 px-6 bg-white border-2 border-[#e5e7eb] rounded-xl font-medium text-[#374151] hover:border-[#D6A743]/50 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
                          data-testid="btn-google-login"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#D6A743]" />
                          ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                          )}
                          <span className="text-sm tracking-wide">Continue with Google</span>
                        </motion.button>

                        {/* Email */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => changeMode('email-signin')}
                          className="w-full py-4 px-6 bg-white border-2 border-[#e5e7eb] rounded-xl font-medium text-[#374151] hover:border-[#D6A743]/50 hover:shadow-lg transition-all flex items-center justify-center gap-4 group"
                          data-testid="btn-email-signin"
                        >
                          <Mail className="w-5 h-5 text-[#6b7280]" />
                          <span className="text-sm tracking-wide">Sign in with Email</span>
                        </motion.button>

                        {/* SMS */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => changeMode('phone')}
                          className="w-full py-4 px-6 bg-white border-2 border-[#e5e7eb] rounded-xl font-medium text-[#374151] hover:border-[#D6A743]/50 hover:shadow-lg transition-all flex items-center justify-center gap-4 group"
                          data-testid="btn-phone-signin"
                        >
                          <Phone className="w-5 h-5 text-[#6b7280]" />
                          <span className="text-sm tracking-wide">Sign in with SMS</span>
                        </motion.button>
                      </div>

                      {/* Sign Up Link */}
                      <div className="mt-6 text-center">
                        <p className="text-sm text-[#6b7280]">
                          Don't have an account?{' '}
                          <button
                            onClick={() => changeMode('email-signup')}
                            className="text-[#D6A743] hover:text-[#B8862D] font-medium transition-colors"
                            data-testid="link-signup"
                          >
                            Create one
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Sign In */}
                  {authMode === 'email-signin' && (
                    <motion.div
                      key="email-signin"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => changeMode('select')}
                        className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#374151] mb-6 transition-colors"
                        data-testid="btn-back"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>

                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                          <Mail className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#111827]">Sign in with Email</h2>
                        <p className="text-sm text-[#6b7280] mt-1">Enter your credentials</p>
                      </div>

                      <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                            data-testid="input-email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="w-full h-12 px-4 pr-12 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                              data-testid="input-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                              data-testid="btn-toggle-password"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => changeMode('forgot-password')}
                            className="text-sm text-[#D6A743] hover:text-[#B8862D] transition-colors"
                            data-testid="link-forgot-password"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-4 bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] text-black font-semibold rounded-xl shadow-[0_10px_30px_rgba(214,167,67,0.4)] hover:shadow-[0_15px_40px_rgba(214,167,67,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          data-testid="btn-submit-signin"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>Sign In<ChevronRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                      </form>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-[#6b7280]">
                          Don't have an account?{' '}
                          <button
                            onClick={() => changeMode('email-signup')}
                            className="text-[#D6A743] hover:text-[#B8862D] font-medium transition-colors"
                            data-testid="link-to-signup"
                          >
                            Sign up
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Sign Up */}
                  {authMode === 'email-signup' && (
                    <motion.div
                      key="email-signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => changeMode('select')}
                        className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#374151] mb-6 transition-colors"
                        data-testid="btn-back"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>

                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#111827]">Create Account</h2>
                        <p className="text-sm text-[#6b7280] mt-1">Join the Essence family</p>
                      </div>

                      <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">First Name</label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="John"
                              className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                              data-testid="input-firstname"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Last Name</label>
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Doe"
                              className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                              data-testid="input-lastname"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                            data-testid="input-email"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="At least 6 characters"
                              required
                              className="w-full h-12 px-4 pr-12 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                              data-testid="input-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                              data-testid="btn-toggle-password"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Confirm Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                            data-testid="input-confirm-password"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-4 bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] text-black font-semibold rounded-xl shadow-[0_10px_30px_rgba(214,167,67,0.4)] hover:shadow-[0_15px_40px_rgba(214,167,67,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          data-testid="btn-submit-signup"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>Create Account<ChevronRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                      </form>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-[#6b7280]">
                          Already have an account?{' '}
                          <button
                            onClick={() => changeMode('email-signin')}
                            className="text-[#D6A743] hover:text-[#B8862D] font-medium transition-colors"
                            data-testid="link-to-signin"
                          >
                            Sign in
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Forgot Password */}
                  {authMode === 'forgot-password' && (
                    <motion.div
                      key="forgot-password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => changeMode('email-signin')}
                        className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#374151] mb-6 transition-colors"
                        data-testid="btn-back"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                      </button>

                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                          <Lock className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#111827]">Reset Password</h2>
                        <p className="text-sm text-[#6b7280] mt-1">We'll send you a reset link</p>
                      </div>

                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                            data-testid="input-email"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-4 bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] text-black font-semibold rounded-xl shadow-[0_10px_30px_rgba(214,167,67,0.4)] hover:shadow-[0_15px_40px_rgba(214,167,67,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          data-testid="btn-send-reset"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>Send Reset Link<ChevronRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}

                  {/* Phone Sign In */}
                  {authMode === 'phone' && (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => changeMode('select')}
                        className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#374151] mb-6 transition-colors"
                        data-testid="btn-back"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>

                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                          <Phone className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#111827]">Sign in with SMS</h2>
                        <p className="text-sm text-[#6b7280] mt-1">We'll send you a verification code</p>
                      </div>

                      <form onSubmit={handleSendSms} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Phone Number</label>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1 234 567 8900"
                            required
                            className="w-full h-12 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                            data-testid="input-phone"
                          />
                          <p className="mt-1.5 text-xs text-[#9ca3af]">Include country code (e.g., +1 for US)</p>
                        </div>

                        <motion.button
                          ref={smsButtonRef}
                          id="sms-button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-4 bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] text-black font-semibold rounded-xl shadow-[0_10px_30px_rgba(214,167,67,0.4)] hover:shadow-[0_15px_40px_rgba(214,167,67,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          data-testid="btn-send-code"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>Send Code<ChevronRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}

                  {/* Phone Verification */}
                  {authMode === 'phone-verify' && (
                    <motion.div
                      key="phone-verify"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => changeMode('phone')}
                        className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#374151] mb-6 transition-colors"
                        data-testid="btn-back"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Change number
                      </button>

                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#D6A743] to-[#B8862D] flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#111827]">Verify Your Number</h2>
                        <p className="text-sm text-[#6b7280] mt-1">
                          Enter the 6-digit code sent to<br />
                          <span className="font-medium text-[#374151]">{phoneNumber}</span>
                        </p>
                      </div>

                      <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">Verification Code</label>
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            maxLength={6}
                            required
                            className="w-full h-14 px-4 bg-white border border-[#e5e7eb] rounded-xl text-[#111827] text-center text-2xl tracking-[0.5em] font-medium placeholder:text-[#9ca3af] placeholder:tracking-normal placeholder:text-base focus:outline-none focus:border-[#D6A743] focus:ring-2 focus:ring-[#D6A743]/20 transition-all"
                            data-testid="input-code"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isProcessing || verificationCode.length !== 6}
                          className="w-full py-4 bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] text-black font-semibold rounded-xl shadow-[0_10px_30px_rgba(214,167,67,0.4)] hover:shadow-[0_15px_40px_rgba(214,167,67,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          data-testid="btn-verify-code"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>Verify & Sign In<ChevronRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                      </form>

                      <div className="mt-6 text-center">
                        <button
                          onClick={() => changeMode('phone')}
                          className="text-sm text-[#D6A743] hover:text-[#B8862D] transition-colors"
                          data-testid="btn-resend-code"
                        >
                          Didn't receive the code? Send again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-1 bg-gradient-to-r from-[#B8862D] via-[#F7E3A3] to-[#B8862D]" />
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-6 text-xs text-[#9ca3af]">
              <Link href="/privacy" className="hover:text-[#6b7280] transition-colors" data-testid="link-privacy">
                Privacy Policy
              </Link>
              <span className="w-1 h-1 rounded-full bg-[#d1d5db]" />
              <Link href="/terms" className="hover:text-[#6b7280] transition-colors" data-testid="link-terms">
                Terms of Service
              </Link>
            </div>
            <p className="text-[11px] text-[#9ca3af] tracking-widest uppercase">
              Essence Yogurt™ • Premium Since 2019
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
