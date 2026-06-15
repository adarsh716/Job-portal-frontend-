import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Pencil, Users, Trash2, Briefcase } from 'lucide-react'
import { useMyJobs, useDeleteJob } from '../../hooks/useJobs'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatDate'
import { formatSalary } from '../../utils/formatSalary'

const TYPE_LABELS = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract', INTERNSHIP: 'Internship', REMOTE: 'Remote',
}

export default function ManageJobsPage() {
  const navigate = useNavigate()
  const [deleteId, setDeleteId] = useState(null)
  const { data: jobs = [], isLoading } = useMyJobs()
  const deleteJob = useDeleteJob()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em' }}>Manage Jobs</h1>
          <p style={{ fontSize: 13, color: '#9898a8', marginTop: 4 }}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Button onClick={() => navigate('/employer/jobs/new')} leftIcon={Plus}>Post New Job</Button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Post your first job to start receiving applications."
          actionLabel="Post a Job"
          onAction={() => navigate('/employer/jobs/new')}
        />
      ) : (
        <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Job Title', 'Type', 'Location', 'Salary', 'Applicants', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="th-cell">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="table-row">
                    <td className="td-cell">
                      <p style={{ fontWeight: 500, color: '#f0f0f5', fontSize: 13 }}>{job.title}</p>
                      <p style={{ fontSize: 11, color: '#5a5a6e', marginTop: 2 }}>{formatDate(job.createdAt)}</p>
                    </td>
                    <td className="td-cell" style={{ fontSize: 13, color: '#9898a8' }}>{TYPE_LABELS[job.type] || job.type || '-'}</td>
                    <td className="td-cell" style={{ fontSize: 13, color: '#9898a8' }}>{job.location || '-'}</td>
                    <td className="td-cell" style={{ fontSize: 13, color: '#9898a8' }}>{formatSalary(job.salaryMin, job.salaryMax)}</td>
                    <td className="td-cell">
                      <Link
                        to={`/employer/jobs/${job.id}/applicants`}
                        style={{ fontSize: 13, fontWeight: 500, color: '#6366f1', textDecoration: 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#6366f1' }}
                      >
                        {job.applicantCount || 0}
                      </Link>
                    </td>
                    <td className="td-cell">
                      <Badge variant={job.isActive ? 'success' : 'default'} size="sm">{job.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="td-cell">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Link to={`/employer/jobs/${job.id}/applicants`} className="icon-btn icon-btn-accent" title="Applicants">
                          <Users size={14} />
                        </Link>
                        <Link to={`/employer/jobs/${job.id}/edit`} className="icon-btn" title="Edit">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => setDeleteId(job.id)} className="icon-btn icon-btn-danger" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteJob.mutate(deleteId); setDeleteId(null) }}
        title="Delete Job"
        message="Are you sure you want to delete this job? All applications will also be lost."
        confirmLabel="Delete"
      />
    </div>
  )
}
