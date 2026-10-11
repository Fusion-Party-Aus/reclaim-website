# Offline shared CMS migration planning

This milestone prepares review artifacts only. It does not export live datasets,
create a destination, upload assets, write documents, change source data, or switch
reads. #77 permits fixture-only planning while separate datasets remain in use; actual restricted-gateway/account evidence and live migration approval remain required. VIC `production` and QLD `qld` stay
unchanged. An offline `ready` report means the supplied plan inputs reconcile; it
is not production migration approval or proof that destination assets exist.

Retain authenticated Sanity exports and asset files in an approved backup location
before attempting future writes. The planner consumes explicit NDJSON export files
and a reviewed JSON mapping. It never derives ownership from source membership.
Review every document, including drafts; missing ownership blocks mutation output.
Source membership supplies only the initial Site scope. An approved sharing map may
explicitly replace that scope. Draft IDs remain drafts and editorial IDs are
namespaced by Site, so VIC/QLD ID collisions cannot overwrite one another.

Reference declarations are schema-derived paths, with `[]` denoting array entries.
Every non-asset reference must declare whether it is required. Missing declarations
or targets block the plan. Required references are checked by the same staged
publication validator used by the prospective shared content service. Drafts may
remain incomplete. Asset identifiers are preserved and emitted in a separate asset
manifest with source URLs; future approved transport must upload/verify actual
assets and reconcile destination URLs before reads switch. No asset upload is
implemented here.

The plan includes stable NDJSON create-or-replace proposals, counts, source/destination
IDs, ownership, scope, references and asset manifests. There is deliberately no
apply command. Review the plan before designing an approved writer adapter; do not
pipe it into an unrestricted import tool. Deterministic IDs make repeated planning
converge without duplicate document proposals. Future writer execution must also
handle destination drift, permissions, transactions and failure recovery.

Rollback keeps the old Site CMS dataset bindings and retained exports. The artifact
records the exact source dataset and backup path for each Site. Restoring the legacy
read configuration requires no source import because this planner never edits the
sources. Live cutover additionally requires a real preview rollback demonstration,
asset verification, complete count/reference reconciliation and separate approval.

## Review input and command

Run on Node 24 (native TypeScript stripping loads the shared validator):

```bash
node scripts/sanity/plan-site-migration.mjs --input /approved-backups/reviewed-plan.json --output /tmp/new-migration-review
```

The output directory must not exist. Existing export and review files are never
rewritten. Omit `--output` to print the reconciliation report only. Invalid inputs
return a nonzero status and suppress all mutation proposals.

```json
{
  "sources": [
    { "siteId": "vic", "dataset": "production", "backupPath": "vic.ndjson" },
    { "siteId": "qld", "dataset": "qld", "backupPath": "qld.ndjson" }
  ],
  "reviewedOwners": {
    "production:example-id": { "type": "branch", "branchId": "vic" },
    "qld:example-id": { "type": "branch", "branchId": "qld" }
  },
  "approvedSharing": {},
  "referenceDeclarations": {
    "exampleDocumentType": { "requiredChild": true, "relatedItems[]": false }
  },
  "singletonTypes": ["homePage", "navigation", "footer"]
}
```

This is an input-shape example, not an approved ownership or schema-reference
mapping. Build complete mappings from actual exported documents and reviewed schema
rules. The planner requires every referenced target in the supplied exports,
including assets; missing targets remain reconciliation blockers even in drafts.
Incomplete drafts without required fields remain drafts and are not published.
Asset manifests preserve source URLs for audit; destination URLs and availability
must be reconciled after a separately approved upload implementation.
