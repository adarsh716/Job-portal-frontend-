import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(dateString) {
  if (!dateString) return ''
  return format(new Date(dateString), 'MMM dd, yyyy')
}

export function timeAgo(dateString) {
  if (!dateString) return ''
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}
