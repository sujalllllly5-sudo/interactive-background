# Interactive Background

A Next.js portfolio landing page for Sujal Dehariya. The page combines an OGL-powered dot-grid background with responsive editorial sections, scroll reveals, pointer tilt, a custom cursor, and an interactive process roadmap.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

Open `http://localhost:3000` after starting the development server.

## Code map

Each source file starts with a purpose tag so the feature can be scanned without opening every module.

- `[COMPOSER:LANDING]` — `src/features/landing/InteractiveBackground.tsx` wires the page together.
- `[CONTENT]` — `src/features/landing/content/site.ts` owns navigation, projects, principles, and roadmap copy.
- `[UI:*]` — `src/features/landing/components/` contains shared buttons, labels, and animated text.
- `[BEHAVIOR:*]` — `src/features/landing/hooks/` contains reveal, tilt, cursor, scroll, loader, and roadmap state.
- `[WEBGL:*]` — `src/features/landing/background/` contains the OGL renderer and GLSL shaders.
- `[SECTION:*]` — `src/features/landing/sections/` contains the page sections and their markup.
- `[STYLE:*]` — `src/styles/` contains ordered CSS chunks imported by `app/globals.css`.

## Runtime structure

```text
app/page.tsx
  -> app/InteractiveBackground.tsx
     -> src/features/landing/InteractiveBackground.tsx
        -> content, components, hooks, background, and sections
```

The CSS entry point remains `app/globals.css` so the Next.js layout and any future global selectors keep a stable import path. The active project preview remains at `public/portfolio-preview.png`.
