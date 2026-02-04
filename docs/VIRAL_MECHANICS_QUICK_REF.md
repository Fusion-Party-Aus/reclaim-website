# Viral Mechanics Quick Reference

Quick copy-paste guide for adding viral mechanics to any page.

---

## 🚀 Quick Imports

```astro
---
// At top of any .astro file
import ShareQuoteCard from '../components/ShareQuoteCard.astro'
import ClickToTweet from '../components/ClickToTweet.astro'
import ScrollProgress from '../components/ScrollProgress.astro'
import FloatingShareButtons from '../components/FloatingShareButtons.astro'
import MemberBadge from '../components/MemberBadge.astro'
import KonamiCode from '../components/KonamiCode.astro'
import DeveloperMessages from '../components/DeveloperMessages.astro'
---
```

---

## 1. Share Quote Card

**Use when**: You have a stat, quote, or fact worth sharing

```astro
<ShareQuoteCard
  quote="Housing prices up 340%. Wages up 80%. This is theft."
  attribution="Victorian Theft Report 2024"
  category="Housing"
  policyUrl="/policies/housing"
  color="magenta"
  compact={false}
/>
```

**Colors**: `magenta` | `mint` | `yellow`  
**Props**: All optional except `quote`

---

## 2. Click-to-Tweet

**Use when**: You have a quotable one-liner

```astro
<ClickToTweet
  text="Democracy shouldn't be a spectator sport"
  hashtags={['FusionParty', 'VicVotes2026']}
  via="FusionPartyAus"
  compact={false}
/>

<!-- Or with custom content in slot -->
<ClickToTweet text="Your tweet text">
  <p>Custom formatted content here</p>
</ClickToTweet>
```

**Props**:

- `text` (required) - Tweet text
- `hashtags` - Array of hashtags (no # symbol)
- `via` - Twitter handle to mention (no @ symbol)
- `url` - Link to include in tweet
- `compact` - Smaller version

---

## 3. Scroll Progress

**Use when**: Page has long-form content (manifesto, policy, blog)

```astro
<!-- Add once at top of page -->
<ScrollProgress showMilestones={true} color="magenta" />
```

**Milestones**:

- 25%: "📖 You're getting it!"
- 50%: "💡 Halfway there!"
- 75%: "🔥 Almost done!"
- 100%: "🎉 Share what you learned!"

---

## 4. Floating Share Buttons

**Use when**: You want persistent share options

```astro
<FloatingShareButtons
  title="Fusion Party - Real Democracy"
  url="/policies/housing"
  position="left"
  compact={false}
/>
```

**Props**:

- `title` - Meta title for shares
- `url` - Override current URL
- `position` - `left` | `right`
- `compact` - Smaller buttons

**Platforms**: Twitter, Facebook, LinkedIn, Copy Link

---

## 5. Member Badge

**Use when**: User signs up or on thank-you page

```astro
<!-- For members -->
<MemberBadge memberNumber={847} showShareButtons={true} variant="hero" />

<!-- For non-members (shows signup CTA) -->
<MemberBadge />
```

**Variants**: `default` | `hero` | `compact`

**Generates**:

- Shareable badge image (1080x1080px)
- Twitter/Facebook share buttons
- Download button

---

## 6. Konami Code

**Use when**: Globally (once in BaseLayout)

```astro
<KonamiCode />
```

**Sequence**: `↑ ↑ ↓ ↓ ← → ← → B A`

**Triggers**:

- Confetti explosion
- Modal with exclusive content
- Annotated manifesto download

---

## 7. Developer Messages

**Use when**: Globally (once in BaseLayout)

```astro
<DeveloperMessages />
```

**Console Output**:

- ASCII art logo
- Styled messages
- Interactive commands
- Zero tracking proof

---

## 📍 Where Each Is Currently Used

### Homepage (`/src/pages/index.astro`)

```astro
✅ ScrollProgress ✅ FloatingShareButtons ✅ KonamiCode ✅ DeveloperMessages ✅ ShareQuoteCard (in
Victorian Theft cards) ✅ MovementMetrics
```

### Global Components

```astro
✅ KonamiCode (in all pages via BaseLayout potential) ✅ DeveloperMessages (in all pages via
BaseLayout potential)
```

### Ready to Add

```astro
📝 ClickToTweet - Add to policy pages 📝 MemberBadge - Add to signup flow 📝 ScrollProgress - Add to
manifesto 📝 FloatingShareButtons - Add to all pages
```

---

## 🎯 Common Patterns

### Policy Page Template

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import ScrollProgress from '../components/ScrollProgress.astro'
import FloatingShareButtons from '../components/FloatingShareButtons.astro'
import ShareQuoteCard from '../components/ShareQuoteCard.astro'
import ClickToTweet from '../components/ClickToTweet.astro'
---

<BaseLayout title="Housing Policy">
  <ScrollProgress color="magenta" />
  <FloatingShareButtons title="Fusion Housing Policy" />

  <article>
    <h1>Housing Policy</h1>

    <section>
      <h2>The Crisis</h2>
      <p>Victorian housing prices have increased 340%...</p>

      <ShareQuoteCard
        quote="Housing prices up 340%. Wages up 80%."
        attribution="Housing Crisis Report"
        category="Housing"
        color="magenta"
      />
    </section>

    <section>
      <h2>Our Solution</h2>
      <p>Build 50,000 social housing units...</p>

      <ClickToTweet
        text="50,000 new social housing units. This is what real policy looks like."
        hashtags={['FusionParty', 'Housing']}
      />
    </section>
  </article>
</BaseLayout>
```

### Thank You Page Template

```astro
---
import MemberBadge from '../components/MemberBadge.astro'
import ClickToTweet from '../components/ClickToTweet.astro'

// Get from signup form/database
const memberNumber = 847
---

<div class="thank-you">
  <h1>Welcome to the Movement!</h1>

  <MemberBadge memberNumber={memberNumber} variant="hero" />

  <ClickToTweet
    text={`I just became founding member #${memberNumber} of @FusionPartyAus!`}
    hashtags={['FusionParty', `Member${memberNumber}`]}
  />

  <p>Next steps: Download your badge and share it!</p>
</div>
```

### Manifesto Page Template

```astro
---
import ScrollProgress from '../components/ScrollProgress.astro'
import FloatingShareButtons from '../components/FloatingShareButtons.astro'
import ClickToTweet from '../components/ClickToTweet.astro'
---

<ScrollProgress showMilestones={true} color="mint" />

<FloatingShareButtons title="Fusion Party Manifesto 2026" position="left" />

<article>
  <!-- Long-form manifesto content -->

  <section>
    <h2>Core Values</h2>
    <blockquote>Democracy shouldn't be a spectator sport.</blockquote>

    <ClickToTweet text="Democracy shouldn't be a spectator sport. Join the movement." />
  </section>
</article>
```

---

## 🎨 Color Guidelines

### When to Use Each Color

**Magenta (#C926F2)**:

- Primary actions
- Member badges
- Urgent messages
- Political content

**Mint (#5EFFD8)**:

- Community content
- Environmental policies
- Positive messages
- Secondary actions

**Yellow (#FFED00)**:

- Highlights
- Achievements
- Milestones
- Celebrations

---

## 📊 Analytics Tracking

All viral components automatically track events when available:

```javascript
// Check if Plausible is available
if (window.plausible) {
  window.plausible('Event Name', {
    props: { key: 'value' },
  })
}
```

**Events Tracked**:

- `Share` - Platform, page URL
- `Konami Code` - Activation
- `Scroll Milestone` - Percentage
- `Member Badge Download` - Member number
- `Quote Card Share` - Quote text

---

## 🐛 Common Issues

### "Module not found"

**Problem**: Import path is wrong  
**Fix**: Check if component is in `/src/components/` or `/src/components/ui/`

### Share buttons open popup blockers

**Problem**: Browser blocking popups  
**Fix**: This is expected - users need to allow popups or use "Open in new tab"

### Animations not triggering

**Problem**: JavaScript not loaded  
**Fix**: Check browser console for errors, ensure `<script>` tags are present

### Milestones not firing

**Problem**: Page too short to scroll  
**Fix**: ScrollProgress needs scrollable content (>2 viewport heights)

---

## 💡 Pro Tips

### 1. Stack Viral Mechanics

Don't use just one - use multiple:

```astro
<ScrollProgress />
<FloatingShareButtons />
<!-- Content with ShareQuoteCard and ClickToTweet -->
```

### 2. Make Everything Shareable

Add share button to:

- Every stat
- Every quote
- Every achievement
- Every milestone

### 3. Personalize When Possible

```astro
<!-- Generic -->
<ShareQuoteCard quote="Join the movement" />

<!-- Personal -->
<ShareQuoteCard quote="I'm member #847 of the movement" />
```

### 4. Test Mobile First

All components are responsive, but test on real devices:

- Share buttons: Horizontal on mobile
- Member badge: Downloads work on mobile
- Konami Code: Works with on-screen keyboards

### 5. Monitor and Iterate

Track which mechanics work:

- Most shared platform?
- Most downloaded badges?
- Highest scroll completion?

Then double down on what works.

---

## 🚀 Ready-to-Copy Examples

### Homepage Hero with Member Badge

```astro
<section class="hero">
  <h1>Join the Movement</h1>

  <MemberBadge memberNumber={847} variant="hero" />

  <ClickToTweet
    text="I just joined @FusionPartyAus as founding member #847!"
    hashtags={['FusionParty', 'Member847']}
  />
</section>
```

### Policy Stats Section

```astro
<section class="stats">
  <div class="stat">
    <h3>$1,200/month</h3>
    <p>Goes to landlords instead of savings</p>

    <ShareQuoteCard
      quote="$1,200/month goes to landlords instead of your savings"
      category="Housing"
      color="magenta"
      compact={true}
    />
  </div>
</section>
```

### Long-Form Article

```astro
<ScrollProgress showMilestones={true} color="mint" />
<FloatingShareButtons position="left" />

<article>
  <h1>Article Title</h1>

  <p>Intro paragraph...</p>

  <ClickToTweet text="Key quote from article" />

  <p>More content...</p>

  <ShareQuoteCard quote="Important statistic" attribution="Research Source" />
</article>
```

---

## 📚 Related Docs

- [Complete Viral Mechanics Guide](./VIRAL_MECHANICS_COMPLETE.md)
- [Testing Guide](../TESTING_VIRAL_FEATURES.md)
- [Component Library](./COMPONENT_LIBRARY.md)

---

**Quick Start**: Copy one of the templates above, adjust the content, and you're done! Every viral mechanic is designed to be drop-in ready.

🎯 **Goal**: Make every page shareable, every stat quotable, every interaction rewarding.
