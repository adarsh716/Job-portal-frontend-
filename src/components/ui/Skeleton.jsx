export default function Skeleton({ width, height, className = '', variant = 'rect' }) {
  const base = `
    animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)]
    bg-[length:200%_100%] bg-[#1a1a24]
  `

  if (variant === 'circle') {
    return (
      <div
        className={`rounded-full flex-shrink-0 ${base} ${className}`}
        style={{ width: width || 40, height: height || 40 }}
      />
    )
  }

  if (variant === 'text') {
    return (
      <div
        className={`rounded-md h-4 ${base} ${className}`}
        style={{ width: width || '100%' }}
      />
    )
  }

  return (
    <div
      className={`rounded-xl ${base} ${className}`}
      style={{ width: width || '100%', height: height || 80 }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="55%" />
      <div className="flex gap-2 mt-1">
        <Skeleton variant="rect" width={60} height={22} className="rounded-full" />
        <Skeleton variant="rect" width={80} height={22} className="rounded-full" />
      </div>
    </div>
  )
}
