import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <ShieldOff size={64} className="text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-6">You don't have permission to view this page.</p>
      <Link to="/" className="text-blue-600 hover:underline font-medium">Go back home</Link>
    </div>
  )
}
