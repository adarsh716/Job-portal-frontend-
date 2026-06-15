export function formatSalary(min, max) {
  if (!min && !max) return 'Not specified'
  const fmt = (n) => '$' + Number(n).toLocaleString()
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max)}`
}
