# Adding a branch landing site

The isolated `branch-agnostic-test` Worker serves NSW, SA, WA, TAS, NT and ACT from their canonical state subdomains. VIC and QLD retain their separate deployments and Sanity datasets. National is not routed through this Worker.

For another approved landing site:

1. Add its stable ID and state name to `config/site-landings.mjs`. This generates its canonical hostname; aliases require explicit approval.
2. Add verified city photography and attribution to `config/branch-city-photography.mjs`, with provenance in the photography document.
3. Add its approved branding to `config/site-branding.mjs`, and explicitly include its ID in the shared National base content scope. Never substitute a VIC/QLD dataset.
4. Extend the host, content, photography, branding and HTTP QA matrices. Build with `npm run build:test`, run the tests and `check-shared-base-artifact.mjs`, then check the built Worker locally and inspect desktop/mobile.
5. Publish the verified production branch for this Worker. In Cloudflare, map the exact approved custom domain to `branch-agnostic-test`. Its generated deployment config intentionally contains no automatic domain routes or CMS bindings.
6. Verify HTTPS root, canonical metadata, own photo/accent, HEAD, unavailable-route 404s and root-only discovery on the live hostname. Confirm VIC/QLD remain unchanged.

Unknown hosts fail closed. Registry entries alone do not create DNS or Cloudflare custom-domain mappings. The static content adapter can later be replaced behind `BranchLandingContent`; adding a landing page does not consolidate CMS datasets.
