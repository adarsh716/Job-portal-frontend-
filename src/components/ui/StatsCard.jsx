import { TrendingUp, TrendingDown } from 'lucide-react'

const COLORS = {
  indigo: { grad: ['rgba(99,102,241,0.18)', 'rgba(99,102,241,0.04)'], icon: 'rgba(99,102,241,0.18)', iconBorder: 'rgba(99,102,241,0.3)', iconText: '#a5b4fc', glow: 'rgba(99,102,241,0.3)' },
  violet: { grad: ['rgba(139,92,246,0.18)', 'rgba(139,92,246,0.04)'], icon: 'rgba(139,92,246,0.18)', iconBorder: 'rgba(139,92,246,0.3)', iconText: '#c4b5fd', glow: 'rgba(139,92,246,0.3)' },
  emerald: { grad: ['rgba(16,185,129,0.15)', 'rgba(16,185,129,0.03)'], icon: 'rgba(16,185,129,0.15)', iconBorder: 'rgba(16,185,129,0.3)', iconText: '#6ee7b7', glow: 'rgba(16,185,129,0.25)' },
  amber: { grad: ['rgba(245,158,11,0.15)', 'rgba(245,158,11,0.03)'], icon: 'rgba(245,158,11,0.15)', iconBorder: 'rgba(245,158,11,0.3)', iconText: '#fcd34d', glow: 'rgba(245,158,11,0.25)' },
  blue: { grad: ['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.03)'], icon: 'rgba(59,130,246,0.15)', iconBorder: 'rgba(59,130,246,0.3)', iconText: '#93c5fd', glow: 'rgba(59,130,246,0.25)' },
  rose: { grad: ['rgba(239,68,68,0.15)', 'rgba(239,68,68,0.03)'], icon: 'rgba(239,68,68,0.15)', iconBorder: 'rgba(239,68,68,0.3)', iconText: '#fca5a5', glow: 'rgba(239,68,68,0.25)' },
}

export default function StatsCard({ title, value, change, icon: Icon, color = 'indigo', onClick }) {
  const c = COLORS[color] || COLORS.indigo
  const isPositive = change > 0
  const hasChange = change !== undefined && change !== null

  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${c.grad[0]} 0%, ${c.grad[1]} 100%)`,
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={onClick ? (e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)' } : undefined}
      onMouseLeave={onClick ? (e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' } : undefined}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: c.glow,
        filter: 'blur(24px)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#9898a8', marginBottom: 8,
          }}>
            {title}
          </p>
          <p style={{
            fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1,
            background: 'linear-gradient(135deg, #f0f0f5, #c8c8d8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}
          </p>
          {hasChange && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4, marginTop: 6,
              fontSize: 12, fontWeight: 500,
              color: isPositive ? '#10b981' : '#ef4444',
            }}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{isPositive ? '+' : ''}{change}% this month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: c.icon,
            border: `1px solid ${c.iconBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={18} style={{ color: c.iconText }} />
          </div>
        )}
      </div>
    </div>
  )
}
