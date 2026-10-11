const lifetime = 30 * 60 * 1000
const encoder = new TextEncoder()
function encode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
function decode(value: string) {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
}
async function signingKey(secret: string) {
  if (encoder.encode(secret).length < 32)
    throw new Error('Preview signing key must contain at least 32 bytes')
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}
export async function issuePreviewSession(
  input: { siteId: string; browser: string; now: number },
  secret: string
) {
  const payload = encode(
    encoder.encode(JSON.stringify({ ...input, expiresAt: input.now + lifetime }))
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    await signingKey(secret),
    encoder.encode(payload)
  )
  return `${payload}.${encode(new Uint8Array(signature))}`
}
export async function verifyPreviewSession(
  token: string,
  input: { siteId: string; browser: string; now: number },
  secret: string
) {
  try {
    if (token.length > 4096) return false
    const [payload, signature, extra] = token.split('.')
    if (!payload || !signature || extra) return false
    if (
      !(await crypto.subtle.verify(
        'HMAC',
        await signingKey(secret),
        decode(signature),
        encoder.encode(payload)
      ))
    )
      return false
    const data = JSON.parse(new TextDecoder().decode(decode(payload)))
    return (
      data.siteId === input.siteId &&
      data.browser === input.browser &&
      Boolean(input.browser) &&
      Number.isFinite(data.now) &&
      Number.isFinite(data.expiresAt) &&
      data.now <= input.now &&
      data.expiresAt > input.now &&
      data.expiresAt - data.now === lifetime
    )
  } catch {
    return false
  }
}
export function safePreviewReturnPath(path: string | undefined) {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return '/'
  try {
    const url = new URL(path, 'https://preview.invalid')
    if (
      url.origin !== 'https://preview.invalid' ||
      url.pathname.startsWith('/api/preview/') ||
      [...url.searchParams.keys()].some((key) => key.startsWith('sanity-preview-'))
    )
      return '/'
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}
