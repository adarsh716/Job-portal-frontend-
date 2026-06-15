import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Briefcase, Building2, Mail, Lock, ArrowLeft, Check, Users, Star, TrendingUp } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { authApi } from '../../api/auth.api'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

function PasswordStrength({ password }) {
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#ef4444', '#f59e0b', '#10b981', '#10b981']
  return (
    <div className="flex items-center gap-2 mt-1.5">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className="h-1 flex-1 rounded-full transition-all duration-300"
          style={{ background: strength >= s ? colors[strength] : 'rgba(255,255,255,0.08)' }}
        />
      ))}
      {password && <span className="text-[11px] font-medium shrink-0" style={{ color: colors[strength] }}>{labels[strength]}</span>}
    </div>
  )
}

function RoleCard({ roleKey, selected, onSelect, icon: Icon, title, description, gradient }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(roleKey)}
      className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 w-full"
      style={{
        background: selected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
        borderColor: selected ? '#6366f1' : 'rgba(255,255,255,0.1)',
        boxShadow: selected ? '0 0 24px rgba(99,102,241,0.15)' : 'none',
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
        style={{ background: gradient }}
      >
        <Icon size={26} className="text-white" />
        {selected && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-primary flex items-center justify-center">
            <Check size={11} className="text-white" />
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-[15px] text-content-primary">{title}</h3>
        <p className="text-[12px] text-content-secondary mt-1 leading-relaxed">{description}</p>
      </div>
    </button>
  )
}

export default function RegisterPage() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  })
  const password = watch('password', '')

  async function onSubmit(data) {
    if (!role) { toast.error('Please select a role'); return }
    setLoading(true)
    try {
      await authApi.register(data.email, data.password, role)
      const { role: userRole } = await login(data.email, data.password)
      toast.success('Account created!')
      if (userRole === 'JOB_SEEKER') navigate('/dashboard')
      else navigate('/employer/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError('root', { message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#07070a]">
      {/* Left Column - Branding & Features (Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-[#0b0b12] border-r border-[rgba(255,255,255,0.06)] relative overflow-hidden">
        {/* Glow Mesh Background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '350px', height: '350px', borderRadius: '50%', opacity: 0.15, filter: 'blur(60px)', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)', background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        </div>

        {/* Logo Header */}
        <div className="flex items-center gap-2.5 z-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
          >
            <Zap size={18} className="text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ background: 'linear-gradient(135deg, #f0f0f5, #9898a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            JobPortal
          </span>
        </div>

        {/* Stats Grid Showcase */}
        <div className="flex flex-col gap-8 my-auto z-10 max-w-[380px]">
          <div>
            <h2 className="text-2xl font-bold text-content-primary tracking-tight mb-2 leading-snug">
              Begin Your Professional Journey
            </h2>
            <p className="text-sm text-content-secondary leading-relaxed">
              Create your account in less than two minutes and get instant access to global recruiters and matches.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.18)] shrink-0">
                <Briefcase size={18} className="text-[#6366f1]" />
              </div>
              <div>
                <span className="text-[20px] font-extrabold text-content-primary tracking-tight">50K+</span>
                <p className="text-[11px] text-content-secondary uppercase tracking-wider mt-0.5">Active Job Listings</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.18)] shrink-0">
                <Building2 size={18} className="text-[#10b981]" />
              </div>
              <div>
                <span className="text-[20px] font-extrabold text-content-primary tracking-tight">10K+</span>
                <p className="text-[11px] text-content-secondary uppercase tracking-wider mt-0.5">Verified Employers</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.18)] shrink-0">
                <Users size={18} className="text-[#8b5cf6]" />
              </div>
              <div>
                <span className="text-[20px] font-extrabold text-content-primary tracking-tight">500K+</span>
                <p className="text-[11px] text-content-secondary uppercase tracking-wider mt-0.5">Talented Professionals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="z-10 border-t border-[rgba(255,255,255,0.06)] pt-6 max-w-[380px]">
          <div className="flex items-center gap-1 mb-2.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={11} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <p className="text-[12px] text-content-secondary italic leading-relaxed">
            "Joining was the best decision. I completed my profile, applied to a few roles, and got three interview calls in the first week!"
          </p>
          <p className="text-[11px] font-semibold text-content-primary mt-2">
            — Seeker, Frontend Engineer
          </p>
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto min-h-screen">
        {/* Glow orbs behind form */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '25%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', opacity: 0.12, filter: 'blur(70px)', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '350px', height: '350px', borderRadius: '50%', opacity: 0.08, filter: 'blur(60px)', background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        </div>

        {/* Mobile Header (Hides on Desktop) */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-content-primary">
            JobPortal
          </span>
        </div>

        {/* Dynamic Card Container */}
        <div className="w-full z-10 animate-slide-up" style={{ maxWidth: role ? 460 : 580, transition: 'max-width 0.3s ease' }}>
          {!role ? (
            /* Step 1: Role selection */
            <div className="animate-scale-in">
              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-content-primary tracking-tight">Join JobPortal</h1>
                <p className="text-sm text-content-secondary mt-1.5">How would you like to use JobPortal?</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <RoleCard
                  roleKey="JOB_SEEKER"
                  selected={role === 'JOB_SEEKER'}
                  onSelect={setRole}
                  icon={Briefcase}
                  title="Job Seeker"
                  description="Find opportunities, build your profile, apply to top companies"
                  gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
                />
                <RoleCard
                  roleKey="EMPLOYER"
                  selected={role === 'EMPLOYER'}
                  onSelect={setRole}
                  icon={Building2}
                  title="Employer"
                  description="Post jobs, manage applications, find the best talent"
                  gradient="linear-gradient(135deg, #10b981, #059669)"
                />
              </div>
              <p className="text-center text-sm text-content-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-primary hover:text-[#818cf8] font-medium transition-colors">Sign in</Link>
              </p>
            </div>
          ) : (
            /* Step 2: Registration form */
            <div className="gradient-border p-px rounded-2xl animate-scale-in" style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(99, 102, 241, 0.1)' }}>
              <div className="rounded-2xl p-8" style={{ background: '#13131a' }}>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    className="p-1.5 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-[rgba(255,255,255,0.06)] transition-all"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-content-primary tracking-tight">Create your account</h1>
                    <p className="text-[12px] text-content-secondary mt-0.5">
                      as{' '}
                      <span className="text-accent-primary font-medium">
                        {role === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer'}
                      </span>
                    </p>
                  </div>
                </div>

                {errors.root && (
                  <div
                    className="mb-5 px-4 py-3 rounded-xl text-sm text-status-error"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    {errors.root.message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={Mail}
                    register={register}
                    error={errors.email?.message}
                  />
                  <div>
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      leftIcon={Lock}
                      register={register}
                      error={errors.password?.message}
                    />
                    <PasswordStrength password={password} />
                  </div>
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    leftIcon={Lock}
                    register={register}
                    error={errors.confirmPassword?.message}
                  />

                  <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
                    Create Account
                  </Button>
                </form>

                <p className="text-center text-sm text-content-secondary mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-accent-primary hover:text-[#818cf8] font-medium transition-colors">Sign in</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
