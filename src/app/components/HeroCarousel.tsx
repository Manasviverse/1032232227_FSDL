import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Users, Zap, Trophy } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: '🔴 LIVE',
    badgeColor: '#FB7185',
    title: 'Quiz Battle: Advanced Mathematics',
    subtitle: '128 students competing right now',
    cta: 'Join Battle',
    ctaColor: '#2F80ED',
    bg: 'linear-gradient(135deg, rgba(47,128,237,0.3) 0%, rgba(123,97,255,0.3) 100%)',
    borderGlow: 'rgba(47,128,237,0.3)',
    image: 'https://images.unsplash.com/photo-1758685848691-3933bc2aa3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=60',
    Icon: Zap,
    stat1: { label: 'Players', value: '128' },
    stat2: { label: 'Prize XP', value: '500' },
    stat3: { label: 'Time Left', value: '12m' },
  },
  {
    id: 2,
    badge: '⭐ TRENDING',
    badgeColor: '#FACC15',
    title: 'ML Hub: Study Room Now Open',
    subtitle: '8 students collaborating on Neural Networks',
    cta: 'Enter Room',
    ctaColor: '#7B61FF',
    bg: 'linear-gradient(135deg, rgba(123,97,255,0.3) 0%, rgba(244,114,182,0.3) 100%)',
    borderGlow: 'rgba(123,97,255,0.3)',
    image: 'https://images.unsplash.com/photo-1675557009483-e6cf3867976b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=60',
    Icon: Users,
    stat1: { label: 'Members', value: '8' },
    stat2: { label: 'Resources', value: '21' },
    stat3: { label: 'Active', value: 'Now' },
  },
  {
    id: 3,
    badge: '🏆 WEEKLY',
    badgeColor: '#F97316',
    title: 'Weekly Leaderboard Results',
    subtitle: 'Apurva Sharma tops the chart with 8,420 XP',
    cta: 'View Board',
    ctaColor: '#2DD4BF',
    bg: 'linear-gradient(135deg, rgba(45,212,191,0.3) 0%, rgba(47,128,237,0.3) 100%)',
    borderGlow: 'rgba(45,212,191,0.3)',
    image: 'https://images.unsplash.com/photo-1514820720301-4c4790309f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=60',
    Icon: Trophy,
    stat1: { label: '#1 XP', value: '8,420' },
    stat2: { label: 'Students', value: '248' },
    stat3: { label: 'Resets', value: '2d' },
  },
  {
    id: 4,
    badge: '👥 ACTIVE',
    badgeColor: '#2DD4BF',
    title: 'DSA Study Group: 18 Members Online',
    subtitle: 'Solving graph algorithms and dynamic programming',
    cta: 'Collaborate',
    ctaColor: '#FB7185',
    bg: 'linear-gradient(135deg, rgba(251,113,133,0.3) 0%, rgba(249,115,22,0.3) 100%)',
    borderGlow: 'rgba(251,113,133,0.3)',
    image: 'https://images.unsplash.com/photo-1758525861742-fef623c2ad2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=60',
    Icon: Users,
    stat1: { label: 'Members', value: '18' },
    stat2: { label: 'Notes', value: '29' },
    stat3: { label: 'Quiz On', value: 'Yes' },
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slides[current];

  return (
    <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: 280 }}>
      {/* Background with image */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            background: '#0F172A',
          }}
        >
          {/* Blurred background image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px) brightness(0.25)',
          }} />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: slide.bg,
          }} />

          {/* Border glow */}
          <div style={{
            position: 'absolute', inset: 0,
            border: `1px solid ${slide.borderGlow}`,
            borderRadius: '20px',
            pointerEvents: 'none',
            boxShadow: `inset 0 0 60px ${slide.borderGlow}25`,
          }} />

          {/* Content */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center',
            padding: '0 40px',
            gap: 40,
          }}>
            {/* Left - Text */}
            <div style={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: `${slide.badgeColor}20`,
                  border: `1px solid ${slide.badgeColor}40`,
                  borderRadius: '20px', padding: '4px 12px',
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: slide.badgeColor,
                    boxShadow: `0 0 6px ${slide.badgeColor}`,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                  <span style={{ color: slide.badgeColor, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' }}>
                    {slide.badge}
                  </span>
                </div>

                <h2 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  margin: '0 0 8px',
                  fontFamily: 'Orbitron, sans-serif',
                }}>
                  {slide.title}
                </h2>
                <p style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.875rem', marginBottom: 20 }}>
                  {slide.subtitle}
                </p>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                  {[slide.stat1, slide.stat2, slide.stat3].map((stat, i) => (
                    <div key={i}>
                      <div style={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: 'white',
                      }}>
                        {stat.value}
                      </div>
                      <div style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.7rem' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: `linear-gradient(135deg, ${slide.ctaColor}, ${slide.ctaColor}cc)`,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 24px',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: `0 0 20px ${slide.ctaColor}40`,
                  }}
                >
                  {slide.cta} →
                </motion.button>
              </motion.div>
            </div>

            {/* Right - Image */}
            <div style={{
              width: 220, height: 200, borderRadius: '16px',
              overflow: 'hidden', flexShrink: 0,
              border: `1px solid ${slide.borderGlow}`,
              boxShadow: `0 0 30px ${slide.borderGlow}`,
            }}>
              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={prev}
        style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white',
        }}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white',
        }}
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 10,
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            style={{
              width: i === current ? 24 : 8,
              height: 8, borderRadius: 4,
              background: i === current ? slide.ctaColor : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: i === current ? `0 0 8px ${slide.ctaColor}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
