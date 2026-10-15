# CSS frameworks comparison

The same Next.js landing page ("Visit Mars") built six times, once per styling approach, to decide what replaces styled-components. Every app has the same tokens, components, light/dark theme, breakpoints and container query. The only differences are how each library expresses them.

| App | Library | Authoring style |
| --- | --- | --- |
| [`apps/css-modules`](apps/css-modules) | CSS Modules (built into Next) | `.module.css` files |
| [`apps/tailwind`](apps/tailwind) | Tailwind CSS 4.3 | utility classes + `cva` |
| [`apps/next-yak`](apps/next-yak) | next-yak 9.10 | `styled` template literals (SWC) |
| [`apps/linaria`](apps/linaria) | Linaria 8.2 via `@wyw-in-js/nextjs` | `styled` template literals (build-time eval) |
| [`apps/stylex`](apps/stylex) | StyleX 0.19 | `stylex.create` objects |
| [`apps/panda`](apps/panda) | Panda CSS 2.2 | `css()` objects + recipes |

Each app is standalone, with its own lockfile and configs, and nothing is shared between them. `PLAN.md` has the full spec and `PRD.md` the original brief.

> [!IMPORTANT]
> Open each app as its own VS Code window, e.g. `code apps/tailwind`, not the repo root. VS Code only reads `.vscode/settings.json` and `.vscode/extensions.json` from the folder you open, so from the root none of the per-app settings or extension recommendations apply, and Biome and TypeScript won't pick up the app's config.

## Running

Requirements: Node 22 or newer (the measurements used 24.15), bun 1.3, and [hyperfine](https://github.com/sharkdp/hyperfine) for the benchmarks.

```sh
cd apps/<name>
bun install
bun run dev        # http://localhost:3000, plus /showcase
bun run lint       # Biome
bun run typecheck  # tsc (runs codegen first where an app needs it)
bun run build
```

Benchmarks (builds every app 22 times, takes about 20 minutes):

```sh
cd bench
bun install
bun run bench      # writes bench/results/*.json and the tables below
```

## What every app implements

- **Tokens.** Two tiers: a primitive palette (`neutral-*`, `mars-*`, spacing, radii, type scale) and semantic tokens (`color-background`, `color-surface`, `color-text-primary`, `color-accent`, and so on) that switch between dark (the default) and light. Font sizes are in `pt` and everything else in `px`.
- **Theme.** `data-theme` on `<html>` starts from `prefers-color-scheme`, a client `ThemeToggle` flips it and saves it to `localStorage`, and an inline script in `<head>` prevents a flash on load.
- **Reusable chunks.** A `surface` mixin used by the card and a `focusRing` mixin used by the buttons.
- **Variants.** `Button` takes `variant: "primary" | "secondary"` and `size: "medium" | "large"`.
- **Responsive layout.** Breakpoints are `sm` 640, `md` 768 and `lg` 1024. The hero goes from stacked to two columns at `lg`, the heading grows at `md` and `lg`, and the card list goes to two columns at `md`. The card's footer uses a **container query** (≥ 400px of card content) to switch from stacked buttons to a row.
- **Server components.** Everything is a server component except `ThemeToggle`.

All six apps render the same page pixel for pixel. Screenshots at 375, 768 and 1280px in both themes showed 0 differing pixels against the CSS Modules app.

## Requirement matrix

✅ works well · ⚠️ works with a cost · ❌ not supported or works against the library

| | CSS Modules | Tailwind | next-yak | Linaria | StyleX | Panda |
| --- | --- | --- | --- | --- | --- | --- |
| Design tokens | ⚠️ CSS variables, untyped in TS | ✅ `@theme` becomes utilities | ⚠️ CSS variables + typed TS refs, declared twice | ⚠️ same as yak | ✅ `defineVars`, typed | ✅ typed, `strictTokens` |
| Light/dark | ✅ `[data-theme]` overrides | ✅ same variables overridden in `@layer base` | ✅ `globalStyle` | ✅ `:global()` | ✅ `light-dark()` + `color-scheme` | ✅ semantic tokens `base` / `_light` |
| Reusable chunks | ✅ `composes` (whole classes only) | ⚠️ `@utility` in CSS, class strings in TS | ✅ `css` mixins interpolated | ⚠️ plain strings, no highlighting | ✅ shared `create` objects | ✅ `layerStyles` + spread objects |
| Prop-driven variants | ✅ `styles[variant]` | ✅ `cva` | ✅ `${p => css…}`, same as styled-components | ⚠️ data attributes only | ✅ variant maps | ✅ config recipes, typed |
| Media queries without literals | ✅ `@custom-media` (2 PostCSS plugins) | ✅ breakpoint tokens | ✅ TS constants | ✅ TS constants | ✅ `defineConsts` | ✅ breakpoint tokens (emitted as `rem`) |
| Container queries without literals | ❌ literal `400px` | ✅ `@card-wide:` | ✅ TS constant | ✅ TS constant | ✅ `defineConsts` | ✅ `@/cardWide` |
| Nesting + media queries inside the wrapper | ✅ native nesting | ❌ prefixes on every class | ✅ | ✅ | ❌ no descendant selectors | ⚠️ per-property conditions, `& svg` allowed |
| Native CSS / template literals | ✅ plain CSS | ❌ | ✅ | ✅ | ❌ objects | ❌ objects (template literals removed in v2) |
| Biome lint + format | ✅ CSS, CSS Modules, `@custom-media` | ✅ with `tailwindDirectives` | ⚠️ CSS inside `${}` templates isn't formatted | ⚠️ same as yak | ✅ (allow-list `@stylex`) | ✅ |
| Editor autocomplete/highlighting | ✅ CSS language service + class names | ✅ Tailwind IntelliSense | ⚠️ styled-components extension (last update 2023) | ⚠️ same as yak | ✅ via TS types | ✅ via TS types (v2 extension unverified) |
| Type-safety | ⚠️ none for class names: Next types every module as `{ [key: string]: string }` | ⚠️ only `cva` props are typed | ⚠️ token refs only | ⚠️ token refs only | ✅ typed style contracts | ✅ `strictTokens`, typed recipes |
| Turbopack (`dev` + `build`) | ✅ | ✅ | ✅ | ✅ | ✅ (Babel runs on all app code) | ✅ |
| Setup | PostCSS + 2 plugins | 1 PostCSS plugin | 1 config wrapper | 1 config wrapper | Babel + PostCSS config, layer ordering | config + codegen (~130 generated files) |

## Side by side

### Button variants

**CSS Modules.** One class per variant, selected by key:

```css
.primary {
  background: var(--color-accent);
  color: var(--color-text-on-accent);

  &:hover {
    background: var(--color-accent-hover);
  }
}
```

```tsx
const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean);
```

**Tailwind.** `cva` maps props to class strings:

```ts
const button = cva("focus-ring inline-flex items-center gap-2 rounded-medium border font-medium", {
  variants: {
    variant: {
      primary: "bg-accent text-text-on-accent hover:bg-accent-hover",
      secondary: "border-border bg-transparent text-text-primary hover:bg-surface-hover",
    },
  },
});
```

**next-yak.** The styled-components pattern, compiled away:

```tsx
const Base = styled.button<{ $variant: Variant }>`
  ${focusRing};
  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          background: ${color.accent};
          &:hover { background: ${color.accentHover}; }
        `
      : css`…`}
`;
```

**Linaria.** Props can only become CSS variable values, so variants are attribute selectors:

```tsx
const Base = styled.button`
  ${focusRing};
  &[data-variant="primary"] {
    background: ${color.accent};
    &:hover { background: ${color.accentHover}; }
  }
`;
// <Base data-variant={variant} data-size={size} />
```

**StyleX.** Variant maps merged at the call site, with the last style winning:

```tsx
const variants = stylex.create({
  primary: {
    backgroundColor: { default: theme.colors.accent, ":hover": theme.colors.accentHover },
    color: theme.colors.textOnAccent,
  },
});
// <button sx={[mixins.focusRing, styles.base, variants[variant], sizes[size]]}>
```

**Panda.** A config recipe produces a typed `button()` function:

```ts
export const buttonRecipe = defineRecipe({
  base: { display: "inline-flex", gap: "2", ...focusRing },
  variants: {
    variant: {
      primary: { bg: "accent", color: "text.onAccent", _hover: { bg: "accent.hover" } },
    },
  },
});
```

### Card: media query and container query

```css
/* CSS Modules */
.card {
  container-type: inline-size;
  padding: var(--spacing-6);
  @media (--md) { padding: var(--spacing-8); }
}
.footer {
  flex-direction: column-reverse;
  @container (width >= 400px) { flex-direction: row; } /* @custom-media can't be used here */
}
```

```tsx
// Tailwind
<article className="surface @container p-6 md:p-8" />
<div className="flex flex-col-reverse @card-wide:flex-row @card-wide:justify-end" />

// next-yak / Linaria (identical)
const Wrapper = styled.article`
  ${surface};
  container-type: inline-size;
  padding: ${spacing.s6};
  ${media.md} { padding: ${spacing.s8}; }
`;
const Footer = styled.div`
  flex-direction: column-reverse;
  ${container.cardWide} { flex-direction: row; }
`;

// StyleX
card: { containerType: "inline-size", padding: { default: theme.sizes.spacing[6], [media.md]: theme.sizes.spacing[8] } },
footer: { flexDirection: { default: "column-reverse", [container.cardWide]: "row" } },

// Panda
card: css({ layerStyle: "surface", containerType: "inline-size", p: { base: "6", md: "8" } }),
footer: css({ flexDirection: { base: "column-reverse", "@/cardWide": "row" } }),
```

## Showcases

Each app has a `/showcase` route (`src/showcase/TripCard.tsx`) with one thing that library does better than the others. The visual-parity check and the benchmarks only look at `/`, so these pages don't affect them.

**StyleX: typed style contracts.** `TripCard` accepts `sx?: StyleXStyles<{ marginBlock?, inlineSize?, maxInlineSize? }>`. Passing an `sx` that sets `color` fails `tsc` (TS2322), and the file keeps that case as a `@ts-expect-error` line so the typecheck proves it. This is the "AI-safe design system" argument. A component decides which properties callers may touch, and the compiler enforces it. It only covers what goes through the `sx` prop. Nothing stops a caller from wrapping the component in another element and styling that.

**next-yak: styled-components ergonomics at zero runtime.** `${Wrapper}:hover ${Title}` targets components imported from another file, and `$progress` drives a progress bar width. yak compiles the prop to an inline CSS variable, `style="--yaLdB8v3:25%"`, behind a static rule. The browser never generates styles.

**Linaria: arbitrary JS at build time.** A loop over the token palette, `Object.values(mars).map(…)`, builds a gradient and a stripe pattern. WyW runs that code in Node during the build and ships a static `linear-gradient(90deg,#f4a37e 0%,…)`. yak's static parser can't do this. It doesn't even accept `as const` or numeric object keys.

**Tailwind: a closed design system and state without JS.** `--*: initial` removes every default token, so `bg-red-500` emits no CSS. The built stylesheet has no match for it. Biome doesn't warn about the class either; only the Tailwind extension's IntelliSense would. Selection, hover and keyboard focus come from `peer-checked:`, `group-hover:` and `has-[:focus-visible]:` on a radio list.

**CSS Modules: the platform.** `:has()` highlights the card when an item is hovered, `@scope` limits element selectors to the card, and a container style query (`@container style(--featured: true)`) turns on the "Featured" badge from a custom property instead of a prop. Turbopack's CSS Modules rejects a bare `li` inside `@scope` as "not pure", so the selector is `:scope li`.

**Panda: typed multi-part recipes.** `TripCard` is an `sva` slot recipe in which one `tone: "featured"` variant restyles the root, title and icons together. Under `strictTokens`, `{ color: "#f00" }` fails `tsc`. The cost is that every one-off value needs the escape syntax (`"[40px]"`, `"[1.5]"`).

## Benchmarks

<!-- bench:start -->

Measured 2026-10-15 on Apple M1 Max (10 cores, 64 GB), Darwin 27.0.0, Node v24.15.0, bun 1.3.13, Chromium 156.0.8078.4. Values are median (p95) of 10 runs. Raw data: `bench/results/`.

### Build time (seconds, `bun run build`)

| App | Cold (no `.next`) | Warm (cached) | Peak RSS, cold (MB, largest process) |
| --- | --- | --- | --- |
| css-modules | 3.23 (3.71) | 1.79 (1.88) | 821 (846) |
| tailwind | 3.07 (3.22) | 1.65 (1.69) | 809 (823) |
| next-yak | 3.68 (3.91) | 1.66 (1.88) | 874 (905) |
| linaria | 4.22 (4.64) | 2.14 (2.24) | 869 (903) |
| stylex | 4.59 (4.98) | 1.67 (1.71) | 838 (859) |
| panda | 3.13 (3.41) | 1.79 (1.88) | 822 (841) |

### First-load bytes for `/` (brotli)

| App | CSS | JS | JS vs CSS Modules | HTML |
| --- | --- | --- | --- | --- |
| css-modules | 2.5 KB | 148.6 KB | +0.0 KB | 3.4 KB |
| tailwind | 3.7 KB | 148.6 KB | +0.0 KB | 3.7 KB |
| next-yak | 2.3 KB | 149.3 KB | +0.8 KB | 3.4 KB |
| linaria | 2.2 KB | 150.8 KB | +2.2 KB | 3.4 KB |
| stylex | 2.6 KB | 149.4 KB | +0.8 KB | 3.9 KB |
| panda | 2.8 KB | 153.8 KB | +5.2 KB | 3.8 KB |

### Browser cost for `/` (ms, Chromium, 4× CPU throttle)

| App | Parse stylesheets | Recalculate style | Layout | FCP | LCP | Theme toggle recalc |
| --- | --- | --- | --- | --- | --- | --- |
| css-modules | 0.6 (1.3) | 3.6 (4.8) | 21.0 (28.3) | 60.0 (72.0) | 60.0 (72.0) | 2.7 (4.0) |
| tailwind | 0.8 (1.4) | 4.0 (5.0) | 21.3 (23.0) | 64.0 (68.0) | 64.0 (68.0) | 5.0 (6.4) |
| next-yak | 0.5 (0.8) | 3.2 (4.0) | 22.4 (30.0) | 64.0 (76.0) | 64.0 (76.0) | 3.4 (4.8) |
| linaria | 0.4 (0.9) | 3.3 (4.7) | 22.7 (28.5) | 64.0 (76.0) | 64.0 (76.0) | 2.8 (3.7) |
| stylex | 0.6 (0.9) | 3.4 (4.3) | 22.6 (27.9) | 64.0 (72.0) | 64.0 (72.0) | 2.7 (3.8) |
| panda | 0.8 (1.1) | 4.0 (4.5) | 23.8 (26.9) | 66.0 (76.0) | 66.0 (76.0) | 3.2 (3.8) |

<!-- bench:end -->

### Reading the numbers

- **Bundle size barely separates them.** CSS is 2 to 4 KB everywhere, and roughly 149 KB of JS is the Next/React baseline. The JS deltas come from the one client component (`ThemeToggle`), which pulls in each library's runtime helper: `stylex.props` and yak (+0.8 KB), Linaria's `styled` (+2.2 KB), and Panda's `css()` and `cx` (+5.2 KB, because Panda computes class names at runtime). Server components ship no styling JS in any app. The more client components you style, the more these deltas matter.
- **Tailwind ships the most CSS**, 3.7 KB against 2.2 to 2.8 KB for the rest. That's preflight plus one utility per value used.
- **The browser can't tell them apart.** Parse, style recalculation, layout, FCP and LCP all fall within noise. Between two full benchmark runs, the same app's FCP median moved by up to 14 ms (Panda measured 72, 80 and 66 ms across three runs), which is more than the gap between any two apps. The one repeat outlier is Tailwind's theme-toggle recalculation, 4.9 to 5.7 ms against about 3 ms elsewhere in every run, likely from the `:where([data-theme=light] *)` variant on the icons. That's real but tiny.
- **Build time is the only meaningful difference.** Tailwind, CSS Modules, Panda and next-yak finish cold builds within 0.6 s of each other. Linaria costs about 1.1 s more (it executes style code in Node), and StyleX about 1.5 s more (Babel over every file). With a warm cache, all six build in 1.7 to 2.1 s.

## Problems hit during setup

**All apps**
- TypeScript 7.0.2 ships no `tsserver` or JS compiler API, so tsserver plugins can't load on it. Builds and `tsc` are fine. See the last section.
- Since TypeScript 6, `@types/*` packages aren't included automatically, so the bench `tsconfig.json` needs `"types": ["node"]`.
- `biome migrate` (2.5.15) turned `"recommended": true` into `"preset": "none"`, which silently disables every lint rule. Set `"preset": "recommended"` by hand.
- Container queries measure the content box. A 448px threshold never matched at 1280px because the card content is about 430px wide, so I changed the token to 400px.
- Tailwind's preflight gives buttons `font: inherit` and the body `line-height: 1.5`. Without matching those in every app, the other five drifted by about 2px. They're now part of the shared base styles.
- Using `px` for type means text doesn't scale with the browser's default font size setting (page zoom still works).

**CSS Modules**
- `@custom-media` needs `postcss-custom-media` plus `@csstools/postcss-global-data` to make one breakpoints file visible everywhere. It works under Turbopack.
- `@custom-media` only applies to `@media`; the container query needs the literal `400px`.
- Class names aren't type-checked. Next declares every `*.module.css` as `{ [key: string]: string }`, so `styles.itemTitel` passes `tsc` and the element silently renders without its class. Catching that in `tsc` takes generated `.d.ts` files from a tool like `typed-css-modules` or css-modules-kit. I tried `typed-css-modules` and dropped it to avoid the extra generation step.
- Biome's `noUndeclaredCustomProperties` (nursery) catches a misspelled `var(--…)`. It only counts variables it can see, so every module starts with `@import "@/theme/tokens.css"`. In practice one importing module is enough for the whole project, but the per-file import makes each file explicit. Turbopack deduplicates the import, so the token block ships once. `tokens.css` turns the rule off, because `--font-geist-*` comes from `next/font` at runtime.
- `var(--` autocomplete comes from the CSS Variables extension (`cssVariables.lookupFiles`), not from the imports.
- VS Code doesn't resolve `@/` in CSS by default. The hidden setting `"css.importAliases": { "@/": "/src/" }` makes `@import` paths clickable when `apps/css-modules` is the open folder. `composes … from` paths are never links, relative or aliased.
- The PostCSS Language Support extension claims every `.css` file, which disables VS Code's CSS features and Biome in the editor. `"files.associations": { "*.css": "css" }` takes them back, and `.vscode/css-data.json` declares `composes` and `@custom-media` so CSS mode doesn't flag them.
- In the editor, Biome flagged `:global` as an unknown pseudo-class, while the CLI didn't. `"css": { "parser": { "cssModules": true } }` in `biome.json` fixes it.

**Tailwind**
- A token named `--color-text-primary` becomes the class `text-text-primary`.
- `tailwind-merge` doesn't read `@theme`. Custom names (`text-small`, `rounded-medium`, `font-regular`) have to be declared again in `extendTailwindMerge`, or `text-small` is treated as a color and dropped next to `text-text-on-accent`.
- `--*: initial` also removes the line-height and letter-spacing scales, so those become arbitrary values (`leading-[1.5]`, `tracking-[1px]`), as does 40px, which isn't on the spacing scale.

**next-yak**
- The cross-file constant resolver only reads object properties with identifier keys. It drops `spacing[8]` and `"8": "32px"`, and the build fails with `Unable to resolve "spacing.8"`, so spacing became `spacing.s8`.
- It doesn't parse `as const` objects either, so token objects must be plain literals.
- Plain `.ts` files work for breakpoint constants; no `*.yak.ts` file was needed.
- Biome's embedded CSS formatting works on `css\`color:blue\`` but skips any template that contains `${}`, which is nearly every real template.

**Linaria**
- The `@wyw-in-js/nextjs` README describes Turbopack support for `next dev` only, but `next build` on Turbopack worked.
- Mixins are plain template strings, so editors don't highlight them and Biome doesn't format them.
- Prop interpolation only produces values (CSS variables), so conditional blocks per prop aren't possible. Variants use data attributes.

**StyleX**
- `stylex.when.ancestor(…)` must be written inline inside `stylex.create`. Moving it into a constant fails prerendering with "Unexpected 'stylex.when.ancestor' call at runtime".
- `useCSSLayers` puts all StyleX output in `@layer`, so an unlayered reset like `button { font: inherit }` silently overrides it. The medium button rendered at 16px/400 instead of 14px/500. The fix is a `@layer reset` declared before `@stylex;`.
- There are no descendant selectors, so `Button` can't style an `svg` child. Its API became `icon={Rocket}`, the only app where the component API differs.
- Theming uses StyleX's `light-dark()` recipe rather than `--` named variables with attribute overrides. This deviates from the plan, but it's simpler and documented upstream.
- Overlapping `min-width` constants resolved in the right order (the heading is 56px at 1280px), but StyleX doesn't document that as guaranteed when using `defineConsts`.
- Biome reports `@stylex;` as an unknown at-rule, so it has to be allow-listed.
- Markup uses the `sx` prop (`<p sx={styles.eyebrow}>`, `sx={[a, b]}`) instead of `{...stylex.props(…)}`. The Babel plugin rewrites it to the same call, so the HTML is identical. It only applies to lowercase elements: components such as lucide icons still need the spread, and `Card`/`TripCard` take `sx` as an ordinary prop that they pass on. TypeScript doesn't know `sx`, so `src/sx.d.ts` adds `sx?: StyleXStyles` to React's `HTMLAttributes`.
- Components get `stylex` and the tokens from one import: `import { container, media, stylex, theme } from "@/theme/index.stylex"`. Tokens are one `unstable_defineVarsNested` object (`theme.colors.accent`, `theme.sizes.spacing[6]`). Breakpoints stay separate `defineConsts` exports, because a media query has to be a constant and one object can't mix constants with variables. The compiler only resolves named imports from paths ending in `.stylex`, so `from "@/theme"`, `import * as theme` and a plain object that bundles several `defineVars` all fail. Re-exporting `stylex` needs `importSources: ["@stylexjs/stylex", { from: "@/theme/index.stylex", as: "stylex" }]` in `babel.config.js`, and the plugin matches that string literally, so relative imports of the file aren't recognized.

**Panda**
- v2 adds no presets automatically. This app uses only `@pandacss/preset-base`, so there are no default tokens.
- With `strictTokens`, `m: "0"` and `outlineOffset: "2px"` fail `tsc`. I added a `spacing.0` token, and other one-off values use `[…]`.
- Panda emits breakpoints and container sizes written in `px` as `rem`, for example `@media (min-width:48rem)`.
- `prepare: panda codegen` fails on the first install, before `panda.config.ts` exists.
- v2.0 removed template-literal syntax. In v1, `syntax: "template-literal"` gave `css` and `styled` templates with nesting and tokens via `{fontSizes.md}`, but no recipes, patterns, typed tokens or dynamic interpolation. Using it now means staying on `@pandacss/dev@1.12.1`. This repo uses object syntax.

## Recommendation

**For a styled-components codebase that prefers template literals, use next-yak.**

- Existing code mostly ports as-is. `styled`, `css` mixins, `${props => …}` variants, component selectors, nesting and media queries inside the wrapper all work the same. No other option here can say that.
- It compiles with SWC, works on Turbopack for both dev and build, and costs about 0.3 s of build time and 0.8 KB of client JS here.
- The costs are real, and none of them blocks a migration:
  - Its cross-file constant parser is strict (identifier keys only, no `as const`).
  - Tokens are declared twice (CSS variables and TS refs).
  - Biome can't format templates that contain `${}`.
  - Editor highlighting depends on a styled-components extension last updated in 2023.
  - The project is small and backed by a single company (Digitec Galaxus).

Where the others fit:

- **CSS Modules** if you'd rather depend on nothing. It's native CSS with nesting, `@custom-media`, `@scope` and `:has()`, with no lock-in. Class names aren't type-checked unless you add a codegen step, and container queries can't use tokens. It's also the fallback if next-yak stalls, since yak compiles to `.yak.module.css` files anyway.
- **Linaria** gives the same authoring as yak plus real JS evaluation at build time. You give up conditional variant blocks (data attributes instead), mixins become untyped strings, and cold builds take about 1.1 s longer. Choose it over yak only if computed styles matter.
- **StyleX** if the compiler must enforce the design system. It has typed style contracts, deterministic merging and the strongest guardrails for agents. You give up template literals, descendant selectors (component APIs change to fit) and about 1.5 s per cold build, the most of the six.
- **Panda** for typed tokens and recipes with `strictTokens`. It's object syntax again (template literals are gone in v2), with a codegen step, and it ships the most client JS of the six.
- **Tailwind** doesn't fit the stated preferences, and nothing here contradicts the class-soup notes. Variants need `cva`, merges need `tailwind-merge` configured with duplicated token names, and media queries live on every element.

## TypeScript 7

Every app and the bench run on TypeScript 7.0.2, the Go port of the compiler. I started on 6.0.3 because the 7 package has no `lib/tsserverlibrary.js` and no stable JS API, and I assumed Next.js needed both. Testing showed that only editor plugins need them.

What works on 7, in all six apps:

- `next build`. Next 16.4 type-checks by running the `tsc` CLI, and a planted `const x: number = "nope"` failed the build with TS2322.
- `tsc --noEmit`, including the `@ts-expect-error` guards in the StyleX and Panda showcases, which still reject what they should.
- Every styling tool. Panda codegen, StyleX's Babel plugin, wyw (oxc) and next-yak (SWC) don't use the TypeScript API, and neither does Biome.

`tsc --noEmit` time, median of 5 runs with no incremental cache:

| App | TS 6.0.3 | TS 7.0.2 |
| --- | --- | --- |
| css-modules | 0.89 s | 0.13 s |
| tailwind | 0.89 s | 0.14 s |
| next-yak | 0.88 s | 0.14 s |
| linaria | 1.01 s | 0.16 s |
| stylex | 1.13 s | 0.20 s |
| panda | 1.22 s | 0.24 s |

That's about 6 times faster. On an app this small it saves under a second per check. On a large codebase the same ratio matters a lot more.

What the switch cost:

- `typescript-plugin-css-modules` is gone. It imports `typescript/lib/tsserverlibrary`, which 7 doesn't ship. The generated `.d.ts` files still give class-name completion and typo errors.
- The `typescript.tsdk` setting is gone from `apps/css-modules/.vscode/settings.json`, because `node_modules/typescript/lib` now holds only `tsc.js`.
- The `next` entry in each `tsconfig.json` is a tsserver plugin too. Next adds it back on build, and it does nothing on 7.

Not verified: editor behavior (completion, hover, go-to-definition) with TypeScript 7's language server.

The benchmark tables above ran on 7.0.2. The same suite on 6.0.3 gave these cold builds:

| App | Cold build, TS 6.0.3 | Cold build, TS 7.0.2 | Peak RSS, 6.0.3 → 7.0.2 |
| --- | --- | --- | --- |
| css-modules | 4.02 s | 3.19 s | 813 → 810 MB |
| tailwind | 3.98 s | 3.13 s | 812 → 808 MB |
| next-yak | 4.39 s | 3.49 s | 869 → 858 MB |
| linaria | 6.57 s | 4.34 s | 1409 → 876 MB |
| stylex | 5.43 s | 4.65 s | 841 → 847 MB |
| panda | 4.37 s | 3.40 s | 816 → 812 MB |

Type-checking was a bigger share of `next build` than I expected. Most apps lost 0.8 to 1 s. Linaria lost 2.2 s and 530 MB of peak memory, so most of what I first blamed on WyW's build-time evaluation was the TypeScript 6 type check. Bundle sizes didn't change.

## Developer experience

Open each app in its own VS Code window (`code apps/<name>`) so its `.vscode/` settings and extension recommendations apply.

### CSS Modules

What's set up in `apps/css-modules`:

| Need | How | Where |
| --- | --- | --- |
| Class-name autocomplete and go to definition | `clinyong.vscode-css-modules` suggests class names after `styles.` and jumps from `styles.card` to `.card`. It works only in the editor and doesn't type-check, so a misspelled class still passes `tsc` | `.vscode/extensions.json` |
| `var(--…)` autocomplete | `vunguyentuan.vscode-css-variables`, pointed at the tokens with `"cssVariables.lookupFiles": ["src/theme/tokens.css"]` | `.vscode/settings.json` |
| Undefined variables fail lint | Every `.css` file starts with `@import "@/theme/tokens.css";`, so Biome's nursery rule `noUndeclaredCustomProperties` can see the declarations. `var(--color-acent)` is reported as not defined. The rule is off for `tokens.css` itself, because that file uses `--font-geist-*` variables that `next/font` defines at runtime. Turbopack deduplicates the import, so tokens appear once in the built CSS | each `.module.css`, `biome.json` |
| `@custom-media` and `composes` without editor warnings | `.vscode/css-data.json` describes `@custom-media` and `composes` as custom CSS data, loaded with `"css.customData"`. `"files.associations": { "*.css": "css" }` keeps `.css` files on VS Code's built-in CSS language service, which is the one that reads custom data. `csstools.postcss` is recommended for PostCSS syntax support | `.vscode/css-data.json`, `.vscode/settings.json`, `.vscode/extensions.json` |
| `@/` paths in CSS | `composes: surface from "@/theme/mixins.module.css"` and `@import "@/theme/tokens.css"` resolve through the `tsconfig.json` alias at build time. `"css.importAliases": { "@/": "/src/" }` lets VS Code follow them | CSS files, `.vscode/settings.json` |
| Breakpoints without imports | `@csstools/postcss-global-data` injects `src/theme/breakpoints.css` into every file, so `@media (--md)` works anywhere | `postcss.config.mjs` |
| Consistent property order | Biome's `useSortedProperties` assist, applied on save | `biome.json`, `.vscode/settings.json` |
| Specificity mistakes | Biome's `noDescendingSpecificity` flags a lower-specificity selector placed after a higher one | `biome.json` |

Things to know:

- Nothing checks class names at build time. Next types every module as `{ [key: string]: string }`, so a typo like `styles.itemTitel` compiles and the element silently loses its styles. The extension's suggestions make typos less likely but don't stop them. Generated declarations from `typed-css-modules` or css-modules-kit would bring the check back, at the cost of running a generator in `dev`, `build` and `typecheck`.
- Biome's nursery rule `noUnusedClasses` doesn't understand `styles.x` and reports every class as unused, so it's no use here.

Worth adding as the app grows:

- Cascade layers for overrides. Put component styles in `@layer components` and keep consumer overrides unlayered, so an override wins regardless of CSS chunk order. `composes` can't sit inside `@layer`, so each class splits into a top-level `composes`-only rule plus a layered body.
- `noImportantStyles` and the nursery rule `noExcessiveSelectorClasses` in Biome, to keep specificity flat.
- A per-route CSS size budget. `bench/size.ts` already measures first-load CSS for `/`. Turbopack's `experimental.cssChunking: "graph"` reduces unused CSS per route once Lighthouse starts reporting it.

### StyleX

What's set up in `apps/stylex`:

| Need | How | Where |
| --- | --- | --- |
| One import for tokens and the API | `src/theme/index.stylex.ts` holds the palette, breakpoints and nested tokens, and re-exports `stylex`. The Babel plugin's `importSources` includes `{ from: "@/theme/index.stylex", as: "stylex" }`, so the compiler treats that re-export as StyleX itself. Components import `{ stylex, theme, media }` from one path | `src/theme/index.stylex.ts`, `babel.config.js` |
| Nested token access | `stylex.unstable_defineVarsNested` gives `theme.colors.accent` and `theme.sizes.spacing[6]` instead of one export per group. The API is marked unstable, so its name can change between releases | `src/theme/index.stylex.ts` |
| No `{...stylex.props()}` on HTML elements | The compiler turns `sx={styles.x}` on lowercase elements into `stylex.props`. `src/sx.d.ts` adds `sx?: StyleXStyles` to React's `HTMLAttributes` so TypeScript accepts it. Components such as Lucide icons still need `{...stylex.props()}`, because `sx` only works on host elements | `src/sx.d.ts`, all components |
| Autocomplete and typo checks | Everything is TypeScript. Tokens, breakpoints and CSS properties complete through types, and a misspelled token or property fails `tsc`. No editor extension is needed | none |
| Style contracts | `StyleXStyles<{ marginBlock?, inlineSize?, maxInlineSize? }>` limits what callers can override. Passing `color` fails `tsc` (see `/showcase`) | `src/showcase/TripCard.tsx` |
| Formatting | Styles are plain objects, so Biome formats and lints all of them. The only exception is the `@stylex;` directive, which is allow-listed in `noUnknownAtRules` | `biome.json` |
| Resets that don't override StyleX | StyleX emits everything inside `@layer`, so the reset sits in `@layer reset`, declared before `@stylex;` | `src/app/globals.css` |
| Theme switching | Token values use `light-dark()`, and `[data-theme]` switches `color-scheme`. The theme icons use `stylex.when.ancestor('[data-theme="light"]')`, which needs the `stylex.defaultMarker()` class on `<html>` | `src/theme/index.stylex.ts`, `src/app/globals.css`, `src/app/layout.tsx` |

Things to know:

- StyleX's docs say `.stylex.ts` files may only export `defineVars` and `defineConsts`. Re-exporting `stylex` from one works here because of the `importSources` entry, but the official ESLint rule `@stylexjs/enforce-extension` would flag it. Re-run lint, typecheck and build on every StyleX upgrade.
- `stylex.when.*` calls must be written inline inside `stylex.create`. Moving one into a constant fails prerendering with "Unexpected 'stylex.when.ancestor' call at runtime".
- There are no descendant selectors, so parents can't style children like an `svg`. `Button` takes an `icon` prop instead.

Worth adding:

- `@stylexjs/eslint-plugin` checks property values and sorts keys, which Biome can't do for StyleX. It means running ESLint next to Biome, which this repo avoids, so it's a trade-off rather than a free win.
