export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'text-accent-primary border border-[rgba(99,102,241,0.25)]'
                : 'text-content-secondary hover:text-content-primary hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
              }
            `}
            style={isActive ? { background: 'rgba(99,102,241,0.1)' } : {}}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold px-1 ${
                  isActive ? 'bg-accent-primary text-white' : 'bg-[rgba(255,255,255,0.08)] text-content-secondary'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
