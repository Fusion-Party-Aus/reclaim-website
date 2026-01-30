# Testing Viral Features - Quick Guide

Quick guide to test all the viral growth mechanics on your local site.

## 🚀 Start Dev Server

```bash
npm run dev
```

Visit: `http://localhost:4321`

---

## 1️⃣ Movement Metrics Widget

**Location**: Homepage, right after the hero section

**What to Check**:
- [ ] Counters animate from 0 to target numbers (2 seconds)
- [ ] Progress bars fill with shimmer effect
- [ ] "🔥 Almost There!" badge shows for metrics at 90%+
- [ ] Motivation message appears at bottom
- [ ] Overall progress percentage calculates correctly
- [ ] Responsive on mobile (test by resizing browser)

**Expected Data**:
- Members: 847 / 1,000 (85%)
- Volunteers: 234 / 320 (73%)
- Candidates: 12 / 88 (14%)
- Donations: $4,250 / $10,000 (43%)

**Screenshot This**: The "Almost There!" milestone badge is perfect for social media

---

## 2️⃣ Konami Code Easter Egg

**How to Trigger**:
1. Go to any page on the site
2. Make sure the page is focused (click anywhere)
3. Type the Konami Code: **`↑ ↑ ↓ ↓ ← → ← → B A`**
   - Use arrow keys on keyboard
   - Then press `B` key
   - Then press `A` key

**What Should Happen**:
- [ ] Confetti explosion (150 particles in brand colors)
- [ ] Modal appears with heading "You Found the Secret!"
- [ ] Shows annotated manifesto offer
- [ ] GitHub link visible
- [ ] Zero tracking message
- [ ] Close button works (X or click outside)

**Pro Tip**: This is SUPER shareable. When someone discovers it, they'll post about it.

---

## 3️⃣ Developer Console Messages

**How to See**:
1. Open browser DevTools
   - **Chrome/Edge**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - **Firefox**: Press `F12` or `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)
   - **Safari**: Enable Developer menu first, then `Cmd+Option+C`

2. Click **"Console"** tab

**What to Check**:
- [ ] ASCII art Fusion logo appears
- [ ] Styled welcome message with box drawing characters
- [ ] Colored console messages (magenta, mint, yellow)
- [ ] Easter egg hint appears
- [ ] Tracking verification message
- [ ] GitHub repository link
- [ ] Interactive commands listed

**Interactive Commands to Try**:
```javascript
// In console, type these:
window.__FUSION__              // See site metadata
window.fusionStats()           // View component stats table
window.compareToPoliticians()  // Side-by-side comparison table
window.democracy.build()       // Interactive democracy builder
```

**Expected Output**:
- `__FUSION__` shows: version, framework, tracking status, stats
- `fusionStats()` shows: Components (11), Tests (41), Coverage (91%)
- `compareToPoliticians()` shows: Fusion vs Major Parties comparison
- `democracy.build()` shows: 4-step guide to getting involved

**Screenshot This**: The ASCII art logo and comparison table are very shareable

---

## 4️⃣ Share Quote Cards

**Where to Add**:
Currently a reusable component. Add to any page:

```astro
---
import ShareQuoteCard from '../components/ShareQuoteCard.astro'
---

<ShareQuoteCard 
  quote="Housing prices up 340%. Wages up 80%. This is theft."
  attribution="Housing Crisis Report 2024"
  category="Housing"
  policyUrl="/policies/housing"
  color="magenta"
/>
```

**What to Check**:
- [ ] "📤 Share" button appears
- [ ] Click opens modal with preview
- [ ] Canvas generates image (1200x630px)
- [ ] Twitter share button works
- [ ] Facebook share button works
- [ ] LinkedIn share button works
- [ ] Download button saves PNG
- [ ] Copy URL button works
- [ ] Close modal works

**Test Quote**:
```astro
<ShareQuoteCard 
  quote="Every Australian deserves a home they can afford"
  attribution="Fusion Party Housing Policy"
  category="Housing"
  color="magenta"
/>
```

---

## 5️⃣ Convince Your Friends Templates

**Location**: `/convince-your-friends` page (already built)

**What to Check**:
- [ ] 6 templates visible
- [ ] Each template has icon and audience label
- [ ] Click to expand/collapse works
- [ ] Copy button copies text to clipboard
- [ ] "✓ Copied!" confirmation appears
- [ ] Channel filter buttons work (Email, Text, Social, LinkedIn)
- [ ] Textarea is editable
- [ ] "Share Your Success" form visible at bottom
- [ ] Tips section appears

**Test Copy Function**:
1. Click any template to expand
2. Click "Copy to Clipboard" button
3. Open a text editor
4. Paste (`Cmd+V` or `Ctrl+V`)
5. Text should appear

---

## 🐛 Troubleshooting

### Konami Code Not Working

**Problem**: Nothing happens when I enter the code  
**Solution**: 
1. Make sure page is focused (click anywhere on page first)
2. Use arrow keys, not WASD
3. Type the full sequence: ↑ ↑ ↓ ↓ ← → ← → B A
4. Don't press keys too fast (1 key per second is fine)
5. Check console for errors (`F12` → Console tab)

### Console Messages Not Appearing

**Problem**: DevTools console is empty  
**Solution**:
1. Make sure you're on the Console tab (not Elements or Network)
2. Refresh the page (`Cmd+R` or `Ctrl+R`)
3. Check if console is filtered (remove any filters)
4. Make sure JavaScript is enabled

### Movement Metrics Not Animating

**Problem**: Numbers appear but don't count up  
**Solution**:
1. Scroll the metrics widget into view (animation triggers on scroll)
2. Refresh the page and scroll again
3. Check browser console for errors
4. Try a different browser

### Share Quote Card Not Generating Image

**Problem**: Modal opens but preview is empty  
**Solution**:
1. Check browser console for Canvas errors
2. Some browsers block Canvas API - try Chrome/Firefox
3. Make sure all props are provided (quote, attribution, category)

---

## 📸 Screenshots for Social Media

### Best Moments to Capture

1. **Movement Metrics at 90%+**
   - Shows "Almost There!" badge
   - Progress bars nearly full
   - Creates FOMO

2. **Konami Code Modal**
   - Confetti mid-explosion
   - Modal with exclusive content offer
   - "You found the secret!" heading

3. **Console ASCII Art**
   - Full logo and styled messages
   - `compareToPoliticians()` table output
   - Zero tracking verification

4. **Share Quote Card Preview**
   - Generated image in modal
   - Shows branding and QR code
   - Professional-looking card

### Hashtags to Use

```
#FusionParty
#VicVotes2026
#OpenSourcePolitics
#TransparencyWins
#PeoplePower
```

---

## 🎯 What Makes This Viral

### Movement Metrics
- **Psychology**: Tipping point urgency ("almost there!")
- **Social Proof**: Real numbers, not vague claims
- **Sharability**: Milestone achievements are inherently shareable

### Konami Code
- **Nostalgia**: Gaming culture connection
- **Discovery**: "Look what I found!" posts
- **Exclusivity**: Rewards the curious

### Developer Messages
- **Respect**: Treats devs as allies, not users
- **Proof**: Zero tracking is verifiable
- **Recruitment**: Turns inspectors into contributors

### Share Quote Cards
- **Friction-Free**: One click to share
- **Branded**: Every share is free advertising
- **QR Code**: Brings traffic back to site

### Templates
- **Removes Paralysis**: "What do I say?" → Pre-written
- **Audience-Specific**: Different tones for different people
- **Feedback Loop**: Success stories create case studies

---

## ✅ Testing Checklist

Print this out or keep it open while testing:

### Homepage
- [ ] Movement Metrics section appears after hero
- [ ] Counters animate on scroll
- [ ] Progress bars fill with shimmer
- [ ] Milestone badges show correctly
- [ ] Motivation message appears

### Global (All Pages)
- [ ] Konami Code works (`↑ ↑ ↓ ↓ ← → ← → B A`)
- [ ] Confetti explodes
- [ ] Modal opens and closes
- [ ] Console messages appear on page load
- [ ] Interactive console commands work

### Components
- [ ] ShareQuoteCard generates images
- [ ] All social share buttons work
- [ ] Download PNG works
- [ ] Copy URL works

### Performance
- [ ] Page loads under 2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] Mobile responsive

---

## 🚢 Before Deploying

1. **Test All Features**
   - [ ] Go through this entire checklist
   - [ ] Test on Chrome, Firefox, Safari
   - [ ] Test on mobile (real device or DevTools mobile view)

2. **Update Dummy Data**
   - [ ] Change metrics in `src/pages/index.astro` (movementMetrics array)
   - [ ] Update goals as you reach them

3. **Configure Integrations**
   - [ ] Add Formspree form ID (Convince Your Friends feedback)
   - [ ] Create annotated manifesto PDF (for Konami Code download)
   - [ ] Set up analytics tracking (if using)

4. **Social Media Prep**
   - [ ] Take screenshots of best moments
   - [ ] Write launch tweets/posts
   - [ ] Prepare "I found the easter egg" response templates
   - [ ] Set up monitoring for mentions

---

## 🤝 Share Your Findings

Found something cool? Share it!

- **Twitter/X**: Tag `@FusionPartyAus` with `#FusionParty`
- **GitHub**: Open an issue or PR
- **Email**: tech@fusionparty.org.au

---

**Remember**: These features are designed to be discovered and shared. The more people explore, the more they'll talk about it. That's the whole point! 🎯

Now go test that Konami Code... 🎮
