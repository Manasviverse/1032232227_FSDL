import { motion } from 'motion/react';
import { Users, BookOpen, Zap, Trophy, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { XPMeter } from '../components/XPMeter';
import { ActivityFeed } from '../components/ActivityFeed';
import { LeaderboardWidget } from '../components/LeaderboardWidget';
import { QuizTimerWidget } from '../components/QuizTimerWidget';
import { GlassCard, StatCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { studyRoomService, type ApiStudyRoom } from '../services/studyRoomService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allRooms, setAllRooms] = useState<ApiStudyRoom[]>([]);

  useEffect(() => {
    studyRoomService.getAll().then(setAllRooms).catch(() => {});
  }, []);

  const quickStats = [
    { label: 'Study Hours', value: '30.5h', icon: <BookOpen size={18} />, color: '#2F80ED', change: '↑ 12% this week' },
    { label: 'Quiz Wins', value: user?.quizWins ?? 0, icon: <Zap size={18} />, color: '#FACC15', change: '↑ 3 this week' },
    { label: 'Active Rooms', value: allRooms.filter(r => r.activeNow).length || 6, icon: <Users size={18} />, color: '#7B61FF', change: '2 live now' },
    { label: 'XP Earned', value: user?.xp?.toLocaleString() ?? '0', icon: <Trophy size={18} />, color: '#2DD4BF', change: '↑ 8% this week' },
  ];

  const activeRooms = allRooms.filter(r => r.activeNow).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Quick Stats */}
      <div className="grid-resp-4">
        {quickStats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.05} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(0px, calc(100% - 358px), 1fr) minmax(0, 340px)', gap: 18, flexWrap: 'wrap' }} className="dashboard-main-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Active Study Rooms */}
          <GlassCard className="p-5" delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Active Study Rooms</h3>
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem' }}>Join a live session</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => navigate('/study-rooms')}
                  style={{
                    background: 'rgba(47,128,237,0.1)', border: '1px solid rgba(47,128,237,0.25)',
                    borderRadius: '8px', padding: '5px 12px', color: '#2F80ED',
                    fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  View All
                </button>
                <button
                  onClick={() => navigate('/study-rooms')}
                  style={{
                    background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
                    border: 'none', borderRadius: '8px', padding: '5px 12px',
                    color: 'white', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 4,
                    boxShadow: '0 0 12px rgba(47,128,237,0.3)',
                  }}
                >
                  <Plus size={12} /> Create Room
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeRooms.map((room, i) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                  whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.12)' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 14px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => navigate(`/study-rooms`)}
                >
                  {/* Room Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: room.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                  }}>
                    {room.icon}
                  </div>

                  {/* Room Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{room.name}</p>
                      {room.hasQuiz && (
                        <span style={{
                          background: 'rgba(250,204,21,0.15)',
                          border: '1px solid rgba(250,204,21,0.3)',
                          borderRadius: '4px', padding: '1px 6px',
                          color: '#FACC15', fontSize: '0.6rem', fontWeight: 600,
                        }}>
                          QUIZ LIVE
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem' }}>
                        <Users size={10} style={{ display: 'inline', marginRight: 3 }} />
                        {room.members}/{room.maxMembers} members
                      </span>
                      <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem' }}>
                        <BookOpen size={10} style={{ display: 'inline', marginRight: 3 }} />
                        {room.resources} resources
                      </span>
                    </div>
                  </div>

                  {/* Member Avatars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex' }}>
                      {room.memberAvatars.slice(0, 3).map((member, mi) => (
                        <div key={mi} style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: member.color + '40',
                          border: `2px solid #0F172A`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.55rem', fontWeight: 700, color: member.color,
                          marginLeft: mi > 0 ? -8 : 0, zIndex: 3 - mi,
                        }}>
                          {member.initials}
                        </div>
                      ))}
                      {room.memberAvatars.length > 3 && (
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: 'rgba(255,255,255,0.08)',
                          border: '2px solid #0F172A',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.5rem', color: 'rgba(226,232,240,0.6)',
                          marginLeft: -8,
                        }}>
                          +{room.members - 3}
                        </div>
                      )}
                    </div>

                    {/* Active indicator */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: 'rgba(52,211,153,0.1)',
                      border: '1px solid rgba(52,211,153,0.2)',
                      borderRadius: '6px', padding: '3px 7px',
                    }}>
                      <div style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: '#34D399', boxShadow: '0 0 4px #34D399',
                      }} />
                      <span style={{ color: '#34D399', fontSize: '0.6rem', fontWeight: 600 }}>LIVE</span>
                    </div>

                    <ArrowRight size={14} style={{ color: 'rgba(226,232,240,0.3)' }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Activity Feed */}
          <ActivityFeed />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <XPMeter />
          <LeaderboardWidget />
          <QuizTimerWidget />
        </div>
      </div>
    </div>
  );
}
