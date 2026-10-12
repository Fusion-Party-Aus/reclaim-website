/**
 * Draft shared copy; no CMS writes. Source review: 2026-10-12.
 * https://www.fusionparty.org.au/ and https://www.fusionparty.org.au/our_values
 * Publication remains subject to maintainer approval; eligibility never activates a host.
 */
export const sharedBranchBaseContent = Object.freeze({
  version: 1,
  ownerSiteId: 'national',
  heroSlogan: 'A better future, built together.',
  missionHeading: 'Good ideas. Better lives.',
  policyAreas: Object.freeze(
    [
      {
        title: 'Fair + Inclusive Society',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1772325652571-f1406f80ee01?auto=format&fit=crop&w=800&q=80',
          alt: 'Homes and green parkland in a Sydney neighbourhood',
          photographer: 'Shanjir H · Photo4life AU',
          creditUrl:
            'https://unsplash.com/photos/aerial-view-of-a-suburban-neighborhood-with-houses-and-trees-D52yMVa1nZw',
        }),
        description: 'Housing, health and a fairer society.',
        href: 'https://www.fusionparty.org.au/fair_inclusive_society',
      },
      {
        title: 'Ethical Governance',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1672264597620-d792bb6de88d?auto=format&fit=crop&w=800&q=80',
          alt: 'Australian Parliament House in Canberra',
          photographer: 'Marcus Reubenstein',
          creditUrl:
            'https://unsplash.com/photos/a-large-building-with-a-flag-on-top-of-it-WWVLdFbTiVk',
        }),
        description: 'Transparency, accountability and public trust.',
        href: 'https://www.fusionparty.org.au/ethical_governance',
      },
      {
        title: 'Climate Rescue',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1577925966603-3e9c98617875?auto=format&fit=crop&w=800&q=80',
          alt: 'Sea and coastal cliffs at Rapid Bay, South Australia',
          photographer: 'lovebyLouis',
          creditUrl: 'https://unsplash.com/photos/landscape-photography-of-seacoast-ANDnlCxSgrg',
        }),
        description: 'Climate action and a transition to negative emissions.',
        href: 'https://www.fusionparty.org.au/climate_rescue',
      },
    ].map(Object.freeze)
  ),
  siteIds: Object.freeze(['nsw', 'sa', 'tas', 'wa', 'nt', 'act']),
  introduction:
    'Fusion is an Australian political party working towards a free and fair society for current and future generations. We bring people together to develop ideas and take part in democratic life.',
  values: Object.freeze(
    [
      {
        name: 'Personal Liberty',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1768896390397-8ec8ebf2fbdf?auto=format&fit=crop&w=320&h=320&q=75',
          alt: 'Kookaburra perched outdoors',
          photographer: 'Peaky_82',
          creditUrl:
            'https://unsplash.com/photos/a-kookaburra-bird-perched-on-a-wire-outdoors-ZPENtTrA39A',
        }),
        description:
          'People should be free to shape their own lives, with respect for the freedoms of others.',
      },
      {
        name: 'Advancement',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1666868213704-1677b7f04c30?auto=format&fit=crop&w=320&h=320&q=75',
          alt: 'Computer memory module',
          photographer: 'Ian Talmacs',
          creditUrl: 'https://unsplash.com/photos/a-close-up-of-a-computer-chip-7PSKG7iAh7g',
        }),
        description:
          'Everyone should have access to knowledge, resources and opportunities to improve their quality of life.',
      },
      {
        name: 'Ecological Harmony',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1767236860747-77936e5fbf45?auto=format&fit=crop&w=320&h=320&q=75',
          alt: 'Trees and ferns in the Blue Mountains',
          photographer: 'You Le',
          creditUrl:
            'https://unsplash.com/photos/lush-green-forest-with-tall-trees-and-ferns-xpVGYAx4apU',
        }),
        description:
          'Protect the natural world and recognise its value beyond its usefulness to people.',
      },
      {
        name: 'Safety',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1576806112200-cb6902182bde?auto=format&fit=crop&w=320&h=320&q=75',
          alt: 'Black swan resting with its head among its feathers',
          photographer: 'David Clode',
          creditUrl: 'https://unsplash.com/photos/black-swan-W7QkaUbYEmg',
        }),
        description:
          'Everyone deserves security from violence and deprivation, including access to food, housing and care.',
      },
      {
        name: 'Ethical Conduct',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1438179152657-8ce7dfda4f0b?auto=format&fit=crop&w=320&h=320&q=75',
          alt: 'Sunlight falling through trees onto grass',
          photographer: 'Micah Hallahan',
          creditUrl: 'https://unsplash.com/photos/sunlight-through-trees-Kb-Cpr5dZXo',
        }),
        description: 'Act honestly, explain decisions openly and engage with others in good faith.',
      },
      {
        name: 'Equity',
        photography: Object.freeze({
          src: 'https://images.unsplash.com/photo-1772325652571-f1406f80ee01?auto=format&fit=crop&w=320&h=320&q=75',
          alt: 'Homes surrounding green parkland in Sydney',
          photographer: 'Shanjir H · Photo4life AU',
          creditUrl:
            'https://unsplash.com/photos/aerial-view-of-a-suburban-neighborhood-with-houses-and-trees-D52yMVa1nZw',
        }),
        description:
          'Create fair opportunities for people, whatever their background or circumstances.',
      },
    ].map(Object.freeze)
  ),
  links: Object.freeze(
    Object.fromEntries(
      Object.entries({
        values: 'our_values',
        policy: 'policy',
        join: 'join',
        volunteer: 'volunteer',
        contact: 'contact',
        privacy: 'privacy_policy',
      }).map(([key, path]) => [key, `https://www.fusionparty.org.au/${path}`])
    )
  ),
})
export function getBranchBaseContent(siteId) {
  if (!sharedBranchBaseContent.siteIds.includes(siteId))
    throw new Error('Shared base unavailable for this site')
  return sharedBranchBaseContent
}
