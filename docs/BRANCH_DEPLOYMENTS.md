# Branch deployments

The branch manifest at `config/branches.mjs` is the version-controlled source of
truth for branch identity and deployment configuration. The Git branch does not
select a state. `BRANCH`, `PUBLIC_BRANCH` or `SANITY_STUDIO_BRANCH` selects a
registered branch; if none is set, the manifest default (`vic`) is used. The
resolver validates the selected entry and fails closed for unknown, incomplete
or conflicting configuration rather than borrowing another branch's resources.
`config/deployment.mjs` remains a compatibility facade for callers of the
previous deployment interface.

## What a branch needs

Add a complete entry under `branches` in `config/branches.mjs`. The resolver
requires:

- `identity`: `slug`, `state`, `adjective`, `label`, `tagline`, `themeColor`,
  `siteUrl` and, where needed, the permitted canonical `allowedOrigins`.
- `sanity`: `projectId`, `dataset` and a distinct `studioAppId`. A project may
  be shared only when the sharing branch explicitly sets
  `allowSharedProject: true`; the project/dataset pair and Studio app must not
  collide with another branch.
- `theme`: a `slug` matching the branch and every role in `tokenContract`, with
  values of the declared kinds.
- `assets`: at minimum `ogDefault`, `hero`, `favicon` and `pwaManifest` paths.
- `analytics.siteId`: a branch-specific analytics site identifier.
- `deploy`: a unique `workerName`, repository-relative `wranglerConfig`, and
  `kvNamespaces` array with each binding's name and namespace ID. Add
  compatibility flags/date and cache version when the deployment needs them.
- `runtime`: branch-specific navigation, contact, analytics, SEO, CTA and
  footer defaults as appropriate.

The resolver also checks that site URL overrides are among the branch's allowed
origins, that theme and identity slugs agree, that asset and presentation values
are valid, and that Worker, KV, analytics and Studio identities are isolated.
Manifest fields are operational identifiers and presentation data, not a place
for credentials.

## Adding a branch

1. Arrange the site domain and any initial Sanity, analytics and Cloudflare
   account/project access. Decide whether Sanity will use an independent project
   or an explicitly shared project with a separate dataset.
2. Add the branch entry to `config/branches.mjs`, including its actual Sanity
   project, dataset and Studio app IDs, theme roles, assets, analytics site,
   runtime defaults, Worker/config and KV bindings. Do not use another branch's
   dataset, Studio app, Worker or KV namespace.
3. Add `src/styles/themes/<slug>.css` and its branch assets. The theme index is
   generated from manifest keys; do not hand-edit `src/styles/themes/index.css`.
4. Create and configure external resources that do not already exist (see
   [Manual setup](#manual-setup)).
5. Run the checks and local commands below before configuring the deployment.

For an existing branch, the relevant Queensland bindings illustrate the shape:
project `qwl3f8jb`, dataset `qld`, and Studio app ID
`pctplpfvvxwavjm1erscuknz`. Victoria continues to use project `qwl3f8jb`,
dataset `production`, and its own Studio app ID. Published Sanity datasets are
publicly readable by the site; Studio writes require Sanity authentication.

## Safe local commands

The generic commands select the branch from `BRANCH`, `PUBLIC_BRANCH` or the
manifest default. These examples use `BRANCH` explicitly:

```bash
BRANCH=<slug> npm run dev:branch
BRANCH=<slug> npm run build:branch
BRANCH=<slug> npm run seed:branch
```

The QLD convenience commands are `npm run dev:qld`, `npm run build:qld` and
`npm run seed:qld`. Seeding previews starter documents by default; inspect the
output before writing. To write, pass `-- --write` to the seed command and
provide an authenticated Sanity write token in the environment. The seed uses
create-if-absent behavior, so rerunning it does not replace authored singleton
documents.

Provision the dataset and missing singleton starter documents for any registered
branch with `npm run provision:branch -- --acl public` or
`npm run provision:branch -- --acl private`. Select it with `BRANCH=<slug>` or
`PUBLIC_BRANCH=<slug>` and provide `SANITY_WRITE_TOKEN` or `SANITY_AUTH_TOKEN`.
The ACL must be explicit: use `--acl public|private` or `DATASET_ACL=public|private`.
The command takes project and dataset only from the selected manifest entry; it
does not accept project or dataset overrides. It creates the dataset if absent
using the requested ACL, then creates each registered singleton only if absent.
Existing authored documents are preserved. `npm run provision:qld` remains the
compatibility command and provisions the registered QLD dataset with public ACL.

The Studio selects its project, dataset and app ID from the same manifest. Use
`SANITY_STUDIO_BRANCH=<slug>` when running Studio commands, for example:

```bash
cd studio
SANITY_STUDIO_BRANCH=<slug> ./node_modules/.bin/sanity dev --port 3333
SANITY_STUDIO_BRANCH=<slug> ./node_modules/.bin/sanity build
```

Use the configured branch app ID when deploying Studio with the Sanity CLI. The
app ID can be explicitly overridden with `SANITY_STUDIO_APP_ID`; avoid assigning
one branch another branch's app. Add the site and Studio preview origins to
Sanity CORS settings as needed.

## Build, verification and deployment

`npm run predev` and `npm run prebuild` generate the ordered theme import index
from the manifest and validate the token contract and CSS theme files. `--check`
can be used to check the generated index without writing it:

```bash
node scripts/branch/generate-theme-index.mjs --check
```

Build an individual branch with `BRANCH=<slug> npm run build:branch`. To build
and verify every manifest branch, run:

```bash
npm run verify:branches
```

Deploy builds the selected branch first, then uses that branch's manifest
Wrangler config. With no branch variable it deploys the manifest default:

```bash
npm run deploy
BRANCH=<slug> npm run deploy:branch
PUBLIC_BRANCH=<slug> npm run deploy:branch -- --dry-run
```

`npm run deploy:qld` remains available as a Queensland compatibility alias.
Deployment assumes the Cloudflare account, domain/custom-domain routing and
required bindings/resources have been configured for the selected Worker; the
manifest config path alone does not provision them.

This builds each branch into an isolated output directory, resolves and checks
its configuration and parity, then scans the built output for branch-content
leakage. CI runs this command for all manifest entries. A branch with missing
configuration or a failed build makes the verification fail.

Cloudflare's Astro configuration resolves the Wrangler config path, Worker name
and KV bindings from the selected manifest entry. The configured path must exist
inside the repository. For example, QLD points to `wrangler.qld.toml`; that
configuration has Worker name `fusion-website-qld` and a dedicated `SESSION`
binding. Do not select the config through slug-specific source logic or deploy
one branch over another branch's Worker. Use the resolved branch configuration
when invoking Wrangler, and ensure production and preview environments have the
required bindings and credentials.

## Manual setup

`provision:branch` provisions only a dataset within an already-existing Sanity
project and its missing starter singleton documents. It does not create Sanity
projects or Sanity Studio apps, deploy/configure a Studio app or domain, or
create Cloudflare accounts/projects, Workers, KV namespaces, or other Cloudflare
resources. Those remain manual external setup, along with registering the real
resource identifiers in the manifest.

An operator must also arrange the site domain and DNS, analytics site, Sanity
CORS origins, and integration credentials as needed. Keep branch-specific tokens
and credentials in the relevant secret store or environment, never in the
manifest or documentation.

Queensland's public dataset is `qld` in the shared Sanity project; do not clone
Victoria's production content into it. Review branch-specific content and legacy
campaign pages before linking them in navigation, and complete the branch's
authorisation and campaign content in Studio before launch.
