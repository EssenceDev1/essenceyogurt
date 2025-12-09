import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";

interface LuxeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  hint?: string;
  "data-testid"?: string;
}

export const LuxeInput = forwardRef<HTMLInputElement, LuxeInputProps>(
  ({ label, error, success, icon: Icon, rightIcon: RightIcon, hint, className, type, "data-testid": testId, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("space-y-2", className)} data-testid={testId}>
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className={cn(
                "w-5 h-5 transition-colors duration-200",
                isFocused ? "text-[#C9A227]" : "text-neutral-400"
              )} />
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full py-3.5 bg-white border-2 rounded-2xl text-sm font-medium text-neutral-900",
              "placeholder:text-neutral-400 transition-all duration-300",
              "focus:outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10",
              "hover:border-neutral-300",
              Icon ? "pl-12 pr-4" : "px-4",
              (isPassword || RightIcon) && "pr-12",
              error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
              success && "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10",
              !error && !success && "border-neutral-200"
            )}
            data-testid={`${testId}-input`}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              tabIndex={-1}
              data-testid={`${testId}-toggle-password`}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {!isPassword && RightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <RightIcon className={cn(
                "w-5 h-5",
                error ? "text-red-500" : success ? "text-emerald-500" : "text-neutral-400"
              )} />
            </div>
          )}
          
          {success && !RightIcon && !isPassword && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </motion.p>
          )}
          {hint && !error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-neutral-500"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
LuxeInput.displayName = "LuxeInput";

interface LuxeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  "data-testid"?: string;
}

export const LuxeTextarea = forwardRef<HTMLTextAreaElement, LuxeTextareaProps>(
  ({ label, error, hint, className, "data-testid": testId, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("space-y-2", className)} data-testid={testId}>
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full py-3.5 px-4 bg-white border-2 rounded-2xl text-sm font-medium text-neutral-900",
            "placeholder:text-neutral-400 transition-all duration-300 resize-none",
            "focus:outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10",
            "hover:border-neutral-300",
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-neutral-200"
          )}
          data-testid={`${testId}-textarea`}
          {...props}
        />
        
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </motion.p>
          )}
          {hint && !error && (
            <p className="text-xs text-neutral-500">{hint}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
LuxeTextarea.displayName = "LuxeTextarea";

interface LuxeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  "data-testid"?: string;
}

export function LuxeToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  "data-testid": testId,
}: LuxeToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "w-full flex items-center justify-between gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
        "hover:border-[#C9A227]/50",
        checked ? "border-[#C9A227] bg-[#C9A227]/5" : "border-neutral-200 bg-white",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={disabled}
      data-testid={testId}
    >
      <div className="text-left">
        {label && <p className="text-sm font-semibold text-neutral-900">{label}</p>}
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
      
      <div
        className={cn(
          "w-12 h-7 rounded-full p-1 transition-colors duration-300",
          checked ? "bg-gradient-to-r from-[#C9A227] to-[#c5a059]" : "bg-neutral-200"
        )}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

interface LuxeSearchProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  loading?: boolean;
  "data-testid"?: string;
}

export const LuxeSearch = forwardRef<HTMLInputElement, LuxeSearchProps>(
  ({ onSearch, loading, className, "data-testid": testId, ...props }, ref) => {
    return (
      <div className={cn("relative", className)} data-testid={testId}>
        <input
          ref={ref}
          type="search"
          className={cn(
            "w-full py-3 pl-12 pr-4 bg-neutral-50 border-2 border-transparent rounded-2xl",
            "text-sm font-medium text-neutral-900 placeholder:text-neutral-400",
            "transition-all duration-300",
            "focus:outline-none focus:bg-white focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10"
          )}
          onChange={(e) => onSearch?.(e.target.value)}
          data-testid={`${testId}-input`}
          {...props}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>
    );
  }
);
LuxeSearch.displayName = "LuxeSearch";
