import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, CheckCircle } from 'lucide-react'
import { adminApi } from '../../api/admin.api'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function ManageCompaniesPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [verifyTarget, setVerifyTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['adminCompanies', page],
    queryFn: () => adminApi.getCompanies({ page, size: 15 }).then((r) => r.data.data),
  })

  const verifyMutation = useMutation({
    mutationFn: (companyId) => adminApi.verifyCompany(companyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminCompanies'] })
      toast.success('Company verified!')
      setVerifyTarget(null)
    },
    onError: () => toast.error('Verification failed'),
  })

  const companies = data?.content || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight">Manage Companies</h1>
        <p className="text-[13px] text-content-secondary mt-1">
          {data?.totalElements ? `${data.totalElements} companies registered` : ''}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : companies.length === 0 ? (
        <EmptyState icon={Building2} title="No companies" description="No companies have been registered yet" />
      ) : (
        <>
          <div className="card overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    {['Company', 'Industry', 'Location', 'Created', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {c.logoUrl ? (
                            <img
                              src={c.logoUrl}
                              alt={c.name}
                              className="w-8 h-8 rounded-lg object-cover"
                              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-[#a5b4fc]"
                              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}
                            >
                              {c.name?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                          <span className="font-medium text-[13px] text-content-primary">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-content-secondary">{c.industry || '-'}</td>
                      <td className="px-5 py-3.5 text-[13px] text-content-secondary">{c.location || '-'}</td>
                      <td className="px-5 py-3.5 text-[13px] text-content-secondary">{formatDate(c.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={c.isVerified ? 'success' : 'warning'} size="sm" dot>
                          {c.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {!c.isVerified && (
                          <button
                            onClick={() => setVerifyTarget(c)}
                            className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                            style={{ color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
                          >
                            <CheckCircle size={12} /> Verify
                          </button>
                        )}
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
        isOpen={!!verifyTarget}
        onClose={() => setVerifyTarget(null)}
        onConfirm={() => verifyMutation.mutate(verifyTarget.id)}
        title="Verify Company"
        message={`Are you sure you want to verify "${verifyTarget?.name}"? This will mark them as a trusted employer.`}
        confirmLabel="Verify"
      />
    </div>
  )
}
