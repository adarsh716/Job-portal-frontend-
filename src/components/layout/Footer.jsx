import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#111118' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Zap size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-content-primary">JobPortal</span>
          <span className="text-[12px] text-content-tertiary">© 2026</span>
        </div>
        <div className="flex gap-5 text-[13px] text-content-secondary">
          <Link to="/jobs" className="hover:text-content-primary transition-colors">Browse Jobs</Link>
          <Link to="/register" className="hover:text-content-primary transition-colors">Post a Job</Link>
          <Link to="/login" className="hover:text-content-primary transition-colors">Sign In</Link>
        </div>
      </div>
    </footer>
  )
}
