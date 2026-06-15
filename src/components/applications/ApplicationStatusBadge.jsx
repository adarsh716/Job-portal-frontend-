const STATUS_STYLES = {
  APPLIED:     'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-yellow-100 text-yellow-700',
  INTERVIEW:   'bg-purple-100 text-purple-700',
  OFFERED:     'bg-green-100 text-green-700',
  REJECTED:    'bg-red-100 text-red-700',
  WITHDRAWN:   'bg-gray-100 text-gray-600',
}

const STATUS_LABELS = {
  APPLIED: 'Applied', SHORTLISTED: 'Shortlisted', INTERVIEW: 'Interview',
  OFFERED: 'Offered', REJECTED: 'Rejected', WITHDRAWN: 'Withdrawn',
}

export default function ApplicationStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
