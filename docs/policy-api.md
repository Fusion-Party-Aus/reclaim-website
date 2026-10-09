# Policy API

The machine-readable policy platform. It is the canonical JSON surface for the
branch's adopted policies, so downstream consumers do not have to scrape the
presentation HTML.

- Endpoint: `GET /api/policies.json`
- Related feeds: `/api/policy-changes.json` (change log) and `/api/policies.txt` (plain text)
- CORS: `Access-Control-Allow-Origin: *`
- Caching: `public, max-age=300, s-maxage=900`

## Adopted policies by default

The endpoint returns **adopted policies only**. A policy with no `status` is
treated as adopted, so existing content keeps appearing without a migration.
Policies explicitly marked `draft` or `archived` are excluded.

## Top-level fields

| Field                  | Type              | Notes                                        |
| ---------------------- | ----------------- | -------------------------------------------- |
| `schema_version`       | number            | Contract version.                            |
| `generated_at`         | string (ISO 8601) | When the response was generated.             |
| `platform_updated_at`  | string \| null    | Most recent policy revision.                 |
| `policy_count`         | number            | Number of adopted policies returned.         |
| `latest_changes`       | array             | Up to 20 most recently updated policies.     |
| `organization`         | object            | Publisher identity and canonical URLs.       |
| `governing_philosophy` | object            | Manifesto title, summary and governing rule. |
| `policies`             | array             | The adopted policies (see below).            |

## Policy fields

Each entry in `policies` has:

| Field                     | Type           | Notes                                                               |
| ------------------------- | -------------- | ------------------------------------------------------------------- |
| `id`                      | string         | Sanity document id.                                                 |
| `title`                   | string         | Policy title.                                                       |
| `authority`               | object         | Publisher, jurisdiction, `adopted_policy: true`.                    |
| `slug`                    | string         | URL slug.                                                           |
| `canonical_url`           | string         | Public policy page.                                                 |
| `status`                  | string         | `adopted`, `draft` or `archived`. Missing defaults to `adopted`.    |
| `topics`                  | string[]       | Topic taxonomy tags. Defaults to `[]`.                              |
| `source_url`              | string         | Canonical source of the policy text; falls back to `canonical_url`. |
| `references`              | array          | Cited sources as `{ title, url }`. Defaults to `[]`.                |
| `pillar`                  | string \| null | Platform pillar.                                                    |
| `category`                | string \| null | Sub-category within the pillar.                                     |
| `delivery_horizon`        | string         | `current-term` or `long-term`.                                      |
| `summary`                 | string         | Introductory statement.                                             |
| `hook`                    | string \| null | Campaign framing.                                                   |
| `key_points`              | array          | Key points with `point` and optional `description`.                 |
| `shareable_quote`         | string \| null | Pull-quote.                                                         |
| `design_rationale`        | string \| null | Further detail.                                                     |
| `system_interaction`      | string \| null | Further detail.                                                     |
| `economic_logic`          | string \| null | Further detail.                                                     |
| `risks_and_failure_modes` | string \| null | Further detail.                                                     |
| `evidence_and_precedent`  | string \| null | Further detail.                                                     |
| `implementation_outline`  | string \| null | Further detail.                                                     |
| `cost`                    | string \| null | Estimated cost.                                                     |
| `funding`                 | string \| null | Funding approach.                                                   |
| `additional_content_text` | string         | Additional body content as plain text.                              |
| `published_at`            | string \| null | First publication.                                                  |
| `substantive_updated_at`  | string \| null | Last substantive policy change.                                     |
| `change_summary`          | string \| null | Public note for that change.                                        |
| `supporting_research`     | array          | Related research as `{ title, canonical_url }`.                     |
| `updated_at`              | string \| null | Last CMS revision.                                                  |

## Example

```json
{
  "schema_version": 1,
  "generated_at": "2026-10-09T00:00:00.000Z",
  "policy_count": 1,
  "policies": [
    {
      "id": "policy-1",
      "title": "Example policy",
      "slug": "example-policy",
      "canonical_url": "https://vic.fusionparty.org.au/policies/example-policy",
      "status": "adopted",
      "topics": ["housing", "transport"],
      "source_url": "https://github.com/fusion-party/platform/blob/main/housing.md",
      "references": [
        {
          "title": "Productivity Commission report",
          "url": "https://example.org/report"
        }
      ],
      "pillar": "RECLAIM OUR INFRASTRUCTURE",
      "category": "Housing",
      "delivery_horizon": "current-term",
      "summary": "A short introduction to the policy.",
      "supporting_research": []
    }
  ]
}
```
