import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, FileText, Users } from 'lucide-react'
import { useJobApplicants, useUpdateStatus } from '../../hooks/useApplications'
import { useJob } from '../../hooks/useJobs'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatDate } from '../../utils/formatDate'

const STATUSES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'REJECTED']
const TABS = ['ALL', ...STATUSES]

const STATUS_BADGE = {
  APPLIED: 'info', SHORTLISTED: 'warning', INTERVIEW: 'purple', OFFERED: 'success', REJECTED: 'error',
}

function StatusSelect({ applicationId, currentStatus }) {
  const updateStatus = useUpdateStatus()
  return (
    <select
      value={currentStatus}
      onChange={(e) => updateStatus.mutate({ id: applicationId, status: e.target.value })}
      className="text-[12px] rounded-lg px-2 py-1.5 outline-none transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#c8c8d4' }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} style={{ background: '#1a1a24' }}>
          {s[0] + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  )
}

function ApplicantRow({ app }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr
        className="cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.02)]"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#a5b4fc] shrink-0"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.15)' }}
            >
              {app.seekerName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-[13px] font-medium text-content-primary">{app.seekerName}</p>
              <p className="text-[11px] text-content-tertiary">{app.seekerEmail}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-3.5 text-[13px] text-content-secondary">{formatDate(app.appliedAt)}</td>
        <td className="px-5 py-3.5">
          <Badge variant={STATUS_BADGE[app.status] || 'default'} size="sm">{app.status}</Badge>
        </td>
        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
          <StatusSelect applicationId={app.id} currentStatus={app.status} />
        </td>
        <td className="px-5 py-3.5 text-content-tertiary">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: 'rgba(99,102,241,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <td colSpan={5} className="px-5 py-4">
            <div className="flex flex-col gap-3">
              {app.coverLetter && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-content-tertiary mb-1.5">Cover Letter</p>
                  <p className="text-[13px] text-content-secondary leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
                </div>
              )}
              {app.resumeUrl && (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-accent-primary hover:text-[#818cf8] transition-colors"
                >
                  <FileText size={14} /> View Resume
                </a>
              )}
              {!app.coverLetter && !app.resumeUrl && (
                <p className="text-[13px] text-content-tertiary italic">No additional details provided</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function ApplicantsPage() {
  const { id: jobId } = useParams()
  const [activeTab, setActiveTab] = useState('ALL')
  const { data: applications = [], isLoading } = useJobApplicants(jobId)
  const { data: job } = useJob(jobId)

  const filtered = activeTab === 'ALL'
    ? applications
    : applications.filter((a) => a.status === activeTab)

  function count(tab) {
    return tab === 'ALL' ? applications.length : applications.filter((a) => a.status === tab).length
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight">Applicants</h1>
        {job && (
          <p className="text-[13px] text-content-secondary mt-1">
            {job.title} · {applications.length} applicant{applications.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6">
        {TABS.filter((t) => t === 'ALL' || count(t) > 0).map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-200 shrink-0"
              style={isActive
                ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#5a5a6e' }
              }
            >
              {tab === 'ALL' ? 'All' : tab[0] + tab.slice(1).toLowerCase()}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full"
                style={isActive
                  ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }
                  : { background: 'rgba(255,255,255,0.06)', color: '#5a5a6e' }
                }
              >
                {count(tab)}
              </span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={activeTab === 'ALL' ? 'No applicants yet' : `No ${activeTab.toLowerCase()} applicants`}
          description="Applicants will appear here once they apply."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Applicant', 'Applied', 'Status', 'Update Status', ''].map((h, i) => (
                    <th key={i} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                {filtered.map((app) => <ApplicantRow key={app.id} app={app} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
