import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionVariant = 'primary', renderAction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 16px', textAlign: 'center' }}>
      {Icon && (
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}>
          <Icon size={28} style={{ color: '#6366f1', opacity: 0.7 }} />
        </div>
      )}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 8 }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 13, color: '#9898a8', maxWidth: 360, lineHeight: 1.6, marginBottom: 24 }}>
          {description}
        </p>
      )}
      {renderAction && renderAction()}
      {actionLabel && onAction && !renderAction && (
        <Button variant={actionVariant} onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
