import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Zap, Flame, BookOpen, TrendingUp } from 'lucide-react';
import { users, currentUser } from '../data/mockData';
import { GlassCard } from '../components/GlassCard';

const filters = ['Weekly', 'Monthly', 'All-Time'];

const rankEmoji = ['👑', '🥈', '🥉'];
const podiumHeights = [200, 160, 130];
const podiumColors = ['#FACC15', '#94A3B8', '#CD7F32'];
const podiumGlow = [
  'rgba(250,204,21,0.4)',
  'rgba(148,163,184,0.25)',
  'rgba(205,127,50,0.3)',
];
const podiumGradients = [
  'linear-gradient(180deg, rgba(250,204,21,0.2) 0%, rgba(250,204,21,0.05) 100%)',
  'linear-gradient(180deg, rgba(148,163,184,0.15) 0%, rgba(148,163,184,0.03) 100%)',
  'linear-gradient(180deg, rgba(205,127,50,0.15) 0%, rgba(205,127,50,0.03) 100%)',
];
const podiumOrder = [1, 0, 2]; // left is 2nd, center is 1st, right is 3rd

export default function Leaderboard() {
  const [activeFilter, setActiveFilter] = useState('Weekly');
  const top3 = users.slice(0, 3);
  const restUsers = users.slice(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
            Leaderboard
          </h2>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem', marginTop: 4 }}>
            Compete, rank up, and earn glory
          </p>
        </div>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: 4 }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? 'rgba(250,204,21,0.15)' : 'transparent',
                border: activeFilter === f ? '1px solid rgba(250,204,21,0.35)' : '1px solid transparent',
                borderRadius: '8px', padding: '6px 16px',
                color: activeFilter === f ? '#FACC15' : 'rgba(226,232,240,0.5)',
                fontSize: '0.8rem', cursor: 'pointer', fontWeight: activeFilter === f ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Section */}
      <GlassCard className="p-8" style={{ overflow: 'visible' }}>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.72rem', textAlign: 'center', marginBottom: 20, letterSpacing: '2px', textTransform: 'uppercase' }}>
          ⭐ Top Performers ⭐
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12 }}>
          {podiumOrder.map((userIndex, podiumPos) => {
            const user = top3[userIndex];
            const isFirst = userIndex === 0;
            const height = podiumHeights[podiumPos];
            const color = podiumColors[userIndex];
            const glow = podiumGlow[userIndex];
            const gradient = podiumGradients[userIndex];

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: podiumPos * 0.15 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 160 }}
              >
                {/* User Info Above Podium */}
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  {/* Rank Emoji */}
                  <motion.div
                    animate={isFirst ? { y: [0, -6, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: isFirst ? '1.8rem' : '1.3rem', marginBottom: 6 }}
                  >
                    {rankEmoji[userIndex]}
                  </motion.div>

                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    style={{
                      width: isFirst ? 70 : 58, height: isFirst ? 70 : 58,
                      borderRadius: '50%', margin: '0 auto 8px',
                      background: `radial-gradient(circle at 35% 35%, ${user.color}80, ${user.color}30)`,
                      border: `3px solid ${color}`,
                      boxShadow: `0 0 20px ${glow}, 0 0 40px ${glow}50`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isFirst ? '0.9rem' : '0.75rem',
                      fontWeight: 700, color: 'white',
                      animation: isFirst ? 'badge-glow 2s ease-in-out infinite' : 'none',
                      position: 'relative',
                    }}
                  >
                    {user.avatar}
                    {/* Crown for first */}
                    {isFirst && (
                      <div style={{
                        position: 'absolute', top: -14,
                        fontSize: '1.2rem',
                        filter: 'drop-shadow(0 0 4px #FACC15)',
                      }}>
                        👑
                      </div>
                    )}
                  </motion.div>

                  <p style={{
                    color: isFirst ? '#FACC15' : 'white',
                    fontSize: isFirst ? '0.9rem' : '0.8rem',
                    fontWeight: 700, margin: '0 0 2px',
                    textShadow: isFirst ? '0 0 10px rgba(250,204,21,0.5)' : 'none',
                  }}>
                    {user.name.split(' ')[0]}
                  </p>

                  {/* Badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    background: `${user.badgeColor}15`,
                    border: `1px solid ${user.badgeColor}35`,
                    borderRadius: '10px', padding: '2px 8px',
                    marginBottom: 6,
                  }}>
                    <span style={{ color: user.badgeColor, fontSize: '0.62rem', fontWeight: 600 }}>
                      {user.badge}
                    </span>
                  </div>

                  {/* XP */}
                  <p style={{
                    color: color,
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '1rem', fontWeight: 800,
                    textShadow: `0 0 10px ${glow}`,
                    margin: 0,
                  }}>
                    {user.xp.toLocaleString()}
                    <span style={{ fontSize: '0.6rem', opacity: 0.7, marginLeft: 3 }}>XP</span>
                  </p>
                </div>

                {/* Podium Platform */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: podiumPos * 0.15 + 0.3, duration: 0.5, ease: 'easeOut' }}
                  style={{
                    width: '100%',
                    height,
                    background: gradient,
                    border: `1px solid ${color}30`,
                    borderBottom: 'none',
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 -10px 30px ${glow}`,
                    transformOrigin: 'bottom',
                  }}
                >
                  {/* Rank Number */}
                  <p style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: isFirst ? '3rem' : '2.5rem',
                    fontWeight: 900,
                    color: `${color}25`,
                    position: 'absolute',
                    bottom: 10,
                    userSelect: 'none',
                  }}>
                    {userIndex + 1}
                  </p>
                  {/* Shine effect */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
                  }} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Ground line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(250,204,21,0.3), transparent)', marginTop: 0 }} />
      </GlassCard>

      {/* Bottom Section */}
      <div className="leaderboard-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Leaderboard Table */}
        <GlassCard className="p-5">
          <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 16px' }}>
            Full Rankings
          </h3>

          {/* Column Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 36px 1fr 80px 80px 60px',
            gap: 8, padding: '0 10px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 8,
          }}>
            {['Rank', '', 'Student', 'XP', 'Streak', 'Wins'].map(h => (
              <p key={h} style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>{h}</p>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {users.map((user, i) => {
              const isCurrentUser = user.rank === currentUser.rank;
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.04)' }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 36px 1fr 80px 80px 60px',
                    gap: 8, padding: '10px',
                    borderRadius: '12px',
                    background: isCurrentUser ? 'rgba(47,128,237,0.08)' : 'rgba(255,255,255,0.01)',
                    border: isCurrentUser ? '1px solid rgba(47,128,237,0.2)' : '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Rank */}
                  <div style={{ textAlign: 'center' }}>
                    {i < 3 ? (
                      <span style={{ fontSize: '1.1rem' }}>{rankEmoji[i]}</span>
                    ) : (
                      <span style={{
                        color: 'rgba(226,232,240,0.4)',
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: '0.75rem', fontWeight: 700,
                      }}>
                        #{user.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 30, height: 30, borderRadius: '10px',
                    background: user.color + '25', border: `1px solid ${user.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 700, color: user.color,
                    boxShadow: i < 3 ? `0 0 8px ${user.color}30` : 'none',
                  }}>
                    {user.avatar}
                  </div>

                  {/* Name + Badge */}
                  <div>
                    <p style={{
                      color: isCurrentUser ? '#2F80ED' : 'white',
                      fontSize: '0.82rem', fontWeight: 600, margin: 0,
                    }}>
                      {user.name} {isCurrentUser && <span style={{ color: '#FACC15', fontSize: '0.65rem' }}>(You)</span>}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{
                        background: user.badgeColor + '15', border: `1px solid ${user.badgeColor}30`,
                        borderRadius: '4px', padding: '1px 5px',
                        color: user.badgeColor, fontSize: '0.58rem',
                      }}>
                        {user.badge}
                      </span>
                      <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.65rem' }}>Lv.{user.level}</span>
                    </div>
                  </div>

                  {/* XP with bar */}
                  <div>
                    <p style={{
                      color: i < 3 ? [podiumColors[0], podiumColors[1], podiumColors[2]][i] : 'rgba(226,232,240,0.7)',
                      fontSize: '0.8rem', fontWeight: 700, margin: '0 0 3px',
                      fontFamily: 'Orbitron, sans-serif',
                    }}>
                      {user.xp.toLocaleString()}
                    </p>
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.xp / users[0].xp) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.05 + 0.3 }}
                        style={{
                          height: '100%', borderRadius: 2,
                          background: user.color,
                          boxShadow: `0 0 4px ${user.color}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Streak */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={11} style={{ color: '#F97316' }} />
                    <span style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.78rem' }}>{user.streak}d</span>
                  </div>

                  {/* Quiz Wins */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Zap size={11} style={{ color: '#FACC15' }} />
                    <span style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.78rem' }}>{user.quizWins}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Right Panel - Badges & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Your Position */}
          <GlassCard className="p-5" delay={0.1}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', marginBottom: 12 }}>Your Position</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, color: 'white',
                boxShadow: '0 0 16px rgba(47,128,237,0.4)',
              }}>
                {currentUser.avatar}
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>
                  Rank #{currentUser.rank}
                </p>
                <p style={{ color: '#34D399', fontSize: '0.72rem' }}>↑ Up 2 this week!</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ color: '#FACC15', fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  {currentUser.xp.toLocaleString()}
                </p>
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem' }}>XP</p>
              </div>
            </div>

            {/* Gap to next rank */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.7rem' }}>You</span>
                <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.7rem' }}>
                  {users[currentUser.rank - 2]?.name.split(' ')[0]} (#{currentUser.rank - 1})
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2F80ED, #7B61FF)',
                    borderRadius: 3,
                    boxShadow: '0 0 8px rgba(47,128,237,0.5)',
                  }}
                />
              </div>
              <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.68rem', marginTop: 4, textAlign: 'center' }}>
                {(users[currentUser.rank - 2]?.xp || 0) - currentUser.xp} XP to rank up
              </p>
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="p-5" delay={0.2}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', marginBottom: 12 }}>Quick Stats</p>
            {[
              { icon: <Zap size={14} />, label: 'Quiz Wins', value: currentUser.quizWins, color: '#FACC15' },
              { icon: <Flame size={14} />, label: 'Study Streak', value: `${currentUser.streak} days`, color: '#F97316' },
              { icon: <BookOpen size={14} />, label: 'Resources Shared', value: currentUser.resourcesShared, color: '#2DD4BF' },
              { icon: <TrendingUp size={14} />, label: 'Current Level', value: `Lv. ${currentUser.level}`, color: '#7B61FF' },
            ].map(stat => (
              <div key={stat.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.78rem', flex: 1 }}>{stat.label}</span>
                <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: 600 }}>{stat.value}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
