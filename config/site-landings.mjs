function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}

export const landingSiteRegistry = freeze(
  Object.fromEntries(
    Object.entries({
      nsw: 'New South Wales',
      sa: 'South Australia',
      nt: 'Northern Territory',
      act: 'Australian Capital Territory',
    }).map(([siteId, state]) => [
      siteId,
      {
        kind: 'landing',
        siteId,
        branchId: siteId,
        canonicalOrigin: `https://${siteId}.fusionparty.org.au`,
        hostnames: [`${siteId}.fusionparty.org.au`],
        landing: { label: `Fusion Party ${state}`, state },
      },
    ])
  )
)
