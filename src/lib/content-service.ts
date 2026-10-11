import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { Site } from '../../config/sites.mjs'
import type { Policy, Electorate, FAQ, Page, HomePage, ResearchResource } from '../types/sanity'
import type { ContentClient } from './content'

/** Bind typed queries to an already configured server-owned client. */
export function bindContentService(site: Site, client: ContentClient) {
  /**
   * Image URL builder for Sanity images
   */
  const builder = imageUrlBuilder({ projectId: site.cms.projectId, dataset: site.cms.dataset })

  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  /**
   * Helper to fetch all documents of a type
   * @deprecated Use typed functions like getPolicies() instead
   */
  async function getDocuments<T = unknown>(type: string): Promise<T[]> {
    const query = `*[_type == $type] | order(_updatedAt desc)`
    return await client.fetch(query, { type })
  }

  /**
   * Helper to fetch a single document by slug
   * @deprecated Use typed functions like getPolicyBySlug() instead
   */
  async function getDocumentBySlug<T = unknown>(type: string, slug: string): Promise<T | null> {
    const query = `*[_type == $type && slug.current == $slug][0]`
    return await client.fetch(query, { type, slug })
  }

  /**
   * Helper to fetch documents filtered by a field
   * @deprecated Use typed functions or create specific queries
   */
  async function getDocumentsByField<T = unknown>(
    type: string,
    field: string,
    value: string | number
  ): Promise<T[]> {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(field)) throw new Error('Invalid content field')
    const query = `*[_type == $type && ${field} == $value]`
    return await client.fetch(query, { type, value })
  }

  /**
   * Typed Sanity Query Functions
   * These provide better type safety and are the recommended way to fetch data
   */

  async function getPolicies(options?: {
    thisTerm?: boolean
    adoptedOnly?: boolean
  }): Promise<Policy[]> {
    let filter = '_type == "policy"'
    if (options && options.thisTerm !== undefined) {
      filter += ` && thisTerm == ${options.thisTerm}`
    }
    if (options?.adoptedOnly) {
      filter += ` && coalesce(status, 'adopted') == 'adopted'`
    }
    const query = `*[${filter}] | order(_createdAt desc)`
    return await client.fetch(query)
  }

  async function getPolicyBySlug(slug: string): Promise<Policy | null> {
    const query = `*[_type == "policy" && slug.current == $slug][0]`
    return await client.fetch(query, { slug })
  }

  async function getAdoptedPolicyBySlug(slug: string): Promise<Policy | null> {
    const query = `*[_type == "policy" && coalesce(status, 'adopted') == 'adopted' && slug.current == $slug][0]`
    return await client.fetch(query, { slug })
  }

  async function getElectorates(): Promise<Electorate[]> {
    const query = `*[_type == "electorate" && coalesce(isArchived, false) != true] | order(_createdAt desc)`
    return await client.fetch(query)
  }

  async function getArchivedElectorates(): Promise<Electorate[]> {
    const query = `*[_type == "electorate" && isArchived == true] | order(_createdAt desc)`
    return await client.fetch(query)
  }

  async function getElectorateBySlug(slug: string): Promise<Electorate | null> {
    const query = `*[_type == "electorate" && slug.current == $slug][0]`
    return await client.fetch(query, { slug })
  }

  async function getFAQs(): Promise<FAQ[]> {
    const query = `*[_type == "faq"] | order(order asc, _createdAt desc)`
    return await client.fetch(query)
  }

  async function getFAQBySlug(slug: string): Promise<FAQ | null> {
    const query = `*[_type == "faq" && slug.current == $slug][0]`
    return await client.fetch(query, { slug })
  }

  async function getFAQsByCategory(category: string): Promise<FAQ[]> {
    const query = `*[_type == "faq" && category == $category] | order(order asc, _createdAt desc)`
    return await client.fetch(query, { category })
  }

  async function getPages(): Promise<any[]> {
    const query = `*[_type == "page"] {
    ...,
    profileImage,
    role,
    "parent": parent->{
      slug,
      "parent": parent->{
        slug,
        "parent": parent->{
          slug
        }
      }
    }
  }`
    return await client.fetch(query)
  }

  async function getPageBySlug(slug: string): Promise<Page | null> {
    const query = `*[_type == "page" && slug.current == $slug][0]`
    return await client.fetch(query, { slug })
  }

  // ... (existing exports)

  async function getHomePage(): Promise<HomePage | null> {
    const query = `*[_type == "homePage"][0]{
    ...,
    hero {
      ...,
      image { ..., asset, alt }
    },
    theftSection {
      ...,
      featuredPolicies[]->{
        ...,
        image { ..., asset, alt }
      }
    }
  }`
    return await client.fetch(query)
  }

  // ...
  async function getConvinceYourFriendsPage(): Promise<any | null> {
    const query = `*[_type == "convinceYourFriends"][0]`
    return await client.fetch(query)
  }

  async function getPoliciesPage(): Promise<any | null> {
    const query = `*[_type == "policiesPage"][0]`
    return await client.fetch(query)
  }

  async function getElectoratesPage(): Promise<any | null> {
    const query = `*[_type == "electoratesPage"][0]`
    return await client.fetch(query)
  }

  async function getBlogPage(): Promise<any | null> {
    const query = `*[_type == "blogPage"][0]`
    return await client.fetch(query)
  }

  async function getSiteConfig(): Promise<any | null> {
    const query = `*[_type == "siteConfig"] | order(_updatedAt desc)[0]`
    return await client.fetch(query)
  }

  async function getVisionPage(): Promise<any | null> {
    const query = `*[_type == "visionPage"][0]`
    return await client.fetch(query)
  }

  async function getManifestoPage(): Promise<any | null> {
    const query = `*[_type == "manifestoPage"][0]`
    return await client.fetch(query)
  }

  async function getResearchResources(): Promise<ResearchResource[]> {
    const query = `*[_type == "researchResource"] | order(featured desc, publishedAt desc) {
    ...,
    "downloads": downloads[]{
      ...,
      "fileUrl": file.asset->url
    },
    "relatedPolicies": relatedPolicies[]->{
      _id,
      title,
      slug,
      summary
    },
    "relatedResearch": relatedResearch[]->[defined(@)]{
      _id,
      title,
      slug,
      abstract,
      researchArea,
      resourceType
    }
  }`
    return await client.fetch(query)
  }

  async function getResearchResourceBySlug(slug: string): Promise<ResearchResource | null> {
    const query = `*[_type == "researchResource" && slug.current == $slug][0] {
    ...,
    "downloads": downloads[]{
      ...,
      "fileUrl": file.asset->url
    },
    "relatedPolicies": relatedPolicies[]->{
      _id,
      title,
      slug,
      summary
    },
    "relatedResearch": relatedResearch[]->[defined(@)]{
      _id,
      title,
      slug,
      abstract,
      researchArea,
      resourceType
    }
  }`
    return await client.fetch(query, { slug })
  }

  async function getResearchForPolicy(policyId: string): Promise<ResearchResource[]> {
    const query = `*[_type == "researchResource" && references($policyId)] | order(featured desc, publishedAt desc) {
    ...,
    "downloads": downloads[]{
      ...,
      "fileUrl": file.asset->url
    },
    "relatedPolicies": relatedPolicies[]->{
      _id,
      title,
      slug,
      summary
    },
    "relatedResearch": relatedResearch[]->[defined(@)]{
      _id,
      title,
      slug,
      abstract,
      researchArea,
      resourceType
    }
  }`
    return await client.fetch(query, { policyId })
  }

  const fields = `{
  _id, title, slug, summary, featuredOnHome, homeOrder, shortTagline, issueQuestion, issueContext, stateLevers, federalLevers, nationalPolicyUrl, nationalPolicyName, location, entities, dependencies, projectStage, status, body,
  attribution, editorialDisclaimer, nextSteps, evidence, questions, updates, lastReviewed, publishedAt,
  "sourceReferences": sourceReferences[]->{_id,title,url,publisher,pageReference},
  "relatedInvestigations": relatedInvestigations[]->{_id,title,slug}
}`

  async function getInvestigations(): Promise<import('./investigations').Investigation[]> {
    return client.fetch(
      `*[_type == "investigation" && readyForPublication == true && defined(publishedAt) && defined(slug.current)] | order(publishedAt desc) ${fields}`
    )
  }

  async function getInvestigation(
    slug: string
  ): Promise<import('./investigations').Investigation | null> {
    return client.fetch(
      `*[_type == "investigation" && readyForPublication == true && defined(publishedAt) && slug.current == $slug][0] ${fields}`,
      { slug }
    )
  }

  async function getHomeInvestigations(): Promise<import('./investigations').Investigation[]> {
    return client.fetch(
      `*[_type == "investigation" && readyForPublication == true && featuredOnHome == true && defined(publishedAt) && defined(slug.current)] | order(homeOrder asc) ${fields}`
    )
  }
  return Object.freeze({
    getInvestigations,
    getInvestigation,
    getHomeInvestigations,
    urlFor,
    getDocuments,
    getDocumentBySlug,
    getDocumentsByField,
    getPolicies,
    getPolicyBySlug,
    getAdoptedPolicyBySlug,
    getElectorates,
    getArchivedElectorates,
    getElectorateBySlug,
    getFAQs,
    getFAQBySlug,
    getFAQsByCategory,
    getPages,
    getPageBySlug,
    getHomePage,
    getConvinceYourFriendsPage,
    getPoliciesPage,
    getElectoratesPage,
    getBlogPage,
    getSiteConfig,
    getVisionPage,
    getManifestoPage,
    getResearchResources,
    getResearchResourceBySlug,
    getResearchForPolicy,
  })
}

export type ContentService = ReturnType<typeof bindContentService>
