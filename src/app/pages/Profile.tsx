import { motion } from 'motion/react';
import { Trophy, Zap, Flame, BookOpen, Users, Edit3, Share2 } from 'lucide-react';
import { currentUser, achievements, activities, studyHoursData } from '../data/mockData';
import { GlassCard } from '../components/GlassCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const rarityConfig = {
  common: { color: '#94A3B8', label: 'Common', glow: 'rgba(148,163,184,0.3)' },
  rare: { color: '#2F80ED', label: 'Rare', glow: 'rgba(47,128,237,0.4)' },
  epic: { color: '#7B61FF', label: 'Epic', glow: 'rgba(123,97,255,0.4)' },
  legendary: { color: '#FACC15', label: 'Legendary', glow: 'rgba(250,204,21,0.5)' },
};

export default function Profile() {
  const stats = [
    { label: 'Total XP', value: currentUser.xp.toLocaleString(), icon: <Zap size={16} />, color: '#FACC15' },
    { label: 'Quiz Wins', value: currentUser.quizWins, icon: <Trophy size={16} />, color: '#2F80ED' },
    { label: 'Study Streak', value: `${currentUser.streak}d`, icon: <Flame size={16} />, color: '#F97316' },
    { label: 'Resources', value: currentUser.resourcesShared, icon: <BookOpen size={16} />, color: '#2DD4BF' },
    { label: 'Rooms Joined', value: currentUser.joinedRooms, icon: <Users size={16} />, color: '#7B61FF' },
    { label: 'Level', value: currentUser.level, icon: '⚡', color: '#A78BFA' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Profile Header */}
      <GlassCard className="p-0 overflow-hidden" delay={0}>
        {/* Banner */}
        <div style={{
          height: 140,
          background: 'linear-gradient(135deg, #2F80ED30 0%, #7B61FF40 50%, #2DD4BF30 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Animated dots/particles background */}
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              borderRadius: '50%',
              background: ['#2F80ED', '#7B61FF', '#2DD4BF', '#FACC15'][i % 4],
              left: `${(i * 8.3 + 5)}%`,
              top: `${Math.sin(i) * 30 + 50}%`,
              opacity: 0.4,
              boxShadow: `0 0 8px ${['#2F80ED', '#7B61FF', '#2DD4BF', '#FACC15'][i % 4]}`,
              animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
            }} />
          ))}
          {/* Edit & Share buttons */}
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
            <button style={{
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
              padding: '6px 12px', color: 'rgba(226,232,240,0.8)',
              cursor: 'pointer', fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Edit3 size={12} /> Edit Profile
            </button>
            <button style={{
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
              padding: '6px 12px', color: 'rgba(226,232,240,0.8)',
              cursor: 'pointer', fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Share2 size={12} /> Share
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ padding: '0 28px 28px', marginTop: -50 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 16 }}>
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: 90, height: 90, borderRadius: '24px',
                background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
                border: '4px solid #0F172A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', fontWeight: 800, color: 'white',
                boxShadow: '0 0 30px rgba(47,128,237,0.4)',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {currentUser.avatar}
              {/* Level badge */}
              <div style={{
                position: 'absolute', bottom: -8, right: -8,
                background: '#FACC15', borderRadius: '8px',
                padding: '2px 6px', border: '2px solid #0F172A',
                color: '#0F172A', fontSize: '0.65rem', fontWeight: 800,
                boxShadow: '0 0 10px rgba(250,204,21,0.5)',
              }}>
                Lv.{currentUser.level}
              </div>
            </motion.div>

            <div style={{ flex: 1, paddingTop: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                <h1 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                  {currentUser.name}
                </h1>
                <div style={{
                  background: currentUser.badgeColor + '20',
                  border: `1px solid ${currentUser.badgeColor}40`,
                  borderRadius: '20px', padding: '3px 10px',
                  color: currentUser.badgeColor, fontSize: '0.72rem', fontWeight: 600,
                  animation: 'badge-glow 2s ease-in-out infinite',
                }}>
                  ⭐ {currentUser.badge}
                </div>
              </div>
              <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.82rem', margin: '0 0 8px' }}>
                {currentUser.username} • Rank #{currentUser.rank} globally
              </p>
              {/* XP Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  flex: 1, maxWidth: 280,
                  height: 8, borderRadius: 4,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentUser.xp / currentUser.totalXP) * 100}%` }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #2F80ED, #7B61FF, #A78BFA)',
                      borderRadius: 4,
                      boxShadow: '0 0 10px rgba(123,97,255,0.5)',
                    }}
                  />
                </div>
                <span style={{ color: '#7B61FF', fontSize: '0.75rem', fontWeight: 600 }}>
                  {currentUser.xp}/{currentUser.totalXP} XP
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.3 }}
                style={{
                  background: `${stat.color}0D`,
                  border: `1px solid ${stat.color}25`,
                  borderRadius: '12px', padding: '10px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: stat.color, display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                  {typeof stat.icon === 'string' ? <span>{stat.icon}</span> : stat.icon}
                </div>
                <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 2px' }}>{stat.value}</p>
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.62rem', margin: 0 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Bottom Grid */}
      <div className="profile-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Achievement Badges */}
          <GlassCard className="p-5" delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                🏅 Achievement Badges
              </h3>
              <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.72rem' }}>
                {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
              {achievements.map((achievement, i) => {
                const rarity = rarityConfig[achievement.rarity];
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 + 0.1 }}
                    whileHover={{ scale: 1.08 }}
                    style={{
                      background: achievement.unlocked ? `${achievement.color}10` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${achievement.unlocked ? achievement.color + '30' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '14px', padding: '12px 8px',
                      textAlign: 'center', cursor: 'pointer',
                      opacity: achievement.unlocked ? 1 : 0.4,
                      boxShadow: achievement.unlocked && achievement.rarity === 'legendary'
                        ? `0 0 15px ${rarity.glow}`
                        : achievement.unlocked ? `0 0 8px ${rarity.glow}50` : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1.6rem', marginBottom: 5, filter: achievement.unlocked ? 'none' : 'grayscale(1)' }}>
                      {achievement.icon}
                    </div>
                    <p style={{
                      color: achievement.unlocked ? 'white' : 'rgba(226,232,240,0.4)',
                      fontSize: '0.68rem', fontWeight: 600, margin: '0 0 3px', lineHeight: 1.2,
                    }}>
                      {achievement.name}
                    </p>
                    <div style={{
                      display: 'inline-block',
                      background: achievement.unlocked ? rarity.color + '20' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${achievement.unlocked ? rarity.color + '40' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '4px', padding: '1px 5px',
                    }}>
                      <span style={{
                        color: achievement.unlocked ? rarity.color : 'rgba(226,232,240,0.3)',
                        fontSize: '0.55rem', fontWeight: 600,
                      }}>
                        {rarity.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* Activity Chart */}
          <GlassCard className="p-5" delay={0.2}>
            <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 16px' }}>
              📈 Study Activity
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={studyHoursData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profileGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: 'white', fontSize: '0.75rem',
                  }}
                />
                <Area
                  type="monotone" dataKey="hours" name="Hours"
                  stroke="#7B61FF" strokeWidth={2}
                  fill="url(#profileGrad)"
                  dot={{ fill: '#7B61FF', strokeWidth: 0, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Recent Activity */}
          <GlassCard className="p-5" delay={0.15}>
            <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 14px' }}>
              📋 Activity Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activities.slice(0, 6).map((act, i) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.2 }}
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                >
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: act.userColor,
                      boxShadow: `0 0 6px ${act.userColor}`,
                      marginTop: 3,
                    }} />
                    {i < 5 && <div style={{ width: 1, flex: 1, minHeight: 16, background: 'rgba(255,255,255,0.08)', marginTop: 3 }} />}
                  </div>
                  <div>
                    <p style={{ color: 'rgba(226,232,240,0.75)', fontSize: '0.75rem', lineHeight: 1.4, margin: 0 }}>
                      <span style={{ color: 'white', fontWeight: 600 }}>{act.user.split(' ')[0]}</span>
                      {' '}{act.action}{' '}
                      <span style={{ color: act.userColor }}>{act.target}</span>
                    </p>
                    <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.62rem', marginTop: 2 }}>
                      {act.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Streak Calendar */}
          <GlassCard className="p-5" delay={0.25}>
            <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 14px' }}>
              🔥 {currentUser.streak}-Day Streak
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
              {Array.from({ length: 28 }, (_, i) => {
                const isStudied = i < 23 && (i % 8 !== 7);
                const isToday = i === 22;
                return (
                  <div
                    key={i}
                    title={isStudied ? 'Studied' : 'No study'}
                    style={{
                      height: 22, borderRadius: '5px',
                      background: isStudied
                        ? isToday ? '#F97316' : `rgba(249,115,22,${0.3 + (i / 28) * 0.5})`
                        : 'rgba(255,255,255,0.05)',
                      border: isToday ? '1px solid #F97316' : 'none',
                      boxShadow: isToday ? '0 0 8px rgba(249,115,22,0.5)' : 'none',
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.62rem' }}>Less</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0.1, 0.3, 0.5, 0.7, 1].map((o, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: '3px', background: `rgba(249,115,22,${o})` }} />
                ))}
              </div>
              <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.62rem' }}>More</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
