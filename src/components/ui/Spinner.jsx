import { Loader2 } from 'lucide-react'

const SIZES = { sm: 16, md: 24, lg: 40 }
const COLORS = { default: '#6366f1', white: '#ffffff', gray: '#5a5a6e' }

export default function Spinner({ size = 'md', color = 'default' }) {
  return (
    <Loader2
      size={SIZES[size]}
      style={{ color: COLORS[color] || COLORS.default, animation: 'spin 1s linear infinite' }}
    />
  )
}
