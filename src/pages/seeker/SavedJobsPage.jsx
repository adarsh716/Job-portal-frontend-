import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import JobCard from '../../components/jobs/JobCard'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { Heart } from 'lucide-react'
import api from '../../api/axios'
import { Link } from 'react-router-dom'

export default function SavedJobsPage() {
  const qc = useQueryClient()

  const { data: savedJobs = [], isLoading } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: () => api.get('/saved-jobs').then((r) => r.data.data || []),
  })

  const unsaveMutation = useMutation({
    mutationFn: (jobId) => api.delete(`/saved-jobs/${jobId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['savedJobs'] }),
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em' }}>Saved Jobs</h1>
          <p style={{ fontSize: 13, color: '#9898a8', marginTop: 4 }}>
            {savedJobs.length > 0
              ? `${savedJobs.length} saved job${savedJobs.length === 1 ? '' : 's'}`
              : 'Jobs you bookmark for later'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size="lg" /></div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved jobs yet"
          description="When you find a job you like, click the heart icon to save it here."
          renderAction={() => (
            <Link
              to="/jobs"
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '8px 16px',
                borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#fff',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                textDecoration: 'none', transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.45)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.35)' }}
            >
              Browse Jobs
            </Link>
          )}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved
              onUnsave={(id) => unsaveMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
