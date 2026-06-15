import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Upload, CheckCircle, Globe, MapPin, Building2 } from 'lucide-react'
import { companyApi } from '../../api/company.api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
})

const CARD = {
  background: '#13131a',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 14,
  padding: 24,
}

const LABEL = {
  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: '#9898a8', display: 'block', marginBottom: 8,
}

const SELECT_STYLE = {
  width: '100%', padding: '10px 14px', fontSize: 14, borderRadius: 8, outline: 'none',
  transition: 'all 0.2s ease', color: '#f0f0f5', fontFamily: 'inherit',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
}

export default function CompanySetupPage() {
  const qc = useQueryClient()
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const { data: company, isLoading } = useQuery({
    queryKey: ['myCompany'],
    queryFn: () => companyApi.getMyCompany().then((r) => r.data.data),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        website: company.website || '',
        industry: company.industry || '',
        size: company.size || '',
        description: company.description || '',
        location: company.location || '',
      })
      if (company.logoUrl) setLogoPreview(company.logoUrl)
    }
  }, [company, reset])

  const updateMutation = useMutation({
    mutationFn: (data) => company?.id
      ? companyApi.updateCompany(company.id, data)
      : companyApi.createCompany(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myCompany'] })
      toast.success('Company profile saved!')
    },
    onError: () => toast.error('Failed to save company'),
  })

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)) }
  }

  async function uploadLogo() {
    if (!logoFile || !company?.id) return
    setUploading(true)
    try {
      await companyApi.uploadLogo(company.id, logoFile)
      qc.invalidateQueries({ queryKey: ['myCompany'] })
      toast.success('Logo uploaded!')
      setLogoFile(null)
    } catch {
      toast.error('Logo upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><Spinner size="lg" /></div>

  const initial = company?.name?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.02em' }}>Company Profile</h1>
          <p style={{ fontSize: 13, color: '#9898a8', marginTop: 4 }}>Set up your employer brand</p>
        </div>
        {company?.isVerified ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#10b981', padding: '6px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle size={14} /> Verified
          </div>
        ) : company && (
          <div style={{ fontSize: 12, color: '#fbbf24', padding: '6px 12px', borderRadius: 8, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
            Pending verification
          </div>
        )}
      </div>

      {/* Logo card */}
      <div style={{ ...CARD, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5', marginBottom: 16 }}>Company Logo</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#a5b4fc', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              {initial}
            </div>
          )}
          <div>
            <label style={{ cursor: 'pointer' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#6366f1', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Upload size={13} /> Choose image
              </span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
            </label>
            <p style={{ fontSize: 11, color: '#5a5a6e', marginTop: 8 }}>PNG, JPG up to 2MB</p>
            {logoFile && company?.id && (
              <div style={{ marginTop: 8 }}>
                <Button size="sm" loading={uploading} onClick={uploadLogo} leftIcon={Upload}>Upload</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>Company Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Company Name" name="name" register={register} error={errors.name?.message} placeholder="Acme Corp" leftIcon={Building2} />
            <Input label="Website" name="website" register={register} placeholder="https://acme.com" leftIcon={Globe} />
            <Input label="Industry" name="industry" register={register} placeholder="Technology" />
            <div>
              <label style={LABEL}>Company Size</label>
              <select
                style={SELECT_STYLE}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                {...register('size')}
              >
                <option value="">Select size</option>
                <option value="1-10">1–10 employees</option>
                <option value="11-50">11–50 employees</option>
                <option value="51-200">51–200 employees</option>
                <option value="201-500">201–500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Location" name="location" register={register} placeholder="San Francisco, CA" leftIcon={MapPin} />
            </div>
          </div>
          <div>
            <label style={LABEL}>Description</label>
            <textarea
              rows={5}
              placeholder="Tell candidates about your company, culture, and mission..."
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14, borderRadius: 8, outline: 'none',
                resize: 'none', transition: 'all 0.2s ease', color: '#f0f0f5', fontFamily: 'inherit',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              {...register('description')}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" loading={updateMutation.isPending} size="lg">Save Company Profile</Button>
        </div>
      </form>
    </div>
  )
}
