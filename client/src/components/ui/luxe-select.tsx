import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LuxeSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  children: React.ReactNode;
  "data-testid"?: string;
}

export function LuxeSelect({
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  error,
  hint,
  disabled,
  children,
  "data-testid": testId,
}: LuxeSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="space-y-2" data-testid={testId}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {label}
        </label>
      )}

      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        open={isOpen}
        onOpenChange={setIsOpen}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          className={cn(
            "group w-full flex items-center justify-between gap-3",
            "py-3.5 px-4 bg-white border-2 rounded-2xl",
            "text-sm font-medium text-neutral-900",
            "transition-all duration-300 cursor-pointer",
            "hover:border-neutral-300",
            "focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-neutral-200",
            isOpen && "border-[#d4af37] ring-4 ring-[#d4af37]/10"
          )}
          data-testid={`${testId}-trigger`}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isOpen ? "text-[#d4af37]" : "text-neutral-400 group-hover:text-neutral-600"
              )}
            />
          </motion.div>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 min-w-[8rem] overflow-hidden",
              "bg-white rounded-2xl border-2 border-neutral-100",
              "shadow-2xl shadow-neutral-900/10",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2"
            )}
            position="popper"
            sideOffset={8}
          >
            <SelectPrimitive.Viewport className="p-2 max-h-[300px]">
              {children}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

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

interface LuxeSelectItemProps {
  value: string;
  children: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  "data-testid"?: string;
}

export function LuxeSelectItem({
  value,
  children,
  description,
  icon,
  disabled,
  "data-testid": testId,
}: LuxeSelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl",
        "text-sm font-medium text-neutral-900 cursor-pointer",
        "outline-none transition-all duration-150",
        "hover:bg-gradient-to-r hover:from-[#d4af37]/5 hover:to-[#d4af37]/10",
        "focus:bg-gradient-to-r focus:from-[#d4af37]/5 focus:to-[#d4af37]/10",
        "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#d4af37]/10 data-[state=checked]:to-[#d4af37]/20",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
      )}
      data-testid={testId}
    >
      {icon && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-lg">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5 truncate">{description}</p>
        )}
      </div>
      <SelectPrimitive.ItemIndicator>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 flex items-center justify-center bg-gradient-to-r from-[#d4af37] to-[#c5a059] rounded-full"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function LuxeSelectGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <SelectPrimitive.Group>
      <SelectPrimitive.Label className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </SelectPrimitive.Label>
      {children}
    </SelectPrimitive.Group>
  );
}

export function LuxeSelectSeparator() {
  return (
    <SelectPrimitive.Separator className="h-px my-2 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
  );
}
