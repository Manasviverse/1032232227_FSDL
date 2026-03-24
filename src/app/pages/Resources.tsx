import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Download, Heart, Upload, Filter, Star, ExternalLink } from 'lucide-react';
import { resources, users } from '../data/mockData';
import { GlassCard } from '../components/GlassCard';

const filterTags = ['All', 'Mathematics', 'AI/ML', 'DBMS', 'DSA', 'Networks', 'Physics'];
const fileTypeColors: Record<string, { bg: string; color: string; icon: string }> = {
  PDF: { bg: 'rgba(251,113,133,0.15)', color: '#FB7185', icon: '📄' },
  Notes: { bg: 'rgba(47,128,237,0.15)', color: '#2F80ED', icon: '📝' },
  Video: { bg: 'rgba(123,97,255,0.15)', color: '#7B61FF', icon: '🎥' },
  Code: { bg: 'rgba(45,212,191,0.15)', color: '#2DD4BF', icon: '💻' },
  Slides: { bg: 'rgba(250,204,21,0.15)', color: '#FACC15', icon: '📊' },
};

const topContributors = users.slice(0, 5).map(u => ({
  ...u,
  contributions: [23, 31, 45, 18, 27][users.indexOf(u)] || 10,
}));

export default function Resources() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === 'All' || r.subject === activeTag;
    return matchSearch && matchTag;
  });

  const toggleLike = (id: number) => {
    setLikedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const trending = [...resources].sort((a, b) => b.downloads - a.downloads).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
            Resource Library
          </h2>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem', marginTop: 4 }}>
            {resources.length} resources • Shared by the community
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: 'linear-gradient(135deg, #2DD4BF, #2F80ED)',
            border: 'none', borderRadius: '12px',
            padding: '10px 20px',
            color: 'white', fontWeight: 600, fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(45,212,191,0.3)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Upload size={15} /> Upload Resource
        </motion.button>
      </div>

      {/* Trending Carousel */}
      <div>
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.75rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Star size={12} style={{ color: '#FACC15' }} /> Trending This Week
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {trending.map((r, i) => {
            const typeStyle = fileTypeColors[r.type];
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{
                  flex: 1, padding: '16px',
                  background: typeStyle.bg,
                  border: `1px solid ${typeStyle.color}30`,
                  borderRadius: '14px', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: -10, right: -10,
                  fontSize: '4rem', opacity: 0.08,
                }}>
                  {typeStyle.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{
                    background: typeStyle.bg, border: `1px solid ${typeStyle.color}40`,
                    borderRadius: '6px', padding: '2px 8px',
                    color: typeStyle.color, fontSize: '0.65rem', fontWeight: 600,
                  }}>
                    {r.type}
                  </span>
                  <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem' }}>{r.uploadedAt}</span>
                </div>
                <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 4px' }}>
                  {r.title}
                </p>
                <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', margin: 0 }}>
                  by {r.uploader} • ⬇️ {r.downloads}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="resources-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Left - Resource Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              flex: 1, minWidth: 200,
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '8px 14px',
            }}>
              <Search size={14} style={{ color: 'rgba(226,232,240,0.4)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resources..."
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'rgba(226,232,240,0.8)', fontSize: '0.85rem', width: '100%',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {filterTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    background: activeTag === tag ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.04)',
                    border: activeTag === tag ? '1px solid rgba(45,212,191,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', padding: '5px 12px',
                    color: activeTag === tag ? '#2DD4BF' : 'rgba(226,232,240,0.5)',
                    fontSize: '0.72rem', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Resource Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {filtered.map((resource, i) => {
              const typeStyle = fileTypeColors[resource.type];
              const liked = likedItems.has(resource.id);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px', overflow: 'hidden',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {/* File Preview Area */}
                  <div style={{
                    height: 80,
                    background: typeStyle.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>{typeStyle.icon}</span>
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      background: typeStyle.bg,
                      border: `1px solid ${typeStyle.color}50`,
                      borderRadius: '6px', padding: '2px 8px',
                    }}>
                      <span style={{ color: typeStyle.color, fontSize: '0.65rem', fontWeight: 700 }}>{resource.type}</span>
                    </div>
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem' }}>{resource.size}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '12px' }}>
                    <p style={{ color: 'white', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.3 }}>
                      {resource.title}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', margin: '6px 0 8px' }}>
                      {resource.tags.slice(0, 2).map(tag => (
                        <span key={tag} style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '4px', padding: '1px 6px',
                          color: 'rgba(226,232,240,0.5)', fontSize: '0.6rem',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Uploader */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '6px',
                        background: resource.uploaderColor + '30',
                        border: `1px solid ${resource.uploaderColor}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.45rem', fontWeight: 700, color: resource.uploaderColor,
                      }}>
                        {resource.uploaderInitials}
                      </div>
                      <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.68rem' }}>{resource.uploader}</span>
                      <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.65rem', marginLeft: 'auto' }}>{resource.uploadedAt}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => toggleLike(resource.id)}
                        style={{
                          background: liked ? 'rgba(251,113,133,0.12)' : 'rgba(255,255,255,0.05)',
                          border: liked ? '1px solid rgba(251,113,133,0.3)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px', padding: '5px 8px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                          color: liked ? '#FB7185' : 'rgba(226,232,240,0.5)', fontSize: '0.7rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Heart size={11} fill={liked ? '#FB7185' : 'none'} />
                        {resource.likes + (liked ? 1 : 0)}
                      </button>
                      <button style={{
                        flex: 1,
                        background: 'rgba(45,212,191,0.08)',
                        border: '1px solid rgba(45,212,191,0.2)',
                        borderRadius: '8px', padding: '5px 8px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        color: '#2DD4BF', fontSize: '0.72rem', fontWeight: 500,
                      }}>
                        <Download size={11} /> Download
                      </button>
                      <button style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px', padding: '5px 8px',
                        cursor: 'pointer', color: 'rgba(226,232,240,0.4)',
                      }}>
                        <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right - Top Contributors */}
        <div>
          <GlassCard className="p-5" delay={0.1}>
            <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 16px' }}>
              🏆 Top Contributors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topContributors.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.7rem', width: 14, textAlign: 'center' }}>#{i + 1}</span>
                  <div style={{
                    width: 30, height: 30, borderRadius: '10px',
                    background: u.color + '25', border: `1px solid ${u.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 700, color: u.color,
                  }}>
                    {u.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.name.split(' ')[0]}
                    </p>
                    <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem', margin: 0 }}>
                      {u.resourcesShared} uploads
                    </p>
                  </div>
                  <div style={{
                    background: u.color + '15', border: `1px solid ${u.color}30`,
                    borderRadius: '20px', padding: '2px 8px',
                    color: u.color, fontSize: '0.65rem', fontWeight: 600,
                  }}>
                    {u.badge}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Upload CTA */}
          <GlassCard className="p-5 mt-4" delay={0.2}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'linear-gradient(135deg, #2DD4BF, #2F80ED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 0 20px rgba(45,212,191,0.3)',
              }}>
                <Upload size={22} style={{ color: 'white' }} />
              </div>
              <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
                Share Your Notes
              </p>
              <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', lineHeight: 1.4, marginBottom: 14 }}>
                Upload resources and earn XP. Help your classmates and climb the leaderboard!
              </p>
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2DD4BF20, #2F80ED20)',
                border: '1px solid rgba(45,212,191,0.3)',
                borderRadius: '10px', padding: '8px',
                color: '#2DD4BF', fontWeight: 600, fontSize: '0.8rem',
                cursor: 'pointer',
              }}>
                Upload → +50 XP
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
