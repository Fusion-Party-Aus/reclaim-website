# Shared state deployments

The Git branch does not select a state. `PUBLIC_BRANCH` selects deployment identity,
canonical URLs, theme and default Sanity dataset. Unset means Victoria, preserving
project `qwl3f8jb`, dataset `production`, and the existing hosted Studio app.

## Queensland

Use the same Sanity project with an independent **public** `qld` dataset. Public
means published content is readable by the website; Studio writes still require
Sanity authentication. Do not clone Victoria's production dataset.

Site environment:

```dotenv
PUBLIC_BRANCH=qld
PUBLIC_SANITY_PROJECT_ID=qwl3f8jb
PUBLIC_SANITY_DATASET=qld
SITE_URL=https://qld.fusionparty.org.au
PUBLIC_SANITY_STUDIO_URL=https://fusion-qld.sanity.studio
```

Studio environment (set in `studio/.env` or the process launching it):

```dotenv
SANITY_STUDIO_BRANCH=qld
SANITY_STUDIO_PROJECT_ID=qwl3f8jb
SANITY_STUDIO_DATASET=qld
SANITY_STUDIO_PREVIEW_URL=https://qld.fusionparty.org.au
```

Provision using an authenticated Sanity account:

```bash
cd studio
SANITY_STUDIO_BRANCH=qld ./node_modules/.bin/sanity dataset create qld --visibility public
cd ..
npm run seed:qld                         # review starter documents
npm run seed:qld -- --write              # needs SANITY_WRITE_TOKEN
npm run dev:sanity:qld
npm run build:sanity:qld
```

The seed uses `createIfNotExists`: rerunning it preserves edited documents. It
contains no copied policies, candidates, donation figures or authorisation claims.
Complete Queensland's authorisation and campaign content in Studio before launch.

Deploy the Studio separately, choosing a new hostname such as `fusion-qld`:

```bash
cd studio
SANITY_STUDIO_BRANCH=qld ./node_modules/.bin/sanity deploy
```

Never assign Victoria's app ID to Queensland. Once Queensland has an app ID,
set `SANITY_STUDIO_APP_ID` for subsequent Queensland Studio deployments. Add the
site and Studio preview origins in the project's CORS settings as required.

Site checks and build:

```bash
node --test config/deployment.test.mjs
npm run type-check
npm run build
npm run build:qld
```

Create an independent Cloudflare deployment for Queensland from the same source.
Set the environment above there. Keep Victoria's deployment variables unchanged.
Do not reuse Victoria's NationBuilder token KV namespace or state-specific form
credentials without deciding whether those integrations are intentionally shared.
`wrangler.toml` remains Victoria's configuration and must not be used to publish
Queensland over its existing Worker.

Queensland gets an empty-content landing and neutral policy-index defaults. Victoria
keeps its existing home page and editorial defaults. Some legacy pages and artwork
still contain Victorian campaign material; review these before linking them from
Queensland navigation. Populate Home Page, Navigation, Footer and Site Configuration
in the Queensland Studio. The Home Page uses document ID `homePage`, navigation
uses `navigation`, and footer uses `footer`; Victoria retains its existing IDs.

`wrangler.qld.toml` provides a distinct Worker name and intentionally omits
Victoria's NationBuilder token namespace. Configure Queensland's own bindings and
credentials for any integrations before publishing.
