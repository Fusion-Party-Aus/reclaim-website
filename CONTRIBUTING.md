# Contributing to Fusion Victoria Website

Thank you for your interest in contributing to the Fusion Victoria website! This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Collaborate openly and transparently
- Follow our community guidelines

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- Git
- A Sanity.io account (for CMS access)

### Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/reclaim-website-poc.git
   cd reclaim-website-poc
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Add your Sanity project credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

Follow our coding standards (see below).

### 3. Test Your Changes

```bash
# Run all validation checks
npm run validate

# Run tests
npm test

# Check for type errors
npm run type-check
```

### 4. Commit Your Changes

We use conventional commits for clear history:

```bash
git add .
git commit -m "feat: add new policy card component"
```

**Commit message format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**

```bash
feat(ui): add BrutalCard hover animations
fix(sanity): resolve image URL generation issue
docs(readme): update setup instructions
refactor(pages): replace inline types with centralized definitions
test(lib): add tests for constants module
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## 🎨 Coding Standards

### TypeScript

- ✅ Use TypeScript for all new code
- ✅ Avoid `any` types - use proper interfaces
- ✅ Import types from `/src/types/sanity.ts`
- ✅ Use typed Sanity query functions

**Example:**

```typescript
// ❌ Bad
const policies = await getDocuments<any>('policy')

// ✅ Good
import type { Policy } from '../types/sanity'
import { getPolicies } from '../lib/sanity'

const policies: Policy[] = await getPolicies()
```

### Component Development

- ✅ Use the component library (`/src/components/ui/`)
- ✅ Define `interface Props` for all components
- ✅ Add JSDoc comments for props
- ✅ Follow neo-brutalist design principles

**Example:**

```astro
---
/**
 * PolicyCard Component
 *
 * Displays a policy summary with key points
 *
 * @param {Policy} policy - The policy to display
 * @param {boolean} featured - Whether to highlight the card
 */

interface Props {
  policy: Policy
  featured?: boolean
}

const { policy, featured = false } = Astro.props
---

<BrutalCard variant={featured ? 'magenta' : 'white'}>
  <!-- Card content -->
</BrutalCard>
```

### Styling

- ✅ Use Tailwind CSS utility classes
- ✅ Import constants from `/src/lib/constants.ts`
- ✅ Follow the design system (borders, shadows, rotations)
- ❌ Avoid inline hex colors - use constants

**Example:**

```typescript
import { BRAND_COLORS, CARD_ROTATIONS } from '../lib/constants'

const color = BRAND_COLORS.MAGENTA
const rotation = CARD_ROTATIONS[0]
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Design system components
│   └── [Feature].astro  # Feature-specific components
├── lib/                 # Utilities (exported functions)
├── types/               # TypeScript type definitions
├── pages/               # File-based routing
└── test/                # Test utilities and mocks
```

### Testing

- ✅ Write tests for utility functions
- ✅ Use test helpers from `/src/test/helpers.ts`
- ✅ Aim for 70%+ code coverage
- ✅ Test edge cases and error handling

**Example:**

```typescript
import { describe, it, expect } from 'vitest'
import { createMockPolicy } from '../test/helpers'

describe('PolicyCard', () => {
  it('should display policy title', () => {
    const policy = createMockPolicy({ title: 'Test Policy' })
    // Test implementation
  })
})
```

## 📦 Component Library

We have a comprehensive component library. **Always use these instead of creating new components:**

- `BrutalCard` - Neo-brutalist cards
- `BrutalButton` - Consistent buttons
- `BrutalBadge` - Tags and badges
- `FloatingIcon` - Animated background icons
- `Section` - Page sections
- `Grid` - Responsive grids
- `CTA` - Call-to-action banners
- `Breadcrumb` - Navigation breadcrumbs
- `StatCard` - Statistics display
- `IconBadge` - Icon badges

See [docs/COMPONENT_LIBRARY.md](./docs/COMPONENT_LIBRARY.md) for full documentation.

## 🧪 Testing Guidelines

### What to Test

- ✅ Utility functions (`/src/lib/`)
- ✅ Type definitions and constants
- ✅ Sanity query functions
- ✅ Component prop validation
- ❌ Don't test third-party libraries

### Running Tests

```bash
npm test              # Run all tests
npm run test:ui       # Interactive test UI
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

### Writing Good Tests

```typescript
// Good test structure
describe('Feature', () => {
  describe('specific function', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test'

      // Act
      const result = someFunction(input)

      // Assert
      expect(result).toBe('expected')
    })
  })
})
```

## 📚 Documentation

### When to Update Documentation

- New components added → Update `docs/COMPONENT_LIBRARY.md`
- New types added → Update JSDoc comments
- API changes → Update relevant docs
- New features → Update `README.md` and feature docs

### Documentation Style

- Use clear, concise language
- Include code examples
- Document edge cases
- Add visual examples for UI components

## 🔍 Code Review Process

### What Reviewers Look For

1. **Code Quality**
   - Follows coding standards
   - No console.log statements
   - Proper TypeScript usage
   - Uses component library

2. **Testing**
   - Tests pass
   - New code has tests
   - Coverage maintained/improved

3. **Documentation**
   - Code is well-documented
   - README updated if needed
   - JSDoc comments present

4. **Performance**
   - No unnecessary re-renders
   - Images optimized
   - Bundle size acceptable

### Getting Your PR Merged

- ✅ All CI checks pass
- ✅ Code reviewed by maintainer
- ✅ No merge conflicts
- ✅ Branch up-to-date with main

## 🐛 Reporting Bugs

### Before Reporting

1. Search existing issues
2. Check if it's already fixed in main
3. Reproduce in clean environment

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g. macOS]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 20.10.0]
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if it aligns with project goals
2. Search existing feature requests
3. Provide detailed use cases
4. Consider implementation complexity

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/Fusion-Party-Aus/reclaim-website-poc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Fusion-Party-Aus/reclaim-website-poc/discussions)
- **Email**: hello@fusionparty.org.au

## 🙏 Recognition

Contributors are recognized in:

- GitHub contributors page
- Release notes
- Project README

Thank you for contributing to Fusion Victoria! Every contribution, no matter how small, helps build a better political movement.

---

**Questions?** Open a discussion or reach out to maintainers.
