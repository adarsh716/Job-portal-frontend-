import { Link } from 'react-router-dom'
import { Briefcase, CheckCircle, Star, FileText, Clock, ArrowRight } from 'lucide-react'
import { useMyApplications } from '../../hooks/useApplications'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Badge from '../../components/ui/Badge'
import StatsCard from '../../components/ui/StatsCard'
import Spinner from '../../components/ui/Spinner'
import { formatDate } from '../../utils/formatDate'

const STATUS_BADGE = {
  APPLIED: 'info', SHORTLISTED: 'warning', INTERVIEW: 'purple', OFFERED: 'success', REJECTED: 'error', WITHDRAWN: 'default',
}

const CARD = {
  background: '#13131a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden',
}

function ProfileRing({ pct }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke="url(#ring-gradient)" strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 44 44)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <text x="44" y="49" textAnchor="middle" style={{ fontSize: 16, fontWeight: 700, fill: '#f0f0f5' }}>{pct}%</text>
    </svg>
  )
}

export default function SeekerDashboard() {
  const { data: applications = [], isLoading } = useMyApplications()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile/me').then((r) => r.data.data),
  })

  const counts = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    interview: applications.filter((a) => a.status === 'INTERVIEW').length,
    offered: applications.filter((a) => a.status === 'OFFERED').length,
  }

  const profileFields = ['fullName', 'phone', 'bio', 'resumeUrl', 'skills']
  const completed = profileFields.filter((f) => {
    const v = profile?.[f]
    return Array.isArray(v) ? v.length > 0 : !!v
  }).length
  const profilePct = Math.round((completed / profileFields.length) * 100)

  const profileItems = [
    { label: 'Name added', done: !!profile?.fullName },
    { label: 'Phone number', done: !!profile?.phone },
    { label: 'Bio written', done: !!profile?.bio },
    { label: 'Skills added', done: (profile?.skills?.length || 0) > 0 },
    { label: 'Resume uploaded', done: !!profile?.resumeUrl },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em' }}>
          {profile?.fullName ? `Good morning, ${profile.fullName.split(' ')[0]}` : 'Welcome back'} 👋
        </h1>
        <p style={{ fontSize: 13, color: '#9898a8', marginTop: 4 }}>Here&apos;s your job search overview.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        <StatsCard icon={FileText} title="Total Applied" value={counts.total} color="indigo" />
        <StatsCard icon={Star} title="Shortlisted" value={counts.shortlisted} color="amber" />
        <StatsCard icon={Clock} title="Interviews" value={counts.interview} color="violet" />
        <StatsCard icon={CheckCircle} title="Offers" value={counts.offered} color="emerald" />
      </div>

      {/* Bottom 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        {/* Recent Applications */}
        <div style={CARD}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>Recent Applications</h2>
            <Link to="/applications" style={{ fontSize: 12, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}><Spinner /></div>
          ) : applications.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '40px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={20} style={{ color: '#6366f1', opacity: 0.6 }} />
              </div>
              <p style={{ fontSize: 13, color: '#9898a8' }}>No applications yet</p>
              <Link to="/jobs" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none' }}>Browse jobs →</Link>
            </div>
          ) : (
            <div>
              {applications.slice(0, 5).map((app, i) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: i < Math.min(applications.length, 5) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f5' }}>{app.jobTitle}</p>
                    <p style={{ fontSize: 11, color: '#5a5a6e', marginTop: 2 }}>{app.companyName} · {formatDate(app.appliedAt)}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[app.status] || 'default'} size="sm">{app.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Completion */}
        <div style={{ ...CARD, padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>Profile Completion</h2>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <ProfileRing pct={profilePct} />
            <p style={{ fontSize: 12, color: '#9898a8', textAlign: 'center', lineHeight: 1.5 }}>
              {profilePct === 100 ? 'Your profile is complete!' : 'Complete your profile to attract more employers'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {profileItems.map(({ label, done }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                  {done
                    ? <CheckCircle size={10} style={{ color: '#10b981' }} />
                    : <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'block' }} />}
                </div>
                <span style={{ fontSize: 12, color: done ? '#5a5a6e' : '#f0f0f5', textDecoration: done ? 'line-through' : 'none' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {profilePct < 100 && (
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '8px 0', fontSize: 13, fontWeight: 500, color: '#a5b4fc',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'none' }}
              >
                Complete Profile
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
