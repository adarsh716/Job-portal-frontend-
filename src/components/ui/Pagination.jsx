import { ChevronLeft, ChevronRight } from 'lucide-react'

const btnBase = {
  width: 36, height: 36, borderRadius: 8, border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: 13, fontWeight: 500,
  transition: 'all 0.15s ease', fontFamily: 'inherit',
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(0)
    if (currentPage > 3) pages.push('...')
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages - 2, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 4) pages.push('...')
    pages.push(totalPages - 1)
    return pages
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 24 }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        style={{ ...btnBase, color: '#9898a8', background: 'transparent', opacity: currentPage === 0 ? 0.3 : 1, cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => { if (currentPage !== 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f0f0f5' } }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9898a8' }}
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a5a6e', fontSize: 13 }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...btnBase,
              background: p === currentPage ? '#6366f1' : 'transparent',
              color: p === currentPage ? '#fff' : '#9898a8',
              boxShadow: p === currentPage ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
            }}
            onMouseEnter={(e) => { if (p !== currentPage) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f0f0f5' } }}
            onMouseLeave={(e) => { if (p !== currentPage) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9898a8' } }}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        style={{ ...btnBase, color: '#9898a8', background: 'transparent', opacity: currentPage === totalPages - 1 ? 0.3 : 1, cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => { if (currentPage !== totalPages - 1) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f0f0f5' } }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9898a8' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
