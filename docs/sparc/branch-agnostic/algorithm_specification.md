# Algorithm Specification — Branch-Agnostic Framework

Phase S (Specification) deliverable for the branch-agnostic epic (#13, #49–#52, #54–#59).

This document is a language-agnostic blueprint. It defines the data structures, function
signatures, control flow and error handling that the `architect` and `code` phases consume.
It contains no tests and no implementation code.

## Scope and vocabulary

Terms follow `GLOSSARY.md`:

- **Branch** — a state organisation of Fusion (Victoria, Queensland, …), with its own platform
  and public identity. Distinct from a Git branch.
- **Policy**, **Research resource**, **Electorate**, **Delivery horizon** — unchanged; not
  branch-configurable in this framework.

Two further terms are introduced by this specification:

- **Branch manifest** — the declarative, version-controlled record of every branch-specific
  value. The single source of truth.
- **Resolved branch** — the immutable descriptor produced by resolving the manifest against the
  environment. Everything downstream (theme, assets, analytics, presentation, deploy) derives
  from it.

Conventions used below:

- `FUNCTION name(args) -> ReturnType` declares a pure or side-effecting routine.
- `IF / ELSE IF / ELSE`, `FOR EACH`, `WHILE`, `RETURN`, `THROW` are literal control flow.
- `NULL` means absent. `Blank` means a string that is empty or whitespace-only.
- `firstNonBlank(a, b, …)` returns the first argument that is not `NULL` and not blank.
- Every `THROW` carries an **ErrorCode** and a human-readable message intent; the taxonomy is in
  §8. Errors are fail-closed: a missing or ambiguous required value never falls back to another
  branch.

---

## 0. Shared types

```
TYPE Result<T>
  ok:      Boolean
  value:   T | NULL
  errors:  List<Error>

TYPE Error
  code:    ErrorCode            // §8
  field:   String | NULL        // dotted path, e.g. "branches.qld.sanity.projectId"
  message: String
  context: Map<String, Any>     // branch slug, conflicting branch slug, etc.

TYPE BranchSlug = String        // MUST match /^[a-z]{2,6}$/
TYPE NonBlankString = String    // MUST contain at least one non-whitespace character
TYPE AbsoluteUrl = String       // MUST parse as absolute http(s) URL
TYPE ColorHex = String          // MUST match /^#[0-9a-fA-F]{6}$/ (or documented CSS colour form)
TYPE PathString = String        // repository-relative or absolute filesystem path
TYPE TokenName = String
TYPE TokenValue = String
```

Determinism rules (apply to every algorithm in this document):

1. No function reads a value from a branch other than the one being resolved.
2. No required field has a hardcoded fallback. The only permitted fallback is `NULL` (a neutral
   state) for presentation fields declared optional in §5.
3. The default branch is declared in the manifest, never assumed by slug literal.
4. Environment overrides are applied only where explicitly listed (§2.5). Everywhere else the
   manifest is authoritative.

---

## 1. Manifest data structure

```
TYPE BranchManifest
  schemaVersion:  Integer (required, = 1)
  defaultBranch:  BranchSlug (required; MUST be a key of branches)
  branches:       Map<BranchSlug, BranchEntry> (required, non-empty)
  tokenContract:  TokenContract (required; see §3)

TYPE BranchEntry
  identity:     Identity (required)
  sanity:       SanityBinding (required)
  theme:        ThemeReference (required)
  assets:       AssetSet (required)
  analytics:    AnalyticsBinding (required)
  deploy:       DeployBinding (required)
  presentation: PresentationConfig (optional)
```

### 1.1 Identity

```
TYPE Identity
  slug:       BranchSlug     (required, immutable; MUST equal the branches map key)
  state:      NonBlankString (required; e.g. "Victoria", "Queensland")
  adjective:  NonBlankString (required; e.g. "Victorian", "Queensland")
  label:      NonBlankString (required; e.g. "Fusion Party Victoria")
  tagline:    NonBlankString (required; e.g. "Reignite Democracy")
  themeColor: ColorHex       (required; the browser theme colour)
  siteUrl:    AbsoluteUrl    (required; canonical origin for the branch)
```

### 1.2 Sanity binding

```
TYPE SanityBinding
  projectId:           NonBlankString (required)
  dataset:             NonBlankString (required)
  studioAppId:         NonBlankString (required)
  allowSharedProject:  Boolean       (optional; default false)
```

Invariant: `studioAppId` is globally unique per branch. `(projectId, dataset)` pairs are globally
unique. A shared `projectId` is permitted **only** when the entry sets
`allowSharedProject = true` **and** its `dataset` is unique to the branch (the migration path for
Victoria/Queensland). Otherwise the entry is a collision (§8 `SANITY_BINDING_COLLISION`).

### 1.3 Theme reference

```
TYPE ThemeReference
  slug:   BranchSlug               (required; MUST equal identity.slug)
  tokens: Map<TokenName, TokenValue> (required; validated against tokenContract, §3)

TYPE TokenContract
  requiredRoles: List<TokenName>   (required; the minimum role tokens every branch provides)
  kinds:         Map<TokenName, TokenKind>
  TokenKind:     Color | AlphaColor | Shadow | Length
```

### 1.4 Assets

```
TYPE AssetSet
  ogDefault:    PathString (required; default Open Graph card for the branch)
  hero:         PathString (required; default hero imagery)
  favicon:      PathString (required; SVG/PNG/ICO set root or primary icon)
  pwaManifest:  PathString (required; the branch PWA manifest file)
  logo:         PathString (optional)
  ogTemplate:   PathString (optional; used by the OG generator)
```

All asset paths MUST be branch-distinct. A path that names or resolves to another branch's asset
is a leakage error (§8 `ASSET_LEAKAGE`).

### 1.5 Analytics

```
TYPE AnalyticsBinding
  siteId: NonBlankString (required; globally unique per branch)
```

### 1.6 Deploy

```
TYPE DeployBinding
  workerName:          NonBlankString   (required; globally unique per branch)
  wranglerConfig:      PathString       (required; path to the branch wrangler config)
  kvNamespaces:        List<KvNamespace>(required; may be empty)
  compatibilityFlags:  List<String>     (optional; e.g. ["nodejs_compat"])
  compatibilityDate:   String           (optional)

TYPE KvNamespace
  binding: NonBlankString (required)
  id:      NonBlankString (required; globally unique across all branches)
```

### 1.7 Presentation (optional; see §5)

```
TYPE PresentationConfig
  navigation: NavigationConfig | NULL
  contact:    ContactConfig    | NULL
  social:     List<SocialAccount>          (default empty)
  seo:        SeoConfig        | NULL
  ctas:       Map<CtaName, Cta>            (default empty)

TYPE NavigationConfig
  items:  List<NavItem>          // { label, href, order }
  cta:    Cta | NULL

TYPE ContactConfig
  email:   String | NULL
  phone:   String | NULL
  address: String | NULL

TYPE SocialAccount
  network: NonBlankString        // e.g. "facebook", "instagram"
  url:     AbsoluteUrl

TYPE SeoConfig
  metaTitle:       String | NULL
  metaDescription: String | NULL

TYPE Cta
  label: String
  href:  String
  style: String | NULL
```

### 1.8 Illustrative shape (placeholders only, no secrets)

```
BranchManifest {
  schemaVersion: 1,
  defaultBranch: "vic",
  tokenContract: { requiredRoles: [...], kinds: {...} },
  branches: {
    vic: { identity: {...}, sanity: {...}, theme: {...}, assets: {...}, analytics: {...}, deploy: {...} },
    qld: { identity: {...}, sanity: { allowSharedProject: true, ... }, theme: {...}, assets: {...}, analytics: {...}, deploy: {...} }
  }
}
```

---

## 2. `resolveBranch(manifest, env) -> ResolvedBranch`

Primary resolver. Pure with respect to the manifest and the supplied environment. Fail-closed.

```
FUNCTION resolveBranch(manifest: BranchManifest, env: Map<String, String|Boolean|Undefined>)
    -> ResolvedBranch

  // ---- Step 1: validate manifest shape ------------------------------------
  CALL validateManifestShape(manifest)          // §2.1; throws on structural failure

  // ---- Step 2: choose the requested slug ----------------------------------
  slug := CALL selectSlug(manifest, env)        // §2.2

  // ---- Step 3: resolve the entry, rejecting unknown slugs -----------------
  IF NOT manifest.branches.hasKey(slug) THEN
    THROW BRANCH_UNKNOWN {
      field: "branches." + slug,
      message: "Unknown Branch '<slug>'. Register it in the branch manifest before building or deploying.",
      context: { slug, known: keys(manifest.branches) }
    }
  END IF
  entry := manifest.branches[slug]

  // ---- Step 4: validate every required field (collect, then throw) --------
  errors := CALL validateBranchEntry(entry, manifest)   // §2.3
  IF errors is not empty THEN
    THROW FIELD_VALIDATION_FAILED {
      message: "Branch '<slug>' is incomplete or invalid: <n> problem(s).",
      context: { slug, errors }
    }
  END IF

  // ---- Step 5: apply supported environment overrides ----------------------
  resolved := CALL applyOverrides(entry, env)   // §2.4

  // ---- Step 6: enforce cross-branch isolation -----------------------------
  CALL assertCrossBranchIsolation(manifest, resolved)   // §2.5

  // ---- Step 7: derive the remaining fields --------------------------------
  resolved.jurisdiction        := resolved.identity.state + ", Australia"
  resolved.description         := resolved.identity.label + " — " + resolved.identity.tagline
                                  + ". Explore our policies, research and practical plans for "
                                  + "housing, transport, integrity and civil liberties."
  resolved.canonicalOrigin     := CALL normaliseOrigin(resolved.identity.siteUrl)
  resolved.serviceWorkerCache  := CALL resolveServiceWorkerCache(resolved)   // §4
  resolved.assets              := CALL resolveAssets(resolved)               // §4
  resolved.analytics           := CALL resolveAnalytics(resolved)            // §4
  resolved.presentation        := CALL resolvePresentation(resolved, NULL)   // §5

  RETURN resolved
END FUNCTION
```

### 2.1 `validateManifestShape(manifest) -> Void`

```
FUNCTION validateManifestShape(manifest)
  IF manifest is NULL THEN THROW MANIFEST_MISSING { message: "No branch manifest supplied." }
  IF manifest.schemaVersion != 1 THEN THROW MANIFEST_VERSION_UNSUPPORTED { context: { schemaVersion } }
  IF manifest.branches is NULL OR manifest.branches is empty THEN
    THROW MANIFEST_EMPTY { message: "Branch manifest declares no Branches." }
  END IF
  IF manifest.defaultBranch is NULL OR blank THEN
    THROW BRANCH_DEFAULT_MISSING { message: "Branch manifest declares no default Branch." }
  END IF
  IF NOT manifest.branches.hasKey(manifest.defaultBranch) THEN
    THROW BRANCH_DEFAULT_UNKNOWN {
      message: "Default Branch '<defaultBranch>' is not registered in the manifest.",
      context: { defaultBranch }
    }
  END IF
  IF manifest.tokenContract is NULL OR manifest.tokenContract.requiredRoles is empty THEN
    THROW TOKEN_CONTRACT_MISSING { message: "Branch manifest declares no theme token contract." }
  END IF
  FOR EACH (key, entry) IN manifest.branches DO
    IF entry.identity is NULL OR entry.identity.slug != key THEN
      THROW MANIFEST_KEY_MISMATCH {
        field: "branches." + key + ".identity.slug",
        message: "Branch entry key '<key>' does not match identity.slug.",
        context: { key, declaredSlug: entry.identity?.slug }
      }
    END IF
  END FOR
END FUNCTION
```

### 2.2 `selectSlug(manifest, env) -> BranchSlug`

Precedence is explicit and deterministic:

```
FUNCTION selectSlug(manifest, env)
  slug := firstNonBlank(env.BRANCH, env.PUBLIC_BRANCH, env.SANITY_STUDIO_BRANCH)
  IF slug is NULL THEN
    slug := manifest.defaultBranch
  END IF
  RETURN slug
END FUNCTION
```

Notes:

- `env.BRANCH` is the preferred generic override; `PUBLIC_BRANCH` and `SANITY_STUDIO_BRANCH` are
  retained for Victoria/Queensland compatibility (Studio and site must agree, per the existing
  test `Studio and site resolve the same Queensland source`).
- There is no literal `'vic'` fallback in code; the fallback is the declared default.

### 2.3 `validateBranchEntry(entry, manifest) -> List<Error>`

Validation **order** is fixed. All failures are collected before throwing so a maintainer sees
every problem in one pass.

```
FUNCTION validateBranchEntry(entry, manifest) -> List<Error>
  errors := []

  // (a) identity
  FOR EACH field IN [slug, state, adjective, label, tagline, themeColor, siteUrl] DO
    IF isBlank(entry.identity[field]) THEN errors.append(required(field))
  END FOR
  IF entry.identity.slug present AND NOT matches(entry.identity.slug, /^[a-z]{2,6}$/) THEN
    errors.append(invalid("identity.slug", "must match ^[a-z]{2,6}$"))
  END IF
  IF entry.identity.themeColor present AND NOT isColor(entry.identity.themeColor) THEN
    errors.append(invalid("identity.themeColor", "must be a valid colour"))
  END IF
  IF entry.identity.siteUrl present AND NOT isAbsoluteHttpUrl(entry.identity.siteUrl) THEN
    errors.append(invalid("identity.siteUrl", "must be an absolute http(s) URL"))
  END IF

  // (b) sanity binding
  FOR EACH field IN [projectId, dataset, studioAppId] DO
    IF isBlank(entry.sanity[field]) THEN errors.append(required("sanity." + field))
  END FOR

  // (c) theme reference
  IF entry.theme is NULL THEN errors.append(required("theme"))
  ELSE
    IF isBlank(entry.theme.slug) THEN errors.append(required("theme.slug"))
    ELSE IF entry.theme.slug != entry.identity.slug THEN
      errors.append(invalid("theme.slug", "must equal identity.slug"))
    END IF
    IF entry.theme.tokens is NULL THEN errors.append(required("theme.tokens"))
  END IF

  // (d) assets
  FOR EACH field IN [ogDefault, hero, favicon, pwaManifest] DO
    IF isBlank(entry.assets[field]) THEN errors.append(required("assets." + field))
  END FOR

  // (e) analytics
  IF isBlank(entry.analytics.siteId) THEN errors.append(required("analytics.siteId"))

  // (f) deploy
  IF isBlank(entry.deploy.workerName) THEN errors.append(required("deploy.workerName"))
  IF isBlank(entry.deploy.wranglerConfig) THEN errors.append(required("deploy.wranglerConfig"))
  IF entry.deploy.kvNamespaces is NULL THEN errors.append(required("deploy.kvNamespaces"))
  ELSE
    FOR EACH ns IN entry.deploy.kvNamespaces DO
      IF isBlank(ns.binding) THEN errors.append(required("deploy.kvNamespaces[].binding"))
      IF isBlank(ns.id) THEN errors.append(required("deploy.kvNamespaces[].id"))
    END FOR
  END IF

  // (g) token contract compliance (delegated; §3)
  IF entry.theme?.tokens present THEN
    errors.appendAll(CALL validateTokenContract(entry.theme.tokens, manifest.tokenContract, entry.identity.slug))
  END IF

  RETURN errors
END FUNCTION
```

Helper semantics: `required(path)` returns `Error{ code: FIELD_REQUIRED, field: path }`;
`invalid(path, why)` returns `Error{ code: FIELD_INVALID, field: path, message: why }`.

### 2.4 `applyOverrides(entry, env) -> BranchEntry`

Only the fields listed here may be overridden by the environment. **Theme, assets and
presentation are never overridden by environment** — the manifest is authoritative for them.

```
FUNCTION applyOverrides(entry, env) -> BranchEntry
  resolved := deepCopy(entry)

  resolved.identity.siteUrl :=
    firstNonBlank(env.SITE_URL, env.PUBLIC_SITE_URL, entry.identity.siteUrl)

  resolved.sanity.projectId :=
    firstNonBlank(env.PUBLIC_SANITY_PROJECT_ID, env.SANITY_STUDIO_PROJECT_ID, entry.sanity.projectId)
  resolved.sanity.dataset :=
    firstNonBlank(env.PUBLIC_SANITY_DATASET, env.SANITY_STUDIO_DATASET, entry.sanity.dataset)
  resolved.sanity.studioAppId :=
    firstNonBlank(env.SANITY_STUDIO_APP_ID, entry.sanity.studioAppId)

  resolved.analytics.siteId :=
    firstNonBlank(env.PUBLIC_ANALYTICS_SITE_ID, entry.analytics.siteId)

  resolved.deploy.workerName :=
    firstNonBlank(env.WORKER_NAME, entry.deploy.workerName)

  RETURN resolved
END FUNCTION
```

Precedence summary:

| Value                         | Environment overrides (in order)                       | Manifest role         |
| ----------------------------- | ------------------------------------------------------ | --------------------- |
| Branch slug                   | `BRANCH`, `PUBLIC_BRANCH`, `SANITY_STUDIO_BRANCH`      | default branch        |
| Canonical origin              | `SITE_URL`, `PUBLIC_SITE_URL`                          | authoritative default |
| Sanity project                | `PUBLIC_SANITY_PROJECT_ID`, `SANITY_STUDIO_PROJECT_ID` | authoritative default |
| Sanity dataset                | `PUBLIC_SANITY_DATASET`, `SANITY_STUDIO_DATASET`       | authoritative default |
| Studio app ID                 | `SANITY_STUDIO_APP_ID`                                 | authoritative default |
| Analytics site ID             | `PUBLIC_ANALYTICS_SITE_ID`                             | authoritative default |
| Worker name                   | `WORKER_NAME`                                          | authoritative default |
| Theme / assets / presentation | — (never)                                              | authoritative         |

### 2.5 `assertCrossBranchIsolation(manifest, resolved) -> Void`

Runs after overrides, so an override cannot smuggle in another branch's identity.

```
FUNCTION assertCrossBranchIsolation(manifest, resolved) -> Void
  me := resolved.identity.slug

  FOR EACH (otherSlug, other) IN manifest.branches DO
    IF otherSlug == me THEN CONTINUE

    // Sanity project/dataset pair must be unique, unless shared project is explicit + dataset unique
    sameProject := resolved.sanity.projectId == other.sanity.projectId
    sameDataset := resolved.sanity.dataset == other.sanity.dataset
    IF sameProject AND sameDataset THEN
      THROW SANITY_BINDING_COLLISION {
        field: "branches." + me + ".sanity",
        message: "Branch '<me>' resolves to the same Sanity project and dataset as '<otherSlug>'.",
        context: { me, otherSlug, projectId, dataset }
      }
    END IF
    IF sameProject AND NOT resolved.sanity.allowSharedProject THEN
      THROW SANITY_PROJECT_SHARED {
        field: "branches." + me + ".sanity.allowSharedProject",
        message: "Branch '<me>' shares project '<projectId>' with '<otherSlug>' without declaring allowSharedProject.",
        context: { me, otherSlug, projectId }
      }
    END IF

    IF resolved.sanity.studioAppId == other.sanity.studioAppId THEN
      THROW STUDIO_APP_COLLISION {
        field: "branches." + me + ".sanity.studioAppId",
        message: "Branch '<me>' uses the same Sanity Studio app as '<otherSlug>'.",
        context: { me, otherSlug, studioAppId }
      }
    END IF

    IF resolved.analytics.siteId == other.analytics.siteId THEN
      THROW ANALYTICS_COLLISION {
        field: "branches." + me + ".analytics.siteId",
        message: "Branch '<me>' shares an analytics site ID with '<otherSlug>'.",
        context: { me, otherSlug, siteId }
      }
    END IF

    IF resolved.deploy.workerName == other.deploy.workerName THEN
      THROW WORKER_NAME_COLLISION {
        field: "branches." + me + ".deploy.workerName",
        message: "Branch '<me>' would deploy over Worker '<workerName>' owned by '<otherSlug>'.",
        context: { me, otherSlug, workerName }
      }
    END IF

    FOR EACH ns IN resolved.deploy.kvNamespaces DO
      IF exists otherNs IN other.deploy.kvNamespaces WHERE otherNs.id == ns.id THEN
        THROW KV_NAMESPACE_COLLISION {
          field: "branches." + me + ".deploy.kvNamespaces",
          message: "Branch '<me>' shares KV namespace '<ns.id>' with '<otherSlug>'.",
          context: { me, otherSlug, kvId: ns.id }
        }
      END IF
    END FOR
  END FOR
END FUNCTION
```

---

## 3. Theme resolution

`FUNCTION resolveTheme(manifest, resolved) -> ResolvedTheme`

```
TYPE ResolvedTheme
  slug:     BranchSlug
  selector: String                     // ":root[data-theme='<slug>']"
  tokens:   Map<TokenName, TokenValue>

FUNCTION resolveTheme(manifest, resolved) -> ResolvedTheme
  themeSlug := resolved.theme.slug

  IF themeSlug is NULL OR blank THEN THROW THEME_UNKNOWN { context: { slug: resolved.identity.slug } }
  IF themeSlug != resolved.identity.slug THEN
    THROW THEME_SLUG_MISMATCH {
      message: "Theme '<themeSlug>' is not owned by Branch '<resolved.identity.slug>'.",
      context: { themeSlug, branch: resolved.identity.slug }
    }
  END IF

  tokens := resolved.theme.tokens
  IF tokens is NULL THEN THROW THEME_UNKNOWN { context: { themeSlug } }

  errors := CALL validateTokenContract(tokens, manifest.tokenContract, themeSlug)
  IF errors is not empty THEN
    THROW THEME_CONTRACT_VIOLATION {
      message: "Theme '<themeSlug>' does not satisfy the token contract (<n> problem(s)).",
      context: { themeSlug, errors }
    }
  END IF

  RETURN { slug: themeSlug, selector: ":root[data-theme='" + themeSlug + "']", tokens }
END FUNCTION
```

### 3.1 Token contract validation

```
FUNCTION validateTokenContract(tokens, contract, themeSlug) -> List<Error>
  errors := []

  // (a) every required role must be present and non-blank
  FOR EACH role IN contract.requiredRoles DO
    IF isBlank(tokens[role]) THEN
      errors.append(Error{ code: THEME_TOKEN_MISSING, field: "theme.tokens." + role,
                           message: "Branch theme '<themeSlug>' omits required role '<role>'." })
    END IF
  END FOR

  // (b) every declared token must be a valid value for its kind
  FOR EACH (name, value) IN tokens DO
    kind := contract.kinds[name] OR inferKind(name)
    IF NOT isValidTokenValue(value, kind) THEN
      errors.append(Error{ code: THEME_TOKEN_INVALID, field: "theme.tokens." + name,
                           message: "Token '<name>' is not a valid " + kind + " value." })
    END IF
  END FOR

  // (c) reject any token that is not in the contract's allowed set
  FOR EACH name IN keys(tokens) DO
    IF contract.kinds does not contain name THEN
      errors.append(Error{ code: THEME_TOKEN_UNKNOWN, field: "theme.tokens." + name,
                           message: "Token '<name>' is not declared in the token contract." })
    END IF
  END FOR

  RETURN errors
END FUNCTION
```

### 3.2 Role token families (minimum contract)

The contract MUST require at least the semantic role families currently re-pointed by the
Queensland theme. A branch that omits any of these fails, so it can never inherit Victoria's
colours by fallback.

```
primaryFamily:    magenta, magenta-dark, magenta-darker, magenta-bright
secondaryFamily:  mint, mint-dark, mint-bright, mint-hover
emphasisFamily:   yellow, yellow-bright
tertiaryFamily:   lavender, lavender-light, lavender-bright
neutralFamily:    grey, grey-dark, grey-light, black, white
functionalFamily: red, orange, blue, green
semanticRoles:    fg, muted, on-primary, on-secondary, on-accent, on-tertiary,
                  line, line-mid, line-strong, chalk, focus
surfaceLadder:    surface-base, surface-raised, surface-overlay, surface-brand
editorialRoles:   editorial-base, editorial-panel, editorial-fg, editorial-title,
                  editorial-line, editorial-muted, editorial-primary, editorial-secondary
branchRoles:      branch-surface, branch-panel, branch-ink, branch-muted, branch-line,
                  branch-primary, branch-secondary, branch-accent, branch-tertiary
```

Theme discovery: the theme is located from the resolved slug (`themeSlug`), not a hand-maintained
import list. The index that imports theme files iterates the manifest's branch keys, so adding a
Branch is data-only. The editorial inversion rule is generalised from
`:root:not([data-theme='qld'])` to `:root:not([data-theme='<defaultBranch>'])` (or, preferably,
`[data-theme='<slug>']` per-branch), so no branch is special-cased.

---

## 4. Asset and analytics resolution

### 4.1 Assets

```
TYPE ResolvedAssets
  ogDefault:      AbsoluteUrl
  hero:           AbsoluteUrl
  favicon:        PathString
  pwaManifest:    PathString
  logo:           AbsoluteUrl | NULL
  ogTemplate:     PathString | NULL

FUNCTION resolveAssets(resolved) -> ResolvedAssets
  origin := resolved.canonicalOrigin
  a := resolved.assets

  // fail-closed on absence
  FOR EACH field IN [ogDefault, hero, favicon, pwaManifest] DO
    IF isBlank(a[field]) THEN
      THROW ASSET_MISSING { field: "assets." + field,
                            message: "Branch '<slug>' has no " + field + " asset." }
    END IF
  END FOR

  // every asset path must be branch-owned: it must contain the slug or resolve under a branch folder
  FOR EACH field IN [ogDefault, hero, favicon, pwaManifest, logo, ogTemplate] DO
    IF a[field] present AND NOT isBranchOwned(a[field], resolved.identity.slug) THEN
      THROW ASSET_LEAKAGE {
        field: "assets." + field,
        message: "Branch '<slug>' asset '" + a[field] + "' is not namespaced to the branch.",
        context: { slug, path: a[field] }
      }
    END IF
  END FOR

  RETURN {
    ogDefault:   origin + normalisePath(a.ogDefault),
    hero:        origin + normalisePath(a.hero),
    favicon:     a.favicon,
    pwaManifest: a.pwaManifest,
    logo:        a.logo ? origin + normalisePath(a.logo) : NULL,
    ogTemplate:  a.ogTemplate ? normalisePath(a.ogTemplate) : NULL
  }
END FUNCTION
```

### 4.2 Analytics

```
TYPE ResolvedAnalytics
  siteId:    NonBlankString
  scriptUrl: AbsoluteUrl
  initPath:  PathString

FUNCTION resolveAnalytics(resolved) -> ResolvedAnalytics
  siteId := resolved.analytics.siteId
  IF isBlank(siteId) THEN
    THROW ANALYTICS_SITE_ID_MISSING {
      field: "analytics.siteId",
      message: "Branch '<slug>' has no analytics site ID; traffic must not pool with another branch.",
      context: { slug }
    }
  END IF
  // script URL is derived from the site ID; it is never a shared literal
  RETURN {
    siteId,
    scriptUrl: "https://analytics.fusionparty.org.au/js/" + siteId + ".js",
    initPath:  "/plausible-init.js"
  }
END FUNCTION
```

### 4.3 Service-worker cache namespace

```
FUNCTION resolveServiceWorkerCache(resolved) -> String
  version := resolved.deploy.cacheVersion OR "1"
  RETURN "fusion-" + resolved.identity.slug + "-" + version
END FUNCTION
```

The cache name is injected into the built service worker so two branch sites on the same origin
family cannot collide. It MUST contain the branch slug and MUST NOT be a shared literal.

---

## 5. Presentation-config resolution

Every presentation value is read from the resolved descriptor and/or Sanity content. There is no
`slug === 'vic'` conditional and no hardcoded Victoria default. A missing value yields a
**neutral** state, never another branch's copy.

```
TYPE ResolvedPresentation
  navigation: NavigationConfig | NULL
  contact:    ContactConfig    | NULL
  social:     List<SocialAccount>
  seo:        SeoConfig
  ctas:       Map<CtaName, Cta>

FUNCTION resolvePresentation(resolved, content: SiteContent | NULL) -> ResolvedPresentation
  p := resolved.presentation OR {}
  slug := resolved.identity.slug

  // ---- navigation ---------------------------------------------------------
  navigation := firstDefined(content?.navigation, p.navigation)
  IF navigation is NULL OR navigation.items is empty THEN
    navigation := NEUTRAL.navigation          // §5.1
  END IF

  // ---- contact ------------------------------------------------------------
  contact := firstDefined(content?.contact, p.contact)
  IF contact is NULL THEN
    contact := NEUTRAL.contact                // all fields NULL
  ELSE
    contact := { email: contact.email ?? NULL, phone: contact.phone ?? NULL,
                 address: contact.address ?? NULL }
  END IF

  // ---- social -------------------------------------------------------------
  social := firstDefined(content?.social, p.social)
  IF social is NULL THEN social := [] END IF
  FOR EACH account IN social DO
    IF NOT isAbsoluteHttpUrl(account.url) THEN
      THROW PRESENTATION_INVALID { field: "social.url",
        message: "Branch '<slug>' has an invalid social URL." }
    END IF
  END FOR

  // ---- SEO ----------------------------------------------------------------
  seo := {
    metaTitle:       firstNonBlank(content?.seo?.metaTitle, p.seo?.metaTitle,
                                   resolved.identity.label),
    metaDescription: firstNonBlank(content?.seo?.metaDescription, p.seo?.metaDescription,
                                   resolved.description)
  }
  // SEO derives from this branch's own identity only.

  // ---- CTAs ---------------------------------------------------------------
  ctas := firstDefined(content?.ctas, p.ctas) OR {}
  FOR EACH (name, cta) IN ctas DO
    IF isBlank(cta.label) OR isBlank(cta.href) THEN
      THROW PRESENTATION_INVALID { field: "ctas." + name,
        message: "Branch '<slug>' CTA '<name>' is missing a label or href." }
    END IF
  END FOR

  RETURN { navigation, contact, social, seo, ctas }
END FUNCTION
```

### 5.1 Neutral state definitions

`NEUTRAL` is a constant of honest, branch-free values. It NEVER reads the default branch.

```
NEUTRAL.navigation = {
  items: [ { label: "Policies", href: "/policies", order: 1 },
           { label: "Contact",  href: "/contact",  order: 2 } ],
  cta: NULL
}
NEUTRAL.contact    = { email: NULL, phone: NULL, address: NULL }
NEUTRAL.social     = []
NEUTRAL.ctas       = {}
```

Rules:

1. Absent navigation renders the neutral two-item nav, not Victoria's menu.
2. Absent contact renders no phone and no address; a component MUST omit the field rather than
   print an empty label.
3. Absent social renders an empty list; no national or other-branch accounts are injected.
4. Absent SEO derives from `identity.label` / `resolved.description` only.
5. Absent CTA renders no CTA; CTA links MUST NOT default to another branch's `/get-involved`.

---

## 6. Provisioning algorithm

`FUNCTION provisionBranch(manifest, slug, options, credentials) -> ProvisionResult`

Creates the Sanity project/dataset, deploys the Studio, seeds every singleton document type, and
writes the manifest entry. Idempotent or safely refusing.

```
TYPE ProvisionResult
  slug:        BranchSlug
  projectId:   String
  dataset:     String
  studioAppId: String
  seeded:      List<String>     // singleton _type values created
  skipped:     List<String>     // singleton _type values already present
  manifestUpdated: Boolean

TYPE Credentials
  writeToken: NonBlankString (required)
  session:    Any | NULL     (required only for project creation)

FUNCTION provisionBranch(manifest, slug, options, credentials) -> ProvisionResult
  // ---- Step 1: slug validity ----------------------------------------------
  IF NOT matches(slug, /^[a-z]{2,6}$/) THEN
    THROW BRANCH_SLUG_INVALID { message: "Branch slug '<slug>' is not valid." }
  END IF

  // ---- Step 2: reserved branch --------------------------------------------
  IF slug == manifest.defaultBranch AND options.allowDefault != true THEN
    THROW BRANCH_RESERVED {
      message: "Branch '<slug>' is the manifest default and is provisioned by migration, not this command."
    }
  END IF

  // ---- Step 3: idempotency / refusal --------------------------------------
  existing := manifest.branches[slug]
  IF existing present AND options.mode != "update" THEN
    THROW BRANCH_ALREADY_REGISTERED {
      message: "Branch '<slug>' is already registered. Re-run with mode=update to reconcile.",
      context: { slug }
    }
  END IF

  // ---- Step 4: credentials -------------------------------------------------
  IF isBlank(credentials.writeToken) THEN
    THROW CREDENTIAL_MISSING { message: "Set a Sanity write token before provisioning." }
  END IF

  // ---- Step 5: identity ----------------------------------------------------
  identity := CALL deriveIdentity(slug, options)   // fail-closed on any blank identity input
  errors := CALL validateIdentityOnly(identity)
  IF errors is not empty THEN THROW FIELD_VALIDATION_FAILED { context: { errors } } END IF

  // ---- Step 6: project (idempotent) ---------------------------------------
  IF options.projectId present THEN
    projectId := options.projectId
  ELSE IF existing?.sanity.projectId present THEN
    projectId := existing.sanity.projectId
  ELSE
    projectId := CALL sanityCreateProject(identity.label, credentials)
  END IF

  // ---- Step 7: dataset (idempotent) ---------------------------------------
  dataset := options.dataset OR existing?.sanity.dataset OR "production"
  datasets := CALL sanityListDatasets(projectId, credentials)
  IF NOT datasets contains dataset THEN
    CALL sanityCreateDataset(projectId, dataset, { aclMode: "public" }, credentials)
  END IF

  // ---- Step 8: Studio app + deploy (idempotent) ---------------------------
  IF options.studioAppId present THEN
    studioAppId := options.studioAppId
  ELSE IF existing?.sanity.studioAppId present THEN
    studioAppId := existing.sanity.studioAppId
  ELSE
    studioAppId := CALL sanityCreateStudioApp(projectId, credentials)
  END IF
  CALL deployStudio({ projectId, dataset, studioAppId, themeSlug: slug }, credentials)

  // ---- Step 9: seed every singleton document type (idempotent) ------------
  seeded := []; skipped := []
  FOR EACH singletonType IN SINGLETON_TYPES DO
    doc := CALL buildStarterDocument(singletonType, identity)
    exists := CALL sanityDocumentExists(projectId, dataset, doc._id, credentials)
    IF exists THEN
      skipped.append(singletonType)          // never overwrite authored content
    ELSE
      CALL sanityCreateIfNotExists(projectId, dataset, doc, credentials)
      seeded.append(singletonType)
    END IF
  END FOR

  // ---- Step 10: write the manifest entry atomically -----------------------
  entry := CALL buildManifestEntry(identity, projectId, dataset, studioAppId, options)
  CALL validateBranchEntry(entry, manifest)  // the entry must itself resolve cleanly
  manifest := CALL upsertBranch(manifest, slug, entry)
  CALL writeManifestAtomic(manifest)

  RETURN { slug, projectId, dataset, studioAppId, seeded, skipped, manifestUpdated: true }
END FUNCTION
```

### 6.1 Singleton document types

`SINGLETON_TYPES` is a registry, not a literal list in the algorithm. It MUST cover every
singleton `_type` the site reads. The current minimum is derived from `starter-content.mjs`:

```
homePage, navigation, footer, siteConfig
```

The algorithm iterates the registry so adding a singleton type is data-only. Starter content is
branch-neutral: it is built from `identity` and never embeds Victoria's policy, metrics or copy
(the existing `starterContent` already returns empty `movementMetrics`, empty `stats`, empty
`cards`).

### 6.2 Idempotency and refusal guarantees

| Condition                         | Behaviour                                                 |
| --------------------------------- | --------------------------------------------------------- |
| Branch already registered         | Refuse unless `mode=update` (`BRANCH_ALREADY_REGISTERED`) |
| Dataset already exists            | Skip creation, continue                                   |
| Singleton document already exists | Skip (`skipped`), never overwrite                         |
| Studio app already exists         | Reuse `studioAppId`, redeploy                             |
| Manifest write fails              | Leave prior manifest intact; atomic replace               |
| Default branch targeted           | Refuse unless explicitly allowed (`BRANCH_RESERVED`)      |

---

## 7. Deploy-config resolution and the CI matrix

### 7.1 `resolveDeployConfig(resolved, env) -> DeployConfig`

```
TYPE DeployConfig
  workerName:         NonBlankString
  wranglerConfigPath: PathString
  kvNamespaces:       List<KvNamespace>
  compatibilityFlags: List<String>
  compatibilityDate:  String | NULL

FUNCTION resolveDeployConfig(resolved, env) -> DeployConfig
  d := resolved.deploy

  IF isBlank(d.workerName) THEN
    THROW DEPLOY_CONFIG_MISSING { field: "deploy.workerName",
      message: "Branch '<slug>' has no Worker name." }
  END IF
  IF isBlank(d.wranglerConfig) THEN
    THROW DEPLOY_CONFIG_MISSING { field: "deploy.wranglerConfig",
      message: "Branch '<slug>' has no wrangler config." }
  END IF

  wranglerConfigPath := CALL resolveRepoPath(d.wranglerConfig)
  IF NOT fileExists(wranglerConfigPath) THEN
    THROW DEPLOY_CONFIG_MISSING { field: "deploy.wranglerConfig",
      message: "Wrangler config '<wranglerConfigPath>' for Branch '<slug>' was not found." }
  END IF

  FOR EACH ns IN d.kvNamespaces DO
    IF isBlank(ns.binding) OR isBlank(ns.id) THEN
      THROW DEPLOY_CONFIG_MISSING { field: "deploy.kvNamespaces",
        message: "Branch '<slug>' has an incomplete KV namespace binding." }
    END IF
  END FOR

  // the config path is selected from data, never a per-slug ternary
  RETURN {
    workerName:         firstNonBlank(env.WORKER_NAME, d.workerName),
    wranglerConfigPath,
    kvNamespaces:       d.kvNamespaces,
    compatibilityFlags: d.compatibilityFlags OR ["nodejs_compat"],
    compatibilityDate:  d.compatibilityDate OR NULL
  }
END FUNCTION
```

Wiring requirement: the Astro Cloudflare adapter receives `configPath` from
`resolveDeployConfig(...).wranglerConfigPath`. The adapter selection reads the resolved branch,
not a `deployment.slug === 'qld'` conditional.

### 7.2 CI matrix build loop

```
FUNCTION buildAllBranches(manifest, env) -> List<BranchBuildResult>
  results := []
  slugs := keys(manifest.branches)

  FOR EACH slug IN slugs DO
    branchEnv := merge(env, { PUBLIC_BRANCH: slug })

    // resolve must be fail-closed and slug-stable
    resolved := CALL resolveBranch(manifest, branchEnv)
    IF resolved.identity.slug != slug THEN
      THROW PARITY_FAILURE { message: "Resolved slug '<resolved.identity.slug>' != requested '<slug>'." }
    END IF

    theme    := CALL resolveTheme(manifest, resolved)
    assets   := CALL resolveAssets(resolved)
    analytics:= CALL resolveAnalytics(resolved)
    deploy   := CALL resolveDeployConfig(resolved, branchEnv)
    present  := CALL resolvePresentation(resolved, CALL loadContent(resolved))

    CALL runBuild(resolved, theme, assets, analytics, deploy, present)

    CALL verifyParity(resolved, manifest)      // §7.3
    CALL verifyLeakage(resolved, manifest)     // §7.4

    results.append({ slug, status: "ok" })
  END FOR

  RETURN results
END FUNCTION
```

CI MUST run this loop over every registered Branch so a half-configured Branch fails instead of
building green as a clone. The resolver unit suite (the existing `config/deployment.test.mjs`
seam) MUST be included in the standard test command; today Vitest's `include` pattern omits `.mjs`
and the file is silently skipped.

### 7.3 `verifyParity(resolved, manifest) -> Void`

```
FUNCTION verifyParity(resolved, manifest) -> Void
  // every required field is present and branch-owned
  CALL validateBranchEntry(manifest.branches[resolved.identity.slug], manifest)
  // resolved identity equals the requested entry
  ASSERT resolved.identity.slug == requestedSlug ELSE PARITY_FAILURE
  // theme contract holds
  CALL validateTokenContract(resolved.theme.tokens, manifest.tokenContract, resolved.identity.slug)
END FUNCTION
```

### 7.4 `verifyLeakage(resolved, manifest) -> Void`

```
FUNCTION verifyLeakage(resolved, manifest) -> Void
  built := CALL readBuiltOutput(resolved)

  FOR EACH (otherSlug, other) IN manifest.branches DO
    IF otherSlug == resolved.identity.slug THEN CONTINUE
    // foreign identity strings
    IF built contains other.identity.label OR built contains other.identity.tagline THEN
      THROW LEAKAGE_FAILURE { context: { branch: resolved.identity.slug, foreign: otherSlug,
                                         kind: "identity" } }
    END IF
    // foreign asset references
    IF built contains other.assets.ogDefault OR built contains other.assets.hero THEN
      THROW LEAKAGE_FAILURE { context: { branch: resolved.identity.slug, foreign: otherSlug,
                                         kind: "asset" } }
    END IF
    // shared analytics property
    IF built contains other.analytics.siteId THEN
      THROW LEAKAGE_FAILURE { context: { branch: resolved.identity.slug, foreign: otherSlug,
                                         kind: "analytics" } }
    END IF
    // shared cache namespace
    IF built contains ("fusion-" + otherSlug) THEN
      THROW LEAKAGE_FAILURE { context: { branch: resolved.identity.slug, foreign: otherSlug,
                                         kind: "cache" } }
    END IF
  END FOR
END FUNCTION
```

---

## 8. Error taxonomy (fail-closed conditions)

Every error below throws rather than falling back. Message text is intent, not a literal string.

| Code                           | Trigger                                          | Message intent                               |
| ------------------------------ | ------------------------------------------------ | -------------------------------------------- |
| `MANIFEST_MISSING`             | No manifest supplied                             | "No branch manifest supplied."               |
| `MANIFEST_VERSION_UNSUPPORTED` | `schemaVersion != 1`                             | Unsupported manifest schema version.         |
| `MANIFEST_EMPTY`               | `branches` empty                                 | Manifest declares no Branches.               |
| `MANIFEST_KEY_MISMATCH`        | map key ≠ `identity.slug`                        | Entry key does not match its slug.           |
| `BRANCH_DEFAULT_MISSING`       | no `defaultBranch`                               | Manifest declares no default Branch.         |
| `BRANCH_DEFAULT_UNKNOWN`       | `defaultBranch` not a key                        | Default Branch is not registered.            |
| `BRANCH_UNKNOWN`               | requested slug not in manifest                   | Unknown Branch; list known slugs.            |
| `BRANCH_SLUG_INVALID`          | slug fails `^[a-z]{2,6}$`                        | Invalid Branch slug.                         |
| `BRANCH_RESERVED`              | provisioning the default branch                  | Default Branch is migration-provisioned.     |
| `BRANCH_ALREADY_REGISTERED`    | provision without `mode=update`                  | Branch already registered; use update.       |
| `FIELD_REQUIRED`               | required field blank/absent                      | Name the dotted field path.                  |
| `FIELD_INVALID`                | type/format violation                            | State the expected format.                   |
| `FIELD_VALIDATION_FAILED`      | one or more field errors collected               | Branch incomplete; list all problems.        |
| `TOKEN_CONTRACT_MISSING`       | no `tokenContract.requiredRoles`                 | Manifest declares no token contract.         |
| `THEME_UNKNOWN`                | theme missing/unresolvable                       | Theme for Branch not found.                  |
| `THEME_SLUG_MISMATCH`          | `theme.slug != identity.slug`                    | Theme is not owned by the Branch.            |
| `THEME_TOKEN_MISSING`          | required role token absent                       | Branch omits a required theme role.          |
| `THEME_TOKEN_INVALID`          | token value wrong kind                           | Token is not a valid value for its kind.     |
| `THEME_TOKEN_UNKNOWN`          | token not in contract                            | Token is not declared in the contract.       |
| `THEME_CONTRACT_VIOLATION`     | contract errors aggregated                       | Theme fails the token contract.              |
| `ASSET_MISSING`                | required asset blank                             | Branch has no such asset.                    |
| `ASSET_LEAKAGE`                | asset not namespaced to branch                   | Asset is not owned by the Branch.            |
| `ANALYTICS_SITE_ID_MISSING`    | site ID blank                                    | Branch has no analytics site ID.             |
| `ANALYTICS_COLLISION`          | site ID shared                                   | Branch shares an analytics property.         |
| `SANITY_BINDING_COLLISION`     | same project+dataset pair                        | Branch reads another Branch's content.       |
| `SANITY_PROJECT_SHARED`        | shared project without declaration               | Shared project not declared.                 |
| `STUDIO_APP_COLLISION`         | studioAppId shared                               | Branch points at another Branch's Studio.    |
| `WORKER_NAME_COLLISION`        | workerName shared                                | Branch would deploy over another's Worker.   |
| `KV_NAMESPACE_COLLISION`       | KV id shared                                     | Branch shares another Branch's KV namespace. |
| `DEPLOY_CONFIG_MISSING`        | worker/wrangler/KV incomplete or file absent     | Deploy config for Branch is missing.         |
| `CREDENTIAL_MISSING`           | write token absent                               | Set a Sanity write token.                    |
| `PRESENTATION_INVALID`         | malformed social/CTA value                       | Branch presentation value is invalid.        |
| `PARITY_FAILURE`               | resolved slug/contract mismatch                  | Branch does not resolve to itself.           |
| `LEAKAGE_FAILURE`              | foreign identity/asset/analytics/cache in output | Another Branch's content leaked.             |

---

## Appendix A — Resolver validation order

`resolveBranch` performs checks in this fixed order so the first failure is deterministic:

1. Manifest shape (`MANIFEST_*`, `BRANCH_DEFAULT_*`, `TOKEN_CONTRACT_MISSING`).
2. Slug selection (precedence, then declared default).
3. Unknown-slug rejection (`BRANCH_UNKNOWN`).
4. Per-entry required/format validation, all errors collected (`FIELD_*`, `THEME_*` presence).
5. Environment overrides (only the documented fields).
6. Cross-branch isolation after overrides (`*_COLLISION`, `SANITY_PROJECT_SHARED`).
7. Derivation of jurisdiction, description, canonical origin, cache namespace.
8. Asset / analytics / presentation resolution (`ASSET_*`, `ANALYTICS_*`, `PRESENTATION_INVALID`).

## Appendix B — Migration compatibility

- Victoria and Queensland MUST resolve to their current values through the manifest with no code
  changes: same identity, same Sanity binding (shared project + distinct dataset, declared via
  `allowSharedProject`), same Studio app IDs, same site URLs.
- Once a Branch is migrated to its own Sanity project, its `allowSharedProject` flag is removed
  and the isolation rule tightens automatically.
- Removing the silent fallbacks is the point: the literal `'qld'` dataset default, the shared
  `qwl3f8jb` project default, and the Queensland Studio-app fall-through are all deleted. Their
  absence becomes a `BRANCH_UNKNOWN` / `FIELD_REQUIRED` error, not a silent reuse.
