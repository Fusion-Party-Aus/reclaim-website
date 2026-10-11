/** Maintainer-approved future roster; this does not register or activate runtime hosts. */
export const approvedSiteRoster = Object.freeze(
  Object.fromEntries(
    ['national', 'vic', 'nsw', 'sa', 'qld', 'tas', 'wa', 'nt', 'act'].map((siteId) => [
      siteId,
      Object.freeze({
        siteId,
        branchId: siteId === 'national' ? undefined : siteId,
        canonicalOrigin: `https://${siteId === 'national' ? '' : `${siteId}.`}fusionparty.org.au`,
        aliases: Object.freeze([]),
      }),
    ])
  )
)
