# Icon Migration Guide

## Overview

We've updated the icon system to use **Material Design Icons (MDI)** instead of emojis or hardcoded icon mappings. This gives you full control over which icon appears for each piece of content in Sanity.

## What Changed

### 1. Policy Schema (`fusion/schemaTypes/policy.ts`)

- **Old:** `icon` field expected an emoji (e.g., 🏠)
- **New:** `icon` field expects an MDI icon name (e.g., `mdi:home-city`)

### 2. Home Page Schema (`fusion/schemaTypes/homePage.ts`)

**Theft Section Cards:**

- **Added:** `icon` field to each theft card
- **Format:** MDI icon name (e.g., `mdi:currency-usd-off`)

**Join Section Cards:**

- **Changed:** `emoji` field deprecated (hidden in Sanity UI)
- **Added:** `icon` field for MDI icon names
- **Fallback:** Will use default icons if not set

## How to Update Content in Sanity

### For Policies

1. Go to **Content** → **Policy** in Sanity Studio
2. Edit each policy
3. In the **Icon** field, replace emoji with MDI icon name:

**Recommended Icons:**

- Housing: `mdi:home-city` or `mdi:home-group`
- Transport: `mdi:train` or `mdi:bus-multiple`
- Healthcare: `mdi:hospital-box` or `mdi:medical-bag`
- Energy: `mdi:solar-power` or `mdi:leaf`
- Wages: `mdi:currency-usd` or `mdi:cash-multiple`
- Education: `mdi:school` or `mdi:book-education`
- Crime: `mdi:shield-account` or `mdi:gavel`
- Environment: `mdi:leaf` or `mdi:tree`

### For Home Page - Theft Cards

1. Go to **Content** → **Home Page** in Sanity Studio
2. Expand **The Victorian Theft Section**
3. For each theft card, add an **Icon** field value:

**Recommended Icons:**

- Housing theft: `mdi:home-remove` or `mdi:currency-usd-off`
- Healthcare cuts: `mdi:hospital-box` or `mdi:medical-bag`
- Transport failures: `mdi:train-car` or `mdi:road-variant`
- Education funding: `mdi:school` or `mdi:book-education`

### For Home Page - Join Section Cards

1. Go to **Content** → **Home Page** in Sanity Studio
2. Expand **Join The Fight Section**
3. For each action card, add an **Icon** field value:

**Recommended Icons:**

- Newsletter/Email: `mdi:email-newsletter` or `mdi:email-fast`
- Donations: `mdi:hand-coin-outline` or `mdi:cash-multiple`
- Volunteer: `mdi:account-group` or `mdi:hand-heart`
- Events: `mdi:calendar-star` or `mdi:party-popper`

## Finding Icons

### Browse Material Design Icons

Visit: **https://pictogrammers.com/library/mdi/**

1. Search for keywords (e.g., "house", "train", "hospital")
2. Click on an icon you like
3. Copy the name (e.g., `home-city`)
4. Add `mdi:` prefix in Sanity (e.g., `mdi:home-city`)

### Icon Format

- ✅ Correct: `mdi:home-city`
- ✅ Correct: `mdi:train-car`
- ❌ Wrong: `home-city` (missing prefix)
- ❌ Wrong: `🏠` (emoji, old format)

## Default Icons (Fallbacks)

If no icon is set, the system will use these defaults:

**Policies:**

- Default: `mdi:file-document`

**Theft Cards:**

- Default: `mdi:alert-circle`

**Join Cards:**

- Card 1: `mdi:email-newsletter`
- Card 2: `mdi:hand-coin-outline`
- Card 3: `mdi:account-group`

## Examples

### Policy Icon Examples

```yaml
# Housing Policy
icon: mdi:home-city

# Transport Policy
icon: mdi:train

# Healthcare Policy
icon: mdi:hospital-box

# Wage Theft Policy
icon: mdi:currency-usd-off

# Environment Policy
icon: mdi:leaf
```

### Theft Card Icon Examples

```yaml
# Housing Theft Card
icon: mdi:home-remove
category: Housing

# Healthcare Cuts Card
icon: mdi:medical-bag
category: Healthcare

# Transport Failures Card
icon: mdi:train-car-passenger
category: Transport
```

## Benefits

✅ **Accurate Icons** - No more housing policies with health icons  
✅ **Full Control** - Choose the perfect icon for each piece of content  
✅ **Consistent Design** - All icons from the same Material Design system  
✅ **Easy Updates** - Change icons anytime in Sanity without code changes  
✅ **Semantic Meaning** - Icons match the content they represent

## Migration Checklist

- [ ] Update all policy icons in Sanity
- [ ] Add icons to theft section cards
- [ ] Add icons to join section cards
- [ ] Test all pages to ensure icons display correctly
- [ ] Remove any old emoji references

## Need Help?

- Icon library: https://pictogrammers.com/library/mdi/
- Sanity Studio: http://localhost:3333 (when running)
- Questions: Check the icon name format includes `mdi:` prefix
