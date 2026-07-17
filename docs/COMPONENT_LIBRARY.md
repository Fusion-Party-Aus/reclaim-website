# Component Library Documentation

## Overview

This component library provides a consistent set of reusable UI components for the Reclaim Democracy website. All components follow neo-brutalist design principles with bold borders, flat shadows, and vibrant colors.

## Design Principles

- **Neo-brutalism**: Bold 4-8px borders, flat shadows, high contrast
- **Consistency**: Standardized props, predictable behavior
- **Accessibility**: ARIA labels, keyboard navigation, reduced motion support
- **Type Safety**: Full TypeScript interfaces for all props
- **Flexibility**: Extensive variant systems for customization

## Component Index

1. [BrutalCard](#brutalcard) - Reusable card component
2. [BrutalButton](#brutalbutton) - Button and link component
3. [BrutalBadge](#brutalbadge) - Badge/tag component
4. [FloatingIcon](#floatingicon) - Animated background decoration
5. [Section](#section) - Page section wrapper
6. [Grid](#grid) - Responsive grid layouts
7. [CTA](#cta) - Call-to-action boxes
8. [Breadcrumb](#breadcrumb) - Breadcrumb navigation
9. [StatCard](#statcard) - Statistic display
10. [IconBadge](#iconbadge) - Icon with badge background

---

## BrutalCard

Reusable neo-brutalist card component with variants, shadows, and rotations.

### Props

```typescript
interface Props {
  variant?: 'white' | 'magenta' | 'mint' | 'yellow' | 'lavender' | 'black'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  borderWidth?: 'sm' | 'md' | 'lg'
  shadowSize?: '4' | '6' | '8' | '12'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rotation?: -3 | -2 | -1 | 0 | 1 | 2 | 3
  hover?: boolean
  class?: string
}
```

### Usage Examples

```astro
<!-- Basic white card -->
<BrutalCard>
  <h2>Card Title</h2>
  <p>Card content goes here.</p>
</BrutalCard>

<!-- Magenta card with large shadow and rotation -->
<BrutalCard variant="magenta" shadow="lg" rotation={2}>
  <h2 class="text-white">Featured Content</h2>
</BrutalCard>

<!-- Mint card with hover effect -->
<BrutalCard variant="mint" hover={true} padding="xl">
  <h3>Hover over me!</h3>
</BrutalCard>
```

### Variants

- **white**: White background, black text (default)
- **magenta**: Magenta background, white text
- **mint**: Mint background, black text
- **yellow**: Yellow background, black text
- **lavender**: Lavender background, black text
- **black**: Black background, white text

### Best Practices

- Use `white` for main content cards
- Use `magenta` for primary CTAs or featured content
- Use `mint` for success states or secondary highlights
- Enable `hover` for interactive cards
- Add slight `rotation` for visual interest (keep between -2 and 2)

---

## BrutalButton

Button and link component with multiple variants and sizes.

### Props

```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'yellow' | 'mint' | 'magenta' | 'white' | 'black'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  class?: string
}
```

### Usage Examples

```astro
<!-- Primary CTA button -->
<BrutalButton variant="primary" size="lg"> Join Reclaim </BrutalButton>

<!-- Button with icon -->
<BrutalButton variant="secondary" icon="mdi:download"> Download Policy </BrutalButton>

<!-- Link button -->
<BrutalButton href="/about" variant="mint"> Learn More </BrutalButton>

<!-- Full-width button with icon on right -->
<BrutalButton variant="magenta" fullWidth={true} icon="mdi:arrow-right" iconPosition="right">
  Continue
</BrutalButton>
```

### Variants

- **primary**: Magenta background (main CTAs)
- **secondary**: Mint background (secondary actions)
- **yellow**: Yellow background (warnings/highlights)
- **mint**: Mint background (success actions)
- **magenta**: Magenta background (emphasis)
- **white**: White background (subtle actions)
- **black**: Black background (strong contrast)

### Best Practices

- Use `primary` for main CTAs (join, donate, sign up)
- Use `secondary` for supporting actions (learn more, read more)
- Use `lg` size for hero CTAs, `md` for general use, `sm` for compact layouts
- Add icons to clarify action (download, external link, arrow for navigation)

---

## BrutalBadge

Badge/tag component for labels and categories.

### Props

```typescript
interface Props {
  variant?: 'magenta' | 'mint' | 'yellow' | 'lavender' | 'white' | 'black'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  class?: string
}
```

### Usage Examples

```astro
<!-- Category badge -->
<BrutalBadge variant="magenta">Housing</BrutalBadge>

<!-- Badge with icon -->
<BrutalBadge variant="mint" icon="mdi:check-circle"> Verified </BrutalBadge>

<!-- Small status badge -->
<BrutalBadge variant="yellow" size="sm">New</BrutalBadge>
```

### Best Practices

- Use for policy categories, tags, statuses
- Keep text short (1-3 words)
- Use icons to add meaning (check for verified, star for featured)

---

## FloatingIcon

Animated background decoration icon.

### Props

```typescript
interface Props {
  name: string // Required - MDI icon name
  color?: string
  size?: number
  animation?: 'float' | 'spin' | 'wiggle' | 'bounce' | 'pulse' | 'none'
  position?: { top?: string; right?: string; bottom?: string; left?: string }
  opacity?: number
  delay?: string
}
```

### Usage Examples

```astro
<!-- Floating balance scale icon -->
<FloatingIcon
  name="mdi:scale-balance"
  color="rgba(255, 51, 153, 0.1)"
  size={120}
  animation="float"
  position={{ top: '10%', right: '5%' }}
/>

<!-- Spinning gear icon -->
<FloatingIcon
  name="mdi:cog"
  color="rgba(0, 255, 204, 0.15)"
  size={80}
  animation="spin"
  position={{ bottom: '20%', left: '10%' }}
/>
```

### Best Practices

- Use sparingly (2-3 per section maximum)
- Keep opacity low (0.05-0.15) for subtle backgrounds
- Position away from text content
- Use thematic icons that relate to content
- Mix animation types for visual interest

---

## Section

Page section wrapper with consistent spacing and backgrounds.

### Props

```typescript
interface Props {
  bg?: 'white' | 'gray' | 'transparent'
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  border?: boolean
  borderPosition?: 'top' | 'bottom' | 'both'
  borderColor?: 'black' | 'magenta' | 'mint' | 'yellow'
  id?: string
  class?: string
}
```

### Usage Examples

```astro
<!-- Basic section -->
<Section>
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>

<!-- Section with gray background and border -->
<Section bg="gray" border={true} borderPosition="top" borderColor="magenta">
  <h2>Separated Section</h2>
</Section>

<!-- Section with custom padding and id for anchors -->
<Section id="about" padding="xl">
  <h2>About Us</h2>
</Section>
```

### Best Practices

- Use to create consistent vertical rhythm
- Add `border` to visually separate sections
- Use `gray` background to alternate section colors
- Add `id` for anchor links from navigation

---

## Grid

Responsive grid layout component.

### Props

```typescript
interface Props {
  variant?: 'theft' | 'policy' | 'electorate' | 'feature' | '2col' | '3col' | '4col' | 'auto'
  gap?: 'sm' | 'md' | 'lg'
  class?: string
}
```

### Usage Examples

```astro
<!-- Policy grid (3 columns) -->
<Grid variant="policy">
  <BrutalCard>Policy 1</BrutalCard>
  <BrutalCard>Policy 2</BrutalCard>
  <BrutalCard>Policy 3</BrutalCard>
</Grid>

<!-- Feature grid (4 columns) with large gap -->
<Grid variant="feature" gap="lg">
  <IconBadge name="mdi:home" />
  <IconBadge name="mdi:bus" />
  <IconBadge name="mdi:hospital" />
  <IconBadge name="mdi:school" />
</Grid>

<!-- Auto-responsive grid -->
<Grid variant="auto" gap="md">
  <!-- Items will automatically flow into columns -->
</Grid>
```

### Variants

- **theft**: Asymmetric 1→2→3 column layout
- **policy**: Equal 1→2→3 columns
- **electorate**: Equal 1→2→3 columns
- **feature**: 2→4 columns (for icon grids)
- **2col**: Simple 1→2 columns
- **3col**: Simple 1→2→3 columns (default)
- **4col**: 1→2→4 columns
- **auto**: Auto-fit 1→2→3→4 columns

### Best Practices

- Use `policy` for policy cards
- Use `feature` for icon grids
- Use `auto` when item count is variable
- Adjust `gap` based on card size (larger cards = larger gap)

---

## CTA

Call-to-action component for prominent banners.

### Props

```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'magenta' | 'mint' | 'yellow' | 'lavender'
  size?: 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  rotation?: -3 | -2 | -1 | 0 | 1 | 2 | 3
  centered?: boolean
  class?: string
}
```

### Usage Examples

```astro
<!-- Join CTA -->
<CTA variant="magenta" size="xl" rotation={1} centered={true}>
  <h2 class="text-4xl font-black mb-4">Join the Movement</h2>
  <p class="text-xl mb-6">Together we can reclaim democracy.</p>
  <BrutalButton variant="white" size="lg">Sign Up Now</BrutalButton>
</CTA>

<!-- Newsletter CTA -->
<CTA variant="mint" size="lg">
  <h3 class="text-2xl font-black mb-2">Stay Informed</h3>
  <p class="mb-4">Subscribe to our newsletter for updates.</p>
  <BrutalButton variant="black">Subscribe</BrutalButton>
</CTA>
```

### Best Practices

- Use at end of pages or between major sections
- Use `magenta` for primary actions (join, donate)
- Use `mint` for secondary actions (newsletter, updates)
- Add slight rotation for visual interest
- Center content for banner-style CTAs

---

## Breadcrumb

Breadcrumb navigation component.

### Props

```typescript
interface Props {
  items: Array<{ label: string; href?: string }>
  separator?: 'chevron' | 'slash' | 'arrow'
  class?: string
}
```

### Usage Examples

```astro
<!-- Basic breadcrumb -->
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Policies', href: '/policies' },
    { label: 'Housing Policy' },
  ]}
/>

<!-- With arrow separator -->
<Breadcrumb
  separator="arrow"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Electorates', href: '/electorates' },
    { label: 'Richmond' },
  ]}
/>
```

### Best Practices

- Place at top of content pages
- Last item should not have `href` (current page)
- Keep labels concise
- Use consistent separator across site

---

## StatCard

Statistic display component.

### Props

```typescript
interface Props {
  value: string
  label: string
  icon?: string
  variant?: 'magenta' | 'mint' | 'yellow' | 'lavender' | 'white'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  class?: string
}
```

### Usage Examples

```astro
<!-- Stat card with icon -->
<StatCard value="85%" label="Voter Turnout" icon="mdi:vote" variant="magenta" size="lg" />

<!-- Grid of stat cards -->
<Grid variant="feature">
  <StatCard value="500+" label="Active Members" icon="mdi:account-group" />
  <StatCard value="$2.4B" label="Funds Raised" icon="mdi:currency-usd" />
  <StatCard value="12" label="Policies" icon="mdi:file-document" />
</Grid>
```

### Best Practices

- Use in hero sections or stat grids
- Keep values concise (use abbreviations like K, M, B)
- Add relevant icons to reinforce meaning
- Use consistent size within a grid
- Disable animation if using many cards (reduce motion overload)

---

## IconBadge

Icon with optional badge background.

### Props

```typescript
interface Props {
  name: string // Required - MDI icon name
  variant?: 'magenta' | 'mint' | 'yellow' | 'lavender' | 'white' | 'black'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  circular?: boolean
  border?: boolean
  animation?: 'none' | 'bounce' | 'wiggle' | 'pulse' | 'float'
  class?: string
}
```

### Usage Examples

```astro
<!-- Category icon -->
<IconBadge name="mdi:home" variant="magenta" size="lg" />

<!-- Feature icon with animation -->
<IconBadge name="mdi:shield-check" variant="mint" animation="bounce" />

<!-- Icon without background -->
<IconBadge name="mdi:arrow-right" circular={false} size="md" />
```

### Best Practices

- Use for category indicators
- Use for feature highlights
- Use `circular={false}` for inline icons
- Add animation sparingly (only for key features)
- Match variant to related content color

---

## Component Composition

Components are designed to work together:

```astro
<Section bg="gray" padding="xl">
  <h2 class="text-4xl font-black mb-8">Our Policies</h2>

  <Grid variant="policy" gap="lg">
    <BrutalCard variant="white" hover={true}>
      <IconBadge name="mdi:home" variant="magenta" size="lg" />
      <h3 class="text-2xl font-black my-4">Housing</h3>
      <p class="mb-4">Affordable housing for all Victorians.</p>
      <BrutalButton href="/policies/housing" variant="secondary"> Read More </BrutalButton>
    </BrutalCard>

    <BrutalCard variant="white" hover={true}>
      <IconBadge name="mdi:bus" variant="mint" size="lg" />
      <h3 class="text-2xl font-black my-4">Transport</h3>
      <p class="mb-4">Free and efficient public transport.</p>
      <BrutalButton href="/policies/transport" variant="secondary"> Read More </BrutalButton>
    </BrutalCard>
  </Grid>

  <CTA variant="magenta" size="lg" rotation={1} centered={true} class="mt-12">
    <h3 class="text-2xl font-black mb-4">Want to help shape policy?</h3>
    <BrutalButton variant="white" icon="mdi:hand-heart"> Join Reclaim </BrutalButton>
  </CTA>
</Section>
```

---

## Design Tokens

All components use consistent design tokens:

### Colors

- **Magenta**: Primary brand color (`#FF3399`)
- **Mint**: Secondary brand color (`#00FFCC`)
- **Yellow**: Accent color (`#FFFF00`)
- **Lavender**: Accent color (`#E6E6FA`)

### Borders

- **sm**: 4px
- **md**: 6px
- **lg**: 8px

### Shadows

- **sm**: 4px offset
- **md**: 6px offset
- **lg**: 8px offset
- **xl**: 12px offset

### Spacing

- **sm**: 8-16px padding
- **md**: 16-24px padding
- **lg**: 24-32px padding
- **xl**: 32-48px padding

---

## TypeScript Support

All components have full TypeScript interfaces. Import types when needed:

```typescript
import type { Props as CardProps } from '@/components/ui/BrutalCard.astro'
import type { Props as ButtonProps } from '@/components/ui/BrutalButton.astro'
```

---

## Accessibility

All components include:

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus visible styles
- Reduced motion support

### Reduced Motion

Components respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-* {
    animation: none;
  }
}
```

---

## Contributing

When creating new components:

1. **Follow naming conventions**: Use descriptive component names (Brutal*, Icon*, etc.)
2. **Use TypeScript interfaces**: Define Props interface at top of component
3. **Document props**: Include JSDoc comments with prop descriptions
4. **Provide variants**: Create flexible variant systems for common use cases
5. **Support customization**: Include `class` prop for custom styling
6. **Test accessibility**: Ensure keyboard navigation and screen reader support
7. **Add to documentation**: Update this file with usage examples

---

## Migration Guide

See `REFACTORING_GUIDE.md` for instructions on migrating existing pages to use the component library.

---

## Questions?

If you have questions about component usage:

1. Check the usage examples above
2. Look at existing pages for real-world examples
3. Open an issue for clarification or new component requests
