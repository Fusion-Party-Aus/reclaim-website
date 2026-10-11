/** Map a shared OG asset path to the corresponding asset for the active Site. */
export function siteOgImage(siteId: string, image: string): string {
  if (!image.startsWith('/og/')) return image

  const assetPath = image.slice('/og/'.length)
  const normalizedPath = assetPath === 'qld-default.png' ? 'default.png' : assetPath
  return `/og/${siteId}/${normalizedPath}`
}
