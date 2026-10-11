import type { HomePage, Policy } from '../../types/sanity'

interface Identity {
  label: string
  state: string
  tagline: string
  description: string
}

/** Branch identity supplies defaults; content availability supplies sections. */
export function resolveHomeContent(document: Partial<HomePage> | null, branch: Identity) {
  const home = document || {}
  return {
    ...home,
    title: home.seo?.metaTitle || home.title || branch.label,
    description: home.seo?.metaDescription || home.hero?.subtitle || branch.description,
    hero: {
      ...home.hero,
      eyebrow: home.hero?.eyebrow || branch.label,
      title: home.hero?.title || home.heroTitle || branch.tagline,
      subtitle: home.hero?.subtitle || home.heroSubtitle || branch.description,
      showCTA: home.hero?.showCTA !== false,
      stats: home.hero?.stats || [],
    },
    movementMetrics: (home.movementMetrics || []).filter(
      (metric) =>
        Number.isFinite(metric.current) &&
        metric.current >= 0 &&
        Number.isFinite(metric.goal) &&
        metric.goal > 0
    ),
    resources: (home.participatoryResources || []).filter(
      (resource) => resource.label && resource.url
    ),
    stages: home.participatoryStages || [],
    joinCards: home.joinSection?.cards || [],
  }
}

/** Only published, adopted policies can appear as policy recommendations. */
export function selectHomePolicies(adopted: Policy[], featured: (Policy | null)[] | null = []) {
  const available = adopted.filter(
    (policy) => policy.slug?.current && (!policy.status || policy.status === 'adopted')
  )
  const selected = (featured || []).flatMap((policy) => {
    if (!policy) return []
    const match = available.find((item) => item._id === policy._id)
    return match ? [match] : []
  })
  return (selected.length ? selected : available).slice(0, 3)
}
