import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Upload, FileText, Link2, Code2, User, Briefcase, MapPin, Phone } from 'lucide-react'
import { profileApi } from '../../api/profile.api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  experienceYears: z.coerce.number().min(0).optional(),
})

function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('')

  function addTag(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      if (!value.includes(input.trim())) onChange([...value, input.trim()])
      setInput('')
    }
  }
  function removeTag(t) { onChange(value.filter((s) => s !== t)) }

  return (
    <div
      className="rounded-lg p-2 flex flex-wrap gap-2 min-h-11.5 transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium text-[#a5b4fc]"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          {t}
          <button type="button" onClick={() => removeTag(t)} className="hover:text-white transition-colors"><X size={10} /></button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-25 text-sm text-content-primary placeholder:text-content-tertiary bg-transparent outline-none py-1 px-1"
      />
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</h2>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const qc = useQueryClient()
  const [skills, setSkills] = useState([])
  const [resumeFile, setResumeFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMyProfile().then((r) => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        experienceYears: profile.experienceYears || 0,
      })
      setSkills(profile.skills || [])
    }
  }, [profile, reset])

  const updateMutation = useMutation({
    mutationFn: (data) => profileApi.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated!')
    },
    onError: () => toast.error('Failed to update profile'),
  })

  async function onSubmit(data) {
    updateMutation.mutate({ ...data, skills })
  }

  async function handleResumeUpload() {
    if (!resumeFile) return
    setUploading(true)
    try {
      await profileApi.uploadResume(resumeFile)
      qc.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Resume uploaded!')
      setResumeFile(null)
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><Spinner size="lg" /></div>
  }

  const initial = profile?.fullName?.[0]?.toUpperCase() || '?'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em' }}>My Profile</h1>
        <p style={{ fontSize: 13, color: '#9898a8', marginTop: 4 }}>Manage your professional information</p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Profile preview sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', flexShrink: 0 }}>
              {initial}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>{profile?.fullName || 'Your Name'}</p>
              {profile?.location && <p style={{ fontSize: 12, color: '#5a5a6e', marginTop: 3 }}>{profile.location}</p>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 5 }}>
              {profile?.skills?.slice(0, 4).map((s) => (
                <span key={s} style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 11, color: '#a5b4fc', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SectionCard title="Personal Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="Full Name" name="fullName" register={register} error={errors.fullName?.message} placeholder="John Doe" leftIcon={User} />
                <Input label="Phone" name="phone" register={register} placeholder="+1 234 567 8900" leftIcon={Phone} />
                <Input label="Location" name="location" register={register} placeholder="New York, NY" leftIcon={MapPin} />
                <Input label="Experience (years)" name="experienceYears" type="number" register={register} error={errors.experienceYears?.message} leftIcon={Briefcase} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9898a8', display: 'block', marginBottom: 6 }}>Bio</label>
                <textarea
                  rows={4}
                  placeholder="Tell employers about yourself..."
                  style={{ width: '100%', padding: '10px 14px', fontSize: 14, color: '#f0f0f5', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, outline: 'none', resize: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                  {...register('bio')}
                />
              </div>
            </SectionCard>

            <SectionCard title="Online Presence">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="LinkedIn URL" name="linkedinUrl" register={register} placeholder="https://linkedin.com/in/..." leftIcon={Link2} />
                <Input label="GitHub URL" name="githubUrl" register={register} placeholder="https://github.com/..." leftIcon={Code2} />
              </div>
            </SectionCard>

            <SectionCard title="Skills">
              <p style={{ fontSize: 12, color: '#5a5a6e', marginTop: -8 }}>Type a skill and press Enter or comma to add</p>
              <TagInput value={skills} onChange={setSkills} placeholder="e.g. React, Python, SQL..." />
            </SectionCard>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" loading={updateMutation.isPending} size="lg">Save Profile</Button>
            </div>
          </form>

          {/* Resume Section */}
          <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resume</h2>

            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6366f1', textDecoration: 'none' }}>
                <FileText size={14} /> View current resume
              </a>
            )}

            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); setResumeFile(e.dataTransfer.files?.[0] || null) }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                padding: 32, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s ease',
                border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
                background: dragOver ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Upload size={20} style={{ color: '#6366f1' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f5' }}>Drag PDF here or click to upload</p>
                <p style={{ fontSize: 12, color: '#5a5a6e', marginTop: 4 }}>PDF only · Max 10MB</p>
              </div>
              {resumeFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#9898a8', background: 'rgba(255,255,255,0.06)' }}>
                  <FileText size={12} /> {resumeFile.name}
                </div>
              )}
              <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            </label>

            {resumeFile && <Button onClick={handleResumeUpload} loading={uploading} leftIcon={Upload}>Upload Resume</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
