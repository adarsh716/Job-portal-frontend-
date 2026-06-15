const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export default function Card({
  children,
  hover = false,
  gradient = false,
  gradientBorder = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        ${gradientBorder ? 'gradient-border' : 'card'}
        ${hover ? 'card-hover' : ''}
        ${gradient ? 'bg-gradient-to-br from-[rgba(99,102,241,0.03)] to-[rgba(139,92,246,0.03)]' : ''}
        ${paddings[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
