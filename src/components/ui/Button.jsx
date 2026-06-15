import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: {
    default: { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' },
    hover:   { background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' },
  },
  secondary: {
    default: { background: 'rgba(255,255,255,0.06)', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.12)' },
    hover:   { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' },
  },
  ghost: {
    default: { background: 'transparent', color: '#9898a8', border: '1px solid transparent' },
    hover:   { background: 'rgba(255,255,255,0.06)', color: '#f0f0f5' },
  },
  danger: {
    default: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' },
    hover:   { background: 'rgba(239,68,68,0.18)', boxShadow: '0 4px 16px rgba(239,68,68,0.2)' },
  },
  success: {
    default: { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' },
    hover:   { background: 'rgba(16,185,129,0.18)' },
  },
}

const SIZES = {
  sm: { height: 32, paddingLeft: 12, paddingRight: 12, fontSize: 12, borderRadius: 6 },
  md: { height: 36, paddingLeft: 16, paddingRight: 16, fontSize: 14, borderRadius: 8 },
  lg: { height: 44, paddingLeft: 24, paddingRight: 24, fontSize: 15, borderRadius: 10 },
}

const ICON_SIZES = { sm: 12, md: 14, lg: 16 }

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  children,
  type = 'button',
  onClick,
  style: extraStyle,
  ...props
}) {
  const isDisabled = disabled || loading
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontWeight: 500,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.45 : 1,
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : undefined,
        ...s,
        ...v.default,
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) Object.assign(e.currentTarget.style, v.hover)
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) Object.assign(e.currentTarget.style, v.default, { width: fullWidth ? '100%' : undefined, ...s, ...extraStyle })
      }}
      onMouseDown={(e) => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(1px)' }}
      onMouseUp={(e) => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(-1px)' }}
      {...props}
    >
      {loading
        ? <Loader2 size={ICON_SIZES[size]} style={{ animation: 'spin 1s linear infinite' }} />
        : LeftIcon
        ? <LeftIcon size={ICON_SIZES[size]} />
        : null}
      <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
      {!loading && RightIcon && <RightIcon size={ICON_SIZES[size]} />}
    </button>
  )
}
