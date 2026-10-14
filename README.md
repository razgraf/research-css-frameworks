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
| Type-safety | ✅ typo in a class name fails `tsc` (`tcm`) | ⚠️ only `cva` props are typed | ⚠️ token refs only | ⚠️ token refs only | ✅ typed style contracts | ✅ `strictTokens`, typed recipes |
| Turbopack (`dev` + `build`) | ✅ | ✅ | ✅ | ✅ | ✅ (Babel runs on all app code) | ✅ |
| Setup | PostCSS + 2 plugins + `tcm` | 1 PostCSS plugin | 1 config wrapper | 1 config wrapper | Babel + PostCSS config, layer ordering | config + codegen (~130 generated files) |

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
    backgroundColor: { default: colors.accent, ":hover": colors.accentHover },
    color: colors.textOnAccent,
  },
});
// {...stylex.props(mixins.focusRing, styles.base, variants[variant], sizes[size])}
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
card: { containerType: "inline-size", padding: { default: spacing[6], [media.md]: spacing[8] } },
footer: { flexDirection: { default: "column-reverse", [container.cardWide]: "row" } },

// Panda
card: css({ layerStyle: "surface", containerType: "inline-size", p: { base: "6", md: "8" } }),
footer: css({ flexDirection: { base: "column-reverse", "@/cardWide": "row" } }),
```

## Showcases

Each app has a `/showcase` route (`src/showcase/TripCard.tsx`) with one thing that library does better than the others. The visual-parity check and the benchmarks only look at `/`, so these pages don't affect them.

**StyleX: typed style contracts.** `TripCard` accepts `style?: StyleXStyles<{ marginBlock?, inlineSize?, maxInlineSize? }>`. Passing a style that sets `color` fails `tsc` (TS2322), and the file keeps that case as a `@ts-expect-error` line so the typecheck proves it. This is the "AI-safe design system" argument. A component decides which properties callers may touch, and the compiler enforces it. It only covers what goes through the `style` prop. Nothing stops a caller from wrapping the component in another element and styling that.

**next-yak: styled-components ergonomics at zero runtime.** `${Wrapper}:hover ${Title}` targets components imported from another file, and `$progress` drives a progress bar width. yak compiles the prop to an inline CSS variable, `style="--yaLdB8v3:25%"`, behind a static rule. The browser never generates styles.

**Linaria: arbitrary JS at build time.** A loop over the token palette, `Object.values(mars).map(…)`, builds a gradient and a stripe pattern. WyW runs that code in Node during the build and ships a static `linear-gradient(90deg,#f4a37e 0%,…)`. yak's static parser can't do this. It doesn't even accept `as const` or numeric object keys.

**Tailwind: a closed design system and state without JS.** `--*: initial` removes every default token, so `bg-red-500` emits no CSS. The built stylesheet has no match for it. Biome doesn't warn about the class either; only the Tailwind extension's IntelliSense would. Selection, hover and keyboard focus come from `peer-checked:`, `group-hover:` and `has-[:focus-visible]:` on a radio list.

**CSS Modules: the platform.** `:has()` highlights the card when an item is hovered, `@scope` limits element selectors to the card, and a container style query (`@container style(--featured: true)`) turns on the "Featured" badge from a custom property instead of a prop. Turbopack's CSS Modules rejects a bare `li` inside `@scope` as "not pure", so the selector is `:scope li`.

**Panda: typed multi-part recipes.** `TripCard` is an `sva` slot recipe in which one `tone: "featured"` variant restyles the root, title and icons together. Under `strictTokens`, `{ color: "#f00" }` fails `tsc`. The cost is that every one-off value needs the escape syntax (`"[40px]"`, `"[1.5]"`).

## Benchmarks

<!-- bench:start -->

Measured 2026-10-14 on Apple M1 Max (10 cores, 64 GB), Darwin 27.0.0, Node v24.15.0, bun 1.3.13, Chromium 156.0.8078.4. Values are median (p95) of 10 runs. Raw data: `bench/results/`.

### Build time (seconds, `bun run build`)

| App | Cold (no `.next`) | Warm (cached) | Peak RSS, cold (MB, largest process) |
| --- | --- | --- | --- |
| css-modules | 4.02 (4.42) | 2.32 (2.78) | 813 (833) |
| tailwind | 3.98 (4.55) | 2.27 (2.40) | 812 (831) |
| next-yak | 4.39 (4.60) | 2.20 (2.44) | 869 (887) |
| linaria | 6.57 (6.86) | 2.83 (3.07) | 1409 (1431) |
| stylex | 5.43 (5.70) | 2.26 (2.36) | 841 (862) |
| panda | 4.37 (4.93) | 2.42 (2.49) | 816 (837) |

### First-load bytes for `/` (brotli)

| App | CSS | JS | JS vs CSS Modules | HTML |
| --- | --- | --- | --- | --- |
| css-modules | 2.5 KB | 148.6 KB | +0.0 KB | 3.4 KB |
| tailwind | 3.7 KB | 148.6 KB | +0.0 KB | 3.7 KB |
| next-yak | 2.3 KB | 149.3 KB | +0.8 KB | 3.4 KB |
| linaria | 2.2 KB | 150.8 KB | +2.2 KB | 3.4 KB |
| stylex | 2.6 KB | 149.3 KB | +0.8 KB | 3.9 KB |
| panda | 2.8 KB | 153.8 KB | +5.2 KB | 3.8 KB |

### Browser cost for `/` (ms, Chromium, 4× CPU throttle)

| App | Parse stylesheets | Recalculate style | Layout | FCP | LCP | Theme toggle recalc |
| --- | --- | --- | --- | --- | --- | --- |
| css-modules | 0.9 (1.3) | 4.0 (5.0) | 25.0 (28.4) | 70.0 (72.0) | 70.0 (72.0) | 3.1 (4.4) |
| tailwind | 0.9 (1.3) | 4.5 (5.4) | 23.6 (41.1) | 68.0 (88.0) | 68.0 (88.0) | 5.7 (6.3) |
| next-yak | 0.5 (1.3) | 3.3 (4.6) | 24.2 (31.7) | 68.0 (84.0) | 68.0 (84.0) | 2.8 (4.1) |
| linaria | 0.5 (0.8) | 3.4 (4.8) | 25.1 (28.1) | 68.0 (72.0) | 68.0 (72.0) | 3.0 (4.6) |
| stylex | 0.7 (1.0) | 3.9 (4.5) | 24.4 (41.6) | 72.0 (92.0) | 72.0 (92.0) | 3.4 (5.1) |
| panda | 0.8 (1.0) | 3.7 (4.5) | 25.5 (38.5) | 72.0 (84.0) | 72.0 (84.0) | 3.5 (5.0) |

<!-- bench:end -->

### Reading the numbers

- **Bundle size barely separates them.** CSS is 2 to 4 KB everywhere, and roughly 149 KB of JS is the Next/React baseline. The JS deltas come from the one client component (`ThemeToggle`), which pulls in each library's runtime helper: `stylex.props` and yak (+0.8 KB), Linaria's `styled` (+2.2 KB), and Panda's `css()` and `cx` (+5.2 KB, because Panda computes class names at runtime). Server components ship no styling JS in any app. The more client components you style, the more these deltas matter.
- **Tailwind ships the most CSS**, 3.7 KB against 2.2 to 2.8 KB for the rest. That's preflight plus one utility per value used.
- **The browser can't tell them apart.** Parse, style recalculation, layout, FCP and LCP all fall within run-to-run noise (differences under 1 ms with overlapping p95s). The one outlier is Tailwind's theme-toggle recalculation (5.7 ms vs about 3 ms elsewhere), likely from the `:where([data-theme=light] *)` variant on the icons. That's real but tiny.
- **Build time is the only meaningful difference.** CSS Modules, Tailwind, next-yak and Panda are within about 0.4 s of each other cold. StyleX costs about 1.4 s more (Babel over every file), and Linaria about 2.5 s and 600 MB more (it executes style code in Node). With a warm cache, all six build in 2.2 to 2.8 s.

## Problems hit during setup

**All apps**
- TypeScript 7.0.2, the native Go compiler, ships no `tsserver` or JS compiler API. I pinned 6.0.3 before testing it. A later test showed that `next build` works fine on 7. See the last section.
- TypeScript 6 no longer includes `@types/*` automatically, so the bench `tsconfig.json` needs `"types": ["node"]`.
- `biome migrate` (2.5.15) turned `"recommended": true` into `"preset": "none"`, which silently disables every lint rule. Set `"preset": "recommended"` by hand.
- Container queries measure the content box. A 448px threshold never matched at 1280px because the card content is about 430px wide, so I changed the token to 400px.
- Tailwind's preflight gives buttons `font: inherit` and the body `line-height: 1.5`. Without matching those in every app, the other five drifted by about 2px. They're now part of the shared base styles.
- Using `px` for type means text doesn't scale with the browser's default font size setting (page zoom still works).

**CSS Modules**
- `@custom-media` needs `postcss-custom-media` plus `@csstools/postcss-global-data` to make one breakpoints file visible everywhere. It works under Turbopack.
- `@custom-media` only applies to `@media`; the container query needs the literal `400px`.
- `typed-css-modules` writes `.d.ts` files for every `.css` file unless you pass `-p "src/**/*.module.css"`. The generated files do override Next's `*.module.css` wildcard, so a typo fails `tsc`.

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

**Panda**
- v2 adds no presets automatically. This app uses only `@pandacss/preset-base`, so there are no default tokens.
- With `strictTokens`, `m: "0"` and `outlineOffset: "2px"` fail `tsc`. I added a `spacing.0` token, and other one-off values use `[…]`.
- Panda emits breakpoints and container sizes written in `px` as `rem`, for example `@media (min-width:48rem)`.
- `prepare: panda codegen` fails on the first install, before `panda.config.ts` exists.
- v2.0 removed template-literal syntax. In v1, `syntax: "template-literal"` gave `css` and `styled` templates with nesting and tokens via `{fontSizes.md}`, but no recipes, patterns, typed tokens or dynamic interpolation. Using it now means staying on `@pandacss/dev@1.12.1`. This repo uses object syntax.

## Recommendation

**For a styled-components codebase that prefers template literals, use next-yak.**

- Existing code mostly ports as-is. `styled`, `css` mixins, `${props => …}` variants, component selectors, nesting and media queries inside the wrapper all work the same. No other option here can say that.
- It compiles with SWC, works on Turbopack for both dev and build, and costs about 0.4 s of build time and 0.8 KB of client JS here.
- The costs are real, and none of them blocks a migration:
  - Its cross-file constant parser is strict (identifier keys only, no `as const`).
  - Tokens are declared twice (CSS variables and TS refs).
  - Biome can't format templates that contain `${}`.
  - Editor highlighting depends on a styled-components extension last updated in 2023.
  - The project is small and backed by a single company (Digitec Galaxus).

Where the others fit:

- **CSS Modules** if you'd rather depend on nothing. It's native CSS with nesting, `@custom-media`, `@scope` and `:has()`, with no lock-in. Typed class names cost a codegen step, and container queries can't use tokens. It's also the fallback if next-yak stalls, since yak compiles to `.yak.module.css` files anyway.
- **Linaria** gives the same authoring as yak plus real JS evaluation at build time. You give up conditional variant blocks (data attributes instead), mixins become untyped strings, and builds are the slowest and most memory-hungry. Choose it over yak only if computed styles matter.
- **StyleX** if the compiler must enforce the design system. It has typed style contracts, deterministic merging and the strongest guardrails for agents. You give up template literals, descendant selectors (component APIs change to fit) and some build speed.
- **Panda** for typed tokens and recipes with `strictTokens`. It's object syntax again (template literals are gone in v2), with a codegen step, and it ships the most client JS of the six.
- **Tailwind** doesn't fit the stated preferences, and nothing here contradicts the class-soup notes. Variants need `cva`, merges need `tailwind-merge` configured with duplicated token names, and media queries live on every element.

## Moving to TypeScript 7

TypeScript 7.0.2 is the Go port of the compiler. I pinned 6.0.3 at the start because the `typescript` 7 package has no `lib/tsserverlibrary.js` and no stable JS API, and I assumed Next.js depended on both. I then tested each app with `typescript@7.0.2` in a throwaway copy, and that assumption was wrong for the build.

What I checked, per app:

- `next build` passes in all six. Next 16.4 type-checks by running the `tsc` CLI, and a planted `const x: number = "nope"` failed the build with TS2322, so checking is real.
- `tsc --noEmit` passes in all six, including the `@ts-expect-error` guards in the StyleX and Panda showcases. Both still reject what they should.
- The CSS Modules class-name typo still fails `tsc` (TS2551). That check comes from the `.d.ts` files `typed-css-modules` generates, not from the compiler API.

`tsc --noEmit` time, median of 5 runs with no incremental cache:

| App | TS 6.0.3 | TS 7.0.2 |
| --- | --- | --- |
| css-modules | 0.89 s | 0.13 s |
| tailwind | 0.89 s | 0.14 s |
| next-yak | 0.88 s | 0.14 s |
| linaria | 1.01 s | 0.16 s |
| stylex | 1.13 s | 0.20 s |
| panda | 1.22 s | 0.24 s |

That's about 6 times faster everywhere. StyleX and Panda gain the most in absolute terms because their generated types are the heaviest. On a codebase this small the win is under a second per check. On a large app the same ratio matters a lot more.

What breaks:

- tsserver plugins. `typescript-plugin-css-modules` imports `typescript/lib/tsserverlibrary` and can't load. The CSS Modules app loses that plugin's editor completions but keeps typo errors and class-name completion through the generated `.d.ts` files, so it doesn't lose much. The `next` plugin listed in every `tsconfig.json` is a tsserver plugin too and stops loading in the editor.
- The CSS Modules app's `.vscode/settings.json` points `typescript.tsdk` at `node_modules/typescript/lib`, which on 7 holds only `tsc.js`. That setting has to go, and the editor needs TypeScript 7's language server instead of the workspace `tsserver`. I didn't test editor behavior here.

What the switch would involve:

1. Bump `typescript` to `7.0.2` in all six `package.json` files and the bench, as one change across all apps, as `CLAUDE.md` requires.
2. Remove `typescript-plugin-css-modules` and the `typescript.tsdk` setting from `apps/css-modules`.
3. Run `bun run lint && bun run typecheck && bun run build` in every app, then check autocomplete by hand in each editor setup.

None of the six styling libraries depends on the TypeScript API at build time, so the choice of library doesn't change this. The cost is in editor plugins, and in this repo that's one optional plugin.

