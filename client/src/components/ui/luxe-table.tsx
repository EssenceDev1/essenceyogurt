import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ChevronsUpDown, MoreHorizontal } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

interface LuxeTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  compact?: boolean;
  "data-testid"?: string;
}

export function LuxeTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
  striped = true,
  compact = false,
  "data-testid": testId,
}: LuxeTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDir === "asc" ? comparison : -comparison;
      })
    : data;

  const SortIcon = ({ column }: { column: Column<T> }) => {
    if (!column.sortable) return null;
    if (sortKey !== column.key) return <ChevronsUpDown className="w-4 h-4 text-neutral-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4 text-[#d4af37]" />
    ) : (
      <ChevronDown className="w-4 h-4 text-[#d4af37]" />
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" data-testid={testId}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-neutral-50 to-neutral-100/50 border-b border-neutral-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider text-neutral-500",
                    compact ? "px-4 py-3" : "px-6 py-4",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.sortable && "cursor-pointer hover:text-neutral-900 transition-colors"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={cn(
                    "flex items-center gap-2",
                    column.align === "center" && "justify-center",
                    column.align === "right" && "justify-end"
                  )}>
                    {column.header}
                    <SortIcon column={column} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        className="w-8 h-8 border-3 border-[#d4af37]/30 border-t-[#d4af37] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-sm text-neutral-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <span className="text-sm text-neutral-500">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onRowClick?.(row, index)}
                    className={cn(
                      "border-b border-neutral-100 last:border-0 transition-colors",
                      onRowClick && "cursor-pointer hover:bg-[#d4af37]/5",
                      striped && index % 2 === 1 && "bg-neutral-50/50"
                    )}
                    data-testid={`${testId}-row-${index}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "text-sm text-neutral-900",
                          compact ? "px-4 py-3" : "px-6 py-4",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {column.render
                          ? column.render(row, index)
                          : row[column.key] ?? "-"}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface LuxeBadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "gold";
  size?: "sm" | "md";
  dot?: boolean;
}

export function LuxeBadge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
}: LuxeBadgeProps) {
  const variants = {
    default: "bg-neutral-100 text-neutral-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    gold: "bg-[#d4af37]/15 text-[#a07c10]",
  };

  const dotColors = {
    default: "bg-neutral-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    gold: "bg-[#d4af37]",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full uppercase tracking-wider",
        variants[variant],
        sizes[size]
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

interface LuxeAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

export function LuxeAvatar({
  src,
  name,
  size = "md",
  status,
}: LuxeAvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-neutral-400",
    busy: "bg-red-500",
    away: "bg-amber-500",
  };

  const statusSizes = {
    sm: "w-2.5 h-2.5 border-1",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4 h-4 border-2",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative inline-flex">
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full object-cover ring-2 ring-white",
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-[#d4af37] to-[#c5a059] text-white font-semibold",
            "flex items-center justify-center ring-2 ring-white",
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}

interface LuxeProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger" | "gold";
  showLabel?: boolean;
  label?: string;
}

export function LuxeProgress({
  value,
  max = 100,
  size = "md",
  variant = "gold",
  showLabel = false,
  label,
}: LuxeProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variants = {
    default: "bg-neutral-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    gold: "bg-gradient-to-r from-[#d4af37] to-[#c5a059]",
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-neutral-600">{label}</span>}
          {showLabel && (
            <span className="text-xs font-semibold text-neutral-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-neutral-100 rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          className={cn("h-full rounded-full", variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
