import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import Button from '../ui/Button'

export default function JobSearchBar({ compact = false }) {
  const [searchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('search', keyword)
    if (location) params.set('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={`flex ${compact ? 'gap-2' : 'gap-3 flex-col sm:flex-row'}`}>
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, keywords..."
          className={`w-full pl-9 pr-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${compact ? 'py-2 text-sm' : 'py-3'}`}
        />
      </div>
      <div className="relative flex-1">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or remote..."
          className={`w-full pl-9 pr-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${compact ? 'py-2 text-sm' : 'py-3'}`}
        />
      </div>
      <Button type="submit" size={compact ? 'md' : 'lg'} className="shrink-0">
        Search
      </Button>
    </form>
  )
}
