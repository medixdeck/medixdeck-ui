# GitHub Copilot instructions for `@medixdeck/ui`

Treat this repository as a publishable React component library.

- Read `AGENTS.md` first for the full conventions.
- Keep all public exports in `lib/index.ts`.
- Keep `README.md`, `src/App.tsx`, Storybook stories, and `CHANGELOG.md` aligned with the package API.
- Use Chakra UI v3 APIs and semantic tokens.
- Do NOT use `boxShadow`, `shadow`, `card-light`, or `card-dark` props. Rely on clean borders (`border="1px solid" borderColor="border"`) instead.
- Run `npm run build`, `npm run test`, and `npm run pack:check` for changes that affect library code or package metadata.
