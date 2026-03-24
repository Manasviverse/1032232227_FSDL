import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, ChevronRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useNavigate } from 'react-router';

const TOTAL_TIME = 300; // 5 minutes to next quiz

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const R = 42;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function QuizTimerWidget() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(178); // 2:58 remaining

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = timeLeft / TOTAL_TIME;
  const offset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = timeLeft < 60;

  const color = isUrgent ? '#FB7185' : timeLeft < 120 ? '#FACC15' : '#2F80ED';

  return (
    <GlassCard className="p-5" delay={0.25}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '10px',
          background: 'rgba(250,204,21,0.12)',
          border: '1px solid rgba(250,204,21,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FACC15',
        }}>
          <Zap size={15} />
        </div>
        <div>
          <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.72rem' }}>Next Quiz Starts</p>
          <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>DSA Battle Royale</p>
        </div>
      </div>

      {/* Timer Ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={100} height={100} viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx={50} cy={50} r={R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={8}
            />
            {/* Progress */}
            <motion.circle
              cx={50} cy={50} r={R}
              fill="none"
              stroke={color}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
                transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
              }}
            />
            {/* Pulse ring */}
            {isUrgent && (
              <circle
                cx={50} cy={50} r={R + 4}
                fill="none"
                stroke={color}
                strokeWidth={1}
                opacity={0.3}
                style={{ animation: 'pulse 1s ease-in-out infinite' }}
              />
            )}
          </svg>
          {/* Center text */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{
              color,
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '1rem', fontWeight: 700,
              lineHeight: 1,
              filter: `drop-shadow(0 0 4px ${color})`,
            }}>
              {formatTime(timeLeft)}
            </p>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.55rem', marginTop: 2 }}>
              remaining
            </p>
          </div>
        </div>

        {/* Quiz Info */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.65rem', marginBottom: 2 }}>Subject</p>
            <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Data Structures & Algo</p>
          </div>
          <div style={{ marginBottom: 8 }}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.65rem', marginBottom: 2 }}>Questions</p>
            <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>10 Questions • 5 pts each</p>
          </div>
          <div>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.65rem', marginBottom: 2 }}>Players Ready</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex' }}>
                {['AS','ND','KR','RV'].map((initials, i) => (
                  <div key={i} style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: ['#7B61FF','#2F80ED','#2DD4BF','#FACC15'][i] + '80',
                    border: '1.5px solid #0F172A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.5rem', fontWeight: 700, color: 'white',
                    marginLeft: i > 0 ? -6 : 0,
                  }}>
                    {initials}
                  </div>
                ))}
              </div>
              <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.7rem' }}>+24 others</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 14,
      }}>
        {[
          { label: 'Prize', value: '500 XP', color: '#FACC15' },
          { label: 'Difficulty', value: 'Hard', color: '#FB7185' },
          { label: 'Duration', value: '10 min', color: '#2DD4BF' },
        ].map((stat) => (
          <div key={stat.label} style={{
            flex: 1, textAlign: 'center',
            background: `${stat.color}0D`,
            border: `1px solid ${stat.color}25`,
            borderRadius: '8px', padding: '6px 4px',
          }}>
            <p style={{ color: stat.color, fontSize: '0.75rem', fontWeight: 700 }}>{stat.value}</p>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.6rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Join Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/quiz-arena')}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
          border: 'none', borderRadius: '12px',
          padding: '10px',
          color: 'white', fontWeight: 600, fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(47,128,237,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}
      >
        <Zap size={14} />
        Join Quiz Arena
        <ChevronRight size={14} />
      </motion.button>
    </GlassCard>
  );
}
