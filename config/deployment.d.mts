export interface Deployment {
  slug: string
  state: string
  adjective: string
  label: string
  tagline: string
  themeColor: string
  siteUrl: string
  projectId: string
  dataset: string
  jurisdiction: string
  description: string
}
export const branches: Record<
  string,
  Omit<Deployment, 'projectId' | 'dataset' | 'jurisdiction' | 'description'>
>
export function resolveDeployment(env?: Record<string, string | boolean | undefined>): Deployment
