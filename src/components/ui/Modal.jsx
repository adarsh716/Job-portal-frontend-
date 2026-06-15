import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const MAX_WIDTHS = { sm: 448, md: 512, lg: 672, xl: 896 }

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: MAX_WIDTHS[size] || 512,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          background: '#16161f',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18,
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f5' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#5a5a6e', transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f0f0f5' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5a5a6e' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
            padding: '14px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
