# Refactoring Guide: Migrating to Component Library

## Overview

This guide walks you through migrating existing pages from bespoke implementations to the new component library. Following these patterns will ensure consistency, reduce code duplication, and make the codebase easier to maintain.

## Migration Process

### Step 1: Identify Patterns

Before refactoring, identify these common patterns in your page:

**Cards with brutal styling:**
```astro
<!-- OLD -->
<div class="bg-white border-6 border-black shadow-[8px_8px_0px_0px_#000000] p-6">
  <h3>Title</h3>
  <p>Content</p>
</div>

<!-- NEW -->
<BrutalCard shadow="lg">
  <h3>Title</h3>
  <p>Content</p>
</BrutalCard>
```

**Buttons and links:**
```astro
<!-- OLD -->
<a href="/policies" class="inline-block px-6 py-3 bg-magenta text-white border-4 border-black shadow-[6px_6px_0px_0px_#000000]">
  Read More
</a>

<!-- NEW -->
<BrutalButton href="/policies" variant="primary">
  Read More
</BrutalButton>
```

**Badges/tags:**
```astro
<!-- OLD -->
<span class="inline-block px-3 py-1 text-sm bg-magenta text-white border-2 border-black">
  Housing
</span>

<!-- NEW -->
<BrutalBadge variant="magenta">Housing</BrutalBadge>
```

**Grid layouts:**
```astro
<!-- OLD -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>

<!-- NEW -->
<Grid variant="3col" gap="md">
  <!-- Cards -->
</Grid>
```

---

## Example: Refactoring the Home Page

### Before (src/pages/index.astro)

```astro
---
// Old implementation with duplicated styling
---

<Layout>
  <!-- Hero Section -->
  <section class="py-16 px-4 md:px-8 bg-white border-b-4 border-black">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl font-black mb-6">Reclaim Democracy</h1>
      
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div class="bg-magenta border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000000]">
          <div class="text-white">
            <div class="text-3xl font-black">85%</div>
            <div class="text-sm font-bold">Support</div>
          </div>
        </div>
        <!-- More stats... -->
      </div>
    </div>
  </section>
  
  <!-- Theft Cards Section -->
  <section class="py-16 px-4 md:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-black mb-8">They're Stealing Your Future</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white border-6 border-black shadow-[8px_8px_0px_0px_#000000] p-6 rotate-[1deg] hover:shadow-[10px_10px_0px_0px_#000000] transition-all">
          <div class="text-4xl mb-4">🏠</div>
          <h3 class="text-2xl font-black mb-2">Housing Unaffordable</h3>
          <p>The average house in Melbourne costs 12x the average salary.</p>
        </div>
        <!-- More cards... -->
      </div>
    </section>
  
  <!-- CTA Section -->
  <section class="py-16 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-magenta border-6 border-black shadow-[8px_8px_0px_0px_#000000] p-12 text-center rotate-[1deg]">
        <h2 class="text-4xl font-black text-white mb-4">Join Reclaim Democracy</h2>
        <p class="text-xl text-white mb-6">Together we can reclaim our future.</p>
        <a href="/get-involved" class="inline-block px-8 py-4 bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000000]">
          Get Involved
        </a>
      </div>
    </div>
  </section>
</Layout>
```

### After (with Component Library)

```astro
---
import Layout from '@/layouts/Layout.astro';
import Section from '@/components/ui/Section.astro';
import Grid from '@/components/ui/Grid.astro';
import BrutalCard from '@/components/ui/BrutalCard.astro';
import BrutalButton from '@/components/ui/BrutalButton.astro';
import StatCard from '@/components/ui/StatCard.astro';
import CTA from '@/components/ui/CTA.astro';
import FloatingIcon from '@/components/ui/FloatingIcon.astro';
---

<Layout>
  <!-- Hero Section -->
  <Section border={true} borderPosition="bottom" padding="lg">
    <h1 class="text-5xl font-black mb-6">Reclaim Democracy</h1>
    
    <!-- Stats -->
    <Grid variant="feature" gap="md" class="mt-8">
      <StatCard 
        value="85%" 
        label="Support"
        icon="mdi:heart"
        variant="magenta"
      />
      <StatCard 
        value="500+" 
        label="Members"
        icon="mdi:account-group"
        variant="mint"
      />
      <StatCard 
        value="12" 
        label="Policies"
        icon="mdi:file-document"
        variant="yellow"
      />
      <StatCard 
        value="$2.4B" 
        label="Recovered"
        icon="mdi:cash"
        variant="lavender"
      />
    </Grid>
  </Section>
  
  <!-- Theft Cards Section -->
  <Section bg="gray" padding="lg">
    <h2 class="text-4xl font-black mb-8">They're Stealing Your Future</h2>
    
    <Grid variant="theft" gap="lg">
      <BrutalCard hover={true} rotation={1}>
        <div class="text-4xl mb-4">🏠</div>
        <h3 class="text-2xl font-black mb-2">Housing Unaffordable</h3>
        <p>The average house in Melbourne costs 12x the average salary.</p>
      </BrutalCard>
      
      <BrutalCard hover={true} rotation={-1}>
        <div class="text-4xl mb-4">🚇</div>
        <h3 class="text-2xl font-black mb-2">Transport Failing</h3>
        <p>Our public transport is overcrowded and underfunded.</p>
      </BrutalCard>
      
      <BrutalCard hover={true} rotation={2}>
        <div class="text-4xl mb-4">🏥</div>
        <h3 class="text-2xl font-black mb-2">Healthcare Crumbling</h3>
        <p>Hospital wait times are at record highs.</p>
      </BrutalCard>
    </Grid>
    
    <!-- Floating background icons -->
    <FloatingIcon 
      name="mdi:home" 
      color="rgba(255, 51, 153, 0.05)"
      size={150}
      animation="float"
      position={{ top: '10%', right: '5%' }}
    />
    <FloatingIcon 
      name="mdi:bus" 
      color="rgba(0, 255, 204, 0.08)"
      size={120}
      animation="spin"
      position={{ bottom: '15%', left: '8%' }}
    />
  </Section>
  
  <!-- CTA Section -->
  <Section padding="lg">
    <CTA variant="magenta" size="xl" rotation={1} centered={true}>
      <h2 class="text-4xl font-black text-white mb-4">Join Reclaim Democracy</h2>
      <p class="text-xl text-white mb-6">Together we can reclaim our future.</p>
      <BrutalButton href="/get-involved" variant="white" size="lg">
        Get Involved
      </BrutalButton>
    </CTA>
  </Section>
</Layout>
```

### Benefits

**Before:**
- 150+ lines of duplicated styling
- Inconsistent spacing and shadows
- Hard to update design system
- Difficult for new contributors

**After:**
- 80 lines with components
- Consistent design tokens
- Change design system in one place
- Clear, semantic component names

---

## Pattern Library

### Refactoring Cards

**Pattern: Policy/Feature Card**

```astro
<!-- BEFORE -->
<div class="bg-white border-6 border-black shadow-[8px_8px_0px_0px_#000000] p-6 hover:shadow-[10px_10px_0px_0px_#000000] transition-all">
  <div class="w-14 h-14 bg-magenta rounded-full border-4 border-black flex items-center justify-center mb-4">
    <Icon name="mdi:home" class="w-8 h-8 text-white" />
  </div>
  <h3 class="text-2xl font-black mb-2">Housing Policy</h3>
  <p class="mb-4">Affordable housing for all Victorians.</p>
  <a href="/policies/housing" class="inline-block px-4 py-2 bg-mint text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000]">
    Read More
  </a>
</div>

<!-- AFTER -->
<BrutalCard hover={true}>
  <IconBadge name="mdi:home" variant="magenta" size="lg" />
  <h3 class="text-2xl font-black my-4">Housing Policy</h3>
  <p class="mb-4">Affordable housing for all Victorians.</p>
  <BrutalButton href="/policies/housing" variant="secondary">
    Read More
  </BrutalButton>
</BrutalCard>
```

**Lines saved:** ~15 lines → ~6 lines (60% reduction)

---

### Refactoring CTAs

**Pattern: Join/Newsletter Section**

```astro
<!-- BEFORE -->
<div class="bg-magenta border-6 border-black shadow-[8px_8px_0px_0px_#000000] p-10 md:p-12 text-center rotate-[1deg] hover:shadow-[10px_10px_0px_0px_#000000] transition-all">
  <h2 class="text-4xl font-black text-white mb-4">Join the Movement</h2>
  <p class="text-xl text-white mb-6">Together we can reclaim democracy.</p>
  <a href="/get-involved" class="inline-block px-8 py-4 bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000000] font-bold hover:shadow-[8px_8px_0px_0px_#000000] transition-all">
    Get Involved
  </a>
</div>

<!-- AFTER -->
<CTA variant="magenta" size="lg" rotation={1} centered={true}>
  <h2 class="text-4xl font-black text-white mb-4">Join the Movement</h2>
  <p class="text-xl text-white mb-6">Together we can reclaim democracy.</p>
  <BrutalButton href="/get-involved" variant="white" size="lg">
    Get Involved
  </BrutalButton>
</CTA>
```

**Lines saved:** ~8 lines → ~6 lines (25% reduction + consistency)

---

### Refactoring Grids

**Pattern: Policy Grid**

```astro
<!-- BEFORE -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {policies.map(policy => (
    <div class="bg-white border-6 border-black shadow-[8px_8px_0px_0px_#000000] p-6">
      <!-- Card content -->
    </div>
  ))}
</div>

<!-- AFTER -->
<Grid variant="policy" gap="md">
  {policies.map(policy => (
    <BrutalCard>
      <!-- Card content -->
    </BrutalCard>
  ))}
</Grid>
```

---

### Refactoring Sections

**Pattern: Page Section**

```astro
<!-- BEFORE -->
<section class="py-16 px-4 md:px-8 bg-gray-50 border-b-4 border-black">
  <div class="max-w-7xl mx-auto">
    <h2>Section Title</h2>
    <!-- Content -->
  </div>
</section>

<!-- AFTER -->
<Section bg="gray" padding="lg" border={true}>
  <h2>Section Title</h2>
  <!-- Content -->
</Section>
```

---

## Step-by-Step Refactoring

### 1. Add Component Imports

At the top of your file:

```astro
---
// Old imports
import Layout from '@/layouts/Layout.astro';

// Add component imports
import Section from '@/components/ui/Section.astro';
import Grid from '@/components/ui/Grid.astro';
import BrutalCard from '@/components/ui/BrutalCard.astro';
import BrutalButton from '@/components/ui/BrutalButton.astro';
import BrutalBadge from '@/components/ui/BrutalBadge.astro';
import IconBadge from '@/components/ui/IconBadge.astro';
import StatCard from '@/components/ui/StatCard.astro';
import CTA from '@/components/ui/CTA.astro';
import FloatingIcon from '@/components/ui/FloatingIcon.astro';
---
```

### 2. Wrap Content in Sections

Replace `<section>` tags with `<Section>` component:

```astro
<!-- Before -->
<section class="py-16 px-4 md:px-8 bg-white">
  <div class="max-w-7xl mx-auto">
    <!-- Content -->
  </div>
</section>

<!-- After -->
<Section padding="lg">
  <!-- Content -->
</Section>
```

### 3. Replace Grid Layouts

```astro
<!-- Before -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Items -->
</div>

<!-- After -->
<Grid variant="3col" gap="md">
  <!-- Items -->
</Grid>
```

### 4. Replace Cards

```astro
<!-- Before -->
<div class="bg-white border-6 border-black shadow-[8px_8px_0px_0px_#000000] p-6">
  <!-- Content -->
</div>

<!-- After -->
<BrutalCard>
  <!-- Content -->
</BrutalCard>
```

### 5. Replace Buttons

```astro
<!-- Before -->
<a href="/policies" class="inline-block px-6 py-3 bg-magenta text-white border-4 border-black">
  Read More
</a>

<!-- After -->
<BrutalButton href="/policies" variant="primary">
  Read More
</BrutalButton>
```

### 6. Replace Icon Circles

```astro
<!-- Before -->
<div class="w-14 h-14 bg-magenta rounded-full border-4 border-black flex items-center justify-center">
  <Icon name="mdi:home" class="w-8 h-8 text-white" />
</div>

<!-- After -->
<IconBadge name="mdi:home" variant="magenta" size="lg" />
```

### 7. Add Floating Icons (Optional)

Add visual interest with background icons:

```astro
<Section padding="lg">
  <!-- Content -->
  
  <!-- Floating decorations -->
  <FloatingIcon 
    name="mdi:scale-balance"
    color="rgba(255, 51, 153, 0.08)"
    size={120}
    animation="float"
    position={{ top: '10%', right: '5%' }}
  />
</Section>
```

---

## Testing After Refactoring

After refactoring a page:

1. **Visual Check**: Does it look the same or better?
2. **Responsive Check**: Test mobile, tablet, desktop breakpoints
3. **Interaction Check**: Do hover states work?
4. **Accessibility Check**: Tab through interactive elements
5. **Performance Check**: Check page load time
6. **Code Review**: Is the code cleaner and more maintainable?

---

## Common Pitfalls

### ❌ Don't Override Core Styles

```astro
<!-- BAD -->
<BrutalCard class="border-8 shadow-none">
  <!-- This defeats the purpose of components -->
</BrutalCard>

<!-- GOOD -->
<BrutalCard borderWidth="lg" shadow="none">
  <!-- Use props instead -->
</BrutalCard>
```

### ❌ Don't Nest Components Incorrectly

```astro
<!-- BAD -->
<BrutalCard>
  <BrutalCard>
    <!-- Double cards rarely make sense -->
  </BrutalCard>
</BrutalCard>

<!-- GOOD -->
<Grid variant="2col" gap="md">
  <BrutalCard>First card</BrutalCard>
  <BrutalCard>Second card</BrutalCard>
</Grid>
```

### ❌ Don't Mix Old and New Patterns

```astro
<!-- BAD - Inconsistent -->
<Grid variant="3col" gap="md">
  <BrutalCard>Using new component</BrutalCard>
  <div class="bg-white border-6 border-black p-6">Old pattern</div>
</Grid>

<!-- GOOD - Consistent -->
<Grid variant="3col" gap="md">
  <BrutalCard>First card</BrutalCard>
  <BrutalCard>Second card</BrutalCard>
</Grid>
```

---

## Migration Checklist

For each page you refactor:

- [ ] Add component imports
- [ ] Replace `<section>` with `<Section>`
- [ ] Replace grid divs with `<Grid>`
- [ ] Replace card divs with `<BrutalCard>`
- [ ] Replace button/link elements with `<BrutalButton>`
- [ ] Replace badge spans with `<BrutalBadge>`
- [ ] Replace icon circles with `<IconBadge>`
- [ ] Replace stat displays with `<StatCard>`
- [ ] Replace CTA sections with `<CTA>`
- [ ] Add `<FloatingIcon>` decorations (optional)
- [ ] Test visual appearance
- [ ] Test responsive behavior
- [ ] Test interactions
- [ ] Test accessibility
- [ ] Update documentation if needed

---

## Priority Order

Refactor pages in this order:

1. **Home Page** (`/src/pages/index.astro`) - Most visible, sets standard
2. **Policies Listing** (`/src/pages/policies/index.astro`) - High traffic
3. **FAQ Page** (`/src/pages/faq/index.astro`) - Good example of varied patterns
4. **Electorates** (`/src/pages/electorates/index.astro`) - Similar to policies
5. **Policy Detail** (`/src/pages/policies/[slug].astro`) - Template for all policies
6. **Error Pages** (404, 500, etc.) - Already have good styling
7. **Other Pages** - As needed

---

## Questions or Issues?

If you encounter issues during refactoring:

1. Check `COMPONENT_LIBRARY.md` for component documentation
2. Look at already-refactored pages for examples
3. Test with different prop combinations
4. Open an issue if a component doesn't support your use case

---

## Summary

**Before refactoring:**
- 100+ instances of duplicated styling
- Inconsistent spacing, shadows, borders
- Hard to update design system globally
- Difficult for new contributors

**After refactoring:**
- Consistent component-based architecture
- Update design system in one place
- Clear, semantic component names
- Easy for new contributors to understand
- 50-80% less code per page

The component library makes the codebase more maintainable, consistent, and contributor-friendly. Take it one page at a time!
