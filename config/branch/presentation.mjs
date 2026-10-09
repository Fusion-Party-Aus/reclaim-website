import { BranchConfigError, ERROR_CODES, NEUTRAL } from './contract.mjs'

const CONTACT_FIELDS = [
  'email',
  'pressEmail',
  'helloEmail',
  'preselectionEmail',
  'techEmail',
  'discord',
  'phone',
  'address',
]

const isBlank = (value) => typeof value !== 'string' || value.trim() === ''

const isAbsoluteHttpUrl = (value) => {
  if (
    typeof value !== 'string' ||
    value.trim() === '' ||
    /[\u0000-\u001f\u007f\\]/.test(value) ||
    value.startsWith('//')
  )
    return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

export const isSafeHref = (value) => {
  if (
    typeof value !== 'string' ||
    !value ||
    /[\u0000-\u001f\u007f\\]/.test(value) ||
    value.startsWith('//')
  )
    return false
  if (/%2e|%2f|%5c/i.test(value)) return false
  if (value.startsWith('/'))
    return (
      !value.startsWith('///') &&
      value
        .split(/[?#]/, 1)[0]
        .split('/')
        .some((part) => part === '..' || part === '.') === false
    )
  return isAbsoluteHttpUrl(value)
}

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null)

const firstNonBlank = (...values) =>
  values.find((value) => typeof value === 'string' && value.trim() !== '')

const slugOf = (resolved) => resolved?.identity?.slug ?? 'unknown'

const presentationInvalid = (field, message, slug) =>
  new BranchConfigError(ERROR_CODES.PRESENTATION_INVALID, field, message, { slug })

const resolveNavigation = (source, slug) => {
  if (source === undefined || source === null) return NEUTRAL.navigation

  const items = Array.isArray(source) ? source : source.items
  if (!Array.isArray(items) || items.length === 0) return NEUTRAL.navigation

  return items.map((item, index) => {
    if (item === null || typeof item !== 'object') {
      throw presentationInvalid(
        `navigation[${index}]`,
        `Branch '${slug}' has a malformed navigation item.`,
        slug
      )
    }
    if (isBlank(item.label)) {
      throw presentationInvalid(
        `navigation[${index}].label`,
        `Branch '${slug}' navigation item ${index} is missing a label.`,
        slug
      )
    }
    if (isBlank(item.href) || !isSafeHref(item.href)) {
      throw presentationInvalid(
        `navigation[${index}].href`,
        `Branch '${slug}' navigation item ${index} is missing an href.`,
        slug
      )
    }
    return { label: item.label, href: item.href }
  })
}

const resolveContact = (source) => {
  if (source === undefined || source === null || typeof source !== 'object') {
    return NEUTRAL.contact
  }

  const contact = {}
  for (const field of CONTACT_FIELDS) {
    const value = source[field]
    if (value !== undefined && value !== null && value !== '') contact[field] = value
  }
  return contact
}

const resolveSocial = (source, slug) => {
  if (source === undefined || source === null) return NEUTRAL.social
  if (!Array.isArray(source)) return NEUTRAL.social

  return source.map((account, index) => {
    if (account === null || typeof account !== 'object') {
      throw presentationInvalid(
        `social[${index}]`,
        `Branch '${slug}' has a malformed social account.`,
        slug
      )
    }
    if (isBlank(account.platform)) {
      throw presentationInvalid(
        `social[${index}].platform`,
        `Branch '${slug}' social account ${index} is missing a platform.`,
        slug
      )
    }
    if (!isAbsoluteHttpUrl(account.url)) {
      throw presentationInvalid(
        `social[${index}].url`,
        `Branch '${slug}' has an invalid social URL.`,
        slug
      )
    }
    return { platform: account.platform, url: account.url }
  })
}

const resolveSeo = (contentSeo, manifestSeo) => {
  const seo = {}
  const description = firstNonBlank(
    contentSeo?.description,
    manifestSeo?.description,
    NEUTRAL.seo?.description
  )
  if (description !== undefined) seo.description = description

  const sameAs = firstDefined(contentSeo?.sameAs, manifestSeo?.sameAs, NEUTRAL.seo?.sameAs)
  if (sameAs !== undefined) seo.sameAs = sameAs

  return seo
}

const resolveCtas = (source, slug) => {
  if (source === undefined || source === null) return NEUTRAL.ctas

  let entries
  if (Array.isArray(source)) {
    entries = source.map((cta, index) => [`[${index}]`, cta])
  } else if (typeof source === 'object') {
    entries = Object.entries(source)
  } else {
    return NEUTRAL.ctas
  }

  return entries.map(([key, cta]) => {
    if (cta === null || typeof cta !== 'object') {
      throw presentationInvalid(`ctas.${key}`, `Branch '${slug}' CTA '${key}' is malformed.`, slug)
    }
    if (isBlank(cta.label)) {
      throw presentationInvalid(
        `ctas.${key}.label`,
        `Branch '${slug}' CTA '${key}' is missing a label.`,
        slug
      )
    }
    if (isBlank(cta.href) || !isSafeHref(cta.href)) {
      throw presentationInvalid(
        `ctas.${key}.href`,
        `Branch '${slug}' CTA '${key}' is missing an href.`,
        slug
      )
    }
    return { label: cta.label, href: cta.href }
  })
}

export function resolvePresentation(resolved, content = null) {
  const slug = slugOf(resolved)
  const manifest = resolved?.presentation ?? null

  const navigation = resolveNavigation(
    firstDefined(content?.navigation, manifest?.navigation),
    slug
  )
  const contact = resolveContact(firstDefined(content?.contact, manifest?.contact))
  const social = resolveSocial(firstDefined(content?.social, manifest?.social), slug)
  const seo = resolveSeo(content?.seo, manifest?.seo)
  const ctas = resolveCtas(firstDefined(content?.ctas, manifest?.ctas), slug)

  return { navigation, contact, social, seo, ctas }
}
