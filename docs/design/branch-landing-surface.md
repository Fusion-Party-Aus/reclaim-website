# Branch landing surface

Mode: Persuade. Extend the incumbent homepage world; this is not a new visual identity. Applies only to NSW, SA, WA, TAS, NT and ACT on the isolated native Worker.

## Direction contract

THESIS: Give each new branch the same recognizable Fusion homepage structure while keeping approved National base content distinct from unpublished local platforms.

OWN-WORLD: Reuse purple #32105a, teal #00c4c4, lilac and lavender; Georgia headings, self-contained Barlow body type, existing Fusion symbol/wordmark and the actual six-path hero folds. White navigation and a branch-tinted values section continue the established bands.

STORY: Visitors identify their state in the masthead, understand Fusion’s shared values and reach National participation forms. Local policies and candidates remain explicitly unpublished.

FIRST VIEWPORT: White identity/navigation bar; shared slogan on purple at the left of a city photograph, divided by existing curved folds. Primary action leads to participation. On mobile, copy precedes the photo; a horizontal version of the folds spans the photo’s top edge.

FORM: Incumbent homepage extension, pinned by the user’s explicit styling-and-folds requirement; no concept tournament or replacement world.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

For this extension, incumbent source truth is `src/styles/home.css`, `src/styles/fusion-site.css`, `src/components/pages/Home.astro` and `FusionLogo.astro`. No global DESIGN.md rewrite. Photo provenance is in `docs/sparc/domain-network/branch-city-photography.md`; Barlow’s complete OFL is included in the HTML.

The supplied National concept additionally informs the shared slogan, mission band and clearly National policy-area section. Mock metrics/news/events and unapproved local claims are excluded. Independent finish verdict: `branch-landing-finish-review.md`.

Latest maintainer direction: hero H1 is the shared “A better future, built together.” No branch name or announcement in the hero; masthead and metadata retain branch identity. The local readiness notice sits below the mission copy.

## Branch accents and supporting imagery

The maintainer supplied exact accents for all nine approved sites in chat. `config/site-branding.mjs` stores those accents and readable foreground, hover, pale-surface and display variants. Active landing pages use their own exact accent for buttons/folds, with a lighter hue variant for large text on purple. Contrast is tested independently. Existing VIC/QLD theme files remain outside this release; registry entries do not activate or redeploy their sites.

Three credited National policy photographs add a restrained image rhythm beneath the city hero. They illustrate National categories, rather than implying local policy adoption. They are lazy-loaded, dimensioned and documented in the photography provenance file. Six credited circular value photographs echo the supplied concept, arranged in a six-column desktop row and two-column mobile grid. Their provenance is recorded in `branch-values-photography.md`. No fabricated news/event cards are added.

The latest approved overrides replace NSW blue with pale pink `#FFE6EA` and ACT blue with deep purple `#472D8C`. ACT uses a lavender display tint on the purple hero for readable contrast.

Final requested extension includes TAS/Hobart and WA/Perth on this Worker, with existing green/gold accents. The participation banner folds now use a clamped width and full banner height, keeping the complete top-to-bottom shape visible. Cloudflare domain mappings remain separate from the code registry.

Latest maintainer direction supersedes the earlier QLD exclusion: Queensland now uses this Worker with the shared approved base, Brisbane photograph and maroon accent. Only VIC remains on its existing content deployment. The legacy QLD CMS record/dataset is retained for rollback; no dataset wipe or live consolidation is included.
