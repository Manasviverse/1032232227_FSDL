import { motion } from 'motion/react';
import { Upload, Zap, Users, CheckCircle, Award, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { activityService, type ApiActivity } from '../services/activityService';
import { GlassCard } from './GlassCard';

const typeConfig = {
  upload: { Icon: Upload, color: '#2DD4BF', bg: 'rgba(45,212,191,0.1)' },
  quiz: { Icon: Zap, color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
  join: { Icon: Users, color: '#7B61FF', bg: 'rgba(123,97,255,0.1)' },
  solve: { Icon: CheckCircle, color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
  achievement: { Icon: Award, color: '#FB7185', bg: 'rgba(251,113,133,0.1)' },
  streak: { Icon: Flame, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService.getAll()
      .then(setActivities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <GlassCard className="p-5" delay={0.2}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Activity Feed</h3>
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem' }}>Live collaboration updates</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(45,212,191,0.1)',
          border: '1px solid rgba(45,212,191,0.25)',
          borderRadius: '20px', padding: '3px 10px',
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#2DD4BF',
            boxShadow: '0 0 5px #2DD4BF',
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{ color: '#2DD4BF', fontSize: '0.65rem', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {activities.map((activity, i) => {
          const config = typeConfig[activity.type];
          return (
            <motion.div
              key={activity._id || i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 + 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              whileHover={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {/* User Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: '10px',
                background: `${activity.userColor}25`,
                border: `1px solid ${activity.userColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: activity.userColor,
                flexShrink: 0,
              }}>
                {activity.userInitials}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  color: 'rgba(226,232,240,0.85)',
                  fontSize: '0.78rem',
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  <span style={{ color: 'white', fontWeight: 600 }}>{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span style={{ color: config.color }}>{activity.target}</span>
                </p>
                <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.65rem', marginTop: 2 }}>
                  {activity.time}
                </p>
              </div>

              {/* Type Icon */}
              <div style={{
                width: 24, height: 24, borderRadius: '8px',
                background: config.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: config.color, flexShrink: 0,
              }}>
                <config.Icon size={12} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All */}
      <button style={{
        width: '100%', marginTop: 12,
        background: 'rgba(47,128,237,0.08)',
        border: '1px solid rgba(47,128,237,0.2)',
        borderRadius: '10px',
        padding: '8px',
        color: '#2F80ED',
        fontSize: '0.78rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}>
        View All Activity →
      </button>
    </GlassCard>
  );
}
