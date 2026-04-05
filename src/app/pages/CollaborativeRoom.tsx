import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Send, Users, X, BookOpen, MessageSquare } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { studyRooms } from '../data/mockData';
import { useParams, useNavigate } from 'react-router';
import { studyRoomService, type ApiStudyRoom } from '../services/studyRoomService';

interface NoteCard {
  id: string;
  content: string;
  color: string;
  author: string;
  authorColor: string;
  x: number;
  y: number;
  type: 'note' | 'question' | 'resource';
}

interface DraggableNoteProps {
  note: NoteCard;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}

const NOTE_TYPE = 'NOTE';

function DraggableNote({ note, onMove, onDelete }: DraggableNoteProps) {
  const [{ isDragging }, drag] = useDrag({
    type: NOTE_TYPE,
    item: { id: note.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const noteColors: Record<string, string> = {
    note: 'rgba(47,128,237,0.12)',
    question: 'rgba(250,204,21,0.12)',
    resource: 'rgba(45,212,191,0.12)',
  };
  const noteBorderColors: Record<string, string> = {
    note: 'rgba(47,128,237,0.3)',
    question: 'rgba(250,204,21,0.3)',
    resource: 'rgba(45,212,191,0.3)',
  };
  const typeIcons: Record<string, string> = { note: '📝', question: '❓', resource: '🔗' };

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: 180,
        opacity: isDragging ? 0.4 : 1,
        cursor: 'grab',
        zIndex: isDragging ? 100 : 1,
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.03, zIndex: 10 }}
        style={{
          background: noteColors[note.type],
          border: `1px solid ${noteBorderColors[note.type]}`,
          borderRadius: '12px',
          padding: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.75rem' }}>{typeIcons[note.type]}</span>
          <button
            onClick={() => onDelete(note.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(226,232,240,0.3)', padding: 2,
            }}
          >
            <X size={10} />
          </button>
        </div>
        <p style={{ color: 'rgba(226,232,240,0.85)', fontSize: '0.75rem', lineHeight: 1.4, margin: 0 }}>
          {note.content}
        </p>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            background: note.authorColor + '40',
            border: `1px solid ${note.authorColor}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.4rem', color: note.authorColor,
          }}>
            {note.author.slice(0, 2)}
          </div>
          <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.6rem' }}>{note.author}</span>
        </div>
      </motion.div>
    </div>
  );
}

function StudyBoard({ notes, onMove, onDelete }: { notes: NoteCard[]; onMove: (id: string, x: number, y: number) => void; onDelete: (id: string) => void }) {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop({
    accept: NOTE_TYPE,
    drop: (item: { id: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (offset && boardRect) {
        const x = offset.x - boardRect.left - 90;
        const y = offset.y - boardRect.top - 50;
        onMove(item.id, Math.max(0, x), Math.max(0, y));
      }
    },
  });

  const setRef = useCallback((node: HTMLDivElement | null) => {
    boardRef.current = node;
    drop(node);
  }, [drop]);

  return (
    <div
      ref={setRef}
      style={{
        flex: 1, position: 'relative',
        background: 'rgba(255,255,255,0.01)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden', minHeight: 400,
        backgroundImage: `
          radial-gradient(circle at 20px 20px, rgba(255,255,255,0.03) 1px, transparent 0)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Grid dots */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
      }} />

      {notes.map(note => (
        <DraggableNote key={note.id} note={note} onMove={onMove} onDelete={onDelete} />
      ))}

      {notes.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'rgba(226,232,240,0.2)',
        }}>
          <p style={{ fontSize: '3rem', marginBottom: 8 }}>📋</p>
          <p style={{ fontSize: '0.875rem' }}>Drop notes here to collaborate</p>
          <p style={{ fontSize: '0.75rem', marginTop: 4 }}>Click + to add a new note</p>
        </div>
      )}
    </div>
  );
}

const initialNotes: NoteCard[] = [
  { id: '1', content: 'BFS uses a queue, DFS uses a stack. Remember this for exams!', color: '#2F80ED', author: 'Apurva', authorColor: '#7B61FF', x: 40, y: 30, type: 'note' },
  { id: '2', content: 'What is the space complexity of Dijkstra?', color: '#FACC15', author: 'Nirupam', authorColor: '#2F80ED', x: 260, y: 80, type: 'question' },
  { id: '3', content: 'O(V + E) for adjacency list representation', color: '#2DD4BF', author: 'Kavya', authorColor: '#2DD4BF', x: 140, y: 200, type: 'note' },
  { id: '4', content: 'Great resource: CP-Algorithms.com', color: '#A78BFA', author: 'Rohit', authorColor: '#FACC15', x: 380, y: 40, type: 'resource' },
];

const chatMessages = [
  { id: 1, user: 'Apurva', color: '#7B61FF', text: 'Just added notes on BFS vs DFS!', time: '2:34 PM' },
  { id: 2, user: 'Nirupam', color: '#2F80ED', text: 'Great! Can anyone explain Dijkstra complexity?', time: '2:36 PM' },
  { id: 3, user: 'Kavya', color: '#2DD4BF', text: "It's O((V+E) log V) with a min-heap 🎯", time: '2:38 PM' },
  { id: 4, user: 'You', color: '#FACC15', text: 'Thanks Kavya! Added resource link above', time: '2:41 PM' },
];

export default function CollaborativeRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<ApiStudyRoom | any>(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState<NoteCard[]>([]);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<typeof chatMessages>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<'note' | 'question' | 'resource'>('note');
  const [activeTab, setActiveTab] = useState<'board' | 'resources'>('board');

  useEffect(() => {
    async function loadRoom() {
      if (!id) return;
      try {
        setLoading(true);
        if (isNaN(Number(id))) {
          // It's a real MongoDB ID
          const fetchedRoom = await studyRoomService.getById(id);
          setRoom(fetchedRoom);
          
          // If the room was created within the last 15 minutes, it's a "newly added" room
          const isNewlyCreated = fetchedRoom.createdAt 
            ? (new Date().getTime() - new Date(fetchedRoom.createdAt).getTime()) < 15 * 60 * 1000 
            : false;

          if (isNewlyCreated) {
            setNotes([]);
            setMessages([]);
          } else {
            setNotes(initialNotes);
            setMessages(chatMessages);
          }
        } else {
          // Fallback to Mock Data
          const mockRoom = studyRooms.find(r => r.id === Number(id));
          if (mockRoom) {
            setRoom(mockRoom);
            setNotes(initialNotes);
            setMessages(chatMessages);
          } else {
            navigate('/study-rooms');
          }
        }
      } catch (err) {
        console.error("Failed to load room:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoom();
  }, [id, navigate]);

  if (loading || !room) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
         <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '1.2rem' }}>Loading Room Details...</p>
      </div>
    )
  }


  const handleMove = (id: string, x: number, y: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addNote = () => {
    if (!newNoteContent.trim()) return;
    const newNote: NoteCard = {
      id: Date.now().toString(),
      content: newNoteContent,
      color: '#2F80ED',
      author: 'You',
      authorColor: '#FACC15',
      x: Math.random() * 300 + 40,
      y: Math.random() * 200 + 40,
      type: newNoteType,
    };
    setNotes(prev => [...prev, newNote]);
    setNewNoteContent('');
    setShowAddNote(false);
  };

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), user: 'You', color: '#FACC15', text: chatMsg, time: 'Just now' }]);
    setChatMsg('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 16 }}>
        {/* Room Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: room.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}>
              {room.icon}
            </div>
            <div>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {room?.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px #34D399' }} />
                <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.75rem' }}>
                  {room?.members ?? 0} members online
                </span>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'board', label: 'Study Board', Icon: BookOpen },
              { id: 'resources', label: 'Resources', Icon: MessageSquare },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'board' | 'resources')}
                style={{
                  background: activeTab === tab.id ? 'rgba(47,128,237,0.2)' : 'rgba(255,255,255,0.04)',
                  border: activeTab === tab.id ? '1px solid rgba(47,128,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', padding: '7px 14px',
                  color: activeTab === tab.id ? '#2F80ED' : 'rgba(226,232,240,0.5)',
                  fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <tab.Icon size={13} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Member Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {(room?.memberAvatars || []).map((m: any, i: number) => (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: m.color + '30', border: `2px solid #0F172A`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', fontWeight: 700, color: m.color,
                  marginLeft: i > 0 ? -8 : 0,
                }}>
                  {m.initials}
                </div>
              ))}
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '2px solid #0F172A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', color: 'rgba(226,232,240,0.5)', marginLeft: -8,
              }}>
                +{Math.max(0, (room?.members || 0) - (room?.memberAvatars?.length || 0))}
              </div>
            </div>
            <button style={{
              background: 'rgba(47,128,237,0.1)', border: '1px solid rgba(47,128,237,0.25)',
              borderRadius: '8px', padding: '6px 12px',
              color: '#2F80ED', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500,
            }}>
              <Users size={12} style={{ display: 'inline', marginRight: 4 }} />
              Invite
            </button>
          </div>
        </div>

        {/* Main Area */}
        <div style={{ flex: 1, display: 'flex', gap: 16, overflow: 'hidden' }}>
          {/* Study Board */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
            {/* Board toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
            }}>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.78rem', flex: 1 }}>
                🖱️ Drag notes to rearrange • Click + to add
              </span>
              {['note', 'question', 'resource'].map(type => (
                <button
                  key={type}
                  onClick={() => { setNewNoteType(type as 'note' | 'question' | 'resource'); setShowAddNote(true); }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '5px 10px',
                    color: 'rgba(226,232,240,0.6)', fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  + {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Board Canvas */}
            <StudyBoard notes={notes} onMove={handleMove} onDelete={handleDelete} />
          </div>

          {/* Chat Panel */}
          <div style={{
            width: 280, display: 'flex', flexDirection: 'column', gap: 0,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', overflow: 'hidden',
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                Group Chat
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 5px #34D399' }} />
                <span style={{ color: '#34D399', fontSize: '0.65rem' }}>Live</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }} className="scrollbar-thin">
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '8px',
                    background: msg.color + '25', border: `1px solid ${msg.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.55rem', fontWeight: 700, color: msg.color,
                    flexShrink: 0,
                  }}>
                    {msg.user.slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                      <span style={{ color: msg.color, fontSize: '0.72rem', fontWeight: 600 }}>{msg.user}</span>
                      <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.6rem' }}>{msg.time}</span>
                    </div>
                    <p style={{
                      background: msg.user === 'You' ? 'rgba(250,204,21,0.08)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${msg.user === 'You' ? 'rgba(250,204,21,0.15)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '8px', padding: '6px 10px',
                      color: 'rgba(226,232,240,0.85)', fontSize: '0.75rem',
                      lineHeight: 1.4, margin: 0,
                    }}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{
                display: 'flex', gap: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '8px 10px',
              }}>
                <input
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: 'rgba(226,232,240,0.8)', fontSize: '0.78rem',
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    background: 'rgba(47,128,237,0.3)', border: 'none',
                    borderRadius: '6px', padding: '4px 8px',
                    cursor: 'pointer', color: '#2F80ED',
                  }}
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Note Modal */}
        <AnimatePresence>
          {showAddNote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onClick={() => setShowAddNote(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: '#1E2A45', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '24px', width: 340,
                }}
              >
                <h3 style={{ color: 'white', margin: '0 0 16px', fontWeight: 600 }}>Add Note Card</h3>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {(['note', 'question', 'resource'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewNoteType(t)}
                      style={{
                        flex: 1, padding: '6px',
                        background: newNoteType === t ? 'rgba(47,128,237,0.2)' : 'rgba(255,255,255,0.05)',
                        border: newNoteType === t ? '1px solid rgba(47,128,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px', color: newNoteType === t ? '#2F80ED' : 'rgba(226,232,240,0.5)',
                        fontSize: '0.75rem', cursor: 'pointer',
                      }}
                    >
                      {t === 'note' ? '📝' : t === 'question' ? '❓' : '🔗'} {t}
                    </button>
                  ))}
                </div>
                <textarea
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  placeholder="Write your note content..."
                  rows={4}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '10px 12px',
                    color: 'rgba(226,232,240,0.85)', fontSize: '0.85rem',
                    outline: 'none', resize: 'none', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => setShowAddNote(false)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(226,232,240,0.6)', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
                      border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Add Note
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}