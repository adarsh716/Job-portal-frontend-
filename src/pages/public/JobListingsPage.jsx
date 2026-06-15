import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react'
import { useJobs } from '../../hooks/useJobs'
import { useAuth } from '../../hooks/useAuth'
import api from '../../api/axios'
import JobCard from '../../components/jobs/JobCard'
import JobFilters from '../../components/jobs/JobFilters'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { Briefcase } from 'lucide-react'

const INPUT_STYLE = {
  flex: 1, background: 'transparent', border: 'none', outline: 'none',
  fontSize: 14, color: '#f0f0f5', fontFamily: 'inherit',
}

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
    experienceMin: searchParams.get('experienceMin') || '',
  })
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '')
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [locationFocused, setLocationFocused] = useState(false)
  const { user } = useAuth()

  const activeSearch = searchParams.get('search') || ''
  const activeLocation = searchParams.get('location') || ''

  const params = {
    search: activeSearch || undefined,
    location: activeLocation || undefined,
    type: filters.type || undefined,
    salaryMin: filters.salaryMin || undefined,
    salaryMax: filters.salaryMax || undefined,
    experienceMin: filters.experienceMin || undefined,
    page, size: 10, sort,
  }

  const { data, isLoading } = useJobs(params)
  const jobs = data?.content || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  const qc = useQueryClient()
  const { data: savedJobsList = [] } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: () => api.get('/saved-jobs').then((r) => r.data.data || []),
    enabled: user?.role === 'JOB_SEEKER',
  })
  const savedIds = new Set(savedJobsList.map((j) => j.id))

  const saveMutation = useMutation({
    mutationFn: (jobId) => api.post(`/saved-jobs/${jobId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['savedJobs'] }),
  })
  const unsaveMutation = useMutation({
    mutationFn: (jobId) => api.delete(`/saved-jobs/${jobId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['savedJobs'] }),
  })

  function handleSearch(e) {
    e.preventDefault()
    const p = new URLSearchParams(searchParams)
    if (searchInput) {
      p.set('search', searchInput)
    } else {
      p.delete('search')
    }
    if (locationInput) {
      p.set('location', locationInput)
    } else {
      p.delete('location')
    }
    setSearchParams(p)
    setPage(0)
  }

  function handleFiltersChange(f) {
    setFilters(f)
    setPage(0)
    setShowFilterDrawer(false)
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Search bar */}
      <div style={{ background: '#111118', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Search input */}
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${searchFocused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.09)'}`,
              transition: 'border-color 0.2s ease',
            }}>
              <Search size={15} style={{ color: '#5a5a6e', flexShrink: 0 }} />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Job title, skills, or company..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={INPUT_STYLE}
              />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5a6e', padding: 0, display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>
            {/* Location input */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, width: 200,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${locationFocused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.09)'}`,
              transition: 'border-color 0.2s ease',
            }}>
              <MapPin size={15} style={{ color: '#5a5a6e', flexShrink: 0 }} />
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Location..."
                onFocus={() => setLocationFocused(true)}
                onBlur={() => setLocationFocused(false)}
                style={INPUT_STYLE}
              />
            </div>
            {/* Search button */}
            <button
              type="submit"
              style={{
                padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#fff',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.45)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.3)' }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', display: 'flex', gap: 24 }}>
        {/* Sidebar filters (desktop) */}
        <aside style={{ width: 256, flexShrink: 0 }}>
          <JobFilters
            filters={filters}
            onChange={handleFiltersChange}
            onClear={() => { setFilters({}); setPage(0) }}
          />
        </aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setShowFilterDrawer((s) => !s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9898a8',
                  padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.15s ease',
                }}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              <p style={{ fontSize: 13, color: '#9898a8' }}>
                {isLoading ? 'Searching…' : `${totalElements.toLocaleString()} jobs found`}
              </p>
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(0) }}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13, color: '#f0f0f5',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>

          {/* Mobile filter drawer */}
          {showFilterDrawer && (
            <div style={{ marginBottom: 20 }}>
              <JobFilters
                filters={filters}
                onChange={handleFiltersChange}
                onClear={() => { setFilters({}); setPage(0); setShowFilterDrawer(false) }}
              />
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size="lg" /></div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description="Try adjusting your search terms or filters to find more opportunities."
              actionLabel="Clear filters"
              onAction={() => { setFilters({}); setSearchInput(''); setSearchParams({}); setPage(0) }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedIds.has(job.id)}
                  onSave={(id) => saveMutation.mutate(id)}
                  onUnsave={(id) => unsaveMutation.mutate(id)}
                />
              ))}
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
