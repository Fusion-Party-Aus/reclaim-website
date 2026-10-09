/**
 * Branch-agnostic framework — branch-neutral starter content.
 *
 * Builds one starter document per entry in `SINGLETON_TYPES`, derived from the
 * supplied branch entry's `identity` only. No branch name, policy, metric or
 * copy is hardcoded: a new branch starts empty (no movement metrics, stats or
 * cards) and its own labels.
 *
 * See algorithm_specification.md §6.1.
 */
import { SINGLETON_TYPES } from './singletons.mjs'

const describeBranch = (identity) => `${identity.label} — ${identity.tagline}.`

const builders = {
  homePage: (identity) => ({
    _id: 'homePage',
    _type: 'homePage',
    title: identity.label,
    seo: { metaTitle: identity.label, metaDescription: describeBranch(identity) },
    hero: {
      eyebrow: identity.label,
      title: identity.tagline,
      subtitle: 'Help shape our policies and build our movement.',
      showCTA: true,
      stats: [],
    },
    alertBar: { enabled: false },
    movementMetrics: [],
    theftSection: {
      heading: 'Our policies',
      description: 'Our platform will be published here as proposals are developed and reviewed.',
      cards: [],
    },
    electoratesSection: {
      heading: 'Our candidates',
      description: 'Candidate announcements will appear here.',
      callToAction: {
        heading: 'Get involved',
        description: 'Help build our movement.',
        buttonText: 'Contact us',
        buttonLink: '/contact',
      },
    },
    manifestoSection: {
      heading: 'Our approach',
      description: 'Evidence, rights and practical results.',
      stats: [],
    },
    joinSection: {
      heading: 'Build a better future',
      description: 'Join the conversation.',
      cards: [],
    },
    signupCTA: {
      heading: 'Stay in touch',
      description: 'Get campaign updates.',
      buttonText: 'Sign up',
      footerText: '',
    },
  }),

  navigation: (identity) => ({
    _id: 'navigation',
    _type: 'navigation',
    title: identity.label,
    logo: {
      mainText: 'FUSION',
      subText: identity.state.toUpperCase(),
      tagline: identity.tagline,
    },
    mainNav: [
      { _key: 'policies', label: 'Policies', href: '/policies', order: 1 },
      { _key: 'contact', label: 'Contact', href: '/contact', order: 2 },
    ],
    ctaButton: { label: 'Get involved', href: '/contact', style: 'primary' },
  }),

  footer: (identity) => ({
    _id: 'footer',
    _type: 'footer',
    title: identity.label,
    logo: { mainText: 'FUSION', subText: identity.state.toUpperCase() },
    tagline: identity.tagline,
    socialLinks: [],
    resourceLinks: [],
    navColumns: [],
    banner: { text: identity.tagline, rotation: 0 },
    authorization: '',
    newsletter: {
      heading: 'Get campaign updates',
      description: 'Stay in touch with our movement.',
      buttonText: 'Sign up',
    },
  }),

  siteConfig: (identity) => ({
    _id: 'siteConfig',
    _type: 'siteConfig',
    title: identity.label,
  }),
}

/**
 * Build the starter documents for a branch entry.
 * @param {{ identity: object }} entry A branch entry carrying an `identity`.
 * @returns {Array<Record<string, unknown>>} One document per singleton type.
 */
export function buildStarterContent(entry) {
  const identity = entry?.identity ?? entry ?? {}

  return SINGLETON_TYPES.map((type) => builders[type](identity))
}
