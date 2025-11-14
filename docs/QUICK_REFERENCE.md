# Quick Reference: Developer Workflow

## 🚀 Getting Started (5 minutes)

```bash
# 1. Clone and install
git clone <repo-url>
cd reclaim-website-poc
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your Sanity credentials

# 3. Start developing
npm run dev
```

**VS Code will automatically**:

- Format code on save
- Fix ESLint issues on save
- Show inline type hints
- Run tests in background

---

## 📝 Daily Workflow

### Before You Code

```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### While You Code

- **Save often** → Auto-formats with Prettier
- **Watch terminal** → Type errors shown immediately
- **Check tests** → Run `npm test` to verify changes

### Before You Commit

```bash
# Run full validation (optional - pre-commit hook does this automatically)
npm run validate

# Commit (pre-commit hook runs automatically)
git add .
git commit -m "feat: add new feature"
```

**Pre-commit hook automatically**:

- Runs ESLint on changed files
- Formats code with Prettier
- Blocks commit if errors found

### Before You Push

```bash
# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request
# CI/CD will automatically run:
# - Lint checks
# - Type checks
# - Full test suite
# - Build verification
```

---

## 🛠️ Common Commands

| Command                 | What It Does      | When to Use             |
| ----------------------- | ----------------- | ----------------------- |
| `npm run dev`           | Start dev server  | Daily development       |
| `npm run build`         | Production build  | Before deployment       |
| `npm test`              | Run tests (watch) | While coding            |
| `npm test -- --run`     | Run tests once    | Quick check             |
| `npm run test:coverage` | Coverage report   | Check test completeness |
| `npm run lint`          | Check code style  | Find issues             |
| `npm run lint:fix`      | Auto-fix issues   | Clean up code           |
| `npm run format`        | Format all code   | Before commit           |
| `npm run type-check`    | Check TypeScript  | Find type errors        |
| `npm run validate`      | Run all checks    | Before push             |

---

## 📁 Project Structure Quick Map

```
src/
├── components/
│   ├── ui/              ← 10 reusable components (use these!)
│   ├── Header.astro
│   ├── Footer.astro
│   └── ...
├── pages/
│   ├── index.astro      ← Home page
│   ├── policies/
│   ├── faq/
│   └── ...
├── lib/
│   ├── sanity.ts        ← Typed Sanity queries
│   ├── constants.ts     ← Colors, sizes, etc.
│   └── portableText.ts  ← Content rendering
├── types/
│   └── sanity.ts        ← TypeScript interfaces
└── styles/
    └── global.css       ← Global styles + animations
```

---

## 🎨 Component Library Usage

### Import from centralized location

```typescript
import { BrutalCard, BrutalButton, FloatingIcon, Section, Grid, CTA } from '../components/ui'
```

### Common patterns

```astro
<!-- Card with shadow -->
<BrutalCard variant="white" shadow="magenta" padding="lg">
  <h3>Title</h3>
  <p>Content</p>
</BrutalCard>

<!-- Button -->
<BrutalButton variant="magenta" size="lg" href="/link"> Click Me </BrutalButton>

<!-- Section wrapper -->
<Section padding="xl" background="mint">
  <!-- Your content -->
</Section>

<!-- Grid layout -->
<Grid layout="policies">
  <!-- Your cards -->
</Grid>
```

**Full docs**: `docs/COMPONENT_LIBRARY.md`

---

## 🔍 Finding Things

### Need a component example?

```bash
grep -r "BrutalButton" src/pages/
```

### Need a type definition?

Look in `src/types/sanity.ts` (all types in one place)

### Need a color value?

Look in `src/lib/constants.ts` (all constants in one place)

### Need to understand a function?

Look for `*.test.ts` files (they show how it works)

---

## 🧪 Testing Guide

### Run tests

```bash
npm test              # Watch mode (auto-rerun on changes)
npm test -- --run     # Run once
npm test:coverage     # With coverage report
npm test:ui           # Visual test UI
```

### Write a test

```typescript
// src/lib/myFunction.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from './myFunction'

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })
})
```

### Use test helpers

```typescript
import { createMockPolicy, createMockFAQ } from '../test/helpers'

const policy = createMockPolicy({ title: 'Custom Title' })
```

**Coverage target**: 70%+ (we're at 91%!)

---

## 🐛 Troubleshooting

### "Type error in .astro file"

1. Check `src/types/sanity.ts` for correct type
2. Import type: `import type { Policy } from '../types/sanity'`
3. Use typed query: `getPolicies()` instead of `getDocuments<any>('policy')`

### "ESLint errors after commit"

1. Run `npm run lint:fix` to auto-fix
2. Manually fix remaining issues
3. Commit again

### "Tests failing"

1. Check test output for specific failure
2. Update test if behavior changed intentionally
3. Fix code if test found a bug

### "Build failing"

1. Run `npm run type-check` locally
2. Fix TypeScript errors
3. Run `npm run build` to verify
4. Push again

### "Pre-commit hook taking too long"

- Only changed files are checked
- If still slow, check your staged changes: `git status`
- Consider breaking large commits into smaller ones

---

## 📋 Git Commit Guidelines

### Format

```
type(scope): short description

Longer explanation if needed (optional)

Fixes #123 (optional issue reference)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change (no functionality change)
- `test`: Adding tests
- `chore`: Updating build tasks, package manager, etc.

### Examples

```bash
git commit -m "feat(policies): add climate policy page"
git commit -m "fix(nav): correct mobile menu z-index"
git commit -m "docs: update component library examples"
git commit -m "test: add coverage for portableText rendering"
```

---

## 🎯 Quick Wins

### Want to add a new page?

1. Create `.astro` file in `src/pages/`
2. Use existing components from `ui/`
3. Copy structure from similar page
4. Test locally with `npm run dev`

### Want to add a new component?

1. Create in `src/components/ui/`
2. Add TypeScript interface for props
3. Export from `src/components/ui/index.ts`
4. Add test in `*.test.ts` (if complex logic)
5. Document in `docs/COMPONENT_LIBRARY.md`

### Want to fix a bug?

1. Add test that reproduces bug
2. Fix the code
3. Verify test passes
4. Commit with `fix:` prefix

---

## 🎓 Learn More

| Document                        | What You'll Learn      |
| ------------------------------- | ---------------------- |
| `CONTRIBUTING.md`               | Full contributor guide |
| `docs/COMPONENT_LIBRARY.md`     | All components + props |
| `docs/REFACTORING_GUIDE.md`     | Migration patterns     |
| `docs/DX_ACHIEVEMENT_REPORT.md` | What we've built       |
| `README.md`                     | Project overview       |

---

## 💬 Get Help

1. **Check documentation** first (10 files in `docs/`)
2. **Look at existing code** for patterns
3. **Run tests** to understand behavior
4. **Check types** in `src/types/sanity.ts`

---

## ✅ Daily Checklist

- [ ] Pull latest changes
- [ ] Create feature branch
- [ ] Code your changes
- [ ] Run `npm run validate` (optional)
- [ ] Commit (pre-commit hook runs automatically)
- [ ] Push and create PR
- [ ] Wait for CI/CD to pass ✅
- [ ] Request code review

---

**Status**: Production-ready DX ✨
**Support**: Full documentation in `/docs/`
**Testing**: 41 tests, 91% coverage
**Quality**: Automated via pre-commit hooks + CI/CD

_Happy coding! 🚀_
