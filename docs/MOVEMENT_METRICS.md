# Movement Metrics Component

## Overview
An animated, gamified widget showing party growth metrics with progress bars and counters.

## Features
- ✅ Animated counters (count up from 0 to target)
- ✅ Animated progress bars with shimmer effect
- ✅ Overall progress calculation
- ✅ Milestone badges ("🔥 Almost There!" at 90%+)
- ✅ Dynamic motivation messages based on progress
- ✅ Neo-brutalist design with brand colors
- ✅ Intersection Observer for lazy animation
- ✅ Responsive grid layout

## Usage

### Basic Usage
```astro
---
import { MovementMetrics } from '../components/ui';

const metrics = [
  {
    label: 'Members',
    current: 847,
    goal: 1000,
    icon: '👥',
    color: 'magenta',
  },
  {
    label: 'Volunteers',
    current: 234,
    goal: 320,
    icon: '🤝',
    color: 'mint',
  },
  {
    label: 'Candidates',
    current: 12,
    goal: 88,
    icon: '🗳️',
    color: 'yellow',
    suffix: ' electorates'
  },
  {
    label: 'Donations (This Month)',
    current: 4250,
    goal: 10000,
    icon: '💰',
    color: 'magenta',
    prefix: '$',
  },
];
---

<MovementMetrics metrics={metrics} />
```

### Compact Mode
```astro
<MovementMetrics metrics={metrics} compact={true} />
```

### Without Motivation Message
```astro
<MovementMetrics metrics={metrics} showMotivation={false} />
```

## Props

### `metrics` (required)
Array of metric objects with the following structure:

```typescript
interface Metric {
  label: string;        // Display label (e.g., "Members")
  current: number;      // Current value (will animate to this)
  goal: number;         // Target goal
  icon: string;         // Emoji icon
  color: 'magenta' | 'mint' | 'yellow';  // Brand color
  suffix?: string;      // Optional suffix (e.g., " votes", " electorates")
  prefix?: string;      // Optional prefix (e.g., "$", "~")
}
```

### `showMotivation` (optional)
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Shows dynamic motivation message based on overall progress

### `compact` (optional)
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Reduces padding and uses 2-column grid instead of 4

## Animation Details

### Counters
- Duration: 2 seconds
- Easing: Linear with 60 steps
- Staggered: Each counter delayed by 100ms * index
- Number formatting: Uses `toLocaleString()` for comma separators

### Progress Bars
- Duration: 2 seconds
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Shimmer effect: 2s infinite linear animation
- Staggered: Each bar delayed by 100ms * index

### Intersection Observer
- Threshold: 20% of element visible
- Purpose: Triggers animation when scrolled into view
- Fallback: Runs immediately if IntersectionObserver not supported

## Color Scheme

### Magenta (#C926F2)
- Use for: Primary metrics (members, donations)
- Creates high-energy, attention-grabbing cards

### Mint (#5EFFD8)
- Use for: Community metrics (volunteers, events)
- Fresh, collaborative feeling

### Yellow (#FFED00)
- Use for: Achievement metrics (candidates, victories)
- Optimistic, celebratory tone

## Motivation Messages

Dynamic messages based on overall progress:

| Progress | Message |
|----------|---------|
| 0-49% | 🌱 Every movement starts somewhere. Join us! |
| 50-74% | 📈 Momentum is building. Be part of it! |
| 75-89% | 🚀 We're gaining speed. Don't miss out! |
| 90-100% | ⚡ This is happening. History is being made! |

## Milestone Badges

Automatically displays "🔥 Almost There!" badge when any metric reaches 90%+.

## Psychological Principles

### 1. **Transparency Builds Trust**
- Real numbers, not vague claims
- Progress bars show honest state

### 2. **Tipping Point Psychology**
- "Almost there!" creates urgency
- 90%+ triggers FOMO

### 3. **Social Proof**
- "847 members" shows legitimacy
- Numbers validate the movement

### 4. **Gamification**
- Progress bars create game-like engagement
- Goals provide clear targets

### 5. **Participation Motivation**
- "Be part of this" narrative
- Every number is a person

## Real-World Examples

### Homepage Widget (Primary)
```astro
<!-- Above the fold, right after hero -->
<Section padding="xl" background="white">
  <div class="max-w-6xl mx-auto">
    <MovementMetrics metrics={liveMetrics} />
  </div>
</Section>
```

### Get Involved Page (Compact)
```astro
<!-- Sidebar or above signup form -->
<MovementMetrics 
  metrics={compactMetrics} 
  compact={true}
  showMotivation={false}
/>
```

### Campaign Page (Custom)
```astro
<!-- Electorate-specific metrics -->
<MovementMetrics 
  metrics={[
    {
      label: 'Volunteers Signed Up',
      current: 45,
      goal: 100,
      icon: '🙋',
      color: 'mint',
    },
    {
      label: 'Doors Knocked',
      current: 1240,
      goal: 5000,
      icon: '🚪',
      color: 'magenta',
    },
  ]} 
/>
```

## Data Sources

### Static (Simple)
```astro
---
const metrics = [
  { label: 'Members', current: 847, goal: 1000, icon: '👥', color: 'magenta' },
];
---
```

### Dynamic (Sanity CMS)
```astro
---
import { getMetrics } from '../lib/sanity';
const metricsData = await getMetrics();
---
```

### Real-Time (API)
```astro
---
// Fetch from your backend
const response = await fetch('https://api.fusionparty.org.au/metrics');
const metrics = await response.json();
---
```

## Best Practices

### Update Frequency
- **Weekly**: For member counts, volunteer signups
- **Daily**: For campaign metrics (doors knocked, calls made)
- **Monthly**: For donation goals
- **Real-time**: Only if you have the infrastructure

### Goal Setting
- Make goals **achievable** (70-90% likely)
- Update goals as you reach them (builds momentum)
- Celebrate milestones publicly

### Transparency
- Don't inflate numbers
- Be consistent with updates
- Explain methodology if asked

### Placement
- **Homepage**: Above the fold or after hero section
- **Get Involved**: Before signup form
- **Campaign Pages**: Electorate-specific metrics
- **Thank You Pages**: "You're #847!" personalization

## Customization Examples

### Campaign Countdown
```astro
const daysToElection = Math.ceil(
  (new Date('2026-11-28') - new Date()) / (1000 * 60 * 60 * 24)
);

const metrics = [
  {
    label: 'Days to Election',
    current: daysToElection,
    goal: 365,
    icon: '📅',
    color: 'yellow',
    suffix: ' days',
  },
];
```

### Petition Signatures
```astro
const metrics = [
  {
    label: 'Petition Signatures',
    current: 3456,
    goal: 5000,
    icon: '✍️',
    color: 'mint',
  },
];
```

### Event Attendance
```astro
const metrics = [
  {
    label: 'RSVP\'d for Rally',
    current: 234,
    goal: 500,
    icon: '🎤',
    color: 'magenta',
  },
];
```

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels on progress bars
- ✅ High contrast colors
- ✅ Keyboard navigation (no interactive elements)
- ✅ Screen reader friendly (numbers are readable)

## Performance

- **Initial Load**: ~2KB (component + styles)
- **Animation**: GPU-accelerated (transforms only)
- **Intersection Observer**: Lazy loads animation
- **No Dependencies**: Pure vanilla JS

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS 14+, Android 5+)
- ⚠️ IE11: No animations, shows final state

## Testing Checklist

- [ ] Counters animate from 0 to target
- [ ] Progress bars fill to correct percentage
- [ ] Overall progress calculates correctly
- [ ] Milestone badges appear at 90%+
- [ ] Motivation message changes with progress
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations trigger when scrolled into view
- [ ] No layout shift during animation
- [ ] Numbers format with commas
- [ ] Colors match brand palette

## Future Enhancements

- [ ] Add "Share Milestone" button at 100%
- [ ] Confetti animation when goal reached
- [ ] Historical chart (sparklines)
- [ ] Live updates via WebSocket
- [ ] Personalized messaging ("You're supporter #847!")
- [ ] Leaderboard (top electorates)
- [ ] Time-to-goal prediction

---

**Pro Tip**: When you hit a milestone, make it an event! Tweet about it, email supporters, update the metrics. Momentum is everything in grassroots organizing.
