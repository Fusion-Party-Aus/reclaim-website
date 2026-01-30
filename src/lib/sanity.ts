import { sanityClient } from 'sanity:client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { Policy, Electorate, FAQ, Page, HomePage } from '../types/sanity'

export const client = sanityClient

/**
 * Image URL builder for Sanity images
 */
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Helper to fetch all documents of a type
 * @deprecated Use typed functions like getPolicies() instead
 */
export async function getDocuments<T = unknown>(type: string): Promise<T[]> {
  const query = `*[_type == "${type}"] | order(_createdAt desc)`
  return await client.fetch(query)
}

/**
 * Helper to fetch a single document by slug
 * @deprecated Use typed functions like getPolicyBySlug() instead
 */
export async function getDocumentBySlug<T = unknown>(
  type: string,
  slug: string
): Promise<T | null> {
  const query = `*[_type == "${type}" && slug.current == "${slug}"][0]`
  return await client.fetch(query)
}

/**
 * Helper to fetch documents filtered by a field
 * @deprecated Use typed functions or create specific queries
 */
export async function getDocumentsByField<T = unknown>(
  type: string,
  field: string,
  value: string | number
): Promise<T[]> {
  const query = `*[_type == "${type}" && ${field} == "${value}"]`
  return await client.fetch(query)
}

/**
 * Typed Sanity Query Functions
 * These provide better type safety and are the recommended way to fetch data
 */

export async function getPolicies(): Promise<Policy[]> {
  const query = `*[_type == "policy"] | order(_createdAt desc)`
  return await client.fetch(query)
}

export async function getPolicyBySlug(slug: string): Promise<Policy | null> {
  const query = `*[_type == "policy" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}

export async function getElectorates(): Promise<Electorate[]> {
  const query = `*[_type == "electorate"] | order(_createdAt desc)`
  return await client.fetch(query)
}

export async function getElectorateBySlug(slug: string): Promise<Electorate | null> {
  const query = `*[_type == "electorate" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}

export async function getFAQs(): Promise<FAQ[]> {
  const query = `*[_type == "faq"] | order(order asc, _createdAt desc)`
  return await client.fetch(query)
}

export async function getFAQBySlug(slug: string): Promise<FAQ | null> {
  const query = `*[_type == "faq" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  const query = `*[_type == "faq" && category == $category] | order(order asc, _createdAt desc)`
  return await client.fetch(query, { category })
}

export async function getPages(): Promise<Page[]> {
  const query = `*[_type == "page"] | order(_createdAt desc)`
  return await client.fetch(query)
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const query = `*[_type == "page" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}

// ... (existing exports)

export async function getHomePage(): Promise<HomePage | null> {
  const query = `*[_type == "homePage"][0]`
  return await client.fetch(query)
}

// ...
export async function getConvinceYourFriendsPage(): Promise<any | null> {
  const query = `*[_type == "convinceYourFriends"][0]`
  return await client.fetch(query)
}

export async function getPoliciesPage(): Promise<any | null> {
  const query = `*[_type == "policiesPage"][0]`
  return await client.fetch(query)
}

export async function getElectoratesPage(): Promise<any | null> {
  const query = `*[_type == "electoratesPage"][0]`
  return await client.fetch(query)
}

export async function getBlogPage(): Promise<any | null> {
  const query = `*[_type == "blogPage"][0]`
  return await client.fetch(query)
}
