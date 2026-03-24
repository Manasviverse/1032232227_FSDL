import { motion } from "motion/react";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "warm";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

export function GradientButton({ 
  children, 
  variant = "primary", 
  size = "md",
  onClick,
  className = ""
}: GradientButtonProps) {
  const gradients = {
    primary: "bg-gradient-to-br from-[#0047BA] to-[#0056D6]",
    secondary: "bg-gradient-to-br from-[#6FDA44] to-[#5BC936]",
    accent: "bg-gradient-to-br from-[#EC008C] to-[#FF1A9E]",
    warm: "bg-gradient-to-br from-[#FFC72C] to-[#FFD154]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${gradients[variant]} ${sizes[size]} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
