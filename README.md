# DJ Ganesh — Official Website

Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Structure

```
app/          App Router entry (layout, page, globals.css)
components/   layout · navigation · hero · sections · ui
lib/          Shared config and helpers (siteConfig)
types/        Shared TypeScript types
public/       images · videos · audio · fonts
```

## Conventions

- **Design tokens** live in `app/globals.css` (`:root`) and are exposed to
  Tailwind through `@theme inline`. Do not hardcode colours or spacing in
  components — use `bg-background`, `text-muted-foreground`, `border-border`,
  `py-3xl`, `gap-md`, etc.
- **Spacing scale**: `xs 8` · `sm 16` · `md 24` · `lg 32` · `xl 48` ·
  `2xl 64` · `3xl 96` · `4xl 120` · `5xl 160` (px).
- **Layout**: wrap every section in `<Container>` (`components/layout/Container.tsx`)
  or the `.container-page` class so the whole site shares one max-width
  (1440px) and gutter.
- **Assets**: client-provided media goes in `public/audio`, `public/images`,
  `public/videos`. Do not rename or re-encode client audio files.
