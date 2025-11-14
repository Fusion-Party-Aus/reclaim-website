# Website Styling Enhancements

## Overview

Applied a refined version of the error page aesthetic across all main pages, creating a cohesive, energetic neo-brutalist design system that's polished and production-ready while maintaining maximum personality.

## Key Changes

### 1. Global CSS Enhancements (`src/styles/global.css`)

**Added Refined Animations:**

- `float-gentle` - Subtle 15px vertical float (4s duration)
- `float-slow` - 20px float with 10px horizontal drift (6s)
- `wiggle-subtle` - Gentle ±1deg rotation (3s)
- `pulse-gentle` - Slight scale and opacity variation (2s)
- `spin-slow` - 360deg rotation over 20s
- `bounce-subtle` - 10px vertical bounce (2s)
- `shake-gentle` - ±3px horizontal shake (0.5s)
- `glow-pulse` - Drop shadow animation (2s)

**Enhanced Utility Classes:**
All animations available as classes: `.animate-float-gentle`, `.animate-wiggle-subtle`, etc.

### 2. Home Page (`src/pages/index.astro`)

**Alert Bar:**

- Added animated vote icons in background
- Icon in text for visual interest

**Theft Section:**

- Floating background icons (hand-coin, cash-remove)
- Alert decagram icon with wiggle animation
- Color-coded policy icons for each card
- Enhanced hover states with larger shadows (12px)
- Icons in card headers and impact sections
- Arrow icons on links with hover translation

**Electorates Section:**

- Floating map-marker and account-group icons
- Search icon with bounce animation
- Icons for each electorate card
- Check marks for commitment lists
- Enhanced CTA box with bullhorn icon

**Manifesto Section:**

- Floating document and book icons
- Scroll icon with pulse
- Icons for each stat card with staggered bounce
- Icons on CTA buttons

**Take Action Section:**

- Gradient background (magenta to darker)
- Floating peace hand and greeting icons
- Bullhorn icon with pulse
- Newsletter/donation/group icons on cards
- Enhanced shadows (14px on hover)

### 3. Policies Page (`src/pages/policies/index.astro`)

**Overall:**

- Floating document and chart icons in background
- Policy icon mapping system (home, train, currency, solar, hospital, school, shield, leaf)

**Intro Panel:**

- Gavel icon with wiggle
- Hand icons around main message
- Enhanced shadow (12px on hover)

**Policy Cards:**

- Icon for each policy from mapping
- File certificate icon on "Policy" badge
- Check marks replace checkmark emoji
- Icons for costing details (calculator, currency, piggy bank)
- Book icon on "Read Full Policy" button
- Hover states with color transitions
- Increased border width to 6px
- Enhanced shadows (10px base, 12px hover)

### 4. FAQ Page (`src/pages/faq/index.astro`)

**Background:**

- Floating help-circle and comment-question icons

**Breadcrumbs:**

- Home and FAQ icons

**Jump to Category:**

- Compass icon with bounce
- Icon for each category button

**Category Headers:**

- Icons for each category (info, currency, arrow-left/right, vote, file-document)
- Enhanced shadows on hover

**FAQ Items:**

- Question icon (chat-question) with wiggle
- Answer icon (chat-processing)
- Hover states with subtle lift

**CTA Box:**

- Email-fast icon with wiggle
- Lightbulb icon in text
- Icons on all buttons

### 5. Electorates Page (`src/pages/electorates/index.astro`)

**Background:**

- Floating map-marker-radius and town-hall icons

**Header:**

- Map-marker-multiple icon with pulse
- Alert and info icons in description text

**Electorate Cards:**

- Flag icon on "Electorate" badge
- Account icons already present
- Bounce animations on commitment icons
- Eye icon on "View Plan" button
- Image hover scale effect
- Enhanced borders (6px)

**CTA Section:**

- Gradient background
- Floating hand-wave icon
- Map-search icon with wiggle
- Icons on buttons

### 6. Hero Component (`src/components/Hero.astro`)

**Enhancements:**

- Floating star and hexagon icons in background
- Bullhorn icon on eyebrow badge
- Layered text shadows (magenta, mint, white)
- Icons on stat cards (trending-up, account-group, cash-multiple)
- Stat cards with staggered bounce
- Enhanced hero shadow (8px)
- Icons on CTA buttons

### 7. Design Consistency

**Border Widths:**

- Main elements: 6px (up from 4px)
- Special emphasis: 8px
- Utility borders: 2-4px

**Shadows:**

- Base: 8px-10px offsets
- Hover: 12px-16px offsets
- Layered: Multiple shadows on special elements
- Color-matched: Shadows use brand colors

**Icons:**

- Material Design Icons throughout
- Semantic icon choices (not decorative)
- Animations applied selectively (pulse, wiggle, bounce, float)
- Sized appropriately for context (w-4 to w-16)

**Animations:**

- Subtle by default (1-2deg rotations, 10-20px movements)
- Staggered delays for visual rhythm
- Longer durations (2-6s) for smoothness
- Applied to background elements, icons, and interactive states

**Color Usage:**

- Magenta (#C926F2) - Primary brand, headers, CTAs
- Mint (#5EFFD8) - Secondary actions, highlights
- Yellow (#FFED00) - Warnings, emphasis, alternate CTAs
- Lavender (#9A94E7) - Accents, tertiary elements
- Black/White - Base, text, strong contrast

## Technical Details

**Performance:**

- CSS animations (GPU-accelerated)
- No JavaScript animation libraries
- Optimized icon usage (astro-icon with tree-shaking)
- Responsive animations (reduced on mobile)

**Accessibility:**

- Icons have proper aria-labels where needed
- Animations respect reduced-motion preferences
- Semantic HTML maintained
- Color contrast ratios preserved

**Browser Support:**

- Modern CSS features (Tailwind v4)
- Graceful degradation for older browsers
- Tested hover states and transitions

## Files Modified

1. `/src/styles/global.css` - Added animation keyframes and utility classes
2. `/src/pages/index.astro` - Enhanced all sections with icons and animations
3. `/src/pages/policies/index.astro` - Added icon system and enhanced styling
4. `/src/pages/faq/index.astro` - Added icons and category enhancements
5. `/src/pages/electorates/index.astro` - Enhanced with icons and floating elements
6. `/src/components/Hero.astro` - Added layered effects and stat icons

## Result

The website now has a consistent, energetic neo-brutalist aesthetic that:

- ✅ Maintains high usability
- ✅ Adds personality without overwhelming
- ✅ Uses animations purposefully
- ✅ Stays true to brand identity
- ✅ Scales from error pages to production pages
- ✅ Creates visual hierarchy with icons and color
- ✅ Feels polished and professional while staying bold

The design successfully bridges the gap between the outlandish energy of the error pages and the professional needs of policy/content pages.
