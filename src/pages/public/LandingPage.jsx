import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Briefcase, Users, TrendingUp, Shield, Zap, MapPin, ArrowRight, Star, CheckCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '../../api/jobs.api'
import JobCard from '../../components/jobs/JobCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const POPULAR_SEARCHES = ['React Developer', 'Python', 'Remote', 'UI Design', 'Data Science', 'DevOps']

const STATS = [
  { value: '50K+', label: 'Active Jobs', icon: Briefcase },
  { value: '10K+', label: 'Companies', icon: Users },
  { value: '500K+', label: 'Professionals', icon: TrendingUp },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Verified Companies',
    desc: 'Every company is verified before posting. No scams, no fake listings — only real opportunities.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    icon: Zap,
    title: 'One-Click Apply',
    desc: 'Your profile is your resume. Apply to any job in seconds and track every response.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    icon: TrendingUp,
    title: 'Smart Matching',
    desc: 'Our algorithm surfaces roles that match your exact skill set and experience level.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
  },
]

const STEPS = [
  { num: '01', title: 'Create Your Profile', desc: 'Add your skills, experience, and upload your resume in under 5 minutes.', icon: Users },
  { num: '02', title: 'Discover Roles', desc: 'Browse thousands of live job listings filtered to your preferences.', icon: Search },
  { num: '03', title: 'Land the Job', desc: 'Apply instantly and track every stage of your application in real time.', icon: CheckCircle },
]

export default function LandingPage() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()

  const { data: featuredJobs, isLoading } = useQuery({
    queryKey: ['featuredJobs'],
    queryFn: () => jobsApi.getJobs({ page: 0, size: 6 }).then((r) => r.data.data?.content || []),
  })

  function handleSearch(e) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (keyword) p.set('search', keyword)
    if (location) p.set('location', location)
    navigate(`/jobs?${p.toString()}`)
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section
        style={{ minHeight: '92vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', overflow: 'hidden' }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Orb 1 — indigo, top-left */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Orb 2 — violet, bottom-right */}
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Orb 3 — small teal accent */}
        <div style={{
          position: 'absolute', top: '50%', right: '20%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 9999,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
              boxShadow: '0 0 24px rgba(99,102,241,0.15)',
              marginBottom: 32, fontSize: 13, fontWeight: 500, color: '#a5b4fc',
            }}
          >
            <Star size={13} fill="#6366f1" color="#6366f1" />
            Trusted by 500+ companies worldwide
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: '#f0f0f5',
              marginBottom: 28,
            }}
          >
            The Smarter Way to<br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Find Your Dream Job
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#9898a8', marginBottom: 44, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 44px' }}>
            Connect with top employers, apply in one click, and track every step of your journey — all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: 680, margin: '0 auto 20px' }}>
            <div
              style={{
                display: 'flex', flexWrap: 'wrap', gap: 0,
                background: 'rgba(255,255,255,0.05)',
                border: searchFocused ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
                padding: 6,
                boxShadow: searchFocused
                  ? '0 0 0 3px rgba(99,102,241,0.15), 0 8px 40px rgba(99,102,241,0.15)'
                  : '0 8px 40px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Keyword input */}
              <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', minWidth: 0 }}>
                <Search size={16} color="#5a5a6e" style={{ flexShrink: 0 }} />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Job title, skill, or company"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 14, color: '#f0f0f5', minWidth: 0,
                  }}
                />
              </div>

              {/* Divider */}
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

              {/* Location input */}
              <div style={{ flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', minWidth: 0 }}>
                <MapPin size={16} color="#5a5a6e" style={{ flexShrink: 0 }} />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Location"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 14, color: '#f0f0f5', minWidth: 0,
                  }}
                />
              </div>

              {/* Search button */}
              <button
                type="submit"
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'none' }}
              >
                <Search size={15} />
                Search Jobs
              </button>
            </div>
          </form>

          {/* Popular searches */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, alignItems: 'center', marginTop: 20 }}>
            <span style={{ fontSize: 12, color: '#5a5a6e' }}>Trending:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(term)}`)}
                style={{
                  fontSize: 12, color: '#9898a8', padding: '4px 12px', borderRadius: 9999,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f0f0f5'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9898a8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div style={{ background: '#111118', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <div
              key={label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Icon size={16} color="#6366f1" />
                <span style={{
                  fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {value}
                </span>
              </div>
              <span style={{ fontSize: 13, color: '#9898a8' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURED JOBS ─── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 }}>
                Fresh Listings
              </p>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Latest Opportunities
              </h2>
              <p style={{ fontSize: 14, color: '#9898a8', marginTop: 6 }}>Curated roles from verified employers</p>
            </div>
            <Button variant="ghost" rightIcon={ArrowRight} onClick={() => navigate('/jobs')}>
              View all jobs
            </Button>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner size="lg" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {(featuredJobs || []).map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}

          {!isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
              <button
                onClick={() => navigate('/jobs')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 12, border: '1px solid rgba(99,102,241,0.3)',
                  background: 'rgba(99,102,241,0.08)', color: '#a5b4fc',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
              >
                Browse All Jobs <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ background: '#111118', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 10 }}>
              Simple Process
            </p>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em', marginBottom: 12 }}>
              How It Works
            </h2>
            <p style={{ fontSize: 14, color: '#9898a8' }}>Go from profile to hired in three steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {STEPS.map(({ num, title, desc, icon: Icon }, i) => (
              <div
                key={num}
                style={{
                  background: '#13131a', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: '32px 24px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: -10, right: 16,
                  fontSize: 80, fontWeight: 900, color: 'rgba(99,102,241,0.06)',
                  lineHeight: 1, userSelect: 'none',
                }}>
                  {num}
                </div>

                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color="#818cf8" />
                </div>

                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0f0f5', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#9898a8', lineHeight: 1.6 }}>{desc}</p>
                </div>

                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1,
                  }}>
                    <ArrowRight size={12} color="#818cf8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#10b981', textTransform: 'uppercase', marginBottom: 10 }}>
              Why Us
            </p>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Built for Serious Job Seekers
            </h2>
            <p style={{ fontSize: 14, color: '#9898a8' }}>Every feature designed to get you hired faster</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <div
                key={title}
                style={{
                  background: '#13131a', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: '28px 24px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                  transition: 'all 0.2s ease', cursor: 'default',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4)` }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: bg, border: `1px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#9898a8', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: '#111118', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          {/* Glowing card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -1, borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5))',
              filter: 'blur(1px)',
            }} />
            <div style={{
              position: 'relative', background: '#13131a', borderRadius: 24,
              padding: '60px 40px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}>
              {/* Inner glow */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 300, height: 200, borderRadius: '0 0 50% 50%',
                background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 14px', borderRadius: 9999, marginBottom: 24,
                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                fontSize: 12, fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                Get Started Free
              </div>

              <h2 style={{ fontSize: 34, fontWeight: 800, color: '#f0f0f5', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 16 }}>
                Ready to Take the<br />Next Step?
              </h2>
              <p style={{ fontSize: 15, color: '#9898a8', lineHeight: 1.7, marginBottom: 36 }}>
                Join over 500,000 professionals who found their next role through JobPortal. It&apos;s free, fast, and built around you.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '13px 28px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.45)'; e.currentTarget.style.transform = 'none' }}
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  style={{
                    padding: '13px 28px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#f0f0f5', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                >
                  <Search size={15} /> Browse Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
