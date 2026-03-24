import { motion } from 'motion/react';
import { Flame, Zap, TrendingUp } from 'lucide-react';
import { currentUser } from '../data/mockData';
import { GlassCard } from './GlassCard';

const levels = [
  { name: 'Beginner', min: 0, max: 10, color: '#34D399' },
  { name: 'Learner', min: 10, max: 20, color: '#2DD4BF' },
  { name: 'Scholar', min: 20, max: 30, color: '#2F80ED' },
  { name: 'Scholar+', min: 30, max: 40, color: '#7B61FF' },
  { name: 'Master', min: 40, max: 50, color: '#FACC15' },
  { name: 'Legend', min: 50, max: 100, color: '#FB7185' },
];

function getCurrentLevelInfo(level: number) {
  return levels.find(l => level >= l.min && level < l.max) || levels[levels.length - 1];
}

export function XPMeter() {
  const xpPercent = (currentUser.xp / currentUser.totalXP) * 100;
  const levelInfo = getCurrentLevelInfo(currentUser.level);

  return (
    <GlassCard className="p-5" delay={0.1}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '10px',
            background: 'rgba(123,97,255,0.15)',
            border: '1px solid rgba(123,97,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#7B61FF',
          }}>
            <Zap size={16} />
          </div>
          <div>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.72rem' }}>XP Progress</p>
            <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Level {currentUser.level}</p>
          </div>
        </div>
        <div style={{
          background: `${levelInfo.color}20`,
          border: `1px solid ${levelInfo.color}40`,
          borderRadius: '20px',
          padding: '3px 10px',
          color: levelInfo.color,
          fontSize: '0.7rem',
          fontWeight: 600,
        }}>
          {levelInfo.name}
        </div>
      </div>

      {/* Main XP Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem' }}>
            {currentUser.xp.toLocaleString()} XP
          </span>
          <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem' }}>
            {currentUser.totalXP.toLocaleString()} XP
          </span>
        </div>
        <div style={{
          height: 12, borderRadius: 6,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2F80ED, #7B61FF, #A78BFA)',
              borderRadius: 6,
              position: 'relative',
              boxShadow: '0 0 12px rgba(123,97,255,0.6)',
            }}
          >
            {/* Shimmer */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }} />
            {/* Glow tip */}
            <div style={{
              position: 'absolute', right: -2, top: '50%', transform: 'translateY(-50%)',
              width: 12, height: 12, borderRadius: '50%',
              background: '#A78BFA',
              boxShadow: '0 0 8px #A78BFA, 0 0 16px #7B61FF',
            }} />
          </motion.div>
        </div>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem', marginTop: 4, textAlign: 'center' }}>
          {currentUser.totalXP - currentUser.xp} XP to Level {currentUser.level + 1}
        </p>
      </div>

      {/* Study Streak */}
      <div style={{
        background: 'rgba(249,115,22,0.08)',
        border: '1px solid rgba(249,115,22,0.2)',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.3rem', animation: 'streak-flame 0.8s ease-in-out infinite' }}>🔥</span>
          <div>
            <p style={{ color: '#F97316', fontSize: '0.8rem', fontWeight: 600 }}>
              {currentUser.streak} Day Streak!
            </p>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.68rem' }}>
              Keep it going!
            </p>
          </div>
        </div>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '1.4rem', fontWeight: 700,
          color: '#FACC15',
          textShadow: '0 0 10px rgba(250,204,21,0.5)',
        }}>
          🏆
        </div>
      </div>

      {/* Weekly Streak Calendar */}
      <div>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem', marginBottom: 8 }}>This Week</p>
        <div style={{ display: 'flex', gap: 5 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const studied = i < 6; // studied for 6 days
            const isToday = i === 5;
            return (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 28, borderRadius: '8px',
                  background: studied
                    ? isToday ? '#F97316' : 'rgba(249,115,22,0.4)'
                    : 'rgba(255,255,255,0.05)',
                  border: isToday ? '1px solid #F97316' : '1px solid transparent',
                  boxShadow: isToday ? '0 0 8px rgba(249,115,22,0.5)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 4,
                  fontSize: studied ? '0.7rem' : '',
                }}>
                  {studied && <Flame size={10} style={{ color: isToday ? 'white' : '#F97316' }} />}
                </div>
                <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.6rem' }}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
