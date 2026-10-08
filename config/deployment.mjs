/** Deployment identity is independent of the Git branch. Victoria remains the default. */
export const branches = {
  vic: {
    slug: 'vic',
    state: 'Victoria',
    adjective: 'Victorian',
    label: 'Fusion Party Victoria',
    tagline: 'Reignite Democracy',
    themeColor: '#D428D4',
    siteUrl: 'https://vic.fusionparty.org.au',
  },
  qld: {
    slug: 'qld',
    state: 'Queensland',
    adjective: 'Queensland',
    label: 'Fusion Party Queensland',
    tagline: 'A better future for Queensland',
    themeColor: '#731E32',
    siteUrl: 'https://qld.fusionparty.org.au',
  },
}

export function resolveDeployment(env = {}) {
  const slug = env.PUBLIC_BRANCH || env.SANITY_STUDIO_BRANCH || 'vic'
  if (!Object.hasOwn(branches, slug)) throw new Error(`Unknown deployment branch: ${slug}`)
  const branch = branches[slug]
  const projectId = env.PUBLIC_SANITY_PROJECT_ID || env.SANITY_STUDIO_PROJECT_ID || 'qwl3f8jb'
  const dataset =
    env.PUBLIC_SANITY_DATASET ||
    env.SANITY_STUDIO_DATASET ||
    (slug === 'vic' ? 'production' : 'qld')
  if (slug !== 'vic' && projectId === 'qwl3f8jb' && dataset === 'production') {
    throw new Error(
      'Queensland must use its own Sanity dataset or project, not Victoria production'
    )
  }
  const siteUrl = new URL(env.SITE_URL || env.PUBLIC_SITE_URL || branch.siteUrl).origin
  return {
    ...branch,
    siteUrl,
    projectId,
    dataset,
    jurisdiction: `${branch.state}, Australia`,
    description: `${branch.label} — ${branch.tagline}. Explore our policies, research and practical plans for housing, transport, integrity and civil liberties.`,
  }
}
