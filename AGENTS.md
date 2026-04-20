# AGENTS.md — AI Agent Guidelines for @medixdeck/ui

> This file is the authoritative reference for any AI agent (Copilot, Cursor, Claude, Gemini, etc.) working in this repository. Read this before writing any code.

---

## 1. What This Repository Is

`@medixdeck/ui` is a **shared React UI component library** for the MedixDeck platform (a Nigerian digital health startup). It is **not** an application — it is a **library** that is imported by other projects such as:

- `medixdeck-website` — Public marketing site (Next.js)
- `medixdeck-webapp` — Patient/Doctor web application (Vite + React)
- `medixdeck-admin` — Admin dashboard (Vite + React)

**The library is published to npm** as `@medixdeck/ui`. Consuming apps install it and use it as they would any npm package.

---

## 2. Tech Stack (Do Not Change These)

| Layer | Technology | Version |
| --- | --- | --- |
| Build tool | Vite (Library Mode) | 6.x |
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Component base | Chakra UI | **v3** (not v2!) |
| Theming | Chakra `createSystem` (Panda CSS engine) | v3 |
| Dark mode | `next-themes` | latest |
| Animations | `framer-motion` | **v12** (optional peer dep) |
| Font | Satoshi (Fontshare CDN) | — |
| Package output | ESM + CJS + `.d.ts` | — |

> **Critical:** This project uses **Chakra UI v3**, which has a completely different API from v2. Do not use v2 patterns. See Section 5 for Chakra v3 specifics.

---

## 3. Repository Structure

```txt
lib/                     ← ALL library source code lives here
  index.ts               ← The only public export file
  theme/                 ← Design tokens and Chakra system config
  components/
    provider/            ← MedixProvider (wraps ChakraProvider + next-themes)
    primitive/           ← Button, Badge, Avatar, Spinner, Tag, Divider, Logo
    form/                ← Input, Select, Checkbox, OTPInput, PhoneInput, DatePicker, DateRangePicker, Combobox, FileUpload
    layout/              ← Card, StatCard, Container, SectionHeader
    navigation/          ← Navbar, Breadcrumb, Tabs, Pagination, Stepper
    feedback/            ← Alert, Skeleton, Progress, Modal, Drawer, Tooltip, EmptyState, Notification
    data/                ← Accordion, TestimonialCard, BlogCard, DataTable
    healthcare/          ← DoctorCard, VitalBadge, AppointmentCard

src/                     ← Dev preview app (NOT part of the library output)
  App.tsx                ← Showcase of all components
  main.tsx               ← Vite dev entry

dist/                    ← Build output (auto-generated, do not edit)
.github/
  copilot-instructions.md ← GitHub Copilot repository instructions
  workflows/publish.yml   ← npm publishing workflow
COPILOT.md               ← concise AI contributor guide
README.md                ← npm landing page and public API index
CHANGELOG.md             ← release notes
LICENSE                  ← package license
```

### ⚠️ Rules

- **Never** put library source code in `src/`. Only the dev preview lives there.
- **Never** import from `src/` inside `lib/`.
- **All new components must be exported** from `lib/index.ts`.
- **Public API changes must stay in sync** across `lib/index.ts`, `README.md`, `src/App.tsx`, Storybook, and `CHANGELOG.md`.
- **Never edit** `dist/` files directly.

### AI helper files

- `AGENTS.md` is the full repository guide for any coding agent.
- `COPILOT.md` is the shorter root guide intended for quick AI repo orientation.
- `.github/copilot-instructions.md` should stay brief and point Copilot back to the repo conventions here.
- When contributor guidance changes, update all three together.

---

## 4. Adding a New Component — Checklist

When asked to add a new component (e.g., `FileUpload`, `DateRangePicker`):

1. **Choose the right folder**: `lib/components/<category>/<ComponentName>.tsx`
   - `primitive/` — basic building blocks (buttons, icons, chips)
   - `form/` — anything users type into or select
   - `layout/` — structural/display containers
   - `navigation/` — routing and page flow
   - `feedback/` — overlays, alerts, loading states
   - `data/` — tables, cards, display components
   - `healthcare/` — domain-specific (doctor, patient, vital signs)

2. **Follow the component template**:

   ```tsx
   "use client"; // if using state/effects

   import React from "react";
   import { Box, type BoxProps, Text } from "@chakra-ui/react";

   export interface MyComponentProps extends Omit<BoxProps, "onChange"> {
     /** JSDoc every prop */
     value?: string;
     onChange?: (value: string) => void;
   }

   /**
    * MedixDeck MyComponent
    *
    * @example
    * ```tsx
    * <MyComponent value="hello" onChange={setValue} />
    * ```
    */
   export function MyComponent({ value, onChange, ...props }: MyComponentProps) {
     return (
       <Box {...props}>
         {/* implementation */}
       </Box>
     );
   }
   ```

3. **Export from `lib/index.ts`**:

   ```ts
   export { MyComponent } from "./components/<category>/MyComponent";
   export type { MyComponentProps } from "./components/<category>/MyComponent";
   ```

4. **Add to the dev showcase** in `src/App.tsx` — wrap in a `<Section>` block.

5. **Run the verification commands** to confirm the package stays publishable:

   ```bash
   npm run build
   npm run test
   npm run pack:check
   ```

---

## 5. Chakra UI v3 API Patterns

This project uses **Chakra UI v3** which is architecturally different from v2.

### ✅ v3 Patterns (use these)

```tsx
// Compound avatar (v3)
<ChakraAvatar.Root size="md">
  <ChakraAvatar.Fallback name="John Doe" />
  <ChakraAvatar.Image src="/photo.jpg" alt="John" />
</ChakraAvatar.Root>

// Compound checkbox (v3)
<ChakraCheckbox.Root colorPalette="blue">
  <ChakraCheckbox.HiddenInput />
  <ChakraCheckbox.Control>
    <ChakraCheckbox.Indicator />
  </ChakraCheckbox.Control>
  <ChakraCheckbox.Label>Agree</ChakraCheckbox.Label>
</ChakraCheckbox.Root>

// Compound dialog/modal (v3)
<DialogRoot open={isOpen} onOpenChange={(d) => !d.open && onClose()}>
  <DialogBackdrop />
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
    <DialogBody>Content</DialogBody>
    <DialogCloseTrigger />
  </DialogContent>
</DialogRoot>

// Compound tooltip (v3)
<ChakraTooltip.Root>
  <ChakraTooltip.Trigger asChild><span>{children}</span></ChakraTooltip.Trigger>
  <ChakraTooltip.Positioner>
    <ChakraTooltip.Content>Label</ChakraTooltip.Content>
  </ChakraTooltip.Positioner>
</ChakraTooltip.Root>

// Theming (v3)
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
const system = createSystem(defaultConfig, myConfig);

// colorPalette (v3 term for colorScheme)
<Button colorPalette="blue" />
```

### ❌ v2 Patterns (never use)

```tsx
// ❌ v2 - old API
import { useColorMode, useToast } from "@chakra-ui/react"; // hooks don't exist same way in v3
<Avatar src="..." name="..." />  // no compound API in v2
<Checkbox colorScheme="blue" />  // colorPalette in v3
<extendTheme />  // defineConfig in v3
```

### Type gotchas

| Gotcha | Fix |
| --- | --- |
| `Box as="img"` doesn't accept `src` | Use native `<img>` with inline `style` |
| `Box as="label"` doesn't accept `htmlFor` | Use native `<label>` with inline `style` |
| `interface Foo extends BoxProps {}` where `Foo` has `onChange?: (val: string)` | Use `Omit<BoxProps, "onChange">` to avoid `FormEventHandler` conflict |
| `sx` prop doesn't exist | Inject keyframes via `document.createElement("style")` or use `animation` prop directly |
| `AvatarProps`, `TooltipProps`, `CheckboxProps`, `SwitchProps`, `NativeSelectProps` don't exist | Use `AvatarRootProps`, `TooltipRootProps`, `CheckboxRootProps`, `SwitchRootProps`, `NativeSelectRootProps` |
| `ChakraAvatar.Group` doesn't exist in v3 | Build manual stacking with `Box` |
| `variant` / `size` type mismatch on Chakra components | Define explicit typed constants e.g. `const sizeMap: Record<..., "xs" | "sm" | "md"> = {...}` |
| `globalCss` doesn't accept `@import` | Define `--font-*` CSS vars in MedixProvider's injected `<style>` block |
| `WebkitFontSmoothing` in `globalCss` | Cast as `SystemStyleObject` or use lowercase `-webkit-font-smoothing` |

### Font loading

`MedixProvider` automatically injects Satoshi (Fontshare) and Inter (Google Fonts) `<link>` tags plus `--font-body` / `--font-heading` / `--font-mono` CSS custom properties into `document.head` on mount. **Do NOT** add font `<link>` tags to `index.html` or the consuming project's `<head>` — it will cause duplicate requests and is not needed.

### Dark mode pattern

`next-themes` (used by `MedixProvider`) applies `.dark` to `<html>`. Chakra v3 semantic tokens look for `.dark` on an ancestor. **Always apply the dark class on `<html>` — never on an inner component.** In a dev-preview / Vite app without next-themes' automatic toggle, do:

```tsx
useEffect(() => {
  document.documentElement.classList.toggle("dark", colorMode === "dark");
}, [colorMode]);
```

Applying `className="dark"` on a `<Box>` that doesn't wrap sticky / portalled components (like `Navbar`, `Modal`, `Drawer`) will break those components' dark mode.

---

## 6. Design System Rules

### Colors — always use semantic tokens, not raw hex

```tsx
// ✅ Correct — adapts to light/dark mode
<Box bg="bg.surface" color="text.heading" borderColor="border" />

// ❌ Wrong — hardcoded, breaks dark mode
<Box bg="#F6F6F6" color="#111926" borderColor="#E2E8F0" />
```

### Brand colors (semantic tokens available)

| Token | Value |
| --- | --- |
| `blue.500` | #0685FF (Primary) |
| `purple.500` | #7700CC (Secondary) |
| `bg` | Background (light: #FEFEFE, dark: #0A1220) |
| `bg.surface` | Surface (light: #F6F6F6, dark: #152035) |
| `bg.subtle` | Subtle bg (light: #F0F4F8, dark: #0F1C2E) |
| `text.heading` | #111926 / #F5F6F8 |
| `text.body` | #374151 / #CBD5E1 |
| `text.muted` | #6B7280 / #94A3B8 |
| `border` | #E2E8F0 / #1E3554 |

### Typography

Always use one of:

```tsx
fontFamily="var(--font-body)"      // body text, labels, helper text
fontFamily="var(--font-heading)"   // headings, card titles, nav items
```

### Spacing and Radius

| Token | Value | Use for |
| --- | --- | --- |
| `borderRadius="card"` | 12px | Cards, containers |
| `borderRadius="modal"` | 16px | Modals, drawers |
| `borderRadius="badge"` | 4px | Badges, tags |
| `borderRadius="md"` | 8px | Buttons, inputs |
| `borderRadius="full"` | 9999px | Avatars, pills |

---

## 7. TypeScript Rules

- **All component props must have a named exported interface** — e.g., `export interface ButtonProps`
- **JSDoc every prop** with `/** description */`
- **`unknown` is not a valid prop type** for something you intend to pass to Chakra — use the correct Chakra type or a specific union
- **Never use `any`**
- Avoid `[key: string]: unknown` on interfaces that extend Chakra root props — it confuses the TypeScript checker
- When extending `BoxProps`, always check if your custom props conflict (e.g., `onChange`, `columns`, `size`) and `Omit` them

---

## 8. Styling Rules

- **No inline hardcoded colors** — use semantic tokens
- **No Tailwind** — this project uses Chakra's style props exclusively
- **No `className` for layout** — use Chakra `Box` props
- **Animations** — use `framer-motion` (`motion`, `AnimatePresence`) for entrance/exit animations. Inject CSS keyframes via a `<style>` tag in `document.head` for pure CSS loops (spinners).
- **Framer Motion easing** — Framer Motion v12 requires bezier tuples, not string names. Use `[number, number, number, number]` format:

  ```ts
  // ✅ Correct
  const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as [number, number, number, number];
  transition={{ ease: EASE_OUT }}

  // ❌ Wrong — TypeScript error in v12
  transition={{ ease: "easeOut" }}
  ```

- **Native HTML elements** (`<img>`, `<label>`, `<input>`) — use inline `style` objects when Chakra Box doesn't support the needed attributes
- **`:hover` and `_hover`** — use `_hover={{ ... }}` on Box/Chakra components

---

## 9. Build & Verification

After any change to the library source or package metadata, run:

```bash
npm run build
npm run test
npm run pack:check
```

A successful build outputs:

```txt
✓ 43 modules transformed.
dist/index.js  ~124 kB │ gzip: ~25 kB
dist/index.cjs  ~75 kB │ gzip: ~19 kB
✓ Declaration files built
Exit code: 0
```

If any of these fail, **do not leave the repo in a failing state**. Fix the TypeScript, packaging, or test issue before completing your task.

---

## 10. Dev Preview

```bash
npm run dev
# → http://localhost:5173/
```

The dev preview (`src/App.tsx`) showcases every component. When you add a new component, add it to the preview — this serves as a visual regression test.

---

## 11. Anti-Patterns to Avoid

| ❌ Don't | ✅ Do instead |
| --- | --- |
| Add components to `src/` as library files | Add to `lib/components/` |
| Forget to export from `lib/index.ts` | Always export both value and type |
| Use raw hex colors | Use semantic tokens |
| Use `Box as="img"` with `src` | Use native `<img>` with `style` |
| Use `Box as="label"` with `htmlFor` | Use native `<label>` with `style` |
| Extend `BoxProps` when adding `onChange`, `size`, `columns` | `Omit<BoxProps, "onChange" \| "size">` first |
| Use `sx` prop | Inject keyframes via `document.createElement("style")` |
| Import from v2 Chakra API | Use Chakra v3 compound API |
| Leave build errors | Fix all before committing |
| Write components that import from `src/` | Only import from `lib/` |
| Apply `className="dark"` on an inner `<Box>` | Apply on `document.documentElement` so all components including Navbar get dark mode |
| Add font `<link>` tags in consuming project's `<head>` | `MedixProvider` injects them automatically — nothing needed in host HTML |
| Use Chakra `colorPalette` for interactive components (Button, Checkbox, Switch) | Build as native HTML with explicit brand hex values — Chakra recipe engine leaks default blue in hover/focus states |
| Use string easing in Framer Motion v12 (`ease: "easeOut"`) | Use bezier tuples: `[0.0, 0.0, 0.2, 1.0] as [number,number,number,number]` |

---

## 12. Consuming Project Integration Pattern

When helping a consuming project (e.g., the website or app) use this library:

```tsx
// 1. Install (once the library is published)
// npm install @medixdeck/ui framer-motion

// 2. Wrap root with MedixProvider — it injects Satoshi + Inter fonts automatically.
//    No font <link> tags needed in the host HTML.
<MedixProvider defaultColorMode="light">{children}</MedixProvider>

// 3. Import and use
import { Button, Navbar, DoctorCard, Logo } from "@medixdeck/ui";

// Logo — inline SVG, works without any image/asset setup
<Logo />                              // full blue, 32px (default)
<Logo variant="white" height={28} />  // white, for dark headers
<Logo type="icon" />                  // icon-only mark

// Navbar — default CTA pattern: [label button] [↗ icon button]
<Navbar
  navItems={[{ label: "How it works", href: "/how-it-works" }]}
  ctaLabel="Talk to a Doctor"
  ctaHref="/consult"            // label button navigates here
  isSticky
/>

// Separate icon button destination
<Navbar
  ctaLabel="Talk to a Doctor"
  ctaHref="/consult"                   // label button
  ctaIconHref="https://app.medixdeck.com"  // ↗ icon button (different URL)
  onCtaIconClick={() => analytics.track("app_opened")}
  secondaryCtaLabel="Sign In"
  secondaryCtaHref="/login"
/>

// Full custom CTA slot (replaces the default button group)
<Navbar
  ctaSlot={
    <Box display="flex" gap="2">
      <Button variant="ghost" colorScheme="blue" onClick={() => router.push("/login")}>Sign In</Button>
      <Button variant="solid" colorScheme="purple" onClick={() => router.push("/signup")}>Get Started</Button>
    </Box>
  }
/>

// Custom logo override
<Navbar logo={<Logo variant="purple" height={28} />} navItems={[...]} />
```

---

## 13. Component Conventions Summary

| Convention | Rule |
| --- | --- |
| File naming | `PascalCase.tsx` |
| Export style | Named exports only (no default exports from lib) |
| Props interface | `ComponentNameProps` |
| Forwarded refs | Use `React.forwardRef` only when necessary (inputs, etc.) |
| Display names | Set `ComponentName.displayName = "MedixComponentName"` |
| "use client" | Include at top of files using React state/effects |
| Color prop naming | Use `colorScheme` in our API → maps to `colorPalette` internally for Chakra |
| Size prop | Use `xs \| sm \| md \| lg` in our API → map to Chakra's internal sizes |
| Variant prop | Use human-friendly names (`solid`, `outline`, `ghost`) → map internally |

---

## 14. npm Publishing Standards

- `package.json` is the source of truth for npm metadata. Keep `description`, `exports`, `types`, `files`, `repository`, `homepage`, `bugs`, `engines`, and `publishConfig` current.
- Runtime-only package deps belong in `dependencies`; test and Storybook tooling belong in `devDependencies`.
- Any component shown in `src/App.tsx` or Storybook and intended for consumers must also be exported from `lib/index.ts`.
- The publish workflow should run install, build, test, and `npm pack --dry-run` before `npm publish`.
- Never publish from source files. The npm package should publish the compiled `dist/` output.

---

## 15. Native-First Interactive Components

Chakra UI v3's internal recipe engine leaks default blue (`#3B82F6`) in interactive states (hover, active, checked ring) even when semantic token overrides are applied. To guarantee 100% MedixDeck brand fidelity, **core interactive components are built as native HTML elements**:

| Component | Implementation |
| --- | --- |
| `Button` / `IconButton` | Native `<button>` with inline style, brand hex hover/active states |
| `Checkbox` | Native `<input type="checkbox">` with custom visual control overlay |
| `RadioGroup` | Native `<input type="radio">` per option with custom indicator |
| `Switch` | Native `role="switch"` with animated track + thumb |
| `Badge` | Pure `<span>` with semantic color map — no Chakra recipe |

### Pattern for new interactive components

When adding any new interactive component that has **checked / selected / active states** with color:

1. **Do NOT use** Chakra compound components (`Checkbox.Root`, `Switch.Root`, etc.) for the visual layer
2. Build with native HTML elements
3. Centralise brand colors in a `COLORS` constant at the top of the file:

```tsx
const COLORS = {
  blue:   { base: "#0685FF", hover: "#057AE8", ring: "rgba(6,133,255,0.2)" },
  purple: { base: "#7700CC", hover: "#6600B3", ring: "rgba(119,0,204,0.2)" },
  // ...
} as const;
```

1. Apply states via inline `style` and React `onMouseEnter/Leave` or CSS-in-JS where needed.

---

## 16. Logo Component

`Logo` lives in `lib/components/primitive/Logo.tsx`. It is a **pure inline SVG** component — no image files, no asset pipeline, works in every consuming project immediately.

```tsx
import { Logo } from "@medixdeck/ui";

// Props
type LogoVariant = "blue" | "purple" | "black" | "white";
type LogoType    = "full" | "icon"; // full = mark + wordmark, icon = mark only

<Logo />                                      // blue, full, 32px
<Logo variant="purple" type="icon" />          // purple mark only
<Logo variant="white" height={28} />           // white full at 28px
<Logo variant="black" type="icon" height={48} />
```

The `Navbar` falls back to `<Logo height={28} />` when no `logo` prop is supplied:

```tsx
// No logo prop — defaults to brand Logo
<Navbar navItems={[...]} />

// Override with any ReactNode
<Navbar logo={<Logo variant="purple" height={28} />} navItems={[...]} />
<Navbar logo={<img src="/my-logo.png" height={28} alt="Brand" />} navItems={[...]} />
```
