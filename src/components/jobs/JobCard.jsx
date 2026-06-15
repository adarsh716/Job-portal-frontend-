import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Heart, DollarSign, Users } from 'lucide-react'
import { timeAgo } from '../../utils/formatDate'
import { formatSalary } from '../../utils/formatSalary'
import { calculateMatchPercent } from '../../utils/skillMatch'
import { useAuth } from '../../hooks/useAuth'
import Badge from '../ui/Badge'

const TYPE_CONFIG = {
  FULL_TIME:   { label: 'Full Time', variant: 'indigo' },
  PART_TIME:   { label: 'Part Time', variant: 'warning' },
  CONTRACT:    { label: 'Contract', variant: 'purple' },
  INTERNSHIP:  { label: 'Internship', variant: 'info' },
  REMOTE:      { label: 'Remote', variant: 'success' },
}

function matchVariant(pct) {
  if (pct >= 70) return 'success'
  if (pct >= 40) return 'warning'
  return 'error'
}

export default function JobCard({ job, seekerSkills, isSaved, onSave, onUnsave }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [hovered, setHovered] = useState(false)
  const matchPct = user?.role === 'JOB_SEEKER' && seekerSkills?.length
    ? calculateMatchPercent(job.skillsRequired, seekerSkills)
    : null

  const typeConfig = TYPE_CONFIG[job.type] || { label: job.type, variant: 'default' }
  const companyInitial = job.companyName?.[0]?.toUpperCase() || '?'

  function handleSaveToggle(e) {
    e.stopPropagation()
    isSaved ? onUnsave?.(job.id) : onSave?.(job.id)
  }

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#13131a',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 14,
        padding: 20,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {/* Top row: company + title + save */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.companyName}
              style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#a5b4fc',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
            }}>
              {companyInitial}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: hovered ? '#a5b4fc' : '#f0f0f5', transition: 'color 0.2s ease', marginBottom: 3 }}>
              {job.title}
            </h3>
            <p style={{ fontSize: 12, color: '#9898a8' }}>{job.companyName}</p>
          </div>
        </div>

        {user?.role === 'JOB_SEEKER' && (
          <button
            onClick={handleSaveToggle}
            style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
              color: isSaved ? '#ef4444' : '#5a5a6e',
              background: isSaved ? 'rgba(239,68,68,0.1)' : 'transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isSaved ? 'rgba(239,68,68,0.1)' : 'transparent'; e.currentTarget.style.color = isSaved ? '#ef4444' : '#5a5a6e' }}
          >
            <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Type + meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        {job.type && <Badge variant={typeConfig.variant} size="sm">{typeConfig.label}</Badge>}
        {job.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9898a8' }}>
            <MapPin size={11} /> {job.location}
          </span>
        )}
        {(job.salaryMin || job.salaryMax) && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9898a8' }}>
            <DollarSign size={11} /> {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        )}
        {matchPct !== null && <Badge variant={matchVariant(matchPct)} size="sm">{matchPct}% match</Badge>}
      </div>

      {/* Skills */}
      {job.skillsRequired?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {job.skillsRequired.slice(0, 3).map((s) => (
            <span
              key={s}
              style={{
                padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 500,
                color: '#9898a8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {s}
            </span>
          ))}
          {job.skillsRequired.length > 3 && (
            <span style={{ padding: '2px 10px', borderRadius: 9999, fontSize: 11, color: '#5a5a6e', background: 'rgba(255,255,255,0.03)' }}>
              +{job.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Bottom: time + applicants */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#5a5a6e' }}>
          <Clock size={10} /> {timeAgo(job.createdAt)}
        </span>
        {job.applicantCount !== undefined && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#5a5a6e',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'translateX(-8px)' : 'none',
            transition: 'all 0.2s ease',
          }}>
            <Users size={10} /> {job.applicantCount} applicants
          </span>
        )}
      </div>

      {/* Hover: "View Job" button */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(4px)',
        transition: 'all 0.2s ease',
        pointerEvents: hovered ? 'auto' : 'none',
      }}>
        <span style={{
          padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, color: '#fff',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
        }}>
          View Job →
        </span>
      </div>
    </div>
  )
}
