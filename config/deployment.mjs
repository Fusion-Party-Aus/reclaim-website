/** Values every branch shares unchanged. */
const sharedContact = {
  email: 'contact@fusionparty.org.au',
  pressEmail: 'press@fusionparty.org.au',
  helloEmail: 'hello@fusionparty.org.au',
  preselectionEmail: 'preselection@fusionparty.org.au',
  techEmail: 'tech@fusionparty.org.au',
  discord: 'https://www.fusionparty.org.au/discord',
}

const sharedFooter = {
  networkBrandingUrl: 'https://www.fusionparty.org.au',
  newsletterEndpoint: '/api/newsletter',
}

const sharedSeo = {
  nationalOrganizationUrl: 'https://fusionparty.org.au/#organization',
  logoPath: '/logo.png',
}

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
    navigation: {
      fallback: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Policies', href: '/policies' },
        { label: 'Vision', href: '/vision' },
        { label: 'Research', href: '/research' },
      ],
      cta: { label: 'Get involved', href: '/get-involved' },
    },
    contact: {
      ...sharedContact,
      phone: '0410 249 574',
      address: '254 McLeod Lane\nMansfield VIC 3722\nAustralia',
    },
    analytics: {
      plausibleScriptUrl: 'https://analytics.fusionparty.org.au/js/pa-HF_gBIYZhzFUGLXpsvgWh.js',
    },
    seo: {
      ...sharedSeo,
      defaultOgImage: '/og/default.png',
    },
    cta: {
      getInvolved: '/get-involved',
      donate: '/get-involved#donate',
      donateNational: 'https://fusionparty.org.au/donate',
      contact: '/contact',
      costings: '/costings',
      electorates: '/electorate',
      transportScore: 'https://transportscore.fusionparty.org.au',
    },
    footer: sharedFooter,
  },
  qld: {
    slug: 'qld',
    state: 'Queensland',
    adjective: 'Queensland',
    label: 'Fusion Party Queensland',
    tagline: 'A better future for Queensland',
    themeColor: '#731E32',
    siteUrl: 'https://qld.fusionparty.org.au',
    navigation: {
      fallback: [
        { label: 'Home', href: '/' },
        { label: 'Policies', href: '/policies' },
        { label: 'Contact', href: '/contact' },
      ],
      cta: { label: 'Get involved', href: '/contact' },
    },
    contact: {
      ...sharedContact,
    },
    analytics: {},
    seo: {
      ...sharedSeo,
      defaultOgImage: '/og/qld-default.png',
    },
    cta: {
      getInvolved: '/contact',
      donate: 'https://fusionparty.org.au/donate',
      donateNational: 'https://fusionparty.org.au/donate',
      contact: '/contact',
      electorates: '/electorates',
    },
    footer: sharedFooter,
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
  const analytics = env.PUBLIC_PLAUSIBLE_SRC
    ? { ...branch.analytics, plausibleScriptUrl: env.PUBLIC_PLAUSIBLE_SRC }
    : branch.analytics
  return {
    ...branch,
    siteUrl,
    projectId,
    dataset,
    analytics,
    jurisdiction: `${branch.state}, Australia`,
    description: `${branch.label} — ${branch.tagline}. Explore our policies, research and practical plans for housing, transport, integrity and civil liberties.`,
  }
}
