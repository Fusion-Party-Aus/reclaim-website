# Fusion Victoria Website

A modern, performant website for the Fusion Party Victoria built with Astro, Sanity CMS, and Neo-Brutalist design principles.

## 🚀 Tech Stack

- **Framework**: [Astro 5.x](https://astro.build) - Static Site Generation
- **CMS**: [Sanity.io](https://www.sanity.io) - Headless CMS
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **TypeScript**: Strict type-checking enabled
- **Testing**: [Vitest](https://vitest.dev)
- **Icons**: [MDI Icons](https://icon-sets.iconify.design/mdi/)

## 📦 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your Sanity project ID

# 3. Run development servers
npm run dev                 # Frontend (localhost:4321)
npm run dev:sanity          # Sanity Studio (localhost:3333)
```

## 🏗️ Project Structure

```
src/
├── components/ui/     # Design system (10 components)
├── layouts/           # Page layouts
├── pages/             # File-based routing
├── lib/               # Utilities & API clients
├── types/             # TypeScript definitions
└── test/              # Test utilities

studio/                # Sanity Studio config
```

## 📚 Documentation

### Getting Started

- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Daily workflow, common commands
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute (2000+ words)

### Viral Features 🎯

- **[Viral Mechanics Complete Guide](./docs/VIRAL_MECHANICS_COMPLETE.md)** - Full implementation of all 8 viral mechanics
- **[Viral Features Summary](./VIRAL_FEATURES_SUMMARY.md)** - Overview of all viral mechanics
- **[Movement Metrics](./docs/MOVEMENT_METRICS.md)** - Gamified progress tracking widget
- **[Viral Strategy](./docs/VIRAL_FEATURES.md)** - Complete organic growth playbook
- **[Testing Viral Features](./TESTING_VIRAL_FEATURES.md)** - How to test Konami Code, console messages, etc.

**8 Viral Mechanics Implemented**:

1. ✅ Share Quote Cards (Victorian Theft section)
2. ✅ Movement Metrics Widget (Homepage)
3. ✅ Scroll Progress with Milestones (Global)
4. ✅ Floating Share Buttons (Homepage)
5. ✅ Konami Code Easter Egg (Global)
6. ✅ Developer Console Messages (Global)
7. ✅ Click-to-Tweet Component (Ready to use)
8. ✅ Member Badge Component (Ready to use)

### Component System

- **[Component Library](./docs/COMPONENT_LIBRARY.md)** - Full API reference (24KB)
- **[Component Summary](./docs/COMPONENT_LIBRARY_SUMMARY.md)** - Quick component guide
- **[Refactoring Guide](./docs/REFACTORING_GUIDE.md)** - Migration patterns (16KB)

### Developer Experience

- **[DX Achievement Report](./docs/DX_ACHIEVEMENT_REPORT.md)** - 10/10 DX journey
- **[DX Improvements Summary](./docs/DX_IMPROVEMENTS_SUMMARY.md)** - Complete improvement log
- **[DX Audit Report](./docs/DX_AUDIT_REPORT.md)** - Initial assessment

### Design & Features

- **[Design Rationale](./docs/DESIGN_RATIONALE.md)** - Yellow color justification
- **[Styling Enhancements](./docs/STYLING_ENHANCEMENTS.md)** - Neo-brutalist styling
- **[Icon System](./docs/ICON_MIGRATION_GUIDE.md)** - MDI icon usage
- **[New Features](./docs/NEW_FEATURES.md)** - Feature documentation

## 🧞 Commands

| Command            | Action               |
| ------------------ | -------------------- |
| `npm run dev`      | Start dev server     |
| `npm run build`    | Build for production |
| `npm run lint`     | Lint code            |
| `npm run format`   | Format code          |
| `npm test`         | Run tests            |
| `npm run validate` | Run all checks       |

## 🎨 Component Library

10 reusable components for consistent UI:

- `BrutalCard`, `BrutalButton`, `BrutalBadge`
- `FloatingIcon`, `Section`, `Grid`, `CTA`
- `Breadcrumb`, `StatCard`, `IconBadge`

**Example:**

```astro
import {(BrutalCard, BrutalButton)} from '../components/ui';

<BrutalCard variant="magenta" hover={true}>
  <h2>Title</h2>
  <BrutalButton href="/link" variant="white">Read More</BrutalButton>
</BrutalCard>
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run `npm run validate`
4. Create pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Fusion-Party-Aus/reclaim-website-poc/issues)
- **Website**: https://fusionparty.org.au
- **Email**: hello@fusionparty.org.au

---

Built with ❤️ by the Fusion Party community
