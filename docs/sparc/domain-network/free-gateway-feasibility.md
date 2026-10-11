# Sanity Free publishing gateway feasibility (#77)

Checked 11 October 2026. Research only: no role/token changes, CMS writes, paid commitments, push or deployment.

## Decision

**Conditional GO for a fixture-only gateway/editor prototype on Free. NO-GO for shared production cutover or routine native Studio editing under the current evidence.** A gateway can be the sole routine write path when routine people and Signal possess no independently writable Sanity credential. This requires a custom editing surface, including draft saves and asset operations, not merely a replacement Publish button.

The [current issue and maintainer comment](https://github.com/Fusion-Party-Aus/reclaim-website/issues/77), [accepted ADR](../../adr/0001-shared-cms-write-boundary.md), and [glossary](../../../GLOSSARY.md) agree: one authoritative gateway for every routine writer; named break-glass administrators are a documented exception; no paid upgrade; existing VIC `production` and QLD `qld` sources stay in place. Shared fixtures are appropriate for proving the model. This note does not authorize connecting the prototype to either live source.

## What Free supports

Sanity's official [roles concepts](https://www.sanity.io/docs/content-lake/roles-concepts) distinguishes human roles from API tokens: Free offers Administrator and Viewer users, while Editor read/write robot tokens and Viewer tokens are available on all plans. Thus a Free gateway can hold a project Editor token without making every human an Administrator. The gateway's application policy supplies branch/owner authorization; the upstream token is a broad project credential, not a branch-restricted credential.

The [roles guide](https://www.sanity.io/docs/user-guides/roles) says Administrator can read/write all datasets and manage project settings; Viewer is read-only across all datasets. Editor/Contributor human roles require Growth, and custom roles require Enterprise. Permissions are additive: a restrictive role does not cancel another broad grant. Consequently, separate datasets within one project do not establish branch-specific human or default-token permissions. They preserve current content selection and rollback boundaries, which remain useful.

The [pricing page](https://www.sanity.io/pricing) currently lists two public datasets for Free. Both existing slots are occupied according to the earlier connected-project evidence in [access-and-quotas.md](access-and-quotas.md). Do not assume a third shared dataset can be created while retaining both sources. Actual account plan, organization inheritance, member grants and robot-token permissions remain unverified. No existing dataset should be deleted to make room.

## Editor workflow options

| Workflow                                                                   | Sole routine gateway possible?       | Consequence                                                                                                                                                                                                               |
| -------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing native Studio editing, Administrator users, custom Publish action | **No**                               | Users can directly autosave drafts and invoke Content Lake APIs. Replacing an action does not revoke their credential.                                                                                                    |
| Viewer Studio plus a bespoke gateway tool                                  | **Potentially**                      | Native document forms remain read-only. A custom tool must own editable state, draft saves, publish/unpublish/delete, assets, references, conflicts and recovery. Viewer identities can still read all project documents. |
| Standalone custom editor with gateway authentication                       | **Potentially; preferred prototype** | No Sanity user membership is needed for routine writers. The gateway controls branch-scoped reads and writes. More editorial UI must be implemented, but the credential boundary is explicit.                             |
| Signal or migration runner with gateway-only service identity              | **Potentially**                      | They submit typed commands to the same validator; they never receive a Content Lake write token or generic mutation proxy.                                                                                                |

Sanity supports [custom Studio tools](https://www.sanity.io/docs/studio/custom-studio-tool) as React views, but the documentation does not promise a drop-in replacement for Studio's underlying persistence transport. A custom tool inside Studio is feasible architecture, not a verified native-editing integration. The [Studio customization documentation](https://www.sanity.io/docs/studio/studio-customization) explains that native custom inputs emit patches through `onChange` to retain real-time behavior. Intercepting only document actions leaves those edits outside the gateway.

[Actions API documentation](https://www.sanity.io/docs/http-reference/actions) confirms native authoring uses authenticated read/write operations. [Schema validation documentation](https://www.sanity.io/docs/content-lake/schema-validation-and-the-content-lake) confirms Studio validation is client-side and programmatic mutations/imports do not run it. These are why UI filtering and publish-button overrides cannot meet the authoritative-write requirement.

## Credential boundary and residual trust

Recommended prototype boundary, an engineering inference from those documented controls:

- Routine human: gateway login mapped server-side to approved Branch/owner capabilities; no Administrator or writable robot token. Either no Sanity membership, or Viewer only if access to every branch's drafts is acceptable.
- Signal: distinct gateway service credential with a narrow allowed command/content-type/owner scope. No Sanity write token, administrator session or access to the gateway secret store. Gateway authorization must not trust `siteId`, owner or user identity supplied in the request body.
- Migration runner: separate, short-lived gateway identity limited to an approved plan/hash and destination fixtures. An import CLI with a direct Editor/admin token is a bypass and is not an ordinary supported path.
- Gateway: server-held project Editor robot credential; authenticate callers, authorize transitions, validate ownership/scope/schema/reference graphs, then apply changes. Never return that credential. Limit writes to explicit configured datasets; reject arbitrary GROQ, arbitrary mutation payloads and caller-selected upstream URLs.
- Named break-glass maintainers and infrastructure operators who can retrieve the gateway secret or deploy arbitrary gateway code remain trusted administrators. Free cannot constrain them to the validator. Audit and post-action review are organizational controls, not a claim that bypass is technically impossible.

Sanity recommends a validating proxy/cloud function for external submissions and warns against exposed access tokens in [Keeping your data safe](https://www.sanity.io/docs/content-lake/keeping-your-data-safe). [Browser token guidance](https://www.sanity.io/docs/help/js-client-browser-token) makes clear that frontend tokens are recoverable by users. [CORS documentation](https://www.sanity.io/docs/content-lake/browser-security-and-cors) explicitly excludes Node/curl requests from CORS enforcement. CORS allowlists cannot substitute for revoked write permissions.

## Removing retained bypass credentials

Before claiming routine exclusivity, a named maintainer must inventory project and organization memberships, inherited grants, human sessions, all robot tokens, Signal/CI/import credentials, installed integrations and secret-store/deployment access. Downgrade/remove routine writable human grants and revoke old robot writers after an approved replacement is tested. Remove distributed copies from Signal, CI and operator scripts; deleting a local variable is insufficient.

[Authentication documentation](https://www.sanity.io/docs/content-lake/http-auth) states personal tokens act with the user's permissions, robot tokens normally last until deleted, and token-role changes require replacement plus deletion of the old token. Revocation is immediate on subsequent requests. It also documents optional token expiry. [CLI authentication](https://www.sanity.io/docs/apis-and-sdks/cli-authentication) distinguishes logging out a human session from deleting a robot token. Verify actual revoked/old credentials are denied; do not print their values or use secret-revealing debug commands. Reload Studio after role changes, then test the backend permissions rather than trusting cached UI state.

## Proof required before approval

A fixture prototype should demonstrate valid draft/publish/unpublish/delete/asset flows; wrong-owner and wrong-branch rejection; invalid scope and required-reference rejection; stale-revision/conflicting edits; Signal and migration parity; session revocation; and denied direct Sanity writes using a routine identity and retired service credentials. Test direct HTTP mutations and Actions API, not just the UI. If draft confidentiality is required, also prove wrong-branch reads are denied through the gateway and avoid all-document Viewer membership.

Graph validation and application must resist concurrent dependency changes. [Sanity transactions](https://www.sanity.io/docs/content-lake/transactions) are atomic, but GROQ queries are eventually consistent; read-then-write validation is not automatically serializable. Use a reviewed authoritative serialization/revision-check design covering the complete affected graph. No storage/backend choice or paid service is selected here.

**Go/no-go gates:** GO only to an isolated fixture workflow prototype with external gateway authentication and no routine Content Lake writer. NO-GO if native Studio editing is mandatory without a custom editor, any routine writer retains a direct write credential, account/role evidence is unavailable, or complete graph enforcement cannot be demonstrated. Production shared-dataset work additionally requires a retained-backup/destination-capacity decision and explicit maintainer approval. Existing VIC/QLD datasets remain separate throughout.

## Deployment boundary

The maintainer reports that the `branch-agnostic-test` Worker automatically deploys the current branch. Therefore pushing that branch is deployment-triggering and requires the same concrete reviewed candidate and approval as deployment. This hosting configuration was not independently inspected during this research; no push was performed.
