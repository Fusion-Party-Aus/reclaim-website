/** New branches start with neutral content, never a copy of Victorian policy or metrics. */
export function starterContent(branch) {
  return [
    {
      _id: 'homePage',
      _type: 'homePage',
      title: branch.label,
      seo: { metaTitle: branch.label, metaDescription: branch.description },
      hero: {
        eyebrow: branch.label,
        title: branch.tagline,
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
    },
    {
      _id: 'navigation',
      _type: 'navigation',
      title: branch.label,
      logo: { mainText: 'FUSION', subText: branch.state.toUpperCase(), tagline: branch.tagline },
      mainNav: [
        { _key: 'policies', label: 'Policies', href: '/policies', order: 1 },
        { _key: 'contact', label: 'Contact', href: '/contact', order: 2 },
      ],
      ctaButton: { label: 'Get involved', href: '/contact', style: 'primary' },
    },
    {
      _id: 'footer',
      _type: 'footer',
      title: branch.label,
      logo: { mainText: 'FUSION', subText: branch.state.toUpperCase() },
      tagline: branch.tagline,
      socialLinks: [],
      resourceLinks: [],
      navColumns: [],
      banner: { text: branch.tagline, rotation: 0 },
      authorization: '',
      newsletter: {
        heading: 'Get campaign updates',
        description: 'Stay in touch with our movement.',
        buttonText: 'Sign up',
      },
    },
    { _id: 'siteConfig', _type: 'siteConfig', title: branch.label },
  ]
}
