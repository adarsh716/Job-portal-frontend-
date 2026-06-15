import { Check, X } from 'lucide-react'
import Badge from '../ui/Badge'

const STEPS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED']
const STEP_LABELS = { APPLIED: 'Applied', SHORTLISTED: 'Shortlisted', INTERVIEW: 'Interview', OFFERED: 'Offered' }

export default function StatusTimeline({ status }) {
  if (status === 'WITHDRAWN') {
    return <Badge variant="default" dot>Withdrawn</Badge>
  }
  if (status === 'REJECTED') {
    return <Badge variant="error" dot>Not Selected</Badge>
  }

  const currentIdx = STEPS.indexOf(status)

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < currentIdx
        const current = i === currentIdx

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: done ? '#10b981' : current ? '#6366f1' : 'rgba(255,255,255,0.15)',
                  background: done ? '#10b981' : current ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  boxShadow: current ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {done && <Check size={11} className="text-white" />}
                {current && (
                  <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                )}
              </div>
              <span
                className="text-[10px] mt-1 whitespace-nowrap font-medium"
                style={{
                  color: done ? '#10b981' : current ? '#a5b4fc' : '#5a5a6e',
                }}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-10 h-px mb-4 transition-all duration-300"
                style={{ background: i < currentIdx ? '#10b981' : 'rgba(255,255,255,0.1)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
