# Homepage Rallying-Cry Rewrite + GVT Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Patch the live Sanity `homePage` and `policy-abolish-preference-deals` documents to remove stale/overclaiming GVT-and-seat-winning copy and add rallying-cry energy, plus fix one hardcoded stale line in `convince-your-friends.astro`.

**Architecture:** A single one-off Node migration script (`scripts/migration/rally-cry-gvt-cleanup.js`), following the existing pattern in `scripts/migration/`, uses `@sanity/client` with a write token to `client.patch(...).commit()` two documents. A direct text edit handles the one hardcoded Astro file. Verification is done by re-fetching the live documents after the patch and asserting the new strings are present and the old stale strings are gone.

**Tech Stack:** Node.js (ESM), `@sanity/client` (already a project dependency), the project's `.env` for `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET`, and a `SANITY_WRITE_TOKEN` env var for the write-capable token (same convention as `scripts/migration/import-home.js`).

## Global Constraints

- No claims that Fusion currently holds a seat, or that Fusion has a guaranteed/numeric path to winning one (spec: Context).
- No claims that GVT abolition is settled/enacted — reform is "likely, not confirmed" as of 2026-07-23 (spec: Context).
- Keep the "we did the maths / read the contracts" analytical voice as a credibility layer; add rallying energy on top rather than replacing it (spec: Context).
- Copy-only changes — no layout/component/schema changes (spec: Non-goals).
- Do not touch `joinSection`, `signupCTA`, `movementMetrics`, `electoratesSection`, or either FAQ entry (spec: Non-goals, §4).
- All copy strings below are final — use them verbatim, not as a paraphrase starting point.

---

### Task 1: Write the migration script

**Files:**

- Create: `scripts/migration/rally-cry-gvt-cleanup.js`

**Interfaces:**

- Produces: an executable Node ESM script, run via `node scripts/migration/rally-cry-gvt-cleanup.js`, reading `SANITY_WRITE_TOKEN` from the environment and `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` from `.env`. Exits non-zero on any patch failure.

- [ ] **Step 1: Write the script**

```javascript
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const envText = readFileSync(new URL('../../.env', import.meta.url), 'utf-8')
const env = {}
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2]
}

const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID || 'qwl3f8jb',
  dataset: env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

async function patchHomePage() {
  const homePage = await client.fetch(`*[_type == "homePage"][0]{_id, hero}`)
  if (!homePage) throw new Error('homePage document not found')

  const stats = homePage.hero.stats.map((stat) =>
    stat.label === 'Upper House Seat' ? { ...stat, label: 'Seat Within Reach' } : stat
  )

  const result = await client
    .patch(homePage._id)
    .set({
      'hero.title': 'READ THE CONTRACTS. JOIN THE FIGHT.',
      'hero.subtitle':
        "Fusion is Victoria's crowd-funded minor party — no corporate donors, no career politicians, just people who did the maths and got angry. 900+ Victorians already have. You're next.",
      'hero.stats': stats,
      'theftSection.heading': "Here's why your vote counts",
      'theftSection.description':
        'One seat in the upper house forces contracts into daylight.\nMore votes make that seat easier to win — and harder for the majors to ignore either way.\nBalance of power: we make them earn every vote before we hand out ours.\nNo seat is guaranteed. Every vote still moves the line.\nMake yours count.',
    })
    .commit()

  // manifestoSection.stats is an array; patch the one entry whose current
  // label references GVT abolition, matched by _key rather than index so a
  // reorder elsewhere in Studio doesn't silently patch the wrong entry.
  const gvtStat = homePage._id
    ? await client.fetch(
        `*[_id == $id][0].manifestoSection.stats[label match "*GVT abolition*"][0]._key`,
        { id: homePage._id }
      )
    : null
  if (!gvtStat) throw new Error('manifestoSection GVT stat not found — check the label match')

  await client
    .patch(homePage._id)
    .set({
      [`manifestoSection.stats[_key=="${gvtStat}"].label`]:
        'the car park surcharge bill and preference-deal reform on day one.',
    })
    .commit()

  console.log('✅ homePage patched:', result._id)
}

async function patchPreferenceDealsPolicy() {
  const id = 'policy-abolish-preference-deals'
  const result = await client
    .patch(id)
    .set({
      hook: "Victoria looks likely to scrap group voting tickets before this election — but it isn't law yet. Fusion is running under the rules as they stand today, and we're campaigning to end them regardless of who gets there first.",
      villain:
        "Group voting tickets let parties lodge preference deals in back rooms, often with money changing hands nobody discloses. If reform passes before polling day, the vote-cascade trick dies with it — good, we've called for that for years. But no version of that reform touches the money behind preference deals. We lodged preference deals under today's rules. If those rules survive to polling day, we'll use them the same as any other party — and push to end them from the inside if elected. If reform beats us to it, that fight's already won, and we'll keep pushing for the disclosure law it still leaves out.",
      shareableQuote:
        "We might not get the chance to vote GVTs out ourselves — Victoria may beat us to it. Fine. Either way, the money behind preference deals still isn't public. That fight doesn't end when GVTs do.",
      'proofStat.label':
        "Primary vote that won a federal Senate seat via preference harvesting in 2013 — the loophole GVT reform may close, though the money behind such deals still wouldn't be disclosed.",
      summary:
        'Replace group voting tickets with direct voter-choice preference allocation — and require full disclosure of the money behind preference deals either way.',
      seoDescription:
        "Victoria may abolish group voting tickets before the 2026 election. Fusion's pushing for it regardless — and for full disclosure of the money behind preference deals, whichever happens first.",
      designRationale:
        'Victoria\'s preferential voting system gives candidates and parties the ability to direct how their voters\' preferences flow if they are eliminated, through "how to vote" cards and registered group voting tickets in the upper house. Preference deals between parties are negotiated privately, often with significant financial considerations, and are typically opaque to voters. The structural conflict of interest is that the major parties benefit from preference flows that keep the two-party system intact, while smaller parties trade preferences for campaign support or fundraising assistance. Victoria is likely, but not yet confirmed, to abolish group voting tickets before the 2026 election. Fusion is contesting 2026 under the rules as they currently stand, including lodging preference deals, and is campaigning to end the group voting ticket system regardless of whether reform passes first. Using a mechanism while campaigning to end it, and not knowing in advance whether the mechanism will still exist by polling day, is the central tension this policy states honestly rather than obscures.',
      implementationOutline:
        "This is a crossbench-leverage policy with an acknowledged conflict of interest: Fusion lodged preference deals for the 2026 election under group voting ticket rules that may or may not still be in force by polling day, while campaigning to end those rules. That tension is named explicitly rather than obscured. If Fusion wins a seat, the Fusion MP introduces a Private Member's Bill amending the Electoral Act 2002 in up to two stages, depending on what reform has already done: first, require full public disclosure of any financial or in-kind consideration paid in connection with a preference agreement, registered as a political donation under the existing disclosure regime (this is the least controversial ask, attracts cross-party support, and remains necessary even if group voting tickets are already abolished); second, if group voting tickets have not already been abolished by then, abolish the Legislative Council group voting ticket mechanism in favour of optional preferential voting above the line, mirroring the 2016 Commonwealth Senate reform. The disclosure stage can pass from one seat with the support of parties that benefit from preference transparency even if they oppose abolition. Whichever stages are still live by the time Fusion holds any seat, the one-seat deliverable is putting a fully drafted bill on the record, forcing every party to state publicly whether they support undisclosed preference-deal money.",
      riskAndFailureModes:
        "The direct conflict of interest: Fusion lodged preference deals for the 2026 election under group voting ticket rules, while campaigning to end those same rules. That tension is named rather than finessed, and it holds regardless of whether reform abolishes group voting tickets before or after polling day. If Fusion wins a seat partly through preference flows, any subsequent push for preference-deal disclosure is open to the criticism that the mechanism which helped deliver the seat is being restricted behind the winner. The policy's answer is that the existing system is corrupt regardless of who uses it, and that either winning a seat to push reform from inside, or reform arriving independently, are both acceptable outcomes — the disclosure requirement is the part that doesn't happen automatically either way. The risk is that this argument is not accepted by other parties or by voters, that reform stalls indefinitely, or that Fusion fails to win any seat and has no parliamentary vehicle to advance the disclosure bill at all.",
    })
    .commit()

  console.log('✅ policy patched:', result._id)
}

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('SANITY_WRITE_TOKEN env var is required')
  }
  await patchHomePage()
  await patchPreferenceDealsPolicy()
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
```

- [ ] **Step 2: Confirm the script has no syntax errors**

Run: `node --check scripts/migration/rally-cry-gvt-cleanup.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add scripts/migration/rally-cry-gvt-cleanup.js
git commit -m "$(cat <<'EOF'
Add migration script to patch stale GVT/rallying-cry homepage and policy copy

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Run the migration and verify against live Sanity content

**Files:**

- None created — this task executes Task 1's script against the live `production` dataset and verifies the result by reading it back.

**Interfaces:**

- Consumes: `scripts/migration/rally-cry-gvt-cleanup.js` from Task 1.
- Consumes: a `SANITY_WRITE_TOKEN` with write access to the `production` dataset (check `.env` for an existing token, or `sanity.io/manage` → project → API → Add API token, permission: Editor, if one isn't already available in the shell environment).

- [ ] **Step 1: Run the migration script**

Run: `SANITY_WRITE_TOKEN=<token> node scripts/migration/rally-cry-gvt-cleanup.js`
Expected output:

```
✅ homePage patched: DYZVAW4yRUmcIv7eyyqoTp
✅ policy patched: policy-abolish-preference-deals
```

- [ ] **Step 2: Verify the homePage patch landed correctly**

Run:

```bash
node -e "
import('@sanity/client').then(async ({ createClient }) => {
  const { readFileSync } = await import('fs');
  const env = Object.fromEntries(
    readFileSync('.env', 'utf-8').split('\n')
      .map((l) => l.match(/^([A-Z_]+)=(.*)\$/))
      .filter(Boolean)
      .map((m) => [m[1], m[2]])
  );
  const client = createClient({ projectId: env.PUBLIC_SANITY_PROJECT_ID, dataset: env.PUBLIC_SANITY_DATASET, useCdn: false, apiVersion: '2024-01-01' });
  const hp = await client.fetch('*[_type == \"homePage\"][0]{hero, theftSection, manifestoSection}');
  console.log(JSON.stringify(hp, null, 2));
});
"
```

Expected: `hero.title` is `"READ THE CONTRACTS. JOIN THE FIGHT."`, `hero.stats` contains a `{ label: "Seat Within Reach" }` entry (not `"Upper House Seat"`), `theftSection.heading` is `"Here's why your vote counts"`, `theftSection.description` contains `"No seat is guaranteed"`, and `manifestoSection.stats` contains a label ending in `"preference-deal reform on day one."` with no remaining `"GVT abolition"` text anywhere in the fetched object.

- [ ] **Step 3: Verify the policy patch landed correctly**

Run the same pattern as Step 2, replacing the GROQ query with:
`*[_id == "policy-abolish-preference-deals"][0]{hook, villain, shareableQuote, proofStat, summary, seoDescription}`

Expected: `hook` starts with `"Victoria looks likely to scrap group voting tickets"`, and none of the returned fields contain the phrase `"win a Legislative Council seat from which to abolish them"` (the old settled-fact claim).

- [ ] **Step 4: No commit** — this task only runs a migration against live content; there's nothing new to commit (the script itself was already committed in Task 1).

---

### Task 3: Fix the hardcoded stale line in convince-your-friends.astro

**Files:**

- Modify: `src/pages/convince-your-friends.astro:102`

**Interfaces:**

- None — this is an isolated string literal inside the `defaultTemplates` array's `climate-anxious-friend` entry.

- [ ] **Step 1: Make the edit**

In `src/pages/convince-your-friends.astro`, within the `body` template literal for the `climate-anxious-friend` template, change:

```
Best part: They're running in winnable seats. This isn't pie-in-the-sky stuff.
```

to:

```
Best part: it's a fully costed plan on the table right now — not some 20-year fantasy.
```

- [ ] **Step 2: Verify the old string is gone**

Run: `grep -n "winnable seats" src/pages/convince-your-friends.astro`
Expected: no output (exit code 1).

Run: `grep -n "fully costed plan on the table" src/pages/convince-your-friends.astro`
Expected: one match at the edited line.

- [ ] **Step 3: Commit**

```bash
git add src/pages/convince-your-friends.astro
git commit -m "$(cat <<'EOF'
Remove stale "winnable seats" claim from convince-your-friends template

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Post-implementation note (not a task — informational only)

While researching this plan, the live `evidenceAndPrecedent` field on the
`policy-abolish-preference-deals` document was found to contain a
pre-existing, unrelated factual mix-up: it opens with "The 2013 Victorian
upper house election saw the Australian Motoring Enthusiast Party candidate
Ricky Muir elected to the federal Senate..." — Ricky Muir was a **federal**
Senate candidate in the **2013 federal election**, not a Victorian upper
house race. This isn't touched by this plan (out of scope — not related to
GVT-certainty staleness) but is worth a separate fix.
