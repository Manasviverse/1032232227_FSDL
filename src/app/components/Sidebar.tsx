import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Users, Zap, BookOpen, Trophy, BarChart2, User,
  ChevronRight, Bell, Settings, LogOut, X,
} from 'lucide-react';
import { currentUser } from '../data/mockData';
import { useState, useEffect } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/', color: '#2F80ED' },
  { icon: Users, label: 'Study Rooms', to: '/study-rooms', color: '#7B61FF' },
  { icon: Zap, label: 'Quiz Arena', to: '/quiz-arena', color: '#FACC15' },
  { icon: BookOpen, label: 'Resources', to: '/resources', color: '#2DD4BF' },
  { icon: Trophy, label: 'Leaderboard', to: '/leaderboard', color: '#FB7185' },
  { icon: BarChart2, label: 'Analytics', to: '/analytics', color: '#F97316' },
  { icon: User, label: 'Profile', to: '/profile', color: '#A78BFA' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && onClose) onClose();
  }, [location.pathname]);

  const showExpanded = isMobile ? true : !collapsed;

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <motion.aside
        animate={isMobile ? undefined : { width: collapsed ? 72 : 224 }}
        style={{
          background: 'rgba(8, 14, 32, 0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100vh',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          zIndex: 50,
          overflow: 'hidden',
          width: isMobile ? 224 : (collapsed ? 72 : 224),
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : undefined,
          transition: isMobile ? 'transform 0.3s ease' : undefined,
          boxShadow: isMobile && isOpen ? '4px 0 32px rgba(0,0,0,0.5)' : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '12px', flexShrink: 0,
              background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', boxShadow: '0 0 20px rgba(47,128,237,0.4)',
            }}>
              ⚡
            </div>
            <AnimatePresence>
              {showExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '0.5px',
                    lineHeight: 1.1,
                  }}>
                    EduSync
                  </p>
                  <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.65rem', marginTop: 1 }}>
                    Study · Compete · Grow
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={onClose}
                style={{
                  marginLeft: 'auto',
                  width: 28, height: 28, borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(226,232,240,0.6)',
                  flexShrink: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Toggle (desktop only) */}
        {!isMobile && (
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute', top: 24, right: collapsed ? 16 : 12,
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(47,128,237,0.15)',
              border: '1px solid rgba(47,128,237,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#2F80ED', transition: 'all 0.3s',
              zIndex: 10,
            }}
          >
            <ChevronRight size={12} style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
          </button>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden' }} className="scrollbar-none">
          <div style={{ marginBottom: 6 }}>
            {showExpanded && (
              <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px', padding: '0 8px', marginBottom: 8, textTransform: 'uppercase' }}>
                Navigation
              </p>
            )}
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{ textDecoration: 'none', display: 'block', marginBottom: 4 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: (!showExpanded) ? '10px' : '10px 12px',
                      borderRadius: '12px',
                      background: isActive ? `${item.color}18` : 'transparent',
                      border: isActive ? `1px solid ${item.color}35` : '1px solid transparent',
                      boxShadow: isActive ? `0 0 15px ${item.color}20` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      justifyContent: (!showExpanded) ? 'center' : 'flex-start',
                      position: 'relative',
                    }}
                    whileHover={{
                      background: `${item.color}12`,
                      borderColor: `${item.color}25`,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: '60%',
                          borderRadius: '0 2px 2px 0',
                          background: item.color,
                          boxShadow: `0 0 8px ${item.color}`,
                        }}
                      />
                    )}
                    <div style={{
                      color: isActive ? item.color : 'rgba(226,232,240,0.5)',
                      display: 'flex', alignItems: 'center',
                      filter: isActive ? `drop-shadow(0 0 4px ${item.color})` : 'none',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}>
                      <item.icon size={18} />
                    </div>
                    <AnimatePresence>
                      {showExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            color: isActive ? 'white' : 'rgba(226,232,240,0.6)',
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 600 : 400,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 10px' }}>
          {/* Notifications & Settings */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, justifyContent: showExpanded ? 'flex-start' : 'center' }}>
            {showExpanded && (
              <>
                <button style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(226,232,240,0.5)',
                  position: 'relative',
                }}>
                  <Bell size={15} />
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#FB7185', boxShadow: '0 0 6px #FB7185',
                  }} />
                </button>
                <button style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(226,232,240,0.5)',
                }}>
                  <Settings size={15} />
                </button>
              </>
            )}
          </div>

          {/* User Profile */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: showExpanded ? '8px 10px' : '8px 0', borderRadius: '12px',
            background: 'rgba(47,128,237,0.08)',
            border: '1px solid rgba(47,128,237,0.15)',
            cursor: 'pointer', justifyContent: showExpanded ? 'flex-start' : 'center',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '10px',
              background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'white',
              flexShrink: 0, boxShadow: '0 0 12px rgba(47,128,237,0.4)',
            }}>
              {currentUser.avatar}
            </div>
            <AnimatePresence>
              {showExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.name}
                  </p>
                  <p style={{ color: '#FACC15', fontSize: '0.65rem' }}>
                    Lv.{currentUser.level} · {currentUser.badge}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {showExpanded && <LogOut size={14} style={{ color: 'rgba(226,232,240,0.3)', flexShrink: 0 }} />}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
