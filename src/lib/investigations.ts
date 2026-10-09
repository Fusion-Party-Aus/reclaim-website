import { client } from './sanity'

export interface Investigation {
  _id: string
  title: string
  slug: { current: string }
  summary: string
  location?: string
  entities?: string[]
  dependencies?: string[]
  projectStage?: string
  status?: string
  attribution?: string
  editorialDisclaimer?: string
  nextSteps?: string
  body?: any[]
  evidence?: {
    _key: string
    title: string
    url: string
    publisher?: string
    date?: string
    finding?: string
    limitations?: string
  }[]
  questions?: {
    _key: string
    question: string
    status: 'answered' | 'partial' | 'outstanding'
    answer?: string
    provenance?: string
    submittedOn?: string
    evidenceUrls?: string[]
    lastChecked?: string
  }[]
  updates?: {
    _key: string
    date: string
    headline: string
    detail?: string
    sourceUrl?: string
    previousPosition?: string
    changeAssessment?: string
  }[]
  sourceReferences?: {
    _id: string
    title: string
    url: string
    publisher?: string
    pageReference?: string
  }[]
  relatedInvestigations?: { _id: string; title: string; slug: { current: string } }[]
  lastReviewed?: string
  publishedAt?: string
}

const fields = `{
  _id, title, slug, summary, location, entities, dependencies, projectStage, status, body,
  attribution, editorialDisclaimer, nextSteps, evidence, questions, updates, lastReviewed, publishedAt,
  "sourceReferences": sourceReferences[]->{_id,title,url,publisher,pageReference},
  "relatedInvestigations": relatedInvestigations[]->{_id,title,slug}
}`

export async function getInvestigations(): Promise<Investigation[]> {
  return client.fetch(
    `*[_type == "investigation" && readyForPublication == true && defined(publishedAt) && defined(slug.current)] | order(publishedAt desc) ${fields}`
  )
}

export async function getInvestigation(slug: string): Promise<Investigation | null> {
  return client.fetch(
    `*[_type == "investigation" && readyForPublication == true && defined(publishedAt) && slug.current == $slug][0] ${fields}`,
    { slug }
  )
}
