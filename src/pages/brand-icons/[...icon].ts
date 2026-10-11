import type { APIRoute, GetStaticPaths } from 'astro'
import sharp from 'sharp'
import mark from '../../../public/favicon.svg?raw'
import { siteRegistry } from '../../../config/sites.mjs'

export const prerender = true

const sizes: Record<string, number> = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
}

export const getStaticPaths: GetStaticPaths = () =>
  Object.values(siteRegistry).flatMap((site) =>
    ['favicon.svg', 'favicon.ico', ...Object.keys(sizes)].map((file) => ({
      params: { icon: `${site.siteId}/${file}` },
      props: { file, themeColor: site.deployment.themeColor },
    }))
  )

export const GET: APIRoute = async ({ props }) => {
  const file = props.file as string
  const svg = mark.replace('#32105a', props.themeColor as string)
  if (file === 'favicon.svg') {
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
  }
  if (file === 'favicon.ico') {
    const dimensions = [16, 32, 48]
    const images = await Promise.all(
      dimensions.map((size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer())
    )
    const header = Buffer.alloc(6 + images.length * 16)
    header.writeUInt16LE(1, 2)
    header.writeUInt16LE(images.length, 4)
    let offset = header.length
    images.forEach((image, index) => {
      const entry = 6 + index * 16
      header[entry] = dimensions[index]
      header[entry + 1] = dimensions[index]
      header.writeUInt16LE(1, entry + 4)
      header.writeUInt16LE(32, entry + 6)
      header.writeUInt32LE(image.length, entry + 8)
      header.writeUInt32LE(offset, entry + 12)
      offset += image.length
    })
    return new Response(new Uint8Array(Buffer.concat([header, ...images])), {
      headers: { 'Content-Type': 'image/x-icon' },
    })
  }
  const size = sizes[file]
  let image = sharp(Buffer.from(svg)).resize(size, size)
  if (size >= 180) image = image.flatten({ background: '#ffffff' })
  return new Response(new Uint8Array(await image.png().toBuffer()), {
    headers: { 'Content-Type': 'image/png' },
  })
}
