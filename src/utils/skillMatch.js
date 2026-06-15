export function calculateMatchPercent(jobSkills, seekerSkills) {
  if (!jobSkills || jobSkills.length === 0) return 100
  if (!seekerSkills || seekerSkills.length === 0) return 0
  const jobSet = jobSkills.map((s) => s.toLowerCase())
  const seekerSet = seekerSkills.map((s) => s.toLowerCase())
  const matches = jobSet.filter((s) => seekerSet.includes(s)).length
  return Math.round((matches / jobSet.length) * 100)
}
