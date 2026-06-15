const VARIANTS = {
  default: { color: '#9898a8', background: 'rgba(152,152,168,0.12)', border: '1px solid rgba(152,152,168,0.2)' },
  success: { color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' },
  warning: { color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' },
  error:   { color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' },
  info:    { color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' },
  purple:  { color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' },
  indigo:  { color: '#a5b4fc', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' },
}

const SIZES = {
  sm: { fontSize: 10, paddingLeft: 7, paddingRight: 7, paddingTop: 2, paddingBottom: 2 },
  md: { fontSize: 11, paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3 },
}

export default function Badge({ variant = 'default', size = 'md', dot = false, children, style: extraStyle }) {
  const v = VARIANTS[variant] || VARIANTS.default
  const s = SIZES[size] || SIZES.md

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        borderRadius: 9999,
        fontWeight: 500,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        fontFamily: 'Inter, -apple-system, sans-serif',
        ...s,
        ...v,
        ...extraStyle,
      }}
    >
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: v.color }} />
      )}
      {children}
    </span>
  )
}
