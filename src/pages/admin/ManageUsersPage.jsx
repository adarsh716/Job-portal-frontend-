import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Search } from 'lucide-react'
import { adminApi } from '../../api/admin.api'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const ROLE_BADGE = { JOB_SEEKER: 'info', EMPLOYER: 'purple', ADMIN: 'error' }

export default function ManageUsersPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [banTarget, setBanTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminApi.getUsers({ page, size: 15 }).then((r) => r.data.data),
  })

  const banMutation = useMutation({
    mutationFn: ({ userId, active }) => adminApi.setUserActive(userId, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminUsers'] })
      toast.success(banTarget?.isActive ? 'User banned' : 'User unbanned')
      setBanTarget(null)
    },
    onError: () => toast.error('Action failed'),
  })

  const users = data?.content || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-content-primary tracking-tight">Manage Users</h1>
          <p className="text-[13px] text-content-secondary mt-1">
            {data?.totalElements ? `${data.totalElements} registered users` : ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="There are no registered users" />
      ) : (
        <>
          <div className="card overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    {['Email', 'Role', 'Joined', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-content-tertiary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-content-primary text-[13px]">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={ROLE_BADGE[u.role] || 'default'} size="sm">{u.role}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-content-secondary">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.isActive ? 'success' : 'error'} size="sm">
                          {u.isActive ? 'Active' : 'Banned'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => setBanTarget(u)}
                            className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                            style={u.isActive
                              ? { color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }
                              : { color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }
                            }
                          >
                            {u.isActive ? 'Ban' : 'Unban'}
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
        isOpen={!!banTarget}
        onClose={() => setBanTarget(null)}
        onConfirm={() => banMutation.mutate({ userId: banTarget.id, active: !banTarget.isActive })}
        title={banTarget?.isActive ? 'Ban User' : 'Unban User'}
        message={banTarget?.isActive
          ? `Are you sure you want to ban ${banTarget?.email}? They will no longer be able to log in.`
          : `Are you sure you want to unban ${banTarget?.email}?`}
        confirmLabel={banTarget?.isActive ? 'Ban User' : 'Unban User'}
      />
    </div>
  )
}
