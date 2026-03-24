import { motion } from "motion/react";
import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function FloatingCard({ children, className = "", hoverable = true }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { y: -4, boxShadow: "0 20px 40px rgba(0, 71, 186, 0.15)" } : {}}
      className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
