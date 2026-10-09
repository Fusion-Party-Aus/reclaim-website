# Public investigations — shared editorial workflow

## Scope
Public investigations document verifiable evidence, questions and developments. They are **not** adopted Fusion Party policy. Each deployment's own configured Sanity dataset is the sole source of truth for that branch. The feature is opt-in per branch through deployment configuration or the PUBLIC_ENABLE_INVESTIGATIONS override.

## Creating an investigation
1. Open the correct branch's Sanity Studio and verify its configured dataset.
2. Choose **Public Investigations → New**. Record a neutral title, unique slug, concise summary, geographic area and project stage.
3. Add evidence entries with a direct source URL, publisher, publication date, exact finding and limitations. Prefer primary government records, EIS/EAR documents, council records and public correspondence.
4. Enter questions individually as **answered**, **partial** or **outstanding**. Link supporting evidence. A question is not answered merely because a project proponent has responded.
5. Add dated updates when substantive facts change; distinguish the event date from the date you checked it. Cross-link related investigations.
6. Set the responsible editor, last-reviewed date and internal review notes. Do not include private contact details, unverified accusations or confidential material.
7. A second reviewer should check citations, disputed claims, numerical units, dates, fairness to affected parties and whether a correction or right of reply is needed.
8. Set **Ready for publication** only after editorial review. Then explicitly **Publish** in Sanity. The website requires both this flag and a `publishedAt` date, and uses the published perspective.
9. For updates, edit a draft, recheck evidence, refresh last-reviewed date and publish again. Record the change in the updates array. If a serious error is found, clear the readiness flag and publish that change to withdraw it from public listings.

## Example Queensland investigation queue (not verified or published)
- ARRC — energy facility, planning status, health modelling and public-investment questions.
- Bromelton — proposed facility, consultation, health assessment and government response.
- Coomera Connector — future stages, wetlands, habitat impacts and cumulative effects.
- Cross-project issue: glossy black cockatoo habitat. Record distinct impacts and evidence; **do not add habitat figures together** without establishing compatible boundaries and methods.

Do not migrate figures or conclusions from a screenshot alone. Obtain and verify Stewart's underlying primary sources before populating the evidence register.

## Operational checks
- Verify the branch identity, feature flag and branch-specific Sanity dataset for the site.
- Verify `SANITY_STUDIO_BRANCH=qld` and `SANITY_STUDIO_DATASET=qld` for the Queensland Studio.
- Run `npm run type-check`, `npm run build:qld`, and `npm run build` before merging.
- Check /investigations and /investigations/[slug] on desktop and mobile, including empty state, 404, unpublished exclusion, citations and cross-links.
- The site exposes source URLs and updates publicly, but not editor notes.

## Modular evidence architecture
- `investigation`: one project, questions, dated updates, byline, editorial review, linked shared sources.
- `investigationSource`: reusable source URL, document version, publisher, date, pinpoint page and verification status.
- `investigationComparison`: a comparison across two or more referenced investigations; each topic has project-specific findings, sources, limitations and an assessment. Do not infer a winner from disclosure alone.
- `investigationIssue`: a shared question or cumulative-impact issue with separate project findings, sources, a comparability caveat and next steps.

For Stewart's October 2026 evidence snapshot, the ARRC/Bromelton disclosure table belongs in a comparison document, while glossy black cockatoo habitat belongs in a cross-project issue. The reported 36.6 ha and 46.46 ha figures must not be summed or treated as equivalent without verifying scope and methodology. The question tracker must distinguish submitted ARRC questions from newly proposed comparative questions. Maintain Stewart Brooker's independent-review attribution.

The comparison and issue documents are now editable in Sanity, but their dedicated public rendering and any migration from the PDF remain separate follow-up tasks. Keep these records in draft until source URLs and claims are verified.
