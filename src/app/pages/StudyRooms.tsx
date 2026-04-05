import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, BookOpen, Plus, Search, ArrowRight, X } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { studyRoomService, type ApiStudyRoom } from '../services/studyRoomService';
import { useAuth } from '../context/AuthContext';

const filters = ['All', 'Active', 'Has Quiz', 'Mathematics', 'CS Core', 'AI / ML', 'Physics'];

const subjectOptions = ['Mathematics', 'CS Core', 'AI / ML', 'Physics', 'DBMS', 'DSA', 'Networks', 'Other'];

const roomGradients = [
  'linear-gradient(135deg, #2F80ED, #7B61FF)',
  'linear-gradient(135deg, #2DD4BF, #0D9488)',
  'linear-gradient(135deg, #FACC15, #EAB308)',
  'linear-gradient(135deg, #FB7185, #E11D48)',
  'linear-gradient(135deg, #F97316, #EA580C)',
  'linear-gradient(135deg, #A78BFA, #7C3AED)',
];

const roomIcons = ['📚', '🧠', '💻', '🔬', '🎯', '⚡', '🎮', '🌐', '📐', '🤖'];

/* ─── Create Room Modal ─── */
function CreateRoomModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (room: ApiStudyRoom) => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    subject: 'Mathematics',
    description: '',
    maxMembers: 20,
    icon: '📚',
    hasQuiz: false,
    tags: '',
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const setF = (k: string) => (v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Room name is required.'); return; }
    setError('');
    setCreating(true);

    const gradientIdx = Math.floor(Math.random() * roomGradients.length);

    try {
      const room = await studyRoomService.create({
        name: form.name.trim(),
        subject: form.subject,
        description: form.description.trim(),
        maxMembers: Number(form.maxMembers),
        icon: form.icon,
        hasQuiz: form.hasQuiz,
        gradient: roomGradients[gradientIdx],
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        members: 1,
        resources: 0,
        activeNow: true,
        memberAvatars: user ? [{ initials: (user.name ?? 'U').slice(0, 2).toUpperCase(), color: user.color ?? '#2F80ED' }] : [],
      } as any);
      onSuccess(room);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Could not create room. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
    padding: '9px 12px', color: 'rgba(226,232,240,0.9)', fontSize: '0.85rem',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { color: 'rgba(226,232,240,0.6)', fontSize: '0.78rem', marginBottom: 5, display: 'block' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(15,23,42,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: '28px 32px', width: '100%', maxWidth: 500,
          boxShadow: '0 0 0 1px rgba(47,128,237,0.1), 0 24px 80px rgba(0,0,0,0.6)',
          position: 'relative', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Top glow */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, #2F80ED, #7B61FF, transparent)', opacity: 0.6 }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Create Study Room</h3>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', marginTop: 3 }}>Start a live collaborative session</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,232,240,0.5)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Room Name */}
          <div>
            <label style={labelStyle}>Room Name *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={e => setF('name')(e.target.value)}
              placeholder="e.g. DSA Study Session"
              required
            />
          </div>

          {/* Subject + Max Members */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Subject *</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.subject} onChange={e => setF('subject')(e.target.value)}>
                {subjectOptions.map(s => (
                  <option key={s} value={s} style={{ background: '#0F172A' }}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Max Members</label>
              <input
                type="number"
                style={inputStyle}
                value={form.maxMembers}
                min={2} max={50}
                onChange={e => setF('maxMembers')(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, resize: 'none', height: 72 }}
              value={form.description}
              onChange={e => setF('description')(e.target.value)}
              placeholder="What will you study in this room?"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label style={labelStyle}>Room Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {roomIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setF('icon')(icon)}
                  style={{
                    width: 38, height: 38, borderRadius: 10, fontSize: '1.2rem',
                    background: form.icon === icon ? 'rgba(47,128,237,0.2)' : 'rgba(255,255,255,0.04)',
                    border: form.icon === icon ? '1px solid rgba(47,128,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input
              style={inputStyle}
              value={form.tags}
              onChange={e => setF('tags')(e.target.value)}
              placeholder="e.g. arrays, trees, graph"
            />
          </div>

          {/* Has Quiz */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setF('hasQuiz')(!form.hasQuiz)}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: form.hasQuiz ? 'linear-gradient(90deg, #2F80ED, #7B61FF)' : 'rgba(255,255,255,0.1)',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', padding: 0,
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: 'white', position: 'absolute', top: 3,
                left: form.hasQuiz ? 21 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
            <span style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.82rem' }}>Enable Quiz Mode ⚡</span>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ color: '#FB7185', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={creating}
            whileHover={!creating ? { scale: 1.02 } : {}}
            whileTap={!creating ? { scale: 0.98 } : {}}
            style={{
              width: '100%', padding: '12px',
              borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              color: 'white', fontWeight: 700, fontSize: '0.92rem',
              cursor: creating ? 'wait' : 'pointer',
              opacity: creating ? 0.7 : 1,
              boxShadow: '0 0 20px rgba(47,128,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {creating ? 'Creating...' : <><Plus size={16} /> Create Room</>}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main StudyRooms Page ─── */
export default function StudyRooms() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [allRooms, setAllRooms] = useState<ApiStudyRoom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState<string | null>(null);

  useEffect(() => {
    studyRoomService.getAll().then(setAllRooms).catch(() => {});
  }, []);

  const filtered = allRooms.filter(room => {
    const matchSearch = (room.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (room.subject ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All'
      ? true : activeFilter === 'Active' ? room.activeNow
      : activeFilter === 'Has Quiz' ? room.hasQuiz
      : room.subject === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleJoinRoom = async (e: React.MouseEvent, room: ApiStudyRoom) => {
    e.stopPropagation(); // prevent card click double navigation
    const id = room._id;
    setJoiningRoom(id);
    try {
      await studyRoomService.update(id, { members: (room.members ?? 0) + 1 });
    } catch {
      // Non-critical — still navigate even if update fails
    } finally {
      setJoiningRoom(null);
    }
    navigate(`/study-rooms/${id}`);
  };

  const handleRoomCreated = (room: ApiStudyRoom) => {
    setAllRooms(prev => [room, ...prev]);
    navigate(`/study-rooms/${room._id}`);
  };

  const modalPortal = showCreateModal
    ? createPortal(
        <AnimatePresence>
          <CreateRoomModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleRoomCreated}
          />
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      {modalPortal}
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
            {allRooms.length} rooms • {allRooms.filter(r => r.activeNow).length} active now
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowCreateModal(true)}
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
            key={room._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onHoverStart={() => setHoveredRoom(room._id)}
            onHoverEnd={() => setHoveredRoom(null)}
            onClick={() => navigate(`/study-rooms/${room._id}`)}
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${hoveredRoom === room._id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.3s ease',
              boxShadow: hoveredRoom === room._id ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
            }}
          >
            {/* Card Header with gradient */}
            <div style={{
              height: 120, background: room.gradient ?? 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              position: 'relative', padding: '16px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              {/* Overlay pattern */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <span style={{ fontSize: '2rem' }}>{room.icon ?? '📚'}</span>
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
                    height: '100%', width: `${((room.members ?? 0) / (room.maxMembers ?? 20)) * 100}%`,
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
                {room.description ?? ''}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                {(room.tags ?? []).slice(0, 3).map(tag => (
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
                    <Users size={11} /> {room.members ?? 0}/{room.maxMembers ?? 20}
                  </span>
                  <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <BookOpen size={11} /> {room.resources ?? 0}
                  </span>
                </div>
                {/* Avatars */}
                <div style={{ display: 'flex' }}>
                  {(room.memberAvatars ?? []).slice(0, 3).map((m, mi) => (
                    <div key={mi} style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: (m.color ?? '#2F80ED') + '30',
                      border: `2px solid #0F172A`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.48rem', fontWeight: 700, color: m.color ?? '#2F80ED',
                      marginLeft: mi > 0 ? -6 : 0,
                    }}>
                      {m.initials ?? '??'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Join Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={joiningRoom === room._id}
                onClick={e => handleJoinRoom(e, room)}
                style={{
                  width: '100%',
                  background: 'rgba(47,128,237,0.1)',
                  border: '1px solid rgba(47,128,237,0.3)',
                  borderRadius: '10px', padding: '8px',
                  color: '#2F80ED', fontWeight: 600, fontSize: '0.8rem',
                  cursor: joiningRoom === room._id ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.2s',
                  opacity: joiningRoom === room._id ? 0.7 : 1,
                }}
              >
                {joiningRoom === room._id ? 'Joining...' : <>Join Room <ArrowRight size={13} /></>}
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
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowCreateModal(true)}
            style={{
              marginTop: 16, padding: '10px 20px',
              background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              border: 'none', borderRadius: 10,
              color: 'white', fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Plus size={14} /> Create First Room
          </motion.button>
        </GlassCard>
      )}
    </div>
    </>
  );
}
