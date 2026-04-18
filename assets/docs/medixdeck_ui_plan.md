# MedixDeck UI — Shared Component Library Build Plan

## Tech Stack

- **Framework**: Vite (Library Mode) + React 18 + TypeScript
- **UI System**: Chakra UI v3 (`@chakra-ui/react`)
- **Font**: Satoshi (from Fontshare CDN / local)
- **Bundler Output**: ESM + CJS via `vite-plugin-dts`
- **Registry**: npm (scoped: `@medixdeck/ui`)

---

## Color Tokens (from Style Guide)

### Brand

| Token | Value |
|---|---|
| `brand.blue` | `#0685FF` |
| `brand.gradient` | `#1A8FFF` |
| `brand.sky` | `#D6EEFF` |
| `brand.purple` | `#7700CC` |
| `brand.lavender` | `#EDD6FF` |

### Neutral – Light Mode

| Token | Value |
|---|---|
| `neutral.light.bg` | `#FEFEFE` |
| `neutral.light.bg2` | `#F6F6F6` |
| `neutral.light.surface` | `#F6F6F6` |
| `neutral.light.border` | `#E4E8F0` |
| `neutral.light.muted` | `#9AAAB8` |
| `neutral.light.heading` | `#111926` |
| `neutral.light.body` | `#3D4F63` |

### Neutral – Dark Mode

| Token | Value |
|---|---|
| `neutral.dark.bg` | `#0A1220` |
| `neutral.dark.bg2` | `#182337` |
| `neutral.dark.surface` | `#152035` |
| `neutral.dark.border` | `#1E3050` |
| `neutral.dark.muted` | `#4A6480` |
| `neutral.dark.heading` | `#F0F6FF` |
| `neutral.dark.body` | `#ABC0D6` |

### Status

| Token | Value |
|---|---|
| `status.green` | `#1B7A38` |
| `status.greenTint` | `#DCFCE7` |
| `status.amber` | `#D97706` |
| `status.amberTint` | `#FEF3C7` |
| `status.red` | `#DC2626` |
| `status.redTint` | `#FEE2E2` |

---

## Typography Scale (Satoshi Font)

| Style | Size | Weight | Line Height |
|---|---|---|---|
| Display | 52px | 700 | 1.1 |
| H1 | 36px | 600 | 1.2 |
| H2 | 28px | 600 | 1.3 |
| H3 | 21px | 500 | 1.4 |
| Body | 14px | 400 | 1.6 |
| Small | 12px | 400 | — |
| Label | 11px | 500 (caps) | — |
| Mono/Data | 13px | 400 | — |

---

## Radius & Spacing

| Token | Value |
|---|---|
| Badge | 4px |
| Button / Input | 8px |
| Card | 12px |
| Modal / Sheet | 16px |
| Avatar / FAB | 50% |

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64

---

## Component Checklist (Phase-by-Phase)

### Phase 1 – Core Setup

- [x] Vite config (library mode)
- [x] `package.json` (peer deps, exports)
- [x] `tsconfig.json` + `tsconfig.build.json`
- [x] Chakra theme (`createSystem` + `defineConfig`)
- [x] Font setup (Satoshi)
- [x] `Provider` component export

### Phase 2 – Foundation Components

- [ ] `Button` (solid, outline, ghost, link; sizes: sm, md, lg)
- [ ] `IconButton`
- [ ] `Badge` (status variants)
- [ ] `Avatar` (with fallback, sizes)
- [ ] `Tag` / `Chip`
- [ ] `Divider`
- [ ] `Spinner` / `Loading`

### Phase 3 – Form Components

- [ ] `Input` (default, with icon, error state)
- [ ] `Textarea`
- [ ] `Select` / `NativeSelect`
- [ ] `Checkbox`
- [ ] `Radio` / `RadioGroup`
- [ ] `Switch`
- [ ] `FormControl` (label + error + helper)
- [ ] `FileUpload`
- [ ] `DatePicker` (simple wrapper)
- [ ] `SearchInput`
- [ ] `OTPInput`
- [ ] `PinInput`

### Phase 4 – Layout & Container Components

- [ ] `Card` (with header, body, footer slots)
- [ ] `StatCard` (metric + trend)
- [ ] `SectionHeader`
- [ ] `Container`
- [ ] `Grid` / `SimpleGrid` re-exports
- [ ] `Stack` re-exports

### Phase 5 – Navigation Components

- [ ] `Navbar` (desktop + mobile)
- [ ] `Sidebar`
- [ ] `Breadcrumb`
- [ ] `Tabs`
- [ ] `Pagination`
- [ ] `Steps` / `Stepper`
- [ ] `Link` (styled)

### Phase 6 – Feedback & Overlay Components

- [ ] `Alert` (info, success, warning, error)
- [ ] `Toast` (useToast hook)
- [ ] `Skeleton` / `SkeletonText`
- [ ] `Progress` / `ProgressBar`
- [ ] `Modal` / `Dialog`
- [ ] `Drawer`
- [ ] `Popover`
- [ ] `Tooltip`
- [ ] `EmptyState`

### Phase 7 – Data Display

- [ ] `Table` (sortable, w/ pagination)
- [ ] `DataTable`
- [ ] `List`
- [ ] `Timeline`
- [ ] `Accordion` / `FAQ`
- [ ] `Testimonial Card`
- [ ] `BlogCard`

### Phase 8 – Healthcare-Specific Components

- [ ] `DoctorCard`
- [ ] `AppointmentCard`
- [ ] `VitalBadge`
- [ ] `HealthMetricCard`
- [ ] `PatientAvatar`

---

## File Structure

```
medixdeck-ui/
├── lib/
│   ├── index.ts              # Main entry point (exports all)
│   ├── theme/
│   │   ├── index.ts          # createSystem export
│   │   ├── colors.ts         # Color tokens
│   │   ├── typography.ts     # Text styles
│   │   ├── spacing.ts        # Spacing/radius tokens
│   │   └── components.ts     # Component recipes
│   ├── components/
│   │   ├── primitive/        # Button, Input, Badge, Avatar …
│   │   ├── form/             # FormControl, Select, Checkbox …
│   │   ├── layout/           # Card, Container, Section …
│   │   ├── navigation/       # Navbar, Tabs, Pagination …
│   │   ├── feedback/         # Alert, Toast, Modal …
│   │   ├── data/             # Table, List, Accordion …
│   │   └── healthcare/       # DoctorCard, VitalBadge …
│   ├── hooks/
│   │   └── index.ts
│   └── utils/
│       └── index.ts
├── src/                      # Storybook / dev playground
│   └── App.tsx
├── .storybook/
├── vite.config.ts
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```
