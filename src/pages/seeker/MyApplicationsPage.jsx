import { useState } from 'react'
import { useMyApplications, useWithdraw } from '../../hooks/useApplications'
import StatusTimeline from '../../components/applications/StatusTimeline'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { FileText, Building2, Calendar } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'

const TABS = ['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN']

const STATUS_BADGE = {
  APPLIED: 'info',
  SHORTLISTED: 'warning',
  INTERVIEW: 'purple',
  OFFERED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'default',
}

const TAB_LABELS = {
  ALL: 'All',
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  OFFERED: 'Offered',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}

const CARD = {
  background: '#13131a',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 14,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [withdrawId, setWithdrawId] = useState(null)
  const { data: applications = [], isLoading } = useMyApplications()
  const withdraw = useWithdraw()

  const filtered = activeTab === 'ALL'
    ? applications
    : applications.filter((a) => a.status === activeTab)

  function count(tab) {
    return tab === 'ALL' ? applications.length : applications.filter((a) => a.status === tab).length
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em' }}>My Applications</h1>
        <p style={{ fontSize: 13, color: '#9898a8', marginTop: 4 }}>Track the status of all your job applications</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }}>
        {TABS.filter((t) => t === 'ALL' || count(t) > 0).map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: isActive ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
                color: isActive ? '#a5b4fc' : '#5a5a6e',
              }}
            >
              {TAB_LABELS[tab]}
              <span style={{
                fontSize: 11, padding: '1px 6px', borderRadius: 9999,
                background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                color: isActive ? '#a5b4fc' : '#5a5a6e',
              }}>
                {count(tab)}
              </span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start applying to jobs to track them here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((app) => (
            <div key={app.id} style={CARD}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#a5b4fc',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)',
                  }}>
                    {app.companyName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f5', lineHeight: 1.3 }}>{app.jobTitle}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5a5a6e' }}>
                        <Building2 size={11} /> {app.companyName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5a5a6e' }}>
                        <Calendar size={11} /> Applied {formatDate(app.appliedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={STATUS_BADGE[app.status] || 'default'} size="sm">
                  {app.status}
                </Badge>
              </div>

              {/* Timeline */}
              {!['WITHDRAWN'].includes(app.status) && (
                <div style={{ overflowX: 'auto' }}>
                  <StatusTimeline status={app.status} />
                </div>
              )}

              {/* Cover letter preview */}
              {app.coverLetter && (
                <div style={{
                  padding: '10px 12px', borderRadius: 8, fontSize: 12, color: '#5a5a6e',
                  lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {app.coverLetter}
                </div>
              )}

              {/* Actions */}
              {app.status === 'APPLIED' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  <button
                    onClick={() => setWithdrawId(app.id)}
                    style={{
                      fontSize: 13, fontWeight: 500, color: '#ef4444',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                  >
                    Withdraw Application
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!withdrawId}
        onClose={() => setWithdrawId(null)}
        onConfirm={() => { withdraw.mutate(withdrawId); setWithdrawId(null) }}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmLabel="Withdraw"
      />
    </div>
  )
}
