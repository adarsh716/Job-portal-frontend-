import { useEffect, useRef, useState } from 'react'
import { Bell, Briefcase, Calendar, Star, Info, Check } from 'lucide-react'
import { useNotifications, useMarkAllAsRead, useMarkAsRead, useUnreadCount } from '../../hooks/useNotifications'
import { timeAgo } from '../../utils/formatDate'
import { useAuth } from '../../hooks/useAuth'

const typeConfig = {
  APPLICATION_UPDATE: { icon: Briefcase, color: '#a5b4fc', bg: 'rgba(99,102,241,0.15)' },
  NEW_APPLICANT: { icon: Briefcase, color: '#a5b4fc', bg: 'rgba(99,102,241,0.15)' },
  INTERVIEW: { icon: Calendar, color: '#c4b5fd', bg: 'rgba(139,92,246,0.15)' },
  OFFER: { icon: Star, color: '#6ee7b7', bg: 'rgba(16,185,129,0.15)' },
  SYSTEM: { icon: Info, color: '#93c5fd', bg: 'rgba(59,130,246,0.15)' },
}

function NotifIcon({ type }) {
  const cfg = typeConfig[type] || typeConfig.SYSTEM
  const Icon = cfg.icon
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ background: cfg.bg }}
    >
      <Icon size={15} style={{ color: cfg.color }} />
    </div>
  )
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { isAuthenticated } = useAuth()
  const { data: count = 0 } = useUnreadCount()
  const { data: notifications = [] } = useNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!isAuthenticated) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-[rgba(255,255,255,0.06)] transition-all duration-200"
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-status-error text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-pulse">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-slide-down"
          style={{ background: '#1a1a24' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-sm font-semibold text-content-primary">Notifications</span>
            {count > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                className="flex items-center gap-1 text-[11px] text-accent-primary hover:text-[#818cf8] transition-colors"
              >
                <Check size={11} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell size={24} className="text-content-disabled" />
                <p className="text-sm text-content-tertiary">All caught up!</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read && markAsRead.mutate(n.id)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 border-b border-[rgba(255,255,255,0.04)] last:border-0"
                  style={{ background: !n.read ? 'rgba(99,102,241,0.05)' : 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = !n.read ? 'rgba(99,102,241,0.05)' : 'transparent'}
                >
                  <NotifIcon type={n.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-content-primary leading-snug">{n.message}</p>
                    <p className="text-[11px] text-content-tertiary mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)]">
            <button className="text-[12px] text-content-tertiary hover:text-content-secondary transition-colors">
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
