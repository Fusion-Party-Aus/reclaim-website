/** Unsplash provenance and licence review: docs/sparc/domain-network/branch-city-photography.md */
const records = {
  nsw: {
    city: 'Sydney',
    alt: 'Sydney Opera House beside Sydney Harbour at sunset',
    photo: '1771760171302-2d60b9a3576f',
    photographer: 'Sung Jin Cho',
    slug: 'sydney-opera-house-at-sunset-over-the-water-M7xPhPxyV2Y',
    position: '50% 50%',
  },
  sa: {
    city: 'Adelaide',
    alt: 'Adelaide city skyline viewed from a hill',
    photo: '1677893111398-0ebb0ed2aa85',
    photographer: 'Ben',
    slug: 'a-view-of-a-city-from-a-hill-HlGEM72pd1g',
    position: '50% 50%',
  },
  tas: {
    city: 'Hobart',
    alt: 'Hobart and the River Derwent viewed from a mountain',
    photo: '1687357283072-0d2d8d75c8e0',
    photographer: 'Ziyao Xiong',
    slug: 'a-view-of-a-large-body-of-water-from-a-hill-RfnYWXbQkNY',
    position: '50% 50%',
  },
  wa: {
    city: 'Perth',
    alt: 'Perth skyline and the Swan River viewed from Kings Park',
    photo: '1639669238607-fc36b484012f',
    photographer: 'Joshua Leong',
    slug: 'a-view-of-a-city-and-the-ocean-from-a-hill-gl7nkS_h4lo',
    position: '50% 50%',
  },
  qld: {
    city: 'Brisbane',
    alt: 'Brisbane skyline, river and Neville Bonner Bridge at golden hour',
    photo: '1789758385737-1125f82baa59',
    photographer: 'Queensland, Australia',
    slug: 'brisbane-skyline-and-river-at-sunset-nHSi9DcuLdQ',
    position: '50% 50%',
  },
  nt: {
    city: 'Darwin',
    alt: 'Darwin waterfront park and port with a docked cruise ship',
    photo: '1613847602792-3f2c04719125',
    photographer: 'Renato Marzan',
    slug: 'white-cruise-ship-on-sea-during-daytime--Y-Mpydwfgk',
    position: '50% 50%',
  },
  act: {
    city: 'Canberra',
    alt: 'Australian Parliament House in Canberra',
    photo: '1672264597620-d792bb6de88d',
    photographer: 'Marcus Reubenstein',
    slug: 'a-large-building-with-a-flag-on-top-of-it-WWVLdFbTiVk',
    position: '50% 50%',
  },
}
export const branchCityPhotography = Object.freeze(
  Object.fromEntries(
    Object.entries(records).map(([id, { photo, slug, ...record }]) => [
      id,
      Object.freeze({
        ...record,
        src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&q=80`,
        creditUrl: `https://unsplash.com/photos/${slug}`,
      }),
    ])
  )
)
export function getBranchCityPhotography(siteId) {
  if (!Object.hasOwn(branchCityPhotography, siteId))
    throw new Error('City photo unavailable for this site')
  return branchCityPhotography[siteId]
}
