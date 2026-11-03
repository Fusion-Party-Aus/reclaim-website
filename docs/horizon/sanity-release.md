# Sanity changes and release checklist

Do not publish drafts or deploy the frontend until review and release checks pass together.

## Schema additions to deploy with approved frontend

- Register `electionGuide` in Studio: a recommendation per district/region, official identifier, house, election year, publication status/dates, approved rich text, source URLs and access dates. Copy official identifiers from verified editorial source material; do not derive recommendations from alignment tiers or fabricate a complete set.
- `blogPost.electionCoverage` and `blogPost.electionYear` opt published articles into `/election`. Editors must tag existing relevant articles; untagged posts remain in the ordinary blog.
- Declare the already-used `homePage.hero.image` and its alt field so editors can maintain it through Studio.
- Retain all old homepage/electorate fields and existing documents. No destructive migration.

## Exact editorial actions after frontend review

1. `main-navigation` / `drafts.main-navigation`: remove item `_key=nav-stand`; retain its revised logo tagline. Add `/blog` (“News & analysis”) and `/election` (“Election coverage”) where desired. The frontend supplies these links until the CMS is reconciled. Review both versions before publication.
2. Homepage `DYZVAW4yRUmcIv7eyyqoTp`: retain the current hero “Better places. Better systems. More freedom.”, subtitle, SEO, featured policy references and participation introduction. Set `hero.image.alt` if the photograph conveys information; otherwise leave decorative. Old alert/metrics/candidate fields are retained but ignored by the new Victoria homepage. Do not restore campaign defaults. The specifically requested draft ID was absent; check whether another editor has since created it before making changes.
3. Footer `DYZVAW4yRUmcIv7eyzvQ8T`: set `tagline` to “Policy · Research · Participation”; set `banner.text` to “Reason. Rights. Results.” and clear obsolete `banner.subtext`; change `navColumns[_key=="col-candidates"].badgeLabel` to “Archives”, disable `showElectorates`, remove “All Electorates”, retain “Past Candidates”. Preserve `authorization` exactly unless the authorised officer supplies a change. The frontend safely adapts these obsolete presentation fields for Victoria until CMS publication.
4. About page `DYZVAW4yRUmcIv7eyyXLAv`: another editorial update appeared during review. The final published render is titled “About Fusion Victoria”, with the subtitle “Policy, research and participation — during elections and between them.” It includes current purpose, activities and a 2026 coverage section. Preserve that newer content; do not replace it with earlier campaign copy or the temporary frontend fallback. Historical quotations and dated records remain intact.
5. Get involved `W7N5faJWCy7F9r41TTweSx`: at initial audit the subtitle was “Join the movement to reclaim Victoria's future”; review the latest document before changing it or its body; use ongoing membership, research, council submissions and volunteering destinations that are operational. Remove the current “🗳️ Vote Fusion” section and its following paragraph, and “📢 Run for Office” section and following recruitment paragraphs. The frontend suppresses these two sections pending editorial cleanup. Retain operational membership, volunteering, sharing and donation links. No live policy consultation system is asserted by the new homepage.
6. Stand page `9776a614-2529-40bf-bf79-ff88d1440ea1`: retain its record as historical material; its current subtitle falsely says Fusion Victoria is recruiting for 2026. Frontend access redirects to Get involved. If a historical archive is later published, label it explicitly with date and context.
7. Existing `electorate` tickets are not automatically migrated into 2026 coverage. Editors must separately approve and publish `electionGuide` documents, check district vs region, official identifier, dates, sources, recommendation wording and ballot material. Use `draft`/`review` until approved, then publish the Sanity document with `status=published`.

## Remaining release gates

- Production branch-build verification passes on implementation commit `3a08b691994b2074bffafaac6c245ec90689a068`. Resolve or explicitly review the eight unchanged baseline formatting failures listed in `verification.md`; they stop CI before type/test steps, which pass locally.
- Desktop and 320px/390px page families have been visually reviewed, with screenshots committed in `screenshots/`. Complete final design approval and any additional tablet/assistive-technology review before cutover.
- Test keyboard: skip link, navigation/dropdowns, mobile open/close/Escape, all CTAs, article/policy/research links and form focus. Run a browser accessibility scan and inspect the focus ring on both purple and white surfaces.
- Check homepage source content against current Sanity; confirm no placeholder metrics, candidate recruitment, registration targets or claim to contest 2026 remains.
- Validate image rendering with square graphics containing text, portrait graphics, missing images, no posts, empty research/policies and long titles.
- Verify `/blog`, a live article, `/research`, a research resource, `/policies`, an adopted policy, `/election`, and approved guide detail. Confirm future articles, drafts and withdrawn/incomplete guides are absent. The election hub's empty state must make no recommendation.
- Queensland is served from a separate branch; no further Queensland work or verification is part of this change.
- Publish the coordinated Sanity changes and deploy only after approval; never merge this PR automatically.

Existing published 2026 articles explicitly tagged `election` are included as a backward-compatible coverage fallback when `electionCoverage` is unset. Setting it to false opts out; setting it true with `electionYear=2026` explicitly opts in. The coverage hub lists all eligible articles, while the homepage selects three. This classifies existing editorial metadata; it does not infer positions or generate rankings.
