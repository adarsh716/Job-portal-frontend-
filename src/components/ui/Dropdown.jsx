import { useEffect, useRef, useState } from 'react'

export default function Dropdown({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false)
  const [focusIdx, setFocusIdx] = useState(-1)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!open) setFocusIdx(-1)
  }, [open])

  const handleKey = (e) => {
    const actionable = items.filter((it) => !it.divider)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIdx((i) => Math.min(i + 1, actionable.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && focusIdx >= 0) {
      actionable[focusIdx]?.onClick?.()
      setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  let actionableIdx = -1

  return (
    <div ref={ref} className="relative inline-block" onKeyDown={handleKey}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div
          className={`
            absolute top-full mt-2 z-50 min-w-[180px] rounded-xl py-1.5
            border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]
            animate-slide-down
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
          style={{ background: '#1a1a24', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return <div key={i} className="my-1 border-t border-[rgba(255,255,255,0.06)]" />
            }
            actionableIdx++
            const myIdx = actionableIdx
            return (
              <button
                key={i}
                onClick={() => { item.onClick?.(); setOpen(false) }}
                className={`
                  w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left
                  transition-colors duration-150
                  ${item.danger ? 'text-status-error hover:bg-[rgba(239,68,68,0.08)]' : 'text-content-secondary hover:text-content-primary hover:bg-[rgba(255,255,255,0.05)]'}
                  ${myIdx === focusIdx ? 'bg-[rgba(255,255,255,0.05)] text-content-primary' : ''}
                `}
              >
                {item.icon && <item.icon size={14} />}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(99,102,241,0.15)] text-accent-primary">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
