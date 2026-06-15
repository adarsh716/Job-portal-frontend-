import { Link } from 'react-router-dom'
import { Users, Briefcase, Building2, FileText, ShieldCheck, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/admin.api'
import StatsCard from '../../components/ui/StatsCard'
import Spinner from '../../components/ui/Spinner'

const QUICK_LINKS = [
  { to: '/admin/users', icon: Users, title: 'Manage Users', desc: 'View, ban, and unban user accounts', color: 'indigo' },
  { to: '/admin/companies', icon: Building2, title: 'Manage Companies', desc: 'Review and verify company profiles', color: 'violet' },
  { to: '/admin/jobs', icon: Briefcase, title: 'Manage Jobs', desc: 'Review and remove job listings', color: 'emerald' },
]

const LINK_COLORS = {
  indigo: { border: 'rgba(99,102,241,0.2)', bg: 'rgba(99,102,241,0.08)', text: '#818cf8' },
  violet: { border: 'rgba(139,92,246,0.2)', bg: 'rgba(139,92,246,0.08)', text: '#a78bfa' },
  emerald: { border: 'rgba(16,185,129,0.2)', bg: 'rgba(16,185,129,0.08)', text: '#34d399' },
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats().then((r) => r.data.data),
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <ShieldCheck size={20} className="text-accent-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-content-primary tracking-tight">Admin Dashboard</h1>
          <p className="text-[13px] text-content-secondary mt-0.5">Platform overview and controls</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/users">
            <StatsCard icon={Users} title="Total Users" value={stats?.totalUsers ?? '—'} color="indigo" />
          </Link>
          <Link to="/admin/companies">
            <StatsCard icon={Building2} title="Total Companies" value={stats?.totalCompanies ?? '—'} color="violet" />
          </Link>
          <Link to="/admin/jobs">
            <StatsCard icon={Briefcase} title="Total Jobs" value={stats?.totalJobs ?? '—'} color="emerald" />
          </Link>
          <StatsCard icon={FileText} title="Applications" value={stats?.totalApplications ?? '—'} color="amber" />
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ to, icon: Icon, title, desc, color }) => {
          const c = LINK_COLORS[color]
          return (
            <Link
              key={to}
              to={to}
              className="card p-5 flex flex-col gap-3 card-hover group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <Icon size={18} style={{ color: c.text }} />
              </div>
              <div>
                <h3 className="font-semibold text-content-primary">{title}</h3>
                <p className="text-[13px] text-content-secondary mt-1 leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[12px] mt-auto" style={{ color: c.text }}>
                Go to {title.replace('Manage ', '')} <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
