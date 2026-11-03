import type { Policy, ResearchResource } from '@/types/sanity'

export function selectPolicies(curated: Policy[] = [], policies: Policy[] = []) {
  const seen = new Set<string>()
  return [...curated, ...policies]
    .filter((p) => {
      if (!p?.slug?.current || (p.status && p.status !== 'adopted') || seen.has(p._id)) return false
      seen.add(p._id)
      return true
    })
    .slice(0, 3)
}
export function selectResearch(resources: ResearchResource[], now = Date.now()) {
  return resources
    .filter((r) => r.slug?.current && r.publishedAt && Date.parse(r.publishedAt) <= now)
    .sort(
      (a, b) =>
        Number(!!b.featured) - Number(!!a.featured) ||
        Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
    )
    .slice(0, 3)
}
export function formatDate(value?: string) {
  return value && Number.isFinite(Date.parse(value))
    ? new Date(value).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Australia/Melbourne',
      })
    : ''
}
