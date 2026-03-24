import { motion } from 'motion/react';
import { Trophy, TrendingUp } from 'lucide-react';
import { users } from '../data/mockData';
import { GlassCard } from './GlassCard';
import { useNavigate } from 'react-router';

const rankColors = ['#FACC15', '#94A3B8', '#CD7F32'];
const rankGlow = ['rgba(250,204,21,0.4)', 'rgba(148,163,184,0.3)', 'rgba(205,127,50,0.3)'];
const rankEmoji = ['👑', '🥈', '🥉'];

export function LeaderboardWidget() {
  const navigate = useNavigate();
  const top5 = users.slice(0, 5);

  return (
    <GlassCard className="p-5" delay={0.15}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '10px',
            background: 'rgba(250,204,21,0.12)',
            border: '1px solid rgba(250,204,21,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FACC15',
          }}>
            <Trophy size={15} />
          </div>
          <div>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.72rem' }}>This Week</p>
            <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Leaderboard</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: 'transparent', border: 'none',
            color: '#2F80ED', fontSize: '0.72rem',
            cursor: 'pointer', fontWeight: 500,
          }}
        >
          Full View →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {top5.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 + 0.2 }}
            whileHover={{ x: 4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: '12px',
              background: i < 3 ? `${rankColors[i]}08` : 'rgba(255,255,255,0.02)',
              border: i < 3 ? `1px solid ${rankColors[i]}20` : '1px solid rgba(255,255,255,0.04)',
              boxShadow: i === 0 ? `0 0 12px ${rankGlow[0]}` : 'none',
              cursor: 'pointer',
            }}
          >
            {/* Rank */}
            <div style={{
              width: 24, textAlign: 'center',
              fontSize: i < 3 ? '1rem' : '0.75rem',
              color: i < 3 ? rankColors[i] : 'rgba(226,232,240,0.4)',
              fontWeight: 700,
              flexShrink: 0,
              fontFamily: i >= 3 ? 'Orbitron, sans-serif' : 'inherit',
            }}>
              {i < 3 ? rankEmoji[i] : `#${user.rank}`}
            </div>

            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: '10px',
              background: `${user.color}25`,
              border: `1px solid ${user.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: user.color,
              flexShrink: 0,
              boxShadow: i < 3 ? `0 0 8px ${user.color}30` : 'none',
            }}>
              {user.avatar}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: i === 0 ? '#FACC15' : 'white',
                fontSize: '0.78rem', fontWeight: 600,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.name.split(' ')[0]}
              </p>
              <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem' }}>
                Lv.{user.level} • {user.badge}
              </p>
            </div>

            {/* XP */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{
                color: i < 3 ? rankColors[i] : 'rgba(226,232,240,0.8)',
                fontSize: '0.8rem', fontWeight: 700,
                fontFamily: 'Orbitron, sans-serif',
              }}>
                {user.xp.toLocaleString()}
              </p>
              <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.6rem' }}>XP</p>
            </div>

            {/* XP Bar */}
            <div style={{ width: 36 }}>
              <div style={{
                height: 3, borderRadius: 2,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.xp / user.totalXP) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.4 }}
                  style={{
                    height: '100%',
                    background: user.color,
                    borderRadius: 2,
                    boxShadow: `0 0 4px ${user.color}`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trending */}
      <div style={{
        marginTop: 12,
        padding: '8px 12px',
        background: 'rgba(52,211,153,0.06)',
        border: '1px solid rgba(52,211,153,0.15)',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <TrendingUp size={12} style={{ color: '#34D399' }} />
        <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.7rem' }}>
          You're ranked <span style={{ color: '#34D399', fontWeight: 600 }}>#4</span> — up 2 spots this week!
        </span>
      </div>
    </GlassCard>
  );
}
