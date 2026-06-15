import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Users, Calendar, Building2, Heart, ArrowLeft, CheckCircle } from 'lucide-react'
import { useJob } from '../../hooks/useJobs'
import { useApply, useMyApplications } from '../../hooks/useApplications'
import { useAuth } from '../../hooks/useAuth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDate, timeAgo } from '../../utils/formatDate'
import { formatSalary } from '../../utils/formatSalary'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  FULL_TIME: { label: 'Full Time', variant: 'indigo' },
  PART_TIME: { label: 'Part Time', variant: 'warning' },
  CONTRACT: { label: 'Contract', variant: 'purple' },
  INTERNSHIP: { label: 'Internship', variant: 'info' },
  REMOTE: { label: 'Remote', variant: 'success' },
}

const CARD = {
  background: '#13131a',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 14,
  padding: 24,
}

function MetaItem({ icon: Icon, children }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9898a8' }}>
      <Icon size={14} style={{ color: '#5a5a6e', flexShrink: 0 }} />
      {children}
    </span>
  )
}

export default function JobDetailPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [applyOpen, setApplyOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeChoice, setResumeChoice] = useState('profile')
  const [backHover, setBackHover] = useState(false)

  const { data: job, isLoading } = useJob(id)
  const { data: myApps = [] } = useMyApplications()
  const alreadyApplied = myApps.some((a) => a.jobId === id)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile/me').then((r) => r.data.data),
    enabled: user?.role === 'JOB_SEEKER',
  })

  const qc = useQueryClient()
  const { data: savedJobs = [] } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: () => api.get('/saved-jobs').then((r) => r.data.data || []),
    enabled: user?.role === 'JOB_SEEKER',
  })
  const isSaved = savedJobs.some((j) => j.id === id)
  const saveMutation = useMutation({
    mutationFn: () => isSaved ? api.delete(`/saved-jobs/${id}`) : api.post(`/saved-jobs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['savedJobs'] }),
  })

  const apply = useApply()

  function handleApply() {
    if (!isAuthenticated) { navigate('/login'); return }
    if (user?.role !== 'JOB_SEEKER') { toast.error('Only job seekers can apply'); return }
    setApplyOpen(true)
  }

  async function submitApplication() {
    await apply.mutateAsync({
      jobId: id,
      data: { coverLetter, resumeUrl: resumeChoice === 'profile' ? profile?.resumeUrl : '' },
    })
    setApplyOpen(false)
  }

  if (isLoading) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!job) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: 15, color: '#9898a8' }}>Job not found</p>
      </div>
    )
  }

  const typeConfig = TYPE_CONFIG[job.type] || { label: job.type, variant: 'default' }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
            color: backHover ? '#f0f0f5' : '#5a5a6e',
            background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: 24, padding: 0, transition: 'color 0.15s ease',
          }}
        >
          <ArrowLeft size={14} /> Back to jobs
        </button>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header card */}
            <div style={CARD}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, color: '#a5b4fc',
                    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
                  }}>
                    {job.companyName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em', marginBottom: 4 }}>{job.title}</h1>
                  <Link to={`/companies/${job.companyId}`} style={{ fontSize: 14, fontWeight: 500, color: '#6366f1', textDecoration: 'none' }}>
                    {job.companyName}
                  </Link>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 12 }}>
                    {job.type && <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>}
                    {job.location && <MetaItem icon={MapPin}>{job.location}</MetaItem>}
                    {(job.salaryMin || job.salaryMax) && <MetaItem icon={DollarSign}>{formatSalary(job.salaryMin, job.salaryMax)}</MetaItem>}
                    <MetaItem icon={Clock}>{timeAgo(job.createdAt)}</MetaItem>
                    <MetaItem icon={Users}>{job.applicantCount} applicants</MetaItem>
                    {job.deadline && <MetaItem icon={Calendar}>Deadline: {formatDate(job.deadline)}</MetaItem>}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={CARD}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 12 }}>About this role</h2>
              <p style={{ fontSize: 14, color: '#9898a8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>

            {job.requirements && (
              <div style={CARD}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 12 }}>Requirements</h2>
                <p style={{ fontSize: 14, color: '#9898a8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
              </div>
            )}

            {job.skillsRequired?.length > 0 && (
              <div style={CARD}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 14 }}>Skills Required</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {job.skillsRequired.map((s) => (
                    <span key={s} style={{
                      padding: '5px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 500,
                      color: '#9898a8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply sidebar */}
          <div style={{ width: 288, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              position: 'sticky', top: 80,
              background: '#16161f', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 16, padding: 20,
              display: 'flex', flexDirection: 'column', gap: 16,
              boxShadow: '0 0 0 1px rgba(99,102,241,0.08)',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>Apply for this position</h3>

              {(job.salaryMin || job.salaryMax) && (
                <div>
                  <p style={{ fontSize: 10, color: '#5a5a6e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Salary</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#f0f0f5' }}>{formatSalary(job.salaryMin, job.salaryMax)}</p>
                </div>
              )}

              {job.deadline && (
                <div>
                  <p style={{ fontSize: 10, color: '#5a5a6e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Deadline</p>
                  <p style={{ fontSize: 13, color: '#9898a8' }}>{formatDate(job.deadline)}</p>
                </div>
              )}

              {alreadyApplied ? (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 500,
                  color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <CheckCircle size={15} /> Application Submitted
                </div>
              ) : (
                <Button fullWidth onClick={handleApply}>Apply Now</Button>
              )}

              {user?.role === 'JOB_SEEKER' && (
                <Button
                  variant={isSaved ? 'danger' : 'secondary'}
                  fullWidth
                  leftIcon={Heart}
                  onClick={() => saveMutation.mutate()}
                >
                  {isSaved ? 'Unsave Job' : 'Save Job'}
                </Button>
              )}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <MetaItem icon={Building2}>{job.companyName}</MetaItem>
                {job.experienceMin !== undefined && job.experienceMin !== null && (
                  <MetaItem icon={Users}>{job.experienceMin}+ years experience</MetaItem>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply for ${job.title}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setApplyOpen(false)}>Cancel</Button>
            <Button loading={apply.isPending} onClick={submitApplication}>Submit Application</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9898a8', display: 'block', marginBottom: 8 }}>
              Cover Letter
            </label>
            <textarea
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're a great fit for this role..."
              style={{
                width: '100%', padding: '12px 14px', fontSize: 14, borderRadius: 10, outline: 'none',
                resize: 'none', transition: 'all 0.2s ease', color: '#f0f0f5', fontFamily: 'inherit',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.background = 'rgba(99,102,241,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' }}
            />
            <p style={{ fontSize: 11, color: '#5a5a6e', textAlign: 'right', marginTop: 4 }}>{coverLetter.length}/2000</p>
          </div>

          {profile?.resumeUrl && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9898a8', display: 'block', marginBottom: 8 }}>
                Resume
              </label>
              <label
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: resumeChoice === 'profile' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                  border: resumeChoice === 'profile' ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <input
                  type="radio"
                  value="profile"
                  checked={resumeChoice === 'profile'}
                  onChange={() => setResumeChoice('profile')}
                  style={{ accentColor: '#6366f1' }}
                />
                <div>
                  <p style={{ fontSize: 13, color: '#f0f0f5', fontWeight: 500 }}>Use profile resume</p>
                  <p style={{ fontSize: 11, color: '#5a5a6e', marginTop: 2 }}>Resume already uploaded to your profile</p>
                </div>
                {resumeChoice === 'profile' && <CheckCircle size={16} style={{ color: '#6366f1', marginLeft: 'auto' }} />}
              </label>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
