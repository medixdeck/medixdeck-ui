# COPILOT.md

Use this repository as a **publishable React UI library**, not an app.

## What matters most

- Put library code in `lib\`; `src\` is only the local showcase.
- Export every public component and type from `lib\index.ts`.
- Keep public API changes in sync across `lib\index.ts`, `README.md`, `src\App.tsx`, Storybook, and `CHANGELOG.md`.
- Use **Chakra UI v3** patterns only.
- Prefer semantic tokens for styling; use the repo's native-first pattern for brand-critical interactive states.
- Apply dark mode on `document.documentElement`.

## Release expectations

Before treating a change as complete, run:

```bash
npm run build
npm run test
npm run pack:check
```

## Package standards

- `package.json` must stay correct for npm publishing: exports, entrypoints, types, metadata, and publish settings.
- Test-only libraries belong in `devDependencies`.
- Do not edit `dist\` manually.

See `AGENTS.md` for the full repository guide.
