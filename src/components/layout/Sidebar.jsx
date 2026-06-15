import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, FileText, Bookmark, Building2, PlusCircle, Briefcase, Users, Shield, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const seekerNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { to: '/jobs', label: 'Browse Jobs', icon: Briefcase },
]

const employerNav = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employer/company', label: 'Company Profile', icon: Building2 },
  { to: '/employer/jobs', label: 'Manage Jobs', icon: Briefcase },
  { to: '/employer/jobs/new', label: 'Post New Job', icon: PlusCircle },
]

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/jobs', label: 'All Jobs', icon: Briefcase },
]

export default function Sidebar() {
  const { role, user, logout } = useAuth()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [logoutHover, setLogoutHover] = useState(false)
  const [collapseHover, setCollapseHover] = useState(false)

  const nav =
    role === 'JOB_SEEKER' ? seekerNav
    : role === 'EMPLOYER' ? employerNav
    : role === 'ADMIN' ? adminNav
    : []

  const initial = user?.email?.[0]?.toUpperCase() || '?'
  const roleName = role?.replace('_', ' ') || ''

  return (
    <aside
      style={{
        background: '#111118',
        width: collapsed ? 64 : 220,
        position: 'fixed',
        left: 0,
        top: 56,
        bottom: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 30,
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {nav.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to || (to !== '/dashboard' && to !== '/employer/dashboard' && to !== '/admin/dashboard' && pathname.startsWith(to))
          const isHovered = hoveredItem === to
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              onMouseEnter={() => setHoveredItem(to)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '8px' : '8px 12px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'all 0.15s ease',
                color: isActive ? '#a5b4fc' : (isHovered ? '#f0f0f5' : '#9898a8'),
                background: isActive
                  ? 'rgba(99,102,241,0.12)'
                  : (isHovered ? 'rgba(255,255,255,0.05)' : 'transparent'),
                borderColor: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 8 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}>
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#f0f0f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
              <p style={{ fontSize: 10, color: '#5a5a6e', textTransform: 'capitalize' }}>
                {roleName.toLowerCase()}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Sign out' : undefined}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '8px' : '8px 12px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px solid transparent',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.15s ease',
            color: '#ef4444',
            background: logoutHover ? 'rgba(239,68,68,0.08)' : 'transparent',
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        onMouseEnter={() => setCollapseHover(true)}
        onMouseLeave={() => setCollapseHover(false)}
        style={{
          position: 'absolute',
          right: -12,
          top: 32,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
          background: collapseHover ? '#22222e' : '#1a1a24',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: collapseHover ? '#f0f0f5' : '#9898a8',
          transition: 'all 0.2s ease',
          zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
