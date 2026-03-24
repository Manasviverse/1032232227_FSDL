import { motion } from "motion/react";

interface AnimatedTagProps {
  children: React.ReactNode;
  color?: "blue" | "green" | "pink" | "yellow" | "purple";
}

export function AnimatedTag({ children, color = "blue" }: AnimatedTagProps) {
  const colors = {
    blue: "bg-blue-100 text-[#0047BA] border-[#0047BA]",
    green: "bg-green-100 text-[#5BC936] border-[#6FDA44]",
    pink: "bg-pink-100 text-[#EC008C] border-[#EC008C]",
    yellow: "bg-yellow-100 text-[#B8860B] border-[#FFC72C]",
    purple: "bg-purple-100 text-purple-700 border-purple-400"
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-block px-3 py-1 rounded-full text-sm border ${colors[color]}`}
    >
      {children}
    </motion.span>
  );
}
