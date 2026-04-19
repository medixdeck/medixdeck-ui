# CONTRIBUTING.md

## Contributing to @medixdeck/ui

Thank you for being part of the MedixDeck team! This guide covers how to develop, test, and contribute components to the shared UI library.

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Git**
- A code editor with TypeScript support (VS Code recommended)

---

## Setup

```bash
git clone https://github.com/medixdeck/medixdeck-ui
cd medixdeck-ui
npm install
npm run dev   # → http://localhost:5173/
```

> `framer-motion` is already included in `dependencies` — no extra install needed in this repo. Consuming projects should install it separately.

---

## Development Workflow

### 1. Create the component file

All library code goes in `lib/`:

```txt
lib/components/<category>/<ComponentName>.tsx
```

Available categories: `primitive`, `form`, `layout`, `navigation`, `feedback`, `data`, `healthcare`

### 2. Write the component

Follow the pattern below — **every component gets**:

- A named exported interface with JSDoc
- A JSDoc example at the top of the component function
- A `displayName` for React DevTools
- `"use client"` if it uses state or effects

```tsx
"use client";

import React from "react";
import { Box, type BoxProps, Text } from "@chakra-ui/react";

export interface MyComponentProps extends Omit<BoxProps, "onChange"> {
  /** The current value */
  value?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;
}

/**
 * MedixDeck MyComponent
 *
 * Short description of what it does.
 *
 * @example
 * ```tsx
 * <MyComponent value={val} onChange={setVal} />
 * ```
 */
export function MyComponent({ value, onChange, ...props }: MyComponentProps) {
  return (
    <Box color="text.body" fontFamily="var(--font-body)" {...props}>
      {value}
    </Box>
  );
}

MyComponent.displayName = "MedixMyComponent";
```

### 3. Export from `lib/index.ts`

```ts
// At the appropriate section in lib/index.ts:
export { MyComponent } from "./components/<category>/MyComponent";
export type { MyComponentProps } from "./components/<category>/MyComponent";
```

### 4. Add to the dev preview

In `src/App.tsx`, add a `<Section>` block for your component:

```tsx
<Section title="My Component" id="mycomponent">
  <MyComponent value="Hello" />
</Section>
```

### 5. Verify the build passes

```bash
npm run build
```

Look for `Exit code: 0`. Fix any TypeScript errors before submitting.

---

## Design Guidelines

### Colors — always use tokens

```tsx
// ✅ Use semantic tokens
<Box bg="bg.surface" color="text.heading" borderColor="border" />

// ❌ Never hardcode
<Box bg="#F6F6F6" color="#111926" />
```

### Typography

```tsx
fontFamily="var(--font-body)"     // for body text, labels, form fields
fontFamily="var(--font-heading)"  // for titles and headings
```

### Dark mode

Components automatically support dark mode via semantic tokens. Never check `colorMode` in component code — just use the right token, and the system handles the rest.

### Interactive states

Every interactive element should have:

```tsx
_hover={{ ... }}
_focusVisible={{ outline: "2px solid", outlineColor: "blue.500", outlineOffset: "2px" }}
```

### Animations

Use **Framer Motion** for entrance/exit animations (e.g. panels, menus, modals):

```tsx
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ⚠️ Framer Motion v12 requires bezier tuples, not string easing names
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as [number, number, number, number];

const panelVariants: Variants = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.16, ease: EASE_OUT } },
};

<AnimatePresence>
  {isOpen && (
    <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit">
      {/* content */}
    </motion.div>
  )}
</AnimatePresence>
```

For pure CSS loops (spinners, shimmer), inject a `<style>` tag into `document.head` instead.

### Interactive components — use the Native Bypass pattern

Chakra UI v3's recipe engine leaks default blue in hover/focus states. For any component with **checked, selected, or active state colors**, build with **native HTML** elements and centralize brand colors:

```tsx
const COLORS = {
  blue:   { base: "#0685FF", hover: "#057AE8", ring: "rgba(6,133,255,0.2)" },
  purple: { base: "#7700CC", hover: "#6600B3", ring: "rgba(119,0,204,0.2)" },
} as const;
// Use in inline style / onMouseEnter-Leave handlers, not Chakra colorPalette
```

See `Button.tsx`, `CheckboxRadio.tsx`, `Switch.tsx` for reference implementations.

---

## Chakra UI v3 Cheatsheet

| What you need | v3 API |
| --- | --- |
| Avatar | `<Avatar.Root> <Avatar.Fallback> <Avatar.Image>` |
| Checkbox | `<Checkbox.Root> <Checkbox.HiddenInput> <Checkbox.Control> <Checkbox.Indicator> <Checkbox.Label>` |
| Radio | `<RadioGroup.Root> <RadioGroup.Item> <RadioGroup.ItemHiddenInput> <RadioGroup.ItemIndicator> <RadioGroup.ItemText>` |
| Switch | `<Switch.Root> <Switch.HiddenInput> <Switch.Control> <Switch.Thumb>` |
| Dialog/Modal | `<DialogRoot> <DialogBackdrop> <DialogContent> <DialogHeader> <DialogTitle> <DialogBody> <DialogFooter> <DialogCloseTrigger>` |
| Drawer | `<DrawerRoot> <DrawerBackdrop> <DrawerContent> <DrawerHeader> etc.` |
| Tooltip | `<Tooltip.Root> <Tooltip.Trigger> <Tooltip.Positioner> <Tooltip.Content>` |
| Select | `<NativeSelect.Root> <NativeSelect.Field> <NativeSelect.Indicator>` |
| colorScheme → | `colorPalette` |

---

## Common TypeScript Gotchas

| Problem | Solution |
| --- | --- |
| `Box as="img"` doesn't accept `src` | Use native `<img style={{...}}>` |
| `Box as="label"` doesn't accept `htmlFor` | Use native `<label style={{...}}>` |
| `onChange` conflicts with BoxProps | `Omit<BoxProps, "onChange">` |
| `columns` conflicts with BoxProps | Remove `extends BoxProps` entirely |
| Type `string` not assignable to `"sm" | "md" | "lg"` | Create typed constant maps |

---

## Commit Convention

```txt
feat(button): add loading skeleton variant
fix(avatar): resolve AvatarGroup stacking offset
docs(readme): update DataTable usage example
refactor(theme): consolidate border tokens
```

---

## Pull Request Checklist

- [ ] Component is in the correct `lib/components/<category>/` folder
- [ ] Props interface is exported with JSDoc on every prop
- [ ] Example included in the JSDoc
- [ ] Exported from `lib/index.ts`
- [ ] Added to `src/App.tsx` showcase
- [ ] `npm run build` passes with 0 errors
- [ ] Dark mode tested (toggle in dev preview)
- [ ] Semantic tokens used (no hardcoded colors)
