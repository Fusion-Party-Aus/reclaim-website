### Stack Integrity Rule (Applies to All Tiers)

> **Each tier must be readable in isolation without performing another tier’s job.**

If a sentence could sit comfortably in another tier, it does **not** belong where it is.

---

# Tier-0 Style Rule — Categories & Slogans

## T0 Purpose

Tier-0 exists to establish _orientation_, not policy detail. It signals **what domain is being addressed** and **why it matters at a civic level**.

## What Tier-0 Is

Tier-0 consists of:

- **Primary Category Headers** (e.g. _RECLAIM OUR ECONOMY_)
- **Sub-headers / Slogans** (e.g. _Restore the Fair Go_)

These frame the section emotionally and thematically, not operationally.

## T0 Mandatory Structure

Every Tier-0 element must:

- Be **short and declarative**
- Use **collective language** (“our”, “we”, “Australia”)
- Refer to a **system, domain, or shared outcome**, not a policy

## T0 Prohibited Content

Tier-0 must **not** include:

- Specific policies or actions
- Promises or commitments
- Numeric targets
- Technical or economic terminology
- Moral accusations or assignment of blame

If a phrase could plausibly appear in a policy document or budget paper, it does **not** belong in Tier-0.

## T0 Language Rules

Allowed:

- Broad civic language
- Shared values
- Directional themes

Avoid:

- Verbs that imply delivery or implementation
- Adjectives that require justification
- Ideological or factional language

## T0 Acceptance Test

A Tier-0 phrase is valid if:

- It can be understood without policy literacy
- It remains accurate even if specific policies change
- It answers _“What area are we talking about?”_ rather than _“What are we doing?”_

---

# Tier-1 Style Rule — Hook Statements (Action Claims)

## T1 Purpose

Tier-1 exists to **capture attention** and **signal intent** to people with minimal political engagement.

## What Tier-1 Is

Tier-1 consists of **single-line action statements** that:

- Are immediately intelligible
- Directly relate to everyday concerns
- Communicate _what will change_ without explanation

## T1 Mandatory Structure

Every Tier-1 statement must:

- Be **one sentence or clause**
- Use **plain, non-technical language**
- Be **specific enough to be testable**, but not explanatory

## T1 Prohibited Content

Tier-1 must **not** include:

- Mechanisms or processes
- Justifications or explanations
- Conditional language
- Multi-part constructions

If a statement explains _why_ or _how_, it belongs in a lower tier.

## T1 Language Rules

Allowed:

- Direct action verbs
- Common vocabulary
- Familiar policy labels (e.g. “UBI”, “high-speed rail”)

Avoid:

- Abstract nouns
- Bureaucratic phrasing
- Compound commitments

## T1 Acceptance Test

A Tier-1 statement is valid if:

- A disengaged reader can understand it in under 3 seconds
- It can be quoted without additional context
- It answers _“What are you going to do?”_ — nothing more

---

# Tier-2 Style Rule — Mechanistic “How” Statements

## T2 Purpose

Tier-2 exists to describe **the structural change being made** without arguing for it.

## What Tier-2 Is

Tier-2 consists of **plain mechanical descriptions** of how a policy operates or what system component it replaces.

It describes:

- Inputs
- Flows
- Replacements
- Scope

## T2 Mandatory Structure

Every Tier-2 statement must:

- Describe **only mechanics or structure**
- Be intelligible to a layperson
- Avoid claims about benefit or success

## T2 Prohibited Content

Tier-2 must **not** include:

- Outcomes or benefits
- Moral or emotional language
- Value judgements
- Phrases such as “to ensure”, “so that”, or “providing”

If a sentence persuades, it is doing too much.

## T2 Language Rules

Allowed:

- Neutral descriptive language
- Clear nouns and verbs
- Simple sentence structure

Avoid:

- Adjectives that imply goodness or fairness
- Normative claims
- Forecasts or promises

## T2 Acceptance Test

A Tier-2 statement is valid if:

- It can be followed up with “Why?” without already answering
- It reads like system wiring, not advocacy
- Removing it would make the policy unclear, not unconvincing

---

# Tier-3 Style Rule — Surface Justifications

## T3 Purpose

Tier-3 exists to explain _why a policy works_ without describing _how it works_ or _how it will be implemented_.

It translates system reform into outcomes that are intelligible, credible, and coherent for a general audience.

## What Tier-3 Is

Tier-3 consists of **atomic justification statements** that describe the _intended outcomes_ of a policy.

Each dotpoint answers:

> **“What positive outcome will this system change produce?”**

## T3 Mandatory Structure

Every Tier-3 dotpoint must:

- Be a **single, complete sentence**
- Be **future-oriented** (describing outcomes that will occur)
- Use **benefit-first construction**
  _(state the outcome before the cause wherever possible)_
- Use **positive framing**
  _(describe what is created or enabled, not what is prevented or avoided)_

## T3 Prohibited Content

Tier-3 dotpoints must **not** include:

- Implementation detail
- Mechanisms, processes, or delivery methods
- Funding or cost language
- Administrative steps
- Appeals to emotion or moral obligation
- Phrases that belong in Tier-2 (e.g. “paid”, “replaced”, “introduced”, “set at”)

If a sentence explains _how_ something is done, it does **not** belong in Tier-3.

## T3 Language Rules

Allowed:

- Neutral declarative statements
- Outcomes expressed as future states
- Clear, concrete benefits

Avoid:

- Present-tense assertions (“creates”, “ensures”)
- Repetitive sentence leads (e.g. beginning every point with “Will”)
- Negative framing (“prevent”, “stop”, “avoid”)
- Adjectives that signal persuasion rather than explanation

## T3 Atomicity Rule

Each dotpoint must express **one outcome only**.

If two outcomes appear in the same sentence, the dotpoint must be split.

## T3 Acceptance Test

A Tier-3 dotpoint is valid if:

- It can be debated as an outcome without reference to implementation
- It does not require another dotpoint to make sense
- It does not persuade by emotion alone
- Removing the sentence does not affect the operational meaning of Tier-2

If a reader can ask _“But how?”_ and the sentence already answers, it is **not Tier-3**.

---

Here is the **cleaned, final Tier-4 style rule**, written to match the tone, precision, and enforceability of the Tier-0–Tier-3 rules already in your reference guide.

This is ready to be inserted verbatim.

---

# Tier-4 Style Rule — Further Detail

## T4 Purpose

Tier-4 exists to provide **optional depth** for readers who want to understand a policy in more detail without interrupting or complicating the primary message.

Tier-4 must support scrutiny and understanding, not persuasion.

## What Tier-4 Is

Tier-4 is a **collapsible, supplementary layer** containing contextual and analytical information that expands on a policy for discerning readers.

It is **non-essential** to understanding the policy at higher tiers.

## T4 Mandatory Format

Tier-4 **must** be implemented using a native HTML disclosure block:

```markdown
<details>
<summary><strong>Further Detail</strong></summary>

---

[Tier-4 content]

---

</details>
```

## T4 Visibility Rules

- Tier-4 **must be collapsed by default**
- Users must explicitly opt in by expanding the block
- Removing Tier-4 must not affect comprehension of Tier-0 through Tier-3 content

## T4 Content Rules

Tier-4 **may include**:

- Design rationale and high-level trade-offs
- System and institutional interaction notes
- Economic or incentive logic
- Known risks and failure modes
- Evidence, precedent, or modelling references
- High-level implementation context (non-procedural)
- Implementation outline describing phases, dependencies, and order of operations

Tier-4 **must not include**:

- Slogans, hooks, or moral framing
- Repetition of Tier-1, Tier-2, or Tier-3 content
- New commitments or policy expansion
- Emotional or persuasive language
- Step-by-step detail such as operational runbooks, internal procedural steps, or volatile delivery minutiae

## T4 Structural Rules

- Tier-4 must appear **after Tier-3 dotpoints and before the next Tier-1 header**
- Tier-4 must not be nested inside lists
- Tier-4 must not introduce additional tiers or headings
- Use bold labels (not markdown headings) for internal section names

## T4 Language Rules

Allowed:

- Informational, neutral tone
- Explicit acknowledgement of uncertainty or risk
- Clear, restrained technical language

Avoid:

- Rhetorical devices
- Value judgements
- Present-tense claims of success

## T4 Acceptance Test

A Tier-4 block is valid if:

- It can be removed without weakening the argument or structure of higher tiers
- It improves confidence without attempting persuasion
- It satisfies scrutiny rather than winning agreement

## T4 Canonical Label

All Tier-4 blocks must use the summary label:

**“Further Detail”**

No alternatives are permitted.

## Tier-4 Boundary Rule

> **Tier-4 exists to satisfy scrutiny, not to strengthen the message.
> If it persuades, it has failed.**

---

---

# Policy Stack Compliance Checklist

Use this checklist to review **each policy entry** before acceptance.

A policy **must pass every relevant tier**.

No interpretation, no debate, no vibes — each item is **pass / fail**.

---

## Tier-0 — Categories & Slogans

_(Orientation & framing)_

**PASS only if ALL are true:**

- ☐ Uses collective civic language (“our”, “Australia”, “we”)
- ☐ Contains **no policy actions or commitments**
- ☐ Makes sense without reference to any specific reform
- ☐ Frames a _system, domain, or shared outcome_
- ☐ Would still be accurate if individual policies changed

**AUTO-FAIL if ANY are present:**

- Specific verbs implying delivery or action
- Numbers, targets, or metrics
- Technical or sectoral jargon
- Assignment of blame

---

## Tier-1 — Hook Statements

_(Action signals)_

**PASS only if ALL are true:**

- ☐ Single sentence or clause
- ☐ Understandable in < 3 seconds by a disengaged reader
- ☐ Clearly states _what will be done_
- ☐ Can be quoted without additional explanation
- ☐ Does **not** explain how or why

**AUTO-FAIL if ANY are present:**

- Mechanisms, processes, or structure
- Conditional phrasing (“by”, “through”, “so that”)
- Multiple actions or bundled commitments
- Abstract or bureaucratic language

---

## Tier-2 — Mechanistic “How” Statements

_(Structural description)_

**PASS only if ALL are true:**

- ☐ Describes **only** structure, flow, or replacement
- ☐ Uses neutral, non-evaluative language
- ☐ Explains how the policy operates at a basic level
- ☐ Intelligible to a lay reader without persuasion

**AUTO-FAIL if ANY are present:**

- Outcomes or benefits
- Moral or emotive language
- Claims about effectiveness or success
- Phrases like “to ensure”, “so that”, “providing”

---

## Tier-3 — Surface Justifications

_(Why it works)_

**PASS only if ALL are true:**

- ☐ Each dotpoint is a single, complete sentence
- ☐ Future-oriented outcome framing
- ☐ Positive, benefit-first construction
- ☐ No mechanisms, processes, or delivery detail
- ☐ Each dotpoint expresses **one outcome only**

**AUTO-FAIL if ANY are present:**

- Present-tense assertions
- Repetitive sentence openings
- Negative framing (prevent, stop, avoid)
- Implicit how-statements
- Compound outcomes

---

## Tier-4 — Further Detail

_(Optional depth & scrutiny support)_

**PASS only if ALL are true:**

- ☐ Enclosed in a `<details>` block with the summary label **“Further Detail”**
- ☐ Collapsed by default and requires user action to expand
- ☐ Positioned **after Tier-3 dotpoints and before the next Tier-1 header**
- ☐ Fully removable without affecting understanding of Tier-0 through Tier-3
- ☐ Expands confidence or understanding rather than attempting persuasion
- ☐ Contains only contextual, analytical, or explanatory material
- ☐ Uses bold labels (not markdown headings) for internal sections

**AUTO-FAIL if ANY are present:**

- Step-by-step operational runbooks or procedural instructions
- Internal agency workflows or volatile delivery minutiae
- New commitments, promises, or policy scope expansion
- Repetition of Tier-1 hooks, Tier-2 mechanics, or Tier-3 outcomes
- Emotional, moral, or rhetorical language
- Present-tense claims implying current success
- Slogans or campaign messaging
- Nested tiers or additional heading levels

### Tier-4 Content Boundary Check

A Tier-4 block **fails** if:

- ☐ It feels like “the real policy” rather than supporting context
- ☐ Removing it weakens the clarity or credibility of Tier-3
- ☐ It answers _“Why should I support this?”_ rather than _“How does this stand up to scrutiny?”_
- ☐ It could reasonably be read aloud in a speech

### Tier-4 Implementation Discipline Check

**PASS only if ALL are true:**

- ☐ Any implementation material is limited to a **high-level outline**
  _(phases, dependencies, order of operations)_
- ☐ No individual step is sufficiently detailed to be executed directly
- ☐ Detailed delivery instructions are **referenced externally** (Delivery Plan), not embedded

### Tier-4 Final Acceptance Rule

> **Tier-4 content is accepted only if it supports scrutiny without influencing persuasion,
> and can be removed without weakening the policy stack.**

If Tier-4 content fails:

- It is trimmed back to outline level, or
- Moved into a separate Delivery Plan document, or
- Rejected outright.

---

## Cross-Tier Integrity Check

_(Stack discipline)_

**PASS only if ALL are true:**

- ☐ No sentence could comfortably belong in a different tier
- ☐ Removing Tier-3 does not alter how Tier-2 functions
- ☐ Removing Tier-2 does not alter why Tier-3 exists
- ☐ Tier-1 still makes sense on its own

**AUTO-FAIL if ANY are present:**

- Repetition of the same idea across tiers
- Tier-1 requiring explanation to understand "what"
- Tier-2 persuading rather than describing
- Tier-3 explaining mechanics

---

## Final Acceptance Rule

> **A policy is accepted only if every applicable tier passes its checklist without exception.**

Policy entries that fail:

- Are revised downward (remove detail), or
- Revised upward (move content to the correct tier), or
- Rejected outright
