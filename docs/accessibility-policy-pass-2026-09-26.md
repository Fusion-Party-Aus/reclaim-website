# Accessibility pass — Victorian policy pages (26 September 2026)

Scope: /policies, /vision and policy detail templates in reclaim-website PR #12. This is a targeted pass against WCAG 2.2, with AAA as a goal. It is **not** an AAA conformance claim for the whole site.

## Completed in PR #12

- Skip link uses high-contrast white on dark blue and stays above the sticky header on focus.
- Header text and mobile menu labels have clearer contrast; the menu button announces open/close state and retains aria-expanded.
- Sidebar jump links are larger, have an explicit navigation label and use higher-contrast active/hover colors.
- Policy card links receive unique accessible names ("Read [policy title]") instead of repeated "Read More"; card categories are headings, closing the h2-to-h4 gap.
- The Homes and Stations Code gets a discoverable policy entry and a direct link from the index, vision and station-housing page.
- Policy detail routes render published CMS content at request time, avoiding stale newly-created pages after the deployment.

## Observed on current production before deployment

The accessibility tree for /policies exposes the skip link, primary navigation and policy headings. Repeated "READ MORE" link names and skipped card-category heading level were present. CMS fields on the index and vision were current, while static detail pages remained stale and the newly published Code URL returned 404. These observations must be repeated after PR deployment.

## Remaining AAA work

A full AAA assessment requires every public template, breakpoint, state, modal and media item. Current brand accent colors do not universally meet 7:1 for normal text: white on #D428D4 is about 4.16:1 and white on #4A7AEB about 3.98:1. PR #12 changes several key controls, but many other instances remain. Audit text at actual rendered sizes and backgrounds; use a dark accent for white text or a light accent for dark text, and preserve non-color focus cues.

Test keyboard-only menus, dialogs, forms and the hidden Konami panel; screen readers; 320 CSS-pixel reflow and 200%/400% zoom; text spacing; motion reduction; target size; language and acronym expansion; and any audio/video captions and transcripts. Automated checks cannot certify these. Check content claims and citation destinations separately from WCAG.

## Release gate

Run CI, deploy PR #12, then verify the new policy route, index cards, vision and updated detail fields in a fresh browser session. Record manual accessibility findings before claiming a WCAG conformance level.
