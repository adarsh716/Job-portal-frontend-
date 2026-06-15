import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, Users, BarChart2, Plus, ArrowRight, Eye, Pencil } from 'lucide-react'
import { useMyJobs } from '../../hooks/useJobs'
import Button from '../../components/ui/Button'
import StatsCard from '../../components/ui/StatsCard'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'

const CARD = {
  background: '#13131a',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 14,
  overflow: 'hidden',
}

export default function EmployerDashboard() {
  const navigate = useNavigate()
  const { data: jobs = [], isLoading } = useMyJobs()

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)
  const activeJobs = jobs.filter((j) => j.isActive).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em' }}>Employer Dashboard</h1>
          <p style={{ fontSize: 14, color: '#9898a8', marginTop: 4 }}>Manage your job listings and applicants</p>
        </div>
        <Button onClick={() => navigate('/employer/jobs/new')} leftIcon={Plus}>Post New Job</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatsCard icon={Briefcase} title="Jobs Posted" value={jobs.length} color="indigo" />
        <StatsCard icon={Users} title="Total Applicants" value={totalApplicants} color="violet" />
        <StatsCard icon={BarChart2} title="Active Listings" value={activeJobs} color="emerald" />
      </div>

      {/* Recent Jobs */}
      <div style={CARD}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>Recent Job Listings</h2>
          <Link to="/employer/jobs" style={{ fontSize: 12, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            Manage all <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}><Spinner /></div>
        ) : jobs.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '48px 20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <Briefcase size={20} style={{ color: '#6366f1', opacity: 0.6 }} />
            </div>
            <p style={{ fontSize: 13, color: '#9898a8' }}>No jobs posted yet</p>
            <Button onClick={() => navigate('/employer/jobs/new')} leftIcon={Plus} size="sm">Post your first job</Button>
          </div>
        ) : (
          <div>
            {jobs.slice(0, 6).map((job, i) => (
              <div key={job.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                padding: '12px 20px',
                borderBottom: i < Math.min(jobs.length, 6) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.15s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                    <span style={{ fontSize: 12, color: '#5a5a6e' }}>{job.applicantCount || 0} applicants</span>
                    <Badge variant={job.isActive ? 'success' : 'default'} size="sm">{job.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <Link
                    to={`/employer/jobs/${job.id}/applicants`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#9898a8', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f0f0f5' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9898a8' }}
                  >
                    <Eye size={12} /> Applicants
                  </Link>
                  <Link
                    to={`/employer/jobs/${job.id}/edit`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#9898a8', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f0f0f5' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9898a8' }}
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
