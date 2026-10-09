import type { PresentationConfig, PresentationContent, ResolvedPresentation } from './contract.mjs'

export interface PresentationSource {
  identity: { slug: string }
  presentation?: PresentationConfig | ResolvedPresentation | null
}

export declare function resolvePresentation(
  resolved: PresentationSource,
  content?: PresentationContent | null
): ResolvedPresentation
