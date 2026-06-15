import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { X, ArrowLeft, DollarSign, MapPin, Calendar, Briefcase } from 'lucide-react'
import { useCreateJob, useUpdateJob, useJob } from '../../hooks/useJobs'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  type: z.string().min(1, 'Job type is required'),
  location: z.string().optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  experienceMin: z.coerce.number().min(0).optional(),
  deadline: z.string().optional(),
})

const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE', label: 'Remote' },
]

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
    <div className="card p-6 flex flex-col gap-4">
      <h2 className="text-[14px] font-semibold text-content-primary">{title}</h2>
      {children}
    </div>
  )
}

export default function PostJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [skills, setSkills] = useState([])
  const [selectedType, setSelectedType] = useState('')

  const { data: existingJob, isLoading: loadingJob } = useJob(id, { enabled: isEdit })
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (existingJob) {
      reset({
        title: existingJob.title || '',
        description: existingJob.description || '',
        requirements: existingJob.requirements || '',
        type: existingJob.type || 'FULL_TIME',
        location: existingJob.location || '',
        salaryMin: existingJob.salaryMin || '',
        salaryMax: existingJob.salaryMax || '',
        experienceMin: existingJob.experienceMin || '',
        deadline: existingJob.deadline || '',
      })
      setSkills(existingJob.skillsRequired || [])
      setSelectedType(existingJob.type || 'FULL_TIME')
    }
  }, [existingJob, reset])

  function selectType(type) {
    setSelectedType(type)
    setValue('type', type)
  }

  function onSubmit(data) {
    const payload = { ...data, skillsRequired: skills }
    if (isEdit) {
      updateJob.mutate({ id, data: payload }, { onSuccess: () => navigate('/employer/jobs') })
    } else {
      createJob.mutate(payload, { onSuccess: () => navigate('/employer/jobs') })
    }
  }

  if (isEdit && loadingJob) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  const isPending = createJob.isPending || updateJob.isPending

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/employer/jobs')}
          className="flex items-center gap-1.5 text-[13px] text-content-tertiary hover:text-content-primary transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-2xl font-bold text-content-primary tracking-tight">
          {isEdit ? 'Edit Job' : 'Post a New Job'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <SectionCard title="Basic Information">
          <Input label="Job Title" name="title" register={register} error={errors.title?.message} placeholder="Senior React Developer" leftIcon={Briefcase} />

          {/* Job Type button group */}
          <div>
            <label className="text-[11px] font-medium uppercase tracking-widest text-content-secondary block mb-2">Job Type</label>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map(({ value, label }) => {
                const active = selectedType === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectType(value)}
                    className="px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
                    style={active
                      ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#5a5a6e' }
                    }
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <input type="hidden" {...register('type')} value={selectedType} />
            {errors.type && <p className="text-[12px] text-status-error mt-1">{errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Location" name="location" register={register} placeholder="New York, NY or Remote" leftIcon={MapPin} />
            <Input label="Min Experience (yrs)" name="experienceMin" type="number" register={register} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Min Salary ($)" name="salaryMin" type="number" register={register} placeholder="50000" leftIcon={DollarSign} />
            <Input label="Max Salary ($)" name="salaryMax" type="number" register={register} placeholder="100000" leftIcon={DollarSign} />
            <Input label="Deadline" name="deadline" type="date" register={register} leftIcon={Calendar} />
          </div>
        </SectionCard>

        <SectionCard title="Job Details">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-widest text-content-secondary block mb-2">Description *</label>
            <textarea
              rows={7}
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              className="w-full px-3.5 py-3 text-sm rounded-lg outline-none resize-none transition-all duration-200 text-content-primary placeholder:text-content-tertiary"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              {...register('description')}
            />
            {errors.description && <p className="text-[12px] text-status-error mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-widest text-content-secondary block mb-2">Requirements</label>
            <textarea
              rows={5}
              placeholder="List the skills, qualifications, and experience required..."
              className="w-full px-3.5 py-3 text-sm rounded-lg outline-none resize-none transition-all duration-200 text-content-primary placeholder:text-content-tertiary"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              {...register('requirements')}
            />
          </div>
        </SectionCard>

        <SectionCard title="Required Skills">
          <p className="text-[12px] text-content-tertiary -mt-2">Press Enter or comma to add a skill</p>
          <TagInput value={skills} onChange={setSkills} placeholder="e.g. React, Node.js, PostgreSQL..." />
        </SectionCard>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/employer/jobs')}>Cancel</Button>
          <Button type="submit" loading={isPending} size="lg">{isEdit ? 'Save Changes' : 'Post Job'}</Button>
        </div>
      </form>
    </div>
  )
}
