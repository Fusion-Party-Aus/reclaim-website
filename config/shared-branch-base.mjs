/**
 * Draft shared copy; no CMS writes. Source review: 2026-10-12.
 * https://www.fusionparty.org.au/ and https://www.fusionparty.org.au/our_values
 * Publication remains subject to maintainer approval; eligibility never activates a host.
 */
export const sharedBranchBaseContent = Object.freeze({
  version: 1,
  ownerSiteId: 'national',
  siteIds: Object.freeze(['nsw', 'sa', 'tas', 'wa', 'nt', 'act']),
  introduction:
    'Fusion is an Australian political party working towards a free and fair society for current and future generations. We bring people together to develop ideas and take part in democratic life.',
  values: Object.freeze(
    [
      {
        name: 'Personal Liberty',
        description:
          'People should be free to shape their own lives, with respect for the freedoms of others.',
      },
      {
        name: 'Advancement',
        description:
          'Everyone should have access to knowledge, resources and opportunities to improve their quality of life.',
      },
      {
        name: 'Ecological Harmony',
        description:
          'Protect the natural world and recognise its value beyond its usefulness to people.',
      },
      {
        name: 'Safety',
        description:
          'Everyone deserves security from violence and deprivation, including access to food, housing and care.',
      },
      {
        name: 'Ethical Conduct',
        description: 'Act honestly, explain decisions openly and engage with others in good faith.',
      },
      {
        name: 'Equity',
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
