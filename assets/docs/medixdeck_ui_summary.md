# @medixdeck/ui — Build Complete ✅

## What Was Built

A fully functional **shared UI component library** at `d:\eunithelp@outlook.com\MedixDeck\development\medixdeck-ui`.

- **Stack**: Vite 6 (Library Mode) + React 18 + TypeScript + Chakra UI v3
- **Font**: Satoshi (Fontshare CDN)
- **Output formats**: ESM + CJS with full `.d.ts` declarations
- **Package name**: `@medixdeck/ui`

---

## Running the Dev Preview

```bash
cd d:\eunithelp@outlook.com\MedixDeck\development\medixdeck-ui
npm run dev
# → http://localhost:5173/ (or next available port)
```

---

## Building for NPM

```bash
npm run build
# Outputs: dist/index.js (ESM), dist/index.cjs (CJS), dist/index.d.ts (Types)
```

---

## Components Delivered

### Primitive (7)

| Component | Description |
|---|---|
| `Button` | solid/outline/ghost/link/secondary · xs–lg · 5 color schemes |
| `IconButton` | Round or square icon-only buttons |
| `Badge` | Status badges: success/warning/error/info/neutral |
| `Avatar` / `AvatarGroup` | Profile images with initials fallback |
| `Spinner` / `FullPageSpinner` | Loading indicators |
| `Tag` | Closeable filter chips |
| `Divider` | H/V separator with optional label |

### Form (6)

| Component | Description |
|---|---|
| `Input` / `SearchInput` | Text input with icon support and validation |
| `Textarea` | Multi-line with character count |
| `Select` | Native dropdown from options array |
| `Checkbox` | With optional description |
| `RadioGroup` | Options array with description support |
| `Switch` | Toggle with label/description |
| `FormControl` | Label + helper text + error wrapper |

### Layout (5)

| Component | Description |
|---|---|
| `Card` / `CardHeader` / `CardBody` / `CardFooter` | Surface container |
| `StatCard` | Metric with trend indicator (25K+, 98%) |
| `Container` | Centered max-width wrapper |
| `SectionHeader` | Eyebrow + title + description heading block |

### Navigation (5)

| Component | Description |
|---|---|
| `Navbar` | Responsive with hamburger, sticky/blur/transparent |
| `Breadcrumb` | Page path with custom separator |
| `Tabs` | Line and pill variants with badge count |
| `Pagination` | Ellipsis logic, compact mobile mode |
| `Stepper` | Multi-step flow in horizontal/vertical |

### Feedback & Overlays (6)

| Component | Description |
|---|---|
| `Alert` | subtle/solid/left-accent · info/success/warning/error |
| `Skeleton` / `SkeletonText` / `SkeletonCard` | Shimmer loading placeholders |
| `Progress` | Bar with indeterminate mode |
| `Modal` | Dialog overlay with Chakra v3 API |
| `Tooltip` | Hover labels |
| `EmptyState` | Zero-data screens with CTA |

### Data Display (3)

| Component | Description |
|---|---|
| `Accordion` | FAQ with smooth animations, card variant |
| `TestimonialCard` | Quote + author + star rating |
| `BlogCard` | Article preview with category badge |

### Healthcare-Specific (3)

| Component | Description |
|---|---|
| `DoctorCard` | Profile with rating, fee, Book + View actions |
| `VitalBadge` | Blood pressure, SpO₂, HR with status color |
| `AppointmentCard` | Upcoming/Completed with Join/Reschedule/Cancel |

---

## Using in Other Projects

### 1. Install (once published)

```bash
npm install @medixdeck/ui @chakra-ui/react
```

### 2. Wrap your app

```tsx
// app/layout.tsx (Next.js) or main.tsx (Vite)
import { MedixProvider } from "@medixdeck/ui";

export default function RootLayout({ children }) {
  return (
    <MedixProvider defaultColorMode="light">
      {children}
    </MedixProvider>
  );
}
```

### 3. Use components

```tsx
import { Button, DoctorCard, Navbar } from "@medixdeck/ui";

<Navbar
  logo={<MedixLogo />}
  navItems={[{ label: "How it works", href: "/" }]}
  ctaLabel="Talk to a Doctor"
/>

<DoctorCard
  name="Dr. Amaka Okonkwo"
  specialty="Cardiologist"
  rating={4.9}
  consultationFee="₦5,000"
  onBookClick={handleBook}
/>

<Button variant="solid" colorScheme="blue">Book Appointment</Button>
```

### 4. Link renderer (Next.js / React Router)

```tsx
<Navbar
  renderLink={(item, children) => (
    <Link href={item.href}>{children}</Link>  // Next.js Link
  )}
/>
```

---

## Theme Tokens (for consuming apps)

```tsx
import { system } from "@medixdeck/ui";

// Use with ChakraProvider directly if needed:
<ChakraProvider value={system}>...</ChakraProvider>
```

### Key semantic tokens available in components

- `bg` / `bg.subtle` / `bg.surface`
- `text.heading` / `text.body` / `text.muted`
- `border`
- `blue.500` (#0685FF), `purple.500` (#7700CC)
- Status: `status.success`, `status.warning`, `status.error`

---

## File Structure

```
medixdeck-ui/
├── lib/
│   ├── index.ts                          ← main entry
│   ├── theme/
│   │   ├── index.ts                      ← createSystem
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── components/
│       ├── provider/MedixProvider.tsx
│       ├── primitive/                    ← Button, Badge, Avatar…
│       ├── form/                         ← Input, Select, Checkbox…
│       ├── layout/                       ← Card, StatCard, Container…
│       ├── navigation/                   ← Navbar, Tabs, Pagination…
│       ├── feedback/                     ← Alert, Skeleton, Modal…
│       ├── data/                         ← Accordion, BlogCard…
│       └── healthcare/                   ← DoctorCard, VitalBadge…
├── src/App.tsx                           ← dev showcase app
├── vite.config.ts
├── tsconfig.json / tsconfig.build.json
└── package.json
```

---

## Next Steps

- [ ] Add **Storybook** for interactive component docs
- [ ] Add **unit tests** with Vitest + Testing Library
- [ ] Add **Drawer** component
- [ ] Add **DataTable** with sorting + pagination
- [ ] Add **DatePicker** wrapper
- [ ] Add **OTPInput** / **PinInput**
- [ ] **Publish** to npm: `npm publish --access public`
