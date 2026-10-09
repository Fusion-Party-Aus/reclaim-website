# Public investigations

The investigations feature is shared code and uses the active deployment's Sanity project and dataset. It is not Queensland-specific. Each branch can independently enable the feature in `config/branches.mjs` under `runtime.features.investigations`; `PUBLIC_ENABLE_INVESTIGATIONS=true|false` can override that setting for a deployment.

## Editorial workflow

1. Open the Sanity Studio configured for the intended branch and verify its dataset before creating content.
2. Create a **Public Investigation** with a neutral title, summary, area, project stage and editorial status. Record relevant people, organisations, places, dependencies and next steps where useful.
3. Cite direct source URLs. For each source, identify the publisher, date, specific finding and material limitations. Prefer primary records.
4. Track questions separately as answered, partially answered or outstanding. Note whether each question was submitted, proposed or generated through research; a response alone does not establish that a question is resolved.
5. Add dated updates for material changes, with source links and a brief account of what changed. Link related investigations.
6. Keep private contact details, confidential records, draft allegations and internal review notes out of public fields. Internal review notes are never rendered by the site.
7. A second editor checks citations, disputed claims, dates, numerical units, fairness, privacy and any right-of-reply considerations. Set the editorial readiness flag only after this check, then explicitly publish the Sanity document.
8. The site uses the published Sanity perspective and only returns investigations with `readyForPublication == true`, a publication date and a slug. Clearing readiness and publishing the change withdraws an investigation from public pages.

## Public interface

- `/investigations` lists approved investigations and offers text search, area and editorial-status filters.
- `/investigations/[slug]` displays approved investigation details, question counts and provenance, cited evidence and limitations, source library, update timeline and related records.
- Empty and not-found states do not expose drafts. Unapproved branches return a 404 and omit the navigation link.
- Queries are made against the active deployment dataset, so branches do not share or leak investigation records.

## Branch setup and verification

Enable the feature only for a branch whose editorial team is ready to publish reviewed records. Configure that branch's Sanity Studio to the same project and dataset as its site deployment. To preview an additional branch without changing the manifest, set `PUBLIC_ENABLE_INVESTIGATIONS=true` for that build.

Run `npm run type-check`, `npm run test:config`, and `npm run build:branch`. Verify the listing, filters, detail route, missing-slug 404 and a draft/unapproved record on each enabled deployment.

Cross-project comparisons and issue/cumulative-impact records should keep findings separate by investigation, preserve source-level limitations and explain whether measures are genuinely comparable. Do not sum or equate figures from different boundaries or methods without verification. Their dedicated public views remain follow-up work; the first dashboard release provides individual investigation records and cross-links.
