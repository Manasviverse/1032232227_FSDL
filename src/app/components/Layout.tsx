import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import { Sidebar } from './Sidebar';
import { Search, Bell, Flame, Menu, LayoutDashboard, Users, Zap, BookOpen, Trophy, BarChart2, User } from 'lucide-react';
import { currentUser } from '../data/mockData';
import { useState } from 'react';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Welcome back, Alex! Ready to level up? 🚀' },
  '/study-rooms': { title: 'Study Rooms', subtitle: 'Collaborate with students worldwide' },
  '/quiz-arena': { title: 'Quiz Arena', subtitle: 'Compete and conquer in real-time' },
  '/resources': { title: 'Resource Library', subtitle: 'Discover and share knowledge' },
  '/leaderboard': { title: 'Leaderboard', subtitle: 'See where you stand among the best' },
  '/analytics': { title: 'Analytics', subtitle: 'Track your learning journey' },
  '/profile': { title: 'My Profile', subtitle: 'Your achievements and progress' },
};

function getPageInfo(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/study-rooms/')) return { title: 'Collaborative Room', subtitle: 'Drag, drop, and learn together 🤝' };
  return pageTitles['/'];
}

const bottomNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Users, label: 'Study', to: '/study-rooms' },
  { icon: Zap, label: 'Quiz', to: '/quiz-arena' },
  { icon: BookOpen, label: 'Resources', to: '/resources' },
  { icon: Trophy, label: 'Leaders', to: '/leaderboard' },
  { icon: BarChart2, label: 'Analytics', to: '/analytics' },
  { icon: User, label: 'Profile', to: '/profile' },
];

export function Layout() {
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{
          height: 64,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 40,
          flexShrink: 0,
        }}>
          {/* Hamburger (mobile only) */}
          <button
            className="show-on-mobile"
            onClick={() => setSidebarOpen(true)}
            style={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(226,232,240,0.7)',
              flexShrink: 0,
            }}
          >
            <Menu size={18} />
          </button>

          {/* Tablet hamburger */}
          <button
            className="show-on-tablet"
            onClick={() => setSidebarOpen(true)}
            style={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(226,232,240,0.7)',
              flexShrink: 0,
            }}
          >
            <Menu size={18} />
          </button>

          {/* Page Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ffffff, rgba(226,232,240,0.7))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.2,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {pageInfo.title}
                </h1>
                <p className="topbar-page-subtitle" style={{ color: 'rgba(226,232,240,0.45)', fontSize: '0.72rem', marginTop: 1, whiteSpace: 'nowrap' }}>
                  {pageInfo.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Search (hidden on phone) */}
          <div
            className="topbar-search"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '8px 14px',
              width: 200,
              flexShrink: 0,
            }}>
            <Search size={14} style={{ color: 'rgba(226,232,240,0.4)', flexShrink: 0 }} />
            <input
              placeholder="Search..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'rgba(226,232,240,0.8)',
                fontSize: '0.8rem',
                width: '100%',
              }}
            />
          </div>

          {/* Streak Badge (hidden on phone) */}
          <div
            className="topbar-streak"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: '10px',
              padding: '6px 12px',
              flexShrink: 0,
            }}>
            <Flame size={14} style={{ color: '#F97316', filter: 'drop-shadow(0 0 4px #F97316)' }} />
            <span style={{ color: '#F97316', fontSize: '0.8rem', fontWeight: 600 }}>
              {currentUser.streak}d
            </span>
          </div>

          {/* Notifications */}
          <button style={{
            width: 38, height: 38, borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(226,232,240,0.6)',
            position: 'relative',
            flexShrink: 0,
          }}>
            <Bell size={16} />
            <div style={{
              position: 'absolute', top: 8, right: 8,
              width: 7, height: 7, borderRadius: '50%',
              background: '#FB7185',
              boxShadow: '0 0 6px #FB7185',
              border: '1.5px solid #0F172A',
            }} />
          </button>

          {/* XP Bar (hidden on phone) */}
          <div className="topbar-xpbar" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '10px',
              background: 'linear-gradient(135deg, #2F80ED, #7B61FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'white',
              boxShadow: '0 0 12px rgba(47,128,237,0.4)',
              flexShrink: 0,
            }}>
              {currentUser.avatar}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>Lv.{currentUser.level}</span>
                <span style={{ color: '#FACC15', fontSize: '0.65rem' }}>{currentUser.xp}/{currentUser.totalXP} XP</span>
              </div>
              <div style={{
                width: 80, height: 4, borderRadius: 4,
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentUser.xp / currentUser.totalXP) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2F80ED, #7B61FF)',
                    borderRadius: 4,
                    boxShadow: '0 0 6px rgba(47,128,237,0.6)',
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px',
          }}
          className="scrollbar-thin main-content-area"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}