import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, Heart, Upload, Star, ExternalLink, X, FileText, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { resourceService, type ApiResource } from '../services/resourceService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import type { AuthUser } from '../services/authService';

const filterTags = ['All', 'Mathematics', 'AI/ML', 'DBMS', 'DSA', 'Networks', 'Physics'];

const fileTypeColors: Record<string, { bg: string; color: string; icon: string }> = {
  PDF:    { bg: 'rgba(251,113,133,0.15)', color: '#FB7185', icon: '📄' },
  Notes:  { bg: 'rgba(47,128,237,0.15)',  color: '#2F80ED', icon: '📝' },
  Video:  { bg: 'rgba(123,97,255,0.15)',  color: '#7B61FF', icon: '🎥' },
  Code:   { bg: 'rgba(45,212,191,0.15)',  color: '#2DD4BF', icon: '💻' },
  Slides: { bg: 'rgba(250,204,21,0.15)',  color: '#FACC15', icon: '📊' },
};

// Safe fallback for unknown resource types
const getTypeStyle = (type: string) =>
  fileTypeColors[type] ?? { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8', icon: '📁' };

/* ─── Upload Modal ─── */
function UploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (r: ApiResource) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', type: 'PDF', subject: 'Mathematics', tags: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const setF = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file && !form.title) setF('title')(file.name.replace(/\.[^.]+$/, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) { setError('Please select a file.'); return; }
    if (!form.title.trim()) { setError('Please enter a title.'); return; }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      fd.append('title', form.title.trim());
      fd.append('type', form.type);
      fd.append('subject', form.subject);
      fd.append('tags', form.tags);
      const resource = await resourceService.upload(fd);
      setDone(true);
      setTimeout(() => {
        onSuccess(resource);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
    padding: '9px 12px', color: 'rgba(226,232,240,0.9)', fontSize: '0.85rem',
    outline: 'none', boxSizing: 'border-box',
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };
  const labelStyle: React.CSSProperties = { color: 'rgba(226,232,240,0.6)', fontSize: '0.78rem', marginBottom: 5, display: 'block' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
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
          borderRadius: 20, padding: '28px 32px', width: '100%', maxWidth: 480,
          boxShadow: '0 0 0 1px rgba(45,212,191,0.1), 0 24px 80px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Top glow */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, #2DD4BF, #2F80ED, transparent)', opacity: 0.6 }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Upload Resource</h3>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', marginTop: 3 }}>Share knowledge · Earn +50 XP</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,232,240,0.5)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {done ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', padding: '24px 0' }}
          >
            <CheckCircle size={48} style={{ color: '#34D399', margin: '0 auto 12px' }} />
            <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Uploaded Successfully! 🎉</p>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem' }}>+50 XP added to your profile</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* File Drop Zone */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${selectedFile ? 'rgba(45,212,191,0.5)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 12, padding: '20px',
                textAlign: 'center', cursor: 'pointer',
                background: selectedFile ? 'rgba(45,212,191,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s',
              }}
            >
              {selectedFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <FileText size={20} style={{ color: '#2DD4BF' }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ color: '#2DD4BF', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{selectedFile.name}</p>
                    <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.72rem', margin: 0 }}>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={24} style={{ color: 'rgba(226,232,240,0.3)', marginBottom: 8 }} />
                  <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.82rem', margin: 0 }}>
                    Click to select a file
                  </p>
                  <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.7rem', marginTop: 4 }}>
                    PDF, PPT, DOC, Images — max 50MB
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.txt"
                style={{ display: 'none' }}
              />
            </div>

            {/* Title */}
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={e => setF('title')(e.target.value)}
                placeholder="e.g. Data Structures Notes"
                required
              />
            </div>

            {/* Type + Subject row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Type *</label>
                <select style={selectStyle} value={form.type} onChange={e => setF('type')(e.target.value)}>
                  {Object.keys(fileTypeColors).map(t => (
                    <option key={t} value={t} style={{ background: '#0F172A' }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Subject *</label>
                <select style={selectStyle} value={form.subject} onChange={e => setF('subject')(e.target.value)}>
                  {filterTags.filter(t => t !== 'All').map(t => (
                    <option key={t} value={t} style={{ background: '#0F172A' }}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input
                style={inputStyle}
                value={form.tags}
                onChange={e => setF('tags')(e.target.value)}
                placeholder="e.g. arrays, sorting, interview"
              />
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
              disabled={uploading}
              whileHover={!uploading ? { scale: 1.02 } : {}}
              whileTap={!uploading ? { scale: 0.98 } : {}}
              style={{
                width: '100%', padding: '12px',
                borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #2DD4BF, #2F80ED)',
                color: 'white', fontWeight: 700, fontSize: '0.92rem',
                cursor: uploading ? 'wait' : 'pointer',
                opacity: uploading ? 0.7 : 1,
                boxShadow: '0 0 20px rgba(45,212,191,0.3)',
              }}
            >
              {uploading ? 'Uploading...' : '⬆ Upload Resource'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Resources Page ─── */
export default function Resources() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [resources, setResources] = useState<ApiResource[]>([]);
  const [topContributors, setTopContributors] = useState<AuthUser[]>([]);

  useEffect(() => {
    resourceService.getAll().then(setResources).catch(() => {});
    userService.getAll().then(users => setTopContributors(users.slice(0, 5))).catch(() => {});
  }, []);

  const filtered = resources.filter(r => {
    const matchSearch = (r.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (r.subject ?? '').toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === 'All' || r.subject === activeTag;
    return matchSearch && matchTag;
  });

  const handleLike = async (id: string) => {
    // Optimistic update
    setLikedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    // Update count in list
    try {
      const result = await resourceService.like(id);
      setResources(prev => prev.map(r => r._id === id ? { ...r, likes: result.likes } : r));
    } catch {
      // Revert optimistic update on error
      setLikedItems(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  const handleDownload = (resource: ApiResource) => {
    if (resource.fileUrl) {
      const a = document.createElement('a');
      a.href = resource.fileUrl;
      a.download = resource.title ?? 'resource';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      // Increment download count locally
      setResources(prev => prev.map(r => r._id === resource._id ? { ...r, downloads: (r.downloads ?? 0) + 1 } : r));
    } else {
      alert('No file available for download yet.');
    }
  };

  const handleUploadSuccess = (newResource: ApiResource) => {
    setResources(prev => [newResource, ...prev]);
  };

  const trending = [...resources].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={handleUploadSuccess}
          />
        )}
      </AnimatePresence>

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
          onClick={() => setShowUploadModal(true)}
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
      {trending.length > 0 && (
        <div>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.75rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Star size={12} style={{ color: '#FACC15' }} /> Trending This Week
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {trending.map((r, i) => {
              const typeStyle = getTypeStyle(r.type);
              return (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleDownload(r)}
                  style={{
                    flex: 1, minWidth: 160, padding: '16px',
                    background: typeStyle.bg,
                    border: `1px solid ${typeStyle.color}30`,
                    borderRadius: '14px', cursor: 'pointer',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '4rem', opacity: 0.08 }}>
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
                    <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem' }}>{r.uploadedAt ?? ''}</span>
                  </div>
                  <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 4px' }}>
                    {r.title}
                  </p>
                  <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem', margin: 0 }}>
                    by {r.uploader ?? 'Unknown'} • ⬇️ {r.downloads ?? 0}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

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
          {filtered.length === 0 ? (
            <GlassCard className="p-12" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>📭</p>
              <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.875rem' }}>
                No resources found. Be the first to upload one!
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowUploadModal(true)}
                style={{
                  marginTop: 16, padding: '10px 20px',
                  background: 'linear-gradient(135deg, #2DD4BF, #2F80ED)',
                  border: 'none', borderRadius: 10,
                  color: 'white', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Upload First Resource
              </motion.button>
            </GlassCard>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {filtered.map((resource, i) => {
                const typeStyle = getTypeStyle(resource.type);
                const liked = likedItems.has(resource._id);
                const safeUploaderColor = resource.uploaderColor ?? '#2F80ED';
                return (
                  <motion.div
                    key={resource._id}
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
                        <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem' }}>{resource.size ?? ''}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '12px' }}>
                      <p style={{ color: 'white', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.3 }}>
                        {resource.title}
                      </p>

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', margin: '6px 0 8px' }}>
                        {(resource.tags ?? []).slice(0, 2).map(tag => (
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
                          background: safeUploaderColor + '30',
                          border: `1px solid ${safeUploaderColor}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, color: safeUploaderColor,
                        }}>
                          {resource.uploaderInitials ?? '??'}
                        </div>
                        <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.68rem' }}>{resource.uploader ?? 'Unknown'}</span>
                        <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.65rem', marginLeft: 'auto' }}>{resource.uploadedAt ?? ''}</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleLike(resource._id)}
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
                          {(resource.likes ?? 0) + (liked ? 1 : 0)}
                        </button>
                        <button
                          onClick={() => handleDownload(resource)}
                          style={{
                            flex: 1,
                            background: 'rgba(45,212,191,0.08)',
                            border: '1px solid rgba(45,212,191,0.2)',
                            borderRadius: '8px', padding: '5px 8px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                            color: '#2DD4BF', fontSize: '0.72rem', fontWeight: 500,
                          }}
                        >
                          <Download size={11} /> Download
                        </button>
                        <button
                          onClick={() => resource.fileUrl && window.open(resource.fileUrl, '_blank', 'noopener')}
                          title="Open in new tab"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px', padding: '5px 8px',
                            cursor: resource.fileUrl ? 'pointer' : 'not-allowed',
                            color: resource.fileUrl ? 'rgba(226,232,240,0.6)' : 'rgba(226,232,240,0.2)',
                          }}
                        >
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right - Top Contributors */}
        <div>
          <GlassCard className="p-5" delay={0.1}>
            <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 16px' }}>
              🏆 Top Contributors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topContributors.length === 0 ? (
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.8rem', textAlign: 'center', padding: '12px 0' }}>
                  No contributors yet
                </p>
              ) : topContributors.map((u, i) => {
                const safeColor = u.color ?? '#2F80ED';
                const safeBadgeColor = u.badgeColor ?? '#7B61FF';
                return (
                  <motion.div
                    key={(u as any)._id ?? u.id ?? i}
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
                      background: safeColor + '25', border: `1px solid ${safeColor}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 700, color: safeColor,
                    }}>
                      {u.avatar ?? '😊'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {(u.name ?? 'Unknown').split(' ')[0]}
                      </p>
                      <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem', margin: 0 }}>
                        {u.resourcesShared ?? 0} uploads
                      </p>
                    </div>
                    <div style={{
                      background: safeBadgeColor + '15', border: `1px solid ${safeBadgeColor}30`,
                      borderRadius: '20px', padding: '2px 8px',
                      color: safeBadgeColor, fontSize: '0.65rem', fontWeight: 600,
                    }}>
                      {u.badge ?? 'Member'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* Upload CTA */}
          <GlassCard className="p-5 mt-4" delay={0.2} style={{ marginTop: 16 }}>
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
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowUploadModal(true)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2DD4BF20, #2F80ED20)',
                  border: '1px solid rgba(45,212,191,0.3)',
                  borderRadius: '10px', padding: '8px',
                  color: '#2DD4BF', fontWeight: 600, fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Upload → +50 XP
              </motion.button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
