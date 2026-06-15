import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Globe, MapPin, Users, Building2 } from 'lucide-react'
import { companyApi } from '../../api/company.api'
import { jobsApi } from '../../api/jobs.api'
import JobCard from '../../components/jobs/JobCard'
import Spinner from '../../components/ui/Spinner'

export default function CompanyProfilePage() {
  const { id } = useParams()

  const { data: company, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyApi.getCompany(id).then((r) => r.data.data),
  })

  const { data: jobs = [] } = useQuery({
    queryKey: ['companyJobs', id],
    queryFn: () => jobsApi.getJobs({ page: 0, size: 20 }).then((r) =>
      (r.data.data?.content || []).filter((j) => j.companyId === id && j.isActive)),
    enabled: !!id,
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (!company) return <div className="text-center py-16 text-gray-500">Company not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <div className="flex items-start gap-6">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="w-24 h-24 rounded-2xl object-cover border border-gray-100" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-4xl">
              {company.name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              {company.isVerified && (
                <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">✓ Verified</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {company.industry && <span className="flex items-center gap-1"><Building2 size={14} />{company.industry}</span>}
              {company.size && <span className="flex items-center gap-1"><Users size={14} />{company.size} employees</span>}
              {company.location && <span className="flex items-center gap-1"><MapPin size={14} />{company.location}</span>}
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                  <Globe size={14} /> Website
                </a>
              )}
            </div>
            {company.description && (
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">{company.description}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Open Positions ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No open positions at this time</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  )
}
