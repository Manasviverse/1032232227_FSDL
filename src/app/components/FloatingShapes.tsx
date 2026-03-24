import { motion } from "motion/react";

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating circles */}
      <motion.div
        className="absolute top-20 left-[10%] w-64 h-64 bg-[#0047BA] rounded-full opacity-5"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-[15%] w-48 h-48 bg-[#6FDA44] rounded-full opacity-5"
        animate={{
          y: [0, 40, 0],
          x: [0, -25, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-[20%] w-32 h-32 bg-[#EC008C] rounded-full opacity-5"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[25%] w-40 h-40 bg-[#FFC72C] rounded-full opacity-5"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Abstract blobs */}
      <motion.div
        className="absolute top-1/2 left-[5%] w-72 h-72 bg-gradient-to-br from-[#0047BA] to-[#EC008C] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-[0.03]"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-56 h-56 bg-gradient-to-br from-[#6FDA44] to-[#FFC72C] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-[0.03]"
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
