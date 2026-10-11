/** Minimal server binding surface for Astro 6's Cloudflare runtime module. */
declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>
}
