# Homepage rallying-cry rewrite + GVT staleness cleanup

## Context

Victoria is likely (but not yet confirmed — reform is not enacted as of 2026-07-23) to abolish
the group voting ticket (GVT) system before the 2026 state election. Fusion Party Victoria is
currently extra-parliamentary (holds no seats anywhere). Several pieces of live copy assert or
imply things that are no longer safe to claim:

- That Fusion has a clear numeric path to winning an upper house seat (relies on GVT-era
  preference math that may not exist by polling day).
- That Fusion currently holds an upper house seat (it doesn't — one hero stat mislabels a
  _target_ as if it were a current count).
- That GVT abolition is Fusion's own future legislative act ("we'll abolish it on day one"),
  when the state may do this independently before Fusion could ever act on it.
- That Fusion's use of preference deals in 2026 is a settled, confident bridge to a guaranteed
  seat ("the seat from which to abolish them").

Separately, and independent of the GVT issue, the homepage's overall voice reads as analytical
("we read the contracts", "just the maths") rather than as a rallying cry. The maths/wonk angle
is a deliberate brand differentiator (see the Populist Hook / Villain Framing / Proof Statistic
fields already built into the policy schema) and should be kept as a credibility layer, not
replaced — the fix is to add rallying energy on top, not instead of it.

## Non-goals

- No claims about winning are being added or restored in stronger form than what's here.
- No changes to `joinSection`, `signupCTA`, `movementMetrics`, `electoratesSection`, or the
  "shell party" FAQ — these don't hinge on GVT status and already read fine.
- No changes to page layout/structure/components — copy only.
- The two-stage legislative ask (disclosure, then abolition if still needed) in the policy's
  `implementationOutline` stays structurally the same; only the certainty language changes.

## Changes

### 1. Sanity `homePage` document

**`hero.title`**: `"READ THE CONTRACTS. JOIN THE FIGHT."`

**`hero.subtitle`**: `"Fusion is Victoria's crowd-funded minor party — no corporate donors, no career politicians, just people who did the maths and got angry. 900+ Victorians already have. You're next."`

**`hero.stats`**: relabel the third stat (currently `{ number: "1", label: "Upper House Seat" }`,
which misleadingly reads as a current holding next to two real current-fact stats) to
`{ number: "1", label: "Seat Within Reach" }`. Number unchanged — it's an aspirational target,
not a claim of a current seat.

**`theftSection.heading`**: `"Here's why your vote counts"` (was: `"Here's how we win"`)

**`theftSection.description`**: (was the GVT-preference-math paragraph)

```
One seat in the upper house forces contracts into daylight.
More votes make that seat easier to win — and harder for the majors to ignore either way.
Balance of power: we make them earn every vote before we hand out ours.
No seat is guaranteed. Every vote still moves the line.
Make yours count.
```

**`manifestoSection.stats[2]`**: label changes from
`"the car park surcharge bill and GVT abolition on day one."` to
`"the car park surcharge bill and preference-deal reform on day one."`
(`number: "Introduce"` unchanged.) This wording holds regardless of whether GVT reform passes
before or after the election — "preference-deal reform" covers both full abolition (if still
needed) and the disclosure law (needed either way).

### 2. Sanity `policy` document `policy-abolish-preference-deals`

Title unchanged (`"Abolish Preference Deals"`) — the ask is still live since reform isn't enacted.

**`hook`**: `"Victoria looks likely to scrap group voting tickets before this election — but it isn't law yet. Fusion is running under the rules as they stand today, and we're campaigning to end them regardless of who gets there first."`

**`villain`**: `"Group voting tickets let parties lodge preference deals in back rooms, often with money changing hands nobody discloses. If reform passes before polling day, the vote-cascade trick dies with it — good, we've called for that for years. But no version of that reform touches the money behind preference deals. We lodged preference deals under today's rules. If those rules survive to polling day, we'll use them the same as any other party — and push to end them from the inside if elected. If reform beats us to it, that fight's already won, and we'll keep pushing for the disclosure law it still leaves out."`

**`shareableQuote`**: `"We might not get the chance to vote GVTs out ourselves — Victoria may beat us to it. Fine. Either way, the money behind preference deals still isn't public. That fight doesn't end when GVTs do."`

**`proofStat.label`**: `"Primary vote that won a federal Senate seat via preference harvesting in 2013 — the loophole GVT reform may close, though the money behind such deals still wouldn't be disclosed."` (`proofStat.number: "0.51%"` and `source` unchanged — historical precedent, unaffected by current uncertainty.)

**`summary`**: `"Replace group voting tickets with direct voter-choice preference allocation — and require full disclosure of the money behind preference deals either way."`

**`seoDescription`**: `"Victoria may abolish group voting tickets before the 2026 election. Fusion's pushing for it regardless — and for full disclosure of the money behind preference deals, whichever happens first."`

**`keyPoints`**: unchanged — these describe the reform's effect in general terms and don't assert
Fusion's certainty of winning or a settled abolition timeline.

**`designRationale`, `economicLogic`, `evidenceAndPrecedent`, `systemInteraction`,
`implementationOutline`, `riskAndFailureModes`**: reworded to replace the settled-fact framing
("Fusion is using preference deals in 2026 to win a Legislative Council seat from which to
abolish them") with the same hedge used above — reform is likely, not enacted; Fusion's odds of
winning a seat are tied to whether it survives to polling day; the disclosure ask stands
regardless. Historical precedent (Ricky Muir 2013, international comparisons) stays factual and
unchanged. Exact final prose for these long fields is finalized in the migration script itself
rather than fully reproduced here, since they're detailed policy-analysis paragraphs rather than
short campaign-voice lines — the migration script diff is the review point for these.

`thisTerm` stays `true` — this remains a current-cycle ask either way.

### 3. `src/pages/convince-your-friends.astro`

Line 102, inside the `climate-anxious-friend` hardcoded fallback template:

- Before: `"Best part: They're running in winnable seats. This isn't pie-in-the-sky stuff."`
- After: `"Best part: it's a fully costed plan on the table right now — not some 20-year fantasy."`

### 4. Explicitly out of scope

- FAQ entry `why-are-you-using-the-gvt-system-if-you-want-to-abolish-it`: reviewed, already
  correctly hedged ("it exists until it doesn't... until then"). No change.
- FAQ entry `are-you-a-preference-harvesting-shell`: doesn't reference GVT status. No change.

## Implementation approach

One migration script, `scripts/migration/rally-cry-gvt-cleanup.js`, following the existing
pattern in that directory (`@sanity/client`, `SANITY_WRITE_TOKEN` env var, `client.patch(...)`
per document). It patches:

1. `homePage` document — hero title/subtitle/stats label, theftSection heading/description,
   manifestoSection stat label.
2. `policy-abolish-preference-deals` document — hook, villain, shareableQuote, proofStat.label,
   summary, seoDescription, and the six long analytical fields.

Plus a direct `Edit` to `convince-your-friends.astro` line 102.

The script is run once against the live `production` dataset after review, same as the existing
one-off scripts in `scripts/migration/`.
