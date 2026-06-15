import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Mail, Lock, Shield, CheckCircle, TrendingUp, Star } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data) {
    setLoading(true)
    try {
      const { role } = await login(data.email, data.password)
      toast.success('Welcome back!')
      if (role === 'JOB_SEEKER') navigate('/dashboard')
      else if (role === 'EMPLOYER') navigate('/employer/dashboard')
      else navigate('/admin/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
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
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '350px', height: '350px', borderRadius: '50%', opacity: 0.15, filter: 'blur(60px)', background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
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

        {/* Dynamic Feature Highlights */}
        <div className="flex flex-col gap-8 my-auto z-10 max-w-[380px]">
          <div>
            <h2 className="text-2xl font-bold text-content-primary tracking-tight mb-2 leading-snug">
              Unlock Your True Career Potential
            </h2>
            <p className="text-sm text-content-secondary leading-relaxed">
              Join the most modern platform for finding verified jobs, tracking applications, and scaling your profile.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-4 items-start p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.18)] shrink-0">
                <Shield size={18} className="text-[#10b981]" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-content-primary">Verified Companies</h4>
                <p className="text-[12px] text-content-secondary mt-1 leading-relaxed">No scam job listings. Only direct and verified hirers.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.18)] shrink-0">
                <TrendingUp size={18} className="text-[#6366f1]" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-content-primary">Smart Skill Matching</h4>
                <p className="text-[12px] text-content-secondary mt-1 leading-relaxed">Auto-calculate your compatibility match with required skills.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.18)] shrink-0">
                <CheckCircle size={18} className="text-[#f59e0b]" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-content-primary">One-Click Application</h4>
                <p className="text-[12px] text-content-secondary mt-1 leading-relaxed">Apply in one single click and manage application tracking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="z-10 border-t border-[rgba(255,255,255,0.06)] pt-6 max-w-[380px]">
          <div className="flex items-center gap-1 mb-2.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={11} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <p className="text-[12px] text-content-secondary italic leading-relaxed">
            "JobPortal made my job search completely painless. I applied and got hired within 2 weeks!"
          </p>
          <p className="text-[11px] font-semibold text-content-primary mt-2">
            — Senior React Developer, TechCorp
          </p>
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto min-h-screen">
        {/* Glow orbs behind form */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', opacity: 0.12, filter: 'blur(70px)', background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: '350px', height: '350px', borderRadius: '50%', opacity: 0.08, filter: 'blur(60px)', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
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

        {/* Form Card */}
        <div className="w-full max-w-[440px] z-10 animate-slide-up">
          <div className="gradient-border p-px rounded-2xl" style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(99, 102, 241, 0.1)' }}>
            <div className="rounded-2xl p-8" style={{ background: '#13131a' }}>
              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-content-primary tracking-tight">Welcome back</h1>
                <p className="text-sm text-content-secondary mt-1.5">Sign in to your account</p>
              </div>

              {errors.root && (
                <div
                  className="mb-5 px-4 py-3 rounded-xl text-sm text-status-error flex items-center gap-2"
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
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={Lock}
                  register={register}
                  error={errors.password?.message}
                />

                <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
                  Sign in
                </Button>
              </form>

              <p className="text-center text-sm text-content-secondary mt-6">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-accent-primary hover:text-[#818cf8] font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
