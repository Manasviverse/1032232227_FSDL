import { motion } from 'motion/react';
import { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  glowColor?: string;
  onClick?: () => void;
  delay?: number;
  animate?: boolean;
}

export function GlassCard({
  children,
  className = '',
  style = {},
  hover = true,
  glowColor,
  onClick,
  delay = 0,
  animate = true,
}: GlassCardProps) {
  const baseStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    ...style,
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={hover ? {
          y: -4,
          borderColor: glowColor ? `${glowColor}60` : 'rgba(47, 128, 237, 0.4)',
          boxShadow: glowColor
            ? `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${glowColor}25`
            : '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(47,128,237,0.15)',
        } : undefined}
        style={baseStyle}
        className={className}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={baseStyle} className={className} onClick={onClick}>
      {children}
    </div>
  );
}

// ─── Gradient Card ─────────────────────────────────────────────────────────────
interface GradientCardProps {
  children: ReactNode;
  gradient: string;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  delay?: number;
}

export function GradientCard({ children, gradient, className = '', style = {}, hover = true, delay = 0 }: GradientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      style={{
        background: gradient,
        borderRadius: '16px',
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  change?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, color, change, delay = 0 }: StatCardProps) {
  return (
    <GlassCard delay={delay} className="p-4 cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: 'white', fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif' }}>{value}</p>
          {change && (
            <p style={{ color: '#34D399', fontSize: '0.72rem', marginTop: '2px' }}>{change}</p>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: '12px',
          background: `${color}20`,
          border: `1px solid ${color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, fontSize: '1.2rem',
          boxShadow: `0 0 12px ${color}30`,
        }}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}
