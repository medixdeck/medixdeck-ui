# MedixDeck UI Component Library Invariants

## 1. Architectural Boundaries

- **Source vs Preview Isolation**: All library source code must live exclusively in `lib/` and be exported through `lib/index.ts`. `src/` is strictly reserved for the dev showcase preview application.
- **Dual Module Output**: Build pipeline must compile to dual ESM (`dist/index.js`) and CJS (`dist/index.cjs`) formats with complete `.d.ts` declaration maps.

## 2. Chakra UI v3 & Compound Patterns

- **Strict v3 APIs**: Use Chakra v3 compound components (`ChakraAvatar.Root`, `DialogRoot`, `ChakraTooltip.Root`, `ChakraCheckbox.Root`, `createSystem`).
- **Never use v2 APIs**: Do not import or utilize `useColorMode`, `useToast`, `extendTheme`, or old monolithic component props.

## 3. Native-First Interactive Components (Brand Fidelity)

- **Prevent Recipe Leaks**: Chakra UI v3's recipe engine leaks default blue (`#3B82F6`) during hover, active, and focus states. Core interactive components (`Button`, `IconButton`, `Checkbox`, `RadioGroup`, `Switch`, `Badge`) must be implemented as native HTML elements with explicit inline styles mapping to MedixDeck brand tokens.

## 4. Visual Boundaries & Zero BoxShadow Rule

- **No Shadows**: Never use `boxShadow`, `shadow`, `card-light`, or `card-dark` in components. Visual boundaries must rely exclusively on clean 1px solid borders (`border="1px solid" borderColor="border"`).
- **Semantic Tokens Only**: Never use hardcoded raw hex values in components. Use semantic tokens (`bg`, `bg.surface`, `bg.subtle`, `text.heading`, `text.body`, `text.muted`, `border`, `blue.500: #0685FF`, `purple.500: #7700CC`).

## 5. Animation & Typography Standards

- **Framer Motion v12**: Easing transitions must use bezier numeric tuples (`[0.0, 0.0, 0.2, 1.0] as [number, number, number, number]`), never string names (e.g., `"easeOut"`).
- **Typography Injection**: `MedixProvider` automatically handles Satoshi (headings) and Inter (body) injection into `<head>`. Consuming apps do not need manual `<link>` tags.

## 6. Mandatory Verification Suite

- Always run and verify all three commands before concluding any task:
  1. `npm run build`
  2. `npm run test`
  3. `npm run pack:check`
