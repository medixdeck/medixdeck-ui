# @medixdeck/ui

> Shared React UI component library for MedixDeck, published as `@medixdeck/ui`.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra%20UI-v3-teal)](https://chakra-ui.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

`@medixdeck/ui` is a Vite library-mode package built with React 18, TypeScript 5, Chakra UI v3, semantic design tokens, and dual ESM/CJS output for npm publishing.

## Install

```bash
npm install @medixdeck/ui @chakra-ui/react react react-dom
```

## Quick start

```tsx
import { Button, MedixProvider, Navbar, Logo } from "@medixdeck/ui";

export function App() {
  return (
    <MedixProvider defaultColorMode="light">
      <Navbar
        navItems={[{ label: "Docs", href: "#docs" }]}
        ctaLabel="Talk to a Doctor"
        ctaHref="/consult"
      />
      <Button variant="solid" colorScheme="blue">Book appointment</Button>
      <Logo variant="purple" height={28} />
    </MedixProvider>
  );
}
```

## Public API index

| Area | Exports |
| --- | --- |
| Provider + theme | `MedixProvider`, `system`, `medixConfig`, token exports |
| Primitive | `Button`, `IconButton`, `Badge`, `Avatar`, `AvatarGroup`, `Spinner`, `FullPageSpinner`, `Tag`, `Divider`, `Logo` |
| Form | `Input`, `SearchInput`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FormControl`, `OTPInput`, `PinInput`, `PhoneInput`, `DatePicker`, `DateRangePicker`, `Combobox`, `FileUpload` |
| Layout | `Card`, `CardHeader`, `CardBody`, `CardFooter`, `StatCard`, `Container`, `SectionHeader` |
| Navigation | `Navbar`, `Breadcrumb`, `Tabs`, `Pagination`, `Stepper` |
| Feedback | `Alert`, `Skeleton`, `SkeletonText`, `SkeletonCard`, `Progress`, `Modal`, `Drawer`, `Tooltip`, `EmptyState`, `Toaster`, `toast`, `dismissToast` |
| Data display | `Accordion`, `TestimonialCard`, `BlogCard`, `DataTable` |
| Healthcare | `DoctorCard`, `VitalBadge`, `AppointmentCard` |
| Chakra re-exports | `Box`, `Flex`, `Grid`, `Stack`, `Text`, `Heading`, `Link`, `Image`, `Icon`, `Center`, `Wrap`, `WrapItem`, others in `lib/index.ts` |

## Design-system rules

- Use Chakra UI **v3** APIs only.
- All library source lives in `lib\`; `src\` is dev-preview only.
- Use semantic tokens such as `bg.surface`, `text.heading`, and `border` instead of raw hex for normal component styling.
- For color-critical interactive controls, prefer the repo's native-first pattern instead of Chakra recipes.
- Apply dark mode on `document.documentElement`, not an inner container.

## Repository index

```txt
lib\                         library source and npm entrypoint
src\                         local showcase app only
.github\workflows\publish.yml npm publish workflow
AGENTS.md                    full multi-agent repo guide
COPILOT.md                   concise AI contributor guide
.github\copilot-instructions.md GitHub Copilot repo instructions
CONTRIBUTING.md              contributor workflow
CHANGELOG.md                 release history
LICENSE                      package license
package.json                 npm metadata and scripts
```

## Development commands

```bash
npm run dev
npm run build
npm run test
npm run pack:check
```

## Publishing notes

- The package publishes from `dist\` with ESM, CJS, sourcemaps, and `.d.ts` declarations.
- Public API changes must stay in sync across `lib\index.ts`, `README.md`, `src\App.tsx`, Storybook stories, and `CHANGELOG.md`.
- The GitHub Actions workflow installs dependencies, runs build and test checks, performs `npm pack --dry-run`, and then publishes to npm.

## Project structure

```txt
medixdeck-ui\
├── lib\
│   ├── index.ts
│   ├── theme\
│   └── components\
│       ├── provider\
│       ├── primitive\
│       ├── form\
│       ├── layout\
│       ├── navigation\
│       ├── feedback\
│       ├── data\
│       └── healthcare\
├── src\
├── .github\
│   ├── copilot-instructions.md
│   └── workflows\publish.yml
├── AGENTS.md
├── COPILOT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.build.json
```
