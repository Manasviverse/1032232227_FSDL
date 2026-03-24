import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Zap, Plus, Search, Filter, ArrowRight } from 'lucide-react';
import { studyRooms } from '../data/mockData';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';

const filters = ['All', 'Active', 'Has Quiz', 'Mathematics', 'CS Core', 'AI / ML', 'Physics'];

export default function StudyRooms() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);

  const filtered = studyRooms.filter(room => {
    const matchSearch = room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All'
      ? true : activeFilter === 'Active' ? room.activeNow
      : activeFilter === 'Has Quiz' ? room.hasQuiz
      : room.subject === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif', color: 'white',
            margin: 0, fontSize: '1.3rem', fontWeight: 700,
          }}>
            Study Rooms
          </h2>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem', marginTop: 4 }}>
            {studyRooms.length} rooms • {studyRooms.filter(r => r.activeNow).length} active now
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
            border: 'none', borderRadius: '12px',
            padding: '10px 20px',
            color: 'white', fontWeight: 600, fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(47,128,237,0.4)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Plus size={16} /> Create Room
        </motion.button>
      </div>

      {/* Search & Filters */}
      <GlassCard className="p-4" animate={false} hover={false} style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '8px 14px', flex: 1, minWidth: 200,
          }}>
            <Search size={14} style={{ color: 'rgba(226,232,240,0.4)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search study rooms..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'rgba(226,232,240,0.8)', fontSize: '0.85rem', width: '100%',
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  background: activeFilter === f ? 'rgba(47,128,237,0.2)' : 'rgba(255,255,255,0.04)',
                  border: activeFilter === f ? '1px solid rgba(47,128,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px', padding: '5px 14px',
                  color: activeFilter === f ? '#2F80ED' : 'rgba(226,232,240,0.5)',
                  fontSize: '0.75rem', fontWeight: activeFilter === f ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: activeFilter === f ? '0 0 10px rgba(47,128,237,0.2)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Room Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onHoverStart={() => setHoveredRoom(room.id)}
            onHoverEnd={() => setHoveredRoom(null)}
            onClick={() => navigate(`/study-rooms/${room.id}`)}
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${hoveredRoom === room.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.3s ease',
              boxShadow: hoveredRoom === room.id ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
            }}
          >
            {/* Card Header with gradient */}
            <div style={{
              height: 120, background: room.gradient,
              position: 'relative', padding: '16px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              {/* Overlay pattern */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <span style={{ fontSize: '2rem' }}>{room.icon}</span>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {room.activeNow && (
                    <span style={{
                      background: 'rgba(52,211,153,0.2)', backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(52,211,153,0.4)', borderRadius: '6px',
                      padding: '2px 8px', color: '#34D399', fontSize: '0.6rem', fontWeight: 700,
                    }}>
                      LIVE
                    </span>
                  )}
                  {room.hasQuiz && (
                    <span style={{
                      background: 'rgba(250,204,21,0.2)', backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(250,204,21,0.4)', borderRadius: '6px',
                      padding: '2px 8px', color: '#FACC15', fontSize: '0.6rem', fontWeight: 700,
                    }}>
                      QUIZ ⚡
                    </span>
                  )}
                </div>
              </div>

              {/* Member bar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  height: 4, borderRadius: 2,
                  background: 'rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${(room.members / room.maxMembers) * 100}%`,
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '16px' }}>
              <h3 style={{
                color: 'white', fontSize: '0.9rem', fontWeight: 600,
                margin: '0 0 4px',
              }}>
                {room.name}
              </h3>
              <p style={{
                color: 'rgba(226,232,240,0.4)', fontSize: '0.72rem',
                margin: '0 0 12px', lineHeight: 1.4,
              }}>
                {room.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                {room.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px', padding: '2px 8px',
                    color: 'rgba(226,232,240,0.6)', fontSize: '0.65rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Users size={11} /> {room.members}/{room.maxMembers}
                  </span>
                  <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <BookOpen size={11} /> {room.resources}
                  </span>
                </div>
                {/* Avatars */}
                <div style={{ display: 'flex' }}>
                  {room.memberAvatars.slice(0, 3).map((m, mi) => (
                    <div key={mi} style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: m.color + '30',
                      border: `2px solid #0F172A`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.48rem', fontWeight: 700, color: m.color,
                      marginLeft: mi > 0 ? -6 : 0,
                    }}>
                      {m.initials}
                    </div>
                  ))}
                </div>
              </div>

              {/* Join Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%',
                  background: 'rgba(47,128,237,0.1)',
                  border: '1px solid rgba(47,128,237,0.3)',
                  borderRadius: '10px', padding: '8px',
                  color: '#2F80ED', fontWeight: 600, fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.2s',
                }}
              >
                Join Room <ArrowRight size={13} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <GlassCard className="p-12" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</p>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.875rem' }}>
            No study rooms match your search.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
