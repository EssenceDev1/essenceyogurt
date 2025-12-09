import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface LuxeCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "glass" | "gold" | "dark" | "gradient";
  hover?: boolean;
  glow?: boolean;
}

export const LuxeCard = forwardRef<HTMLDivElement, LuxeCardProps>(
  ({ children, className, variant = "default", hover = true, glow = false, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-neutral-200",
      glass: "bg-white/80 backdrop-blur-xl border border-white/20",
      gold: "bg-gradient-to-br from-[#C9A227]/10 via-white to-[#C9A227]/5 border border-[#C9A227]/20",
      dark: "bg-neutral-900 border border-neutral-800 text-white",
      gradient: "bg-gradient-to-br from-white via-neutral-50 to-[#C9A227]/5 border border-neutral-200",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-3xl p-6 transition-all duration-500",
          variants[variant],
          hover && "hover:shadow-2xl hover:-translate-y-1",
          glow && "shadow-[0_0_60px_rgba(201,162,39,0.15)]",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
LuxeCard.displayName = "LuxeCard";

interface LuxeStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  iconColor?: string;
  "data-testid"?: string;
}

export function LuxeStatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-[#C9A227]",
  "data-testid": testId,
}: LuxeStatCardProps) {
  const changeColors = {
    positive: "text-emerald-600 bg-emerald-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-neutral-600 bg-neutral-100",
  };

  return (
    <LuxeCard
      variant="gradient"
      className="relative overflow-hidden"
      data-testid={testId}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9A227]/10 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {title}
          </p>
          {Icon && (
            <div className={cn("p-2.5 rounded-2xl bg-[#C9A227]/10", iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <p className="text-3xl font-bold text-neutral-900 mb-2" data-testid={`${testId}-value`}>
          {value}
        </p>
        
        {change && (
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
            changeColors[changeType]
          )}>
            {changeType === "positive" && "↑ "}
            {changeType === "negative" && "↓ "}
            {change}
          </span>
        )}
      </div>
    </LuxeCard>
  );
}

interface LuxeDepartmentCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stats?: { label: string; value: string | number }[];
  status?: "healthy" | "warning" | "critical" | "offline";
  onClick?: () => void;
  "data-testid"?: string;
}

export function LuxeDepartmentCard({
  title,
  description,
  icon: Icon,
  stats,
  status = "healthy",
  onClick,
  "data-testid": testId,
}: LuxeDepartmentCardProps) {
  const statusColors = {
    healthy: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
    offline: "bg-neutral-400",
  };

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid={testId}
    >
      <LuxeCard variant="default" className="group cursor-pointer">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#c5a059] text-white shadow-lg shadow-[#C9A227]/25">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-[#C9A227] transition-colors">
                {title}
              </h3>
              <span className={cn("w-2.5 h-2.5 rounded-full", statusColors[status])} />
            </div>
            <p className="text-sm text-neutral-500">{description}</p>
          </div>
        </div>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </LuxeCard>
    </motion.button>
  );
}

interface LuxeAlertCardProps {
  title: string;
  message: string;
  severity: "info" | "warning" | "critical" | "success";
  timestamp?: string;
  action?: { label: string; onClick: () => void };
  "data-testid"?: string;
}

export function LuxeAlertCard({
  title,
  message,
  severity,
  timestamp,
  action,
  "data-testid": testId,
}: LuxeAlertCardProps) {
  const severityStyles = {
    info: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      icon: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
    warning: {
      border: "border-amber-200",
      bg: "bg-amber-50",
      icon: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    critical: {
      border: "border-red-200",
      bg: "bg-red-50",
      icon: "text-red-600",
      badge: "bg-red-100 text-red-700",
    },
    success: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
  };

  const styles = severityStyles[severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 rounded-2xl border-2",
        styles.border,
        styles.bg
      )}
      data-testid={testId}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", styles.badge)}>
              {severity}
            </span>
          </div>
          <p className="text-sm text-neutral-600">{message}</p>
          {timestamp && (
            <p className="text-xs text-neutral-400 mt-2">{timestamp}</p>
          )}
        </div>
        
        {action && (
          <button
            onClick={action.onClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
}
