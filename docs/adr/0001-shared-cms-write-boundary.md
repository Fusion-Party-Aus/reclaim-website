# Shared CMS routine writes require a publishing gateway

**Status**: accepted

Routine writes to any future shared content dataset must pass through one publishing gateway that applies the same ownership, publication-scope, and required-reference checks for every supported writer. Only named break-glass administrators may bypass it for service recovery, with an audit trail and post-action review. Work under the Free-plan constraint; keep the existing VIC and QLD datasets as the read/write boundary until account permissions prove routine writers cannot bypass the gateway. No paid plan or shared-dataset cutover is approved by this decision. The editor experience remains open pending a workflow prototype, and actual account roles and token permissions still require verification.
