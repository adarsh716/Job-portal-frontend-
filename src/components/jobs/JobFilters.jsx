import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import Button from '../ui/Button'

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']
const TYPE_LABELS = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract',
  INTERNSHIP: 'Internship', REMOTE: 'Remote',
}

const INPUT_STYLE = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 13,
  color: '#f0f0f5',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'all 0.2s ease',
}

function FilterSection({ title, children }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5a5a6e', marginBottom: 12 }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function CustomCheckbox({ checked, onChange, label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <label
      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={onChange}
        style={{
          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
          background: checked ? '#6366f1' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${checked ? '#6366f1' : 'rgba(255,255,255,0.15)'}`,
        }}
      >
        {checked && <X size={10} style={{ color: '#fff' }} />}
      </div>
      <span style={{ fontSize: 13, color: hovered ? '#f0f0f5' : '#9898a8', transition: 'color 0.15s ease' }}>{label}</span>
    </label>
  )
}

export default function JobFilters({ filters, onChange, onClear }) {
  const [local, setLocal] = useState(filters)

  function apply() { onChange(local) }
  function clear() { setLocal({}); onClear() }

  function focusInput(e) {
    e.target.style.borderColor = 'rgba(99,102,241,0.6)'
    e.target.style.background = 'rgba(99,102,241,0.05)'
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
  }
  function blurInput(e) {
    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
    e.target.style.background = 'rgba(255,255,255,0.04)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{
      background: '#13131a',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} style={{ color: '#5a5a6e' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f5' }}>Filters</span>
        </div>
        <button
          onClick={clear}
          style={{
            fontSize: 11, color: '#5a5a6e', background: 'none', border: 'none',
            cursor: 'pointer', padding: 0, transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#6366f1' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#5a5a6e' }}
        >
          Clear all
        </button>
      </div>

      {/* Job Type */}
      <FilterSection title="Job Type">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {JOB_TYPES.map((t) => (
            <CustomCheckbox
              key={t}
              checked={local.type === t}
              onChange={() => setLocal((f) => ({ ...f, type: f.type === t ? '' : t }))}
              label={TYPE_LABELS[t]}
            />
          ))}
        </div>
      </FilterSection>

      {/* Salary Range */}
      <FilterSection title="Salary Range">
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#5a5a6e' }}>$</span>
            <input
              type="number"
              placeholder="Min"
              value={local.salaryMin || ''}
              onChange={(e) => setLocal((f) => ({ ...f, salaryMin: e.target.value }))}
              onFocus={focusInput}
              onBlur={blurInput}
              style={{ ...INPUT_STYLE, paddingLeft: 22 }}
            />
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#5a5a6e' }}>$</span>
            <input
              type="number"
              placeholder="Max"
              value={local.salaryMax || ''}
              onChange={(e) => setLocal((f) => ({ ...f, salaryMax: e.target.value }))}
              onFocus={focusInput}
              onBlur={blurInput}
              style={{ ...INPUT_STYLE, paddingLeft: 22 }}
            />
          </div>
        </div>
      </FilterSection>

      {/* Experience */}
      <FilterSection title="Experience">
        <select
          value={local.experienceMin || ''}
          onChange={(e) => setLocal((f) => ({ ...f, experienceMin: e.target.value }))}
          onFocus={focusInput}
          onBlur={blurInput}
          style={{ ...INPUT_STYLE, cursor: 'pointer' }}
        >
          <option value="">Any experience</option>
          <option value="0">Entry Level (0-1 yr)</option>
          <option value="2">Mid Level (2+ yrs)</option>
          <option value="5">Senior (5+ yrs)</option>
          <option value="10">Lead (10+ yrs)</option>
        </select>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <input
          type="text"
          placeholder="City, state, or remote"
          value={local.location || ''}
          onChange={(e) => setLocal((f) => ({ ...f, location: e.target.value }))}
          onFocus={focusInput}
          onBlur={blurInput}
          style={INPUT_STYLE}
        />
      </FilterSection>

      <Button onClick={apply} fullWidth size="sm">Apply Filters</Button>
    </div>
  )
}
