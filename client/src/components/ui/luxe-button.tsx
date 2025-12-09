import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, Loader2 } from "lucide-react";

interface LuxeButtonProps {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const LuxeButton = forwardRef<HTMLButtonElement, LuxeButtonProps>(
  ({
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    loading = false,
    fullWidth = false,
    className,
    disabled,
    type = "button",
    onClick,
    "data-testid": testId,
  }, ref) => {
    const variants = {
      primary: cn(
        "bg-neutral-900 text-white",
        "hover:bg-neutral-800 active:bg-neutral-950",
        "shadow-lg shadow-neutral-900/20 hover:shadow-xl"
      ),
      secondary: cn(
        "bg-neutral-100 text-neutral-900",
        "hover:bg-neutral-200 active:bg-neutral-300"
      ),
      outline: cn(
        "bg-transparent border-2 border-neutral-200 text-neutral-900",
        "hover:border-neutral-300 hover:bg-neutral-50"
      ),
      ghost: cn(
        "bg-transparent text-neutral-600",
        "hover:bg-neutral-100 hover:text-neutral-900"
      ),
      danger: cn(
        "bg-red-600 text-white",
        "hover:bg-red-700 active:bg-red-800",
        "shadow-lg shadow-red-600/20"
      ),
      gold: cn(
        "bg-gradient-to-r from-[#E8D48A] via-[#C9A227] to-[#9A7B0A] text-white",
        "hover:shadow-xl hover:shadow-[#C9A227]/30",
        "active:shadow-lg"
      ),
    };

    const sizes = {
      sm: "px-4 py-2 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-sm gap-2",
      xl: "px-8 py-4 text-base gap-3",
    };

    const iconSizes = {
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-5 h-5",
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center font-semibold rounded-2xl",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-4 focus:ring-[#C9A227]/20",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        type={type}
        onClick={onClick}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        data-testid={testId}
      >
        {loading && (
          <Loader2 className={cn("animate-spin", iconSizes[size])} />
        )}
        {!loading && Icon && iconPosition === "left" && (
          <Icon className={iconSizes[size]} />
        )}
        {children}
        {!loading && Icon && iconPosition === "right" && (
          <Icon className={iconSizes[size]} />
        )}
      </motion.button>
    );
  }
);
LuxeButton.displayName = "LuxeButton";

interface LuxeIconButtonProps {
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  badge?: number;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const LuxeIconButton = forwardRef<HTMLButtonElement, LuxeIconButtonProps>(
  ({
    icon: Icon,
    variant = "ghost",
    size = "md",
    loading = false,
    badge,
    className,
    disabled,
    onClick,
    "data-testid": testId,
  }, ref) => {
    const variants = {
      primary: "bg-neutral-900 text-white hover:bg-neutral-800",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      outline: "bg-transparent border-2 border-neutral-200 text-neutral-600 hover:border-neutral-300",
      ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      danger: "bg-red-600 text-white hover:bg-red-700",
      gold: "bg-gradient-to-r from-[#C9A227] to-[#c5a059] text-white hover:shadow-lg",
    };

    const sizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl",
          "transition-all duration-200",
          "focus:outline-none focus:ring-4 focus:ring-[#C9A227]/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        onClick={onClick}
        whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        data-testid={testId}
      >
        {loading ? (
          <Loader2 className={cn("animate-spin", iconSizes[size])} />
        ) : (
          <Icon className={iconSizes[size]} />
        )}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </motion.button>
    );
  }
);
LuxeIconButton.displayName = "LuxeIconButton";

interface LuxeTabsProps {
  tabs: { id: string; label: string; icon?: LucideIcon; badge?: number }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "pills" | "underline" | "cards";
  "data-testid"?: string;
}

export function LuxeTabs({
  tabs,
  activeTab,
  onChange,
  variant = "pills",
  "data-testid": testId,
}: LuxeTabsProps) {
  if (variant === "underline") {
    return (
      <div className="flex gap-1 border-b border-neutral-200" data-testid={testId}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                isActive ? "text-[#C9A227]" : "text-neutral-500 hover:text-neutral-900"
              )}
              data-testid={`${testId}-tab-${tab.id}`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A227] to-[#c5a059]"
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="flex gap-2 flex-wrap" data-testid={testId}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-[#C9A227] to-[#c5a059] text-white shadow-lg shadow-[#C9A227]/25"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`${testId}-tab-${tab.id}`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                  isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                )}>
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-1 p-1 bg-neutral-100 rounded-2xl" data-testid={testId}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            )}
            data-testid={`${testId}-tab-${tab.id}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
