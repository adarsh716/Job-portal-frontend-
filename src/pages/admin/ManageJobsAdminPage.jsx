import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Trash2 } from 'lucide-react'
import { adminApi } from '../../api/admin.api'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const TYPE_LABELS = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract', INTERNSHIP: 'Internship', REMOTE: 'Remote',
}

export default function ManageJobsAdminPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['adminJobs', page],
    queryFn: () => adminApi.getAllJobs({ page, size: 15 }).then((r) => r.data.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (jobId) => adminApi.deleteJob(jobId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminJobs'] })
      toast.success('Job deleted')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Delete failed'),
  })

  const jobs = data?.content || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight">Manage Jobs</h1>
        <p className="text-[13px] text-content-secondary mt-1">
          {data?.totalElements ? `${data.totalElements} jobs posted` : ''}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs" description="No jobs have been posted yet" />
      ) : (
        <>
          <div className="card overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    {['Job', 'Company', 'Type', 'Applicants', 'Posted', 'Status', ''].map((h, i) => (
                      <th key={i} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[13px] text-content-primary">{job.title}</p>
                        <p className="text-[11px] text-content-tertiary mt-0.5">{job.location || 'No location'}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-content-secondary">{job.companyName || '-'}</td>
                      <td className="px-5 py-3.5 text-[12px] text-content-tertiary">{TYPE_LABELS[job.type] || job.type || '-'}</td>
                      <td className="px-5 py-3.5 text-[13px] text-content-secondary">{job.applicantCount || 0}</td>
                      <td className="px-5 py-3.5 text-[13px] text-content-secondary">{formatDate(job.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={job.isActive ? 'success' : 'default'} size="sm">
                          {job.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setDeleteTarget(job)}
                          className="p-1.5 rounded-lg transition-colors text-content-tertiary hover:text-status-error hover:bg-[rgba(239,68,68,0.08)]"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Delete Job"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
