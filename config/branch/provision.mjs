/**
 * Branch-agnostic framework — branch provisioner.
 *
 * `provisionBranch` is a side-effecting deep module. Every external call goes
 * through the injected `adapters` Sanity port and the injected atomic
 * `manifestWriter`, so the algorithm is exercisable without Sanity or network.
 *
 * It creates the project/dataset/Studio app, seeds every singleton document
 * type, and writes the manifest entry. It refuses reserved slugs, refuses an
 * already-registered slug unless `mode: 'update'`, requires a write token, and
 * never overwrites authored singleton content.
 *
 * See algorithm_specification.md §6.
 */
import {
  BranchConfigError,
  ERROR_CODES,
  RESERVED_SLUGS,
  assertSlug,
  makeError,
} from './contract.mjs'
import { SINGLETON_TYPES } from './singletons.mjs'
import { buildStarterContent } from './starter-content.mjs'
import { resolveBranch } from './resolver.mjs'
import path from 'node:path'

const IDENTITY_FIELDS = ['slug', 'state', 'adjective', 'label', 'tagline', 'themeColor', 'siteUrl']
const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

const isBlank = (value) => typeof value !== 'string' || value.trim() === ''

const isAbsoluteHttpUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const isNonBlank = (value) => typeof value === 'string' && value.trim() !== ''

const firstNonBlank = (...values) =>
  values.find((value) => typeof value === 'string' && value.trim() !== '')

/** Build the branch identity from the slug and the supplied options. */
function deriveIdentity(slug, options) {
  const provided = options.identity ?? {}
  return {
    slug,
    state: provided.state,
    adjective: provided.adjective,
    label: provided.label,
    tagline: provided.tagline,
    themeColor: provided.themeColor,
    siteUrl: provided.siteUrl,
  }
}

/** Collect identity problems; the caller aggregates into FIELD_VALIDATION_FAILED. */
function validateIdentity(identity) {
  const errors = []

  for (const field of IDENTITY_FIELDS) {
    if (isBlank(identity[field])) {
      errors.push(
        makeError(
          ERROR_CODES.FIELD_REQUIRED,
          `identity.${field}`,
          `Branch identity is missing '${field}'.`
        )
      )
    }
  }

  if (isNonBlank(identity.themeColor) && !COLOR_PATTERN.test(identity.themeColor)) {
    errors.push(
      makeError(
        ERROR_CODES.FIELD_INVALID,
        'identity.themeColor',
        'Branch theme colour must be a 6-digit hex value.'
      )
    )
  }

  if (isNonBlank(identity.siteUrl) && !isAbsoluteHttpUrl(identity.siteUrl)) {
    errors.push(
      makeError(
        ERROR_CODES.FIELD_INVALID,
        'identity.siteUrl',
        'Branch site URL must be an absolute http(s) URL.'
      )
    )
  }

  return errors
}

/** Build the manifest entry written for a newly provisioned branch. */
function buildManifestEntry(identity, projectId, dataset, studioAppId, options) {
  const slug = identity.slug

  return {
    identity,
    sanity: {
      projectId,
      dataset,
      studioAppId,
      ...(options.allowSharedProject === true ? { allowSharedProject: true } : {}),
    },
    theme: options.theme ?? { slug, tokens: {} },
    assets: options.assets ?? {
      ogDefault: `/og/${slug}-default.png`,
      hero: `/${slug}/hero.png`,
      favicon: `/${slug}/favicon.svg`,
      pwaManifest: `/${slug}/site.webmanifest`,
    },
    analytics: options.analytics ?? { siteId: `pa-${slug}` },
    deploy: options.deploy ?? {
      workerName: `fusion-${slug}`,
      wranglerConfig: `wrangler.${slug}.toml`,
      kvNamespaces: [],
    },
    ...(options.presentation ? { presentation: options.presentation } : {}),
  }
}

function candidateEntry(identity, options, existing) {
  return buildManifestEntry(
    identity,
    options.projectId ?? existing?.sanity?.projectId ?? 'pendingproject',
    options.dataset ?? existing?.sanity?.dataset ?? 'production',
    options.studioAppId ?? existing?.sanity?.studioAppId ?? 'pendingapp',
    options
  )
}

function assertCandidate(manifest, slug, entry) {
  resolveBranch(
    { ...manifest, branches: { ...manifest.branches, [slug]: entry } },
    { PUBLIC_BRANCH: slug }
  )
}

async function resolveProjectId(existing, options, identity, credentials, adapters) {
  const projectId =
    firstNonBlank(options.projectId, existing?.sanity?.projectId) ??
    (await adapters.createProject(identity.label, credentials))

  if (isBlank(projectId)) {
    throw new BranchConfigError(
      ERROR_CODES.FIELD_REQUIRED,
      `branches.${identity.slug}.sanity.projectId`,
      `Provisioning branch '${identity.slug}' produced no Sanity project ID.`,
      { slug: identity.slug }
    )
  }

  return projectId
}

async function resolveDataset(projectId, existing, options, credentials, adapters) {
  const dataset = firstNonBlank(options.dataset, existing?.sanity?.dataset) ?? 'production'

  const datasets = (await adapters.listDatasets(projectId, credentials)) ?? []
  const names = datasets.map((entry) => (typeof entry === 'string' ? entry : entry?.name))
  if (!names.includes(dataset)) {
    await adapters.createDataset(projectId, dataset, { aclMode: options.aclMode }, credentials)
  }

  return dataset
}

async function resolveStudioAppId(projectId, existing, options, identity, credentials, adapters) {
  const studioAppId =
    firstNonBlank(options.studioAppId, existing?.sanity?.studioAppId) ??
    (await adapters.createStudioApp(projectId, credentials))

  if (isBlank(studioAppId)) {
    throw new BranchConfigError(
      ERROR_CODES.FIELD_REQUIRED,
      `branches.${identity.slug}.sanity.studioAppId`,
      `Provisioning branch '${identity.slug}' produced no Studio app ID.`,
      { slug: identity.slug }
    )
  }

  return studioAppId
}

/**
 * Provision a branch.
 *
 * @param {object} manifest BranchManifest.
 * @param {string} slug Branch slug to provision.
 * @param {object} [options] Provisioning options (`mode`, `allowDefault`, identity and binding overrides).
 * @param {{ writeToken: string }} [credentials] Runtime-injected secrets.
 * @param {object} [adapters] Injected Sanity port plus `manifestWriter`.
 * @returns {Promise<object>} ProvisionResult.
 */
export async function provisionBranch(
  manifest,
  slug,
  options = {},
  credentials = {},
  adapters = {}
) {
  assertSlug(slug)

  const branches = manifest?.branches ?? {}
  const existing = branches[slug]

  const reserved = RESERVED_SLUGS.includes(slug) || slug === manifest?.defaultBranch
  if (reserved && (options.allowDefault !== true || options.authorizeDefault !== true)) {
    throw new BranchConfigError(
      ERROR_CODES.BRANCH_RESERVED,
      `branches.${slug}`,
      `Branch '${slug}' is reserved and is provisioned by migration, not this command.`,
      { slug }
    )
  }

  if (existing && (options.mode !== 'update' || options.authorizeUpdate !== true)) {
    throw new BranchConfigError(
      ERROR_CODES.BRANCH_ALREADY_REGISTERED,
      `branches.${slug}`,
      `Branch '${slug}' is already registered. Re-run with mode=update to reconcile.`,
      { slug }
    )
  }

  if (isBlank(credentials?.writeToken)) {
    throw new BranchConfigError(
      ERROR_CODES.CREDENTIAL_MISSING,
      null,
      'Set a Sanity write token before provisioning.',
      { slug }
    )
  }

  const identity = deriveIdentity(slug, options)
  const identityErrors = validateIdentity(identity)
  if (identityErrors.length > 0) {
    throw new BranchConfigError(
      ERROR_CODES.FIELD_VALIDATION_FAILED,
      `branches.${slug}.identity`,
      `Branch '${slug}' identity is incomplete or invalid: ${identityErrors.length} problem(s).`,
      { slug, errors: identityErrors }
    )
  }

  if (
    !['create', 'update', undefined].includes(options.mode) ||
    !['public', 'private'].includes(options.aclMode)
  ) {
    throw new BranchConfigError(
      ERROR_CODES.FIELD_INVALID,
      'options',
      'Provisioning mode and dataset ACL must be explicitly valid.',
      { slug }
    )
  }
  if (options.deploy?.wranglerConfig !== undefined) {
    const configPath = options.deploy.wranglerConfig
    if (
      typeof configPath !== 'string' ||
      path.isAbsolute(configPath) ||
      configPath.split(/[\\/]/).includes('..') ||
      !/^wrangler(?:\.[a-z0-9-]+)?\.toml$/.test(path.basename(configPath.replace(/^\.\//, '')))
    ) {
      throw new BranchConfigError(
        ERROR_CODES.DEPLOY_CONFIG_MISSING,
        'deploy.wranglerConfig',
        'Provisioning Wrangler config must be a repository-relative Wrangler TOML path.',
        { slug }
      )
    }
  }
  const preflight = buildManifestEntry(
    identity,
    options.projectId ?? existing?.sanity?.projectId ?? 'pendingproject',
    options.dataset ?? existing?.sanity?.dataset ?? 'production',
    options.studioAppId ?? existing?.sanity?.studioAppId ?? 'pendingapp',
    options
  )
  assertCandidate(manifest, slug, preflight)

  const remoteSideEffects = []
  const rawAdapters = adapters
  adapters = new Proxy(rawAdapters, {
    get(target, method, receiver) {
      const operation = Reflect.get(target, method, receiver)
      if (typeof operation !== 'function') return operation
      return async (...args) => {
        try {
          const result = await operation.apply(target, args)
          if (
            [
              'createProject',
              'createDataset',
              'createStudioApp',
              'deployStudio',
              'createIfNotExists',
              'manifestWriter',
            ].includes(String(method))
          )
            remoteSideEffects.push(String(method))
          return result
        } catch (error) {
          if (error && typeof error === 'object') error.remoteSideEffects = [...remoteSideEffects]
          throw error
        }
      }
    },
  })

  const projectId = await resolveProjectId(existing, options, identity, credentials, adapters)
  const dataset = await resolveDataset(projectId, existing, options, credentials, adapters)
  const studioAppId = await resolveStudioAppId(
    projectId,
    existing,
    options,
    identity,
    credentials,
    adapters
  )

  const entry = buildManifestEntry(identity, projectId, dataset, studioAppId, options)
  try {
    assertCandidate(manifest, slug, entry)
  } catch (error) {
    if (error && typeof error === 'object') error.remoteSideEffects = [...remoteSideEffects]
    throw error
  }

  await adapters.deployStudio({ projectId, dataset, studioAppId, themeSlug: slug }, credentials)

  const starterDocuments = buildStarterContent({ identity })
  const seeded = []
  const skipped = []

  for (const type of SINGLETON_TYPES) {
    const document = starterDocuments.find((candidate) => candidate._type === type)
    const exists = await adapters.documentExists(projectId, dataset, document._id, credentials)
    if (exists) {
      skipped.push(type)
      continue
    }
    await adapters.createIfNotExists(projectId, dataset, document, credentials)
    seeded.push(type)
  }

  await adapters.manifestWriter(manifest, slug, entry)

  return { slug, projectId, dataset, studioAppId, seeded, skipped, manifestUpdated: true }
}
