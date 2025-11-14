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

fusion/                # Sanity Studio config
```

## 📚 Documentation

- [Component Library](./COMPONENT_LIBRARY.md) - API reference
- [Refactoring Guide](./REFACTORING_GUIDE.md) - Migration patterns
- [Design Rationale](./DESIGN_RATIONALE.md) - Design decisions
- [DX Audit Report](./DX_AUDIT_REPORT.md) - Developer experience

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
