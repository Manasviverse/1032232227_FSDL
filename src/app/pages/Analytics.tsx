import { motion } from 'motion/react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';
import { TrendingUp, BookOpen, Zap, Users, Clock, Award } from 'lucide-react';
import { studyHoursData, quizPerformanceData, contributionData, weeklyStats } from '../data/mockData';
import { GlassCard, StatCard } from '../components/GlassCard';

const customTooltipStyle = {
  contentStyle: {
    background: 'rgba(15,23,42,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '0.78rem',
  },
};

export default function Analytics() {
  const stats = [
    { label: 'Study Hours', value: `${weeklyStats.studyHours}h`, icon: <Clock size={18} />, color: '#2F80ED', change: '↑ 12% vs last week' },
    { label: 'Quizzes Taken', value: weeklyStats.quizzesTaken, icon: <Zap size={18} />, color: '#FACC15', change: '↑ 5 more than last week' },
    { label: 'XP Earned', value: weeklyStats.xpEarned.toLocaleString(), icon: <Award size={18} />, color: '#7B61FF', change: '↑ 8% vs last week' },
    { label: 'Rooms Joined', value: weeklyStats.roomsJoined, icon: <Users size={18} />, color: '#2DD4BF', change: 'Across 4 subjects' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
          Analytics Dashboard
        </h2>
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem', marginTop: 4 }}>
          Your learning performance — last 7 days
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-resp-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.05} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="analytics-charts-1" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18 }}>
        {/* Study Hours Line Chart */}
        <GlassCard className="p-6" delay={0.1}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', margin: 0 }}>Weekly Overview</p>
            <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '4px 0 0' }}>Study Hours & Quiz Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={studyHoursData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2F80ED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2F80ED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="quizGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...customTooltipStyle} />
              <Legend
                wrapperStyle={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.75rem' }}
              />
              <Area
                type="monotone" dataKey="hours" name="Study Hours"
                stroke="#2F80ED" strokeWidth={2}
                fill="url(#hoursGrad)"
                dot={{ fill: '#2F80ED', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#2F80ED' }}
              />
              <Area
                type="monotone" dataKey="quizzes" name="Quizzes"
                stroke="#7B61FF" strokeWidth={2}
                fill="url(#quizGrad)"
                dot={{ fill: '#7B61FF', strokeWidth: 0, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Resource Pie Chart */}
        <GlassCard className="p-6" delay={0.15}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', margin: 0 }}>Contributions</p>
            <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '4px 0 0' }}>Resource Types Shared</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={contributionData}
                  cx={90} cy={90}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {contributionData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      style={{ filter: `drop-shadow(0 0 4px ${entry.color}60)` }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {contributionData.map(item => (
                <div key={item.name} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 8,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 4px ${item.color}`,
                    flexShrink: 0,
                  }} />
                  <span style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.75rem', flex: 1 }}>{item.name}</span>
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-resp-2" style={{ gap: 18 }}>
        {/* Quiz Performance Bar Chart */}
        <GlassCard className="p-6" delay={0.2}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', margin: 0 }}>Performance</p>
            <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '4px 0 0' }}>Quiz Scores by Subject</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quizPerformanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="subject" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...customTooltipStyle} />
              <Bar dataKey="score" name="Score %" radius={[6, 6, 0, 0]}>
                {quizPerformanceData.map((entry, index) => {
                  const colors = ['#2F80ED', '#7B61FF', '#2DD4BF', '#FACC15', '#FB7185'];
                  return (
                    <Cell
                      key={index}
                      fill={colors[index]}
                      style={{ filter: `drop-shadow(0 0 4px ${colors[index]}60)` }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Achievement Progress */}
        <GlassCard className="p-6" delay={0.25}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', margin: 0 }}>Goals</p>
            <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '4px 0 0' }}>Achievement Progress</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Quiz Master (47/50 wins)', progress: 94, color: '#FACC15', icon: '🏆' },
              { label: 'Scholar+ (31/40 levels)', progress: 78, color: '#7B61FF', icon: '📚' },
              { label: 'Streak Champion (14/21 days)', progress: 67, color: '#F97316', icon: '🔥' },
              { label: 'Top Contributor (22/30 resources)', progress: 73, color: '#2DD4BF', icon: '⭐' },
              { label: 'Perfectionist (4/10 perfect quizzes)', progress: 40, color: '#FB7185', icon: '💎' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.3 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                    <span style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.75rem' }}>{item.label}</span>
                  </div>
                  <span style={{ color: item.color, fontSize: '0.75rem', fontWeight: 600 }}>{item.progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.5, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${item.color}99, ${item.color})`,
                      borderRadius: 3,
                      boxShadow: `0 0 6px ${item.color}60`,
                      position: 'relative',
                    }}
                  >
                    {/* Shimmer */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Level Progression Path */}
      <GlassCard className="p-6" delay={0.3}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', margin: 0 }}>Journey</p>
          <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '4px 0 0' }}>Level Progression Path</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-none">
          {[
            { name: 'Beginner', level: '1-10', emoji: '🌱', color: '#34D399', done: true },
            { name: 'Learner', level: '11-20', emoji: '📖', color: '#2DD4BF', done: true },
            { name: 'Scholar', level: '21-30', emoji: '🎓', color: '#2F80ED', done: true },
            { name: 'Scholar+', level: '31-40', emoji: '⚡', color: '#7B61FF', current: true },
            { name: 'Master', level: '41-50', emoji: '🏆', color: '#FACC15', done: false },
            { name: 'Legend', level: '51+', emoji: '👑', color: '#FB7185', done: false },
          ].map((stage, i, arr) => (
            <div key={stage.name} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}
              >
                <div style={{
                  width: stage.current ? 56 : 44,
                  height: stage.current ? 56 : 44,
                  borderRadius: '50%',
                  background: stage.done || stage.current ? `${stage.color}25` : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${stage.done || stage.current ? stage.color : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: stage.current ? '1.5rem' : '1.2rem',
                  boxShadow: stage.current ? `0 0 20px ${stage.color}60, 0 0 40px ${stage.color}30` : stage.done ? `0 0 10px ${stage.color}30` : 'none',
                  transition: 'all 0.3s',
                  animation: stage.current ? 'badge-glow 2s ease-in-out infinite' : 'none',
                }}>
                  {stage.emoji}
                </div>
                <p style={{
                  color: stage.current ? stage.color : stage.done ? 'rgba(226,232,240,0.6)' : 'rgba(226,232,240,0.3)',
                  fontSize: '0.72rem', fontWeight: stage.current ? 700 : 400,
                  margin: '6px 0 2px', textAlign: 'center',
                }}>
                  {stage.name}
                </p>
                <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.6rem' }}>{stage.level}</p>
                {stage.current && (
                  <div style={{
                    background: stage.color + '20', border: `1px solid ${stage.color}40`,
                    borderRadius: '10px', padding: '2px 6px', marginTop: 3,
                  }}>
                    <span style={{ color: stage.color, fontSize: '0.58rem', fontWeight: 600 }}>YOU ARE HERE</span>
                  </div>
                )}
              </motion.div>

              {/* Connector */}
              {i < arr.length - 1 && (
                <div style={{
                  height: 2, width: 40, flexShrink: 0,
                  background: i < 3
                    ? `linear-gradient(90deg, ${arr[i].color}, ${arr[i + 1].color})`
                    : 'rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  marginBottom: 24,
                }} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
