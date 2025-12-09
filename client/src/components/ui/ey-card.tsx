import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface EYCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function EYCard({ children, className, hoverEffect = true, ...props }: EYCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-white rounded-[24px] p-8 border border-border/50",
        "shadow-luxury",
        hoverEffect && "transition-transform duration-300 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
