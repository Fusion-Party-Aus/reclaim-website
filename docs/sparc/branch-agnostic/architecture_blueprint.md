# Architecture Blueprint — Branch-Agnostic Framework

Phase P (Planning) deliverable for the branch-agnostic epic (#13, #49–#52, #54–#59).

This blueprint converts `algorithm_specification.md` (Phase S) into component boundaries, data
models, integration points, Big O estimates and a Mermaid system diagram. It contains no
implementation code and no tests. Terms follow `GLOSSARY.md`; **Branch** means a state organisation,
never a Git branch.

---

## 1. Purpose and scope

Today a Branch is a Victoria implementation with Queensland bolted on: standing one up is a code
change plus manual operations, and resolution fails **open** — a missing value silently reads
Queensland's dataset, reuses Victoria's project, or points the Studio at another Branch's hosted app.

The target architecture makes a Branch **data**. A single declarative **Branch manifest** is the
single source of truth; one fail-closed resolver turns the manifest plus environment into an
immutable **ResolvedBranch**; everything downstream (theme, assets, analytics, presentation, deploy,
verification) derives from that descriptor. Adding a Branch becomes a manifest entry plus two
commands (`provision`, `deploy`) with no per-Branch code edits.

In scope: manifest + resolver, theme/assets/analytics/presentation/deploy resolution, provisioning,
parity/leakage verification, CI matrix. Out of scope: the policy API contract, jurisdiction-aware
blog work, authoring real NSW/SA content, replacing Sanity or Astro, and account-level setup that
cannot be automated.

---

## 2. Non-functional requirements

| ID        | NFR                                                  | Concrete target                                                                                                                                                                                                                  | Where enforced                                                                                 |
| --------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **NFR-1** | **Fail-closed integrity**                            | Any missing, blank, malformed or ambiguous _required_ value throws an `ErrorCode`; no required value ever falls back to another Branch. Neutral (not foreign) state is permitted only for presentation fields declared optional. | `BranchResolver` (validation order, Appendix A of the spec), `ErrorTaxonomy`                   |
| **NFR-2** | **Config-only extensibility**                        | Adding a Branch requires **zero** edits to build, CI, resolver, theme index, components or npm scripts. A Branch is one manifest entry.                                                                                          | Manifest-driven theme registry, slug-parameterised commands, CI matrix iterating manifest keys |
| **NFR-3** | **Determinism, parity & testability**                | Resolution is a pure function of `(manifest, env)`; identical inputs produce identical output; resolved slug always equals the requested slug. Both test seams are exercisable without Astro, Cloudflare or network.             | Pure `resolveBranch`, fixed validation order, injectable output reader                         |
| **NFR-4** | **Cross-Branch isolation & non-leakage**             | A built Branch emits only its own identity, assets, analytics property, cache namespace, Sanity binding and Worker. Foreign content is structurally impossible, not merely discouraged.                                          | Resolver isolation assertions + `Verifier` leakage scan + theme token contract                 |
| **NFR-5** | **Idempotent operability & migration compatibility** | Provisioning re-runs safely (skip/refuse, never overwrite authored content; atomic manifest write). Victoria and Queensland resolve to their current values through the manifest with no code changes.                           | `BranchProvisioner` idempotency table, seeded `vic`/`qld` manifest entries                     |

---

## 3. Logical component architecture

The design centres on one **deep module** — the Branch Resolver — whose only exported product is the
`ResolvedBranch` descriptor. Every downstream module depends on the descriptor, not on the manifest
shape or the environment. This keeps the manifest free to grow and the consumers narrow.

### 3.1 Module map

| Module                   | Kind                       | Responsibility                                                                                                              | Depends on                                                                |
| ------------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **BranchManifest**       | Data + loader              | Version-controlled record of every Branch-specific value; schema-version gate.                                              | —                                                                         |
| **ErrorTaxonomy**        | Shared vocabulary          | `ErrorCode` union, `Error`/`Result<T>` constructors.                                                                        | —                                                                         |
| **BranchResolver**       | **Deep module**            | Validate shape → select slug → validate entry → apply overrides → assert isolation → derive.                                | Manifest, ErrorTaxonomy                                                   |
| **ThemeResolver**        | Derivation                 | Token-contract validation; produce theme selector + tokens.                                                                 | ResolvedBranch, ErrorTaxonomy                                             |
| **ThemeRegistry**        | Build-time generator       | Emit the ordered theme import list from manifest keys.                                                                      | Manifest                                                                  |
| **AssetResolver**        | Derivation                 | Branch-ownership (namespacing) checks; absolutise asset URLs; derive SW cache namespace.                                    | ResolvedBranch, ErrorTaxonomy                                             |
| **AnalyticsResolver**    | Derivation                 | Site-ID presence; derive script URL from the ID (never a shared literal).                                                   | ResolvedBranch, ErrorTaxonomy                                             |
| **PresentationResolver** | Derivation                 | Precedence (Sanity content → manifest → NEUTRAL); validate social/CTA values.                                               | ResolvedBranch, ErrorTaxonomy                                             |
| **DeployConfigResolver** | Derivation                 | Resolve Worker name, wrangler config path (existence-checked), KV bindings, compatibility flags.                            | ResolvedBranch, ErrorTaxonomy                                             |
| **BranchProvisioner**    | Side-effecting deep module | Create project/dataset, deploy Studio, seed singletons, atomically write manifest entry.                                    | Manifest, ErrorTaxonomy, SingletonRegistry, StarterContent, SanityAdapter |
| **SingletonRegistry**    | Data                       | The `_type` values the site reads; iterated, never literalised in algorithm.                                                | —                                                                         |
| **StarterContent**       | Data builder               | Branch-neutral starter documents built from `identity` only.                                                                | SingletonRegistry                                                         |
| **SanityAdapter**        | Port (injectable)          | `createProject`, `listDatasets`, `createDataset`, `createStudioApp`, `deployStudio`, `documentExists`, `createIfNotExists`. | External Sanity API                                                       |
| **ManifestWriter**       | Side-effecting             | `upsertBranch` + atomic replace; leaves prior manifest intact on failure.                                                   | Manifest                                                                  |
| **BuildOrchestrator**    | Composition root (CI)      | Iterate manifest keys; resolve → derive → build → verify each Branch.                                                       | All resolvers, Verifier                                                   |
| **Verifier**             | Verification               | `verifyParity` (self-consistency) and `verifyLeakage` (built output).                                                       | ResolvedBranch, Manifest, output reader                                   |
| **DeploymentFacade**     | Compatibility adapter      | Map `ResolvedBranch` + `ResolvedPresentation` into the runtime object components read today.                                | ResolvedBranch                                                            |

### 3.2 Module contracts

Signatures are intent, not literal code. `Result<T>` and `Error` are defined in §4.

```
# --- Data / vocabulary -------------------------------------------------------
loadManifest(source) -> BranchManifest            # schemaVersion-gated; throws MANIFEST_*

# --- Primary deep module (test seam 1) ---------------------------------------
resolveBranch(manifest, env) -> ResolvedBranch    # PURE, fail-closed, deterministic

# --- Derivations from the descriptor -----------------------------------------
resolveTheme(manifest, resolved) -> ResolvedTheme
buildThemeIndex(manifest) -> String               # ordered "@import" list from branch keys
resolveAssets(resolved) -> ResolvedAssets
resolveServiceWorkerCache(resolved) -> String
resolveAnalytics(resolved) -> ResolvedAnalytics
resolvePresentation(resolved, content) -> ResolvedPresentation
resolveDeployConfig(resolved, env) -> DeployConfig

# --- Provisioning (side-effecting; adapters injected) ------------------------
provisionBranch(manifest, slug, options, credentials, adapters) -> ProvisionResult

# --- Composition / verification (test seam 2) --------------------------------
buildAllBranches(manifest, env, deps) -> List<BranchBuildResult>
verifyParity(resolved, manifest) -> Void
verifyLeakage(resolved, manifest, readBuiltOutput) -> Void
```

**Deepening decision.** `ResolvedBranch` carries the _validated_ token contract, so `ThemeResolver`
needs only the descriptor and not the raw manifest. `verifyLeakage` receives `readBuiltOutput` as an
injected function, so it is pure over `(descriptor, manifest, output)` and independent of how output
was produced. Both choices keep the interface narrow and the internals free to change.

**Isolation of concerns.** `BranchResolver` owns every check that compares one Branch against
another (`assertCrossBranchIsolation`) and runs it _after_ environment overrides, so an override
cannot smuggle in another Branch's identity. Derivation modules never read another Branch's data.

---

## 4. Data model

### 4.1 Shared types

```
Result<T>   { ok: Boolean, value: T | NULL, errors: List<Error> }
Error       { code: ErrorCode, field: String | NULL, message: String, context: Map<String,Any> }
BranchSlug  = String  # /^[a-z]{2,6}$/
```

`ErrorCode` is the closed set in spec §8 (`MANIFEST_*`, `BRANCH_*`, `FIELD_*`, `THEME_*`,
`ASSET_*`, `ANALYTICS_*`, `SANITY_*`, `STUDIO_APP_COLLISION`, `WORKER_NAME_COLLISION`,
`KV_NAMESPACE_COLLISION`, `DEPLOY_CONFIG_MISSING`, `CREDENTIAL_MISSING`, `PRESENTATION_INVALID`,
`PARITY_FAILURE`, `LEAKAGE_FAILURE`). Every code is a throw, never a fallback.

### 4.2 Input model — `BranchManifest`

```
BranchManifest { schemaVersion=1, defaultBranch, branches: Map<BranchSlug,BranchEntry>, tokenContract }
BranchEntry    { identity, sanity, theme, assets, analytics, deploy, presentation? }
Identity       { slug, state, adjective, label, tagline, themeColor, siteUrl }
SanityBinding  { projectId, dataset, studioAppId, allowSharedProject? }
ThemeReference { slug, tokens: Map<TokenName,TokenValue> }
TokenContract  { requiredRoles: List<TokenName>, kinds: Map<TokenName,TokenKind> }
AssetSet       { ogDefault, hero, favicon, pwaManifest, logo?, ogTemplate? }
AnalyticsBinding { siteId }
DeployBinding  { workerName, wranglerConfig, kvNamespaces: List<KvNamespace>, compatibilityFlags?, compatibilityDate?, cacheVersion? }
KvNamespace    { binding, id }
PresentationConfig { navigation?, contact?, social, seo?, ctas }
```

`branches` is keyed by slug and each key **must** equal `identity.slug`; `defaultBranch` must be a
declared key. No slug literal appears in code.

### 4.3 Output model — `ResolvedBranch` (immutable)

```
ResolvedBranch {
  identity, sanity, theme { slug, selector, tokens, contract },
  assets { raw, resolved: ResolvedAssets },
  analytics { raw, resolved: ResolvedAnalytics },
  deploy, presentation: ResolvedPresentation,
  # derived
  jurisdiction, description, canonicalOrigin, serviceWorkerCache
}
```

`ResolvedBranch` is frozen. Downstream modules receive it and never mutate it; a derived resolver
that needs a new value returns a new structure rather than mutating the descriptor.

### 4.4 Derived models

```
ResolvedTheme        { slug, selector: ":root[data-theme='<slug>']", tokens }
ResolvedAssets       { ogDefault, hero, favicon, pwaManifest, logo, ogTemplate }
ResolvedAnalytics    { siteId, scriptUrl, initPath }
ResolvedPresentation { navigation, contact, social, seo, ctas }
DeployConfig         { workerName, wranglerConfigPath, kvNamespaces, compatibilityFlags, compatibilityDate }
ProvisionResult      { slug, projectId, dataset, studioAppId, seeded, skipped, manifestUpdated }
Credentials          { writeToken, session? }   # runtime-injected; never persisted
```

`NEUTRAL` is a constant of branch-free values (two-item nav; all-NULL contact; empty social/CTAs).
It is **never** the default Branch's values.

---

## 5. Data flow and integration points

### 5.1 Resolution flow

```
manifest + env ──▶ BranchResolver ──▶ ResolvedBranch
                                        │
        ┌───────────────┬───────────────┼───────────────┬────────────────┐
        ▼               ▼               ▼               ▼                ▼
  ThemeResolver   AssetResolver  AnalyticsResolver  PresentationResolver  DeployConfigResolver
        │               │               │               │                │
        └───────────────┴───────────────┴───────────────┴────────────────┘
                                        ▼
                             BuildOrchestrator / DeploymentFacade
                                        ▼
                              Astro build + runtime + Studio CLI
```

### 5.2 Integration points (existing consumers to be rewired to the descriptor)

| Integration point                  | Consumes                            | Change                                                                                               |
| ---------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Astro Cloudflare adapter selection | `DeployConfig.wranglerConfigPath`   | Replace `deployment.slug === 'qld'` ternary with data-driven `configPath`.                           |
| Site runtime `DEPLOYMENT` facade   | `ResolvedBranch`                    | Facade preserves the object shape components read today (see §9).                                    |
| Studio CLI config                  | `ResolvedBranch.sanity.studioAppId` | Replace per-slug app-ID ternary with manifest value.                                                 |
| Theme index CSS                    | `buildThemeIndex(manifest)`         | Emit imports from manifest keys; drop hand-maintained list.                                          |
| npm scripts                        | `BranchResolver` + slug argument    | Replace per-Branch duplicates (`dev:qld`, `build:qld`, `seed:qld`) with slug-parameterised commands. |
| CI workflow                        | `buildAllBranches(manifest, env)`   | Build + verify every registered Branch; include the `.mjs` resolver suite in the standard test run.  |
| Wrangler configs                   | `DeployBinding`                     | Config path named by the manifest, not by convention.                                                |

---

## 6. Big O analysis

Let `B` = number of Branches, `T` = tokens per theme, `R` = required token roles, `N` = KV
namespaces per Branch, `A` = asset fields (≤6), `S` = social accounts, `C` = CTAs, `I` = nav items,
`K` = singleton document types, `O` = built-output size.

| Algorithm                    | Complexity                       | Notes                                                                                    |
| ---------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| `validateManifestShape`      | `O(B)`                           | One pass over entries for key/slug match.                                                |
| `selectSlug`                 | `O(1)`                           | Fixed precedence list.                                                                   |
| `validateBranchEntry`        | `O(T + N)`                       | One entry; `R ⊆ T`, so token scan dominates.                                             |
| `applyOverrides`             | `O(T + N + S + C)`               | Deep copy of one entry.                                                                  |
| `assertCrossBranchIsolation` | `O(B · N)`                       | Dominant resolver term; scalar comparisons `O(B)`, KV scan `O(B·N)` with set membership. |
| `resolveBranch` (total)      | `O(B·N + T + S + C)`             | Linear in Branches; no nested manifest scans beyond isolation.                           |
| `validateTokenContract`      | `O(T)`                           | Required-role pass + value pass + unknown-token pass.                                    |
| `resolveAssets`              | `O(A)`                           | Constant-size field set.                                                                 |
| `resolvePresentation`        | `O(S + C + I)`                   | Linear in presentation size.                                                             |
| `provisionBranch`            | `O(B + K)` + I/O                 | Manifest upsert/write `O(B)`; singleton loop `O(K)`; network latency dominates.          |
| `buildAllBranches`           | `O(B · buildCost + B·(B·N + T))` | Build dominates; verification adds `O(B² · O)` for the pairwise leakage scan.            |
| `verifyLeakage` (per Branch) | `O(B · O)`                       | Substring scan of output per foreign Branch.                                             |

**Bottlenecks.** `assertCrossBranchIsolation` is the only quadratic-in-`B` term in resolution and is
bounded by small `B` (≤ ~8 states). `verifyLeakage` is `O(B²·O)`; if `B` grows, replace the
per-pattern substring scan with a single multi-pattern scan (Aho–Corasick) to `O(O + Σ patterns)`.
Neither is a practical concern at current scale; both are documented so the optimizer phase has a
target if Branch count grows.

---

## 7. Test seams

The specification names two seams; the architecture makes each independently exercisable.

### Seam 1 — Branch Resolver as a pure function (primary, existing)

- **Shape:** `resolveBranch(manifest, env) -> ResolvedBranch | throws`.
- **Why testable:** no file system, network, framework or global state. Tests import the module and
  call it with a literal manifest and env map. The spec's fixed validation order (Appendix A) makes
  the _first_ failure deterministic, so error-code assertions are stable.
- **Coverage enabled:** every required field fails closed when absent; unknown slug rejected;
  override precedence deterministic; Victoria and Queensland resolve exactly as before; collisions
  throw the correct `ErrorCode`; isolation runs after overrides.
- **Regression hook:** the existing `config/deployment.test.mjs` is the prior art; the architecture
  keeps the same "one pure entry point" shape so the suite extends rather than rewrites.

### Seam 2 — Built site per Branch (black-box, highest)

- **Shape:** `verifyLeakage(resolved, manifest, readBuiltOutput)` over the built output, run inside
  `buildAllBranches`.
- **Why testable:** the output reader is injected, so the leakage predicate is a pure function of
  `(descriptor, manifest, output)`. CI runs it against a real build; the suite can also feed
  synthetic output for fast unit coverage. This is the only seam that catches a component bypassing
  the resolver and hardcoding a foreign string or asset.
- **Coverage enabled:** no foreign identity label/tagline, no foreign OG/hero asset reference, no
  shared analytics site ID, no foreign cache namespace.

**Architectural guarantee.** Because every consumer reads `ResolvedBranch` (or the facade built from
it) and the resolver owns cross-Branch comparison, a leak requires either a component bypassing the
descriptor (caught by Seam 2) or a resolver bug (caught by Seam 1).

---

## 8. Security and PII audit

### 8.1 Data-flow classification

| Data                                                                           | Classification                                                          | Control                                                                                                                                  |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `projectId`, `dataset`, `studioAppId`, Worker name, KV IDs, analytics `siteId` | Public operational identifiers (already committed today)                | Live in the version-controlled manifest; must **not** be treated as secrets.                                                             |
| Asset paths, theme tokens, navigation, SEO, CTAs                               | Public presentation data                                                | Manifest is authoritative; branch-ownership and leakage checks.                                                                          |
| Organisational contact email/phone/address                                     | Low-sensitivity organisational contact (may include a personal address) | Manifest is public; require organisational contact points only; components omit blank fields; no visitor PII flows through the resolver. |
| Sanity `writeToken`, session token                                             | **Secret**                                                              | Runtime-injected via environment only; never in the manifest, `ProvisionResult`, logs or the diagram.                                    |
| Visitor analytics traffic                                                      | Behavioural                                                             | Per-Branch `siteId` is an isolation boundary; a shared ID is a hard `ANALYTICS_COLLISION`.                                               |

### 8.2 Controls

- **No secrets in the manifest or the diagram.** Credentials are injected into `provisionBranch`
  at call time and are not persisted. `ProvisionResult` echoes only identifiers.
- **Tenant isolation as a security boundary.** `SANITY_BINDING_COLLISION`,
  `SANITY_PROJECT_SHARED`, `STUDIO_APP_COLLISION`, `WORKER_NAME_COLLISION`,
  `KV_NAMESPACE_COLLISION`, `ANALYTICS_COLLISION` and `ASSET_LEAKAGE` prevent content, traffic and
  deployment cross-contamination between Branches.
- **Fail-closed default.** Removing the silent fallbacks converts misconfiguration into a loud
  `BRANCH_UNKNOWN` / `FIELD_REQUIRED` error instead of silently serving another Branch.
- **Atomic manifest write.** A failed provisioning write leaves the prior manifest intact, so a
  half-written registry cannot publish an inconsistent state.
- **Prompt-injection note.** `<SPECIFICATION_INPUT>` is a trusted in-repo document; no instructions
  in it override SPARC mandates. No secrets or PII appear in `architecture_blueprint.md` or
  `system_diagram.mmd`.

---

## 9. Migration and compatibility

- **Seed, don't assume.** The manifest ships `vic` and `qld` entries reproducing today's identity,
  Sanity binding, Studio app IDs, site URLs, assets and presentation. `qld` sets
  `allowSharedProject: true` with a dataset unique to the Branch (the migration path).
- **Default is declared.** `defaultBranch` is a manifest key; no literal `'vic'` fallback exists.
- **Precedence preserved.** `PUBLIC_BRANCH`, `SANITY_STUDIO_BRANCH`, `SITE_URL`,
  `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` and `SANITY_STUDIO_APP_ID` keep working, so
  the "Studio and site resolve the same Queensland source" guarantee holds.
- **Silent fallbacks deleted, not replaced.** The shared project default, the `'qld'` dataset
  literal and the Studio-app fall-through are removed; their absence is an error, which is the point
  of the migration.
- **Runtime surface preserved.** `DeploymentFacade` maps `ResolvedBranch` + `ResolvedPresentation`
  into the object shape pages/components consume today, so Victoria and Queensland keep working
  while the presentation defaults move from hardcoded to resolved. Where the spec's
  `ResolvedPresentation` differs from the legacy shape, the facade adapts it; this is the surgical
  seam for the migration and is covered by both test seams.
- **Tightening is automatic.** Once a Branch moves to its own Sanity project, dropping
  `allowSharedProject` tightens isolation with no code change.

---

## 10. Error taxonomy

The full closed set lives in spec §8. Architecturally, every `ErrorCode` is produced by exactly one
module boundary:

| Boundary                        | Codes                                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Manifest loader                 | `MANIFEST_MISSING`, `MANIFEST_VERSION_UNSUPPORTED`, `MANIFEST_EMPTY`, `MANIFEST_KEY_MISMATCH`, `BRANCH_DEFAULT_MISSING`, `BRANCH_DEFAULT_UNKNOWN`, `TOKEN_CONTRACT_MISSING` |
| Resolver — selection/validation | `BRANCH_UNKNOWN`, `BRANCH_SLUG_INVALID`, `FIELD_REQUIRED`, `FIELD_INVALID`, `FIELD_VALIDATION_FAILED`                                                                       |
| Resolver — isolation            | `SANITY_BINDING_COLLISION`, `SANITY_PROJECT_SHARED`, `STUDIO_APP_COLLISION`, `ANALYTICS_COLLISION`, `WORKER_NAME_COLLISION`, `KV_NAMESPACE_COLLISION`                       |
| Theme                           | `THEME_UNKNOWN`, `THEME_SLUG_MISMATCH`, `THEME_TOKEN_MISSING`, `THEME_TOKEN_INVALID`, `THEME_TOKEN_UNKNOWN`, `THEME_CONTRACT_VIOLATION`                                     |
| Assets / analytics              | `ASSET_MISSING`, `ASSET_LEAKAGE`, `ANALYTICS_SITE_ID_MISSING`                                                                                                               |
| Presentation                    | `PRESENTATION_INVALID`                                                                                                                                                      |
| Deploy config                   | `DEPLOY_CONFIG_MISSING`                                                                                                                                                     |
| Provisioning                    | `BRANCH_RESERVED`, `BRANCH_ALREADY_REGISTERED`, `CREDENTIAL_MISSING`                                                                                                        |
| Verification                    | `PARITY_FAILURE`, `LEAKAGE_FAILURE`                                                                                                                                         |

---

## 11. Current-code location map (locating, not contract)

| Module                             | Current location to refactor                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| BranchManifest                     | new data file (replaces the `branches` registry in `config/deployment.mjs`)            |
| BranchResolver                     | `config/deployment.mjs` → `resolveDeployment`                                          |
| BranchResolver tests               | `config/deployment.test.mjs`                                                           |
| DeploymentFacade                   | `src/lib/deployment.ts`                                                                |
| Asset/Analytics resolver           | `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `public/sw.js`                     |
| ThemeResolver / ThemeRegistry      | `src/styles/themes/index.css`, `src/styles/themes/qld.css`, `src/styles/editorial.css` |
| DeployConfigResolver               | `astro.config.mjs` (Cloudflare adapter ternary), `wrangler.toml`, `wrangler.qld.toml`  |
| StarterContent / SingletonRegistry | `config/starter-content.mjs`                                                           |
| BranchProvisioner / SanityAdapter  | `scripts/sanity/provision-qld.mjs`, `scripts/sanity/seed-branch.mjs`                   |
| Studio CLI consumer                | `studio/sanity.cli.js`                                                                 |
| BuildOrchestrator / Verifier       | `.github/workflows/ci.yml`, `package.json` scripts                                     |
| Vitest include fix                 | `vitest.config.ts` (must include `.mjs`)                                               |

---

## 12. System diagram

The companion file `system_diagram.mmd` renders the module boundaries, the resolution flow, the
provisioning flow, the two test seams and the security/isolation controls. It contains no secrets or
PII.
