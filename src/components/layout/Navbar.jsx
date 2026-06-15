import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Zap, Menu, X, ChevronDown, LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import NotificationDropdown from '../notifications/NotificationDropdown'
import Button from '../ui/Button'

function NavLink({ to, children }) {
  const { pathname } = useLocation()
  const isActive = pathname === to || pathname.startsWith(to + '/')
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
        isActive ? 'text-content-primary' : 'text-content-secondary hover:text-content-primary'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent-primary rounded-full" />
      )}
    </Link>
  )
}

function AvatarMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const initial = user?.email?.[0]?.toUpperCase() || '?'
  const roleName = user?.role?.replace('_', ' ') || ''

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const profilePath =
    user?.role === 'JOB_SEEKER' ? '/profile'
    : user?.role === 'EMPLOYER' ? '/employer/company'
    : null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-all duration-200"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {initial}
        </div>
        <ChevronDown size={13} className="text-content-tertiary" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-1.5 z-50 animate-slide-down"
          style={{ background: '#1a1a24' }}
        >
          <div className="px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <p className="text-[13px] font-medium text-content-primary truncate">{user?.email}</p>
            <p className="text-[11px] text-content-tertiary mt-0.5 capitalize">{roleName.toLowerCase()}</p>
          </div>

          {profilePath && (
            <Link
              to={profilePath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-content-secondary hover:text-content-primary hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <User size={14} /> Profile
            </Link>
          )}

          <div className="my-1 border-t border-[rgba(255,255,255,0.06)]" />

          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-status-error hover:bg-[rgba(239,68,68,0.08)] transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  const seekerLinks = [
    { to: '/jobs', label: 'Browse Jobs' },
    { to: '/applications', label: 'My Applications' },
    { to: '/saved-jobs', label: 'Saved Jobs' },
  ]
  const employerLinks = [
    { to: '/employer/dashboard', label: 'Dashboard' },
    { to: '/employer/jobs/new', label: 'Post Job' },
    { to: '/employer/jobs', label: 'My Jobs' },
  ]
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin' },
  ]
  const publicLinks = [
    { to: '/jobs', label: 'Jobs' },
  ]

  const links =
    user?.role === 'JOB_SEEKER' ? seekerLinks
    : user?.role === 'EMPLOYER' ? employerLinks
    : user?.role === 'ADMIN' ? adminLinks
    : publicLinks

  const dashboardPath =
    user?.role === 'JOB_SEEKER' ? '/dashboard'
    : user?.role === 'EMPLOYER' ? '/employer/dashboard'
    : user?.role === 'ADMIN' ? '/admin/dashboard'
    : null

  return (
    <nav
      className="sticky top-0 z-40 h-14 flex items-center border-b border-[rgba(255,255,255,0.06)]"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <span
            className="text-base font-bold"
            style={{ background: 'linear-gradient(135deg, #f0f0f5, #9898a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            JobPortal
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {links.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              {dashboardPath && (
                <Link
                  to={dashboardPath}
                  className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-[rgba(255,255,255,0.06)] transition-all duration-200"
                >
                  <LayoutDashboard size={18} />
                </Link>
              )}
              <NotificationDropdown />
              <AvatarMenu user={user} logout={logout} />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-content-secondary hover:bg-[rgba(255,255,255,0.06)] transition-all"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="absolute top-14 left-0 right-0 border-b border-[rgba(255,255,255,0.06)] px-4 py-4 flex flex-col gap-1 md:hidden animate-slide-down"
          style={{ background: '#111118' }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-content-secondary hover:text-content-primary hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)] flex gap-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-sm text-status-error px-3 py-2"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" fullWidth>Sign in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" fullWidth>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
