# PLAN — CSS frameworks comparison (Next.js)

> Source: `PRD.md` and the research notes (`~/Downloads/CSS Frameworks.pdf`).

## Context
Moving off styled-components. Goal is to pick a zero-runtime(ish) replacement by building the **same** Mars landing page in 6 isolated Next.js apps, then comparing DX (tokens, mixins, variants, MQ, theming, Biome, autocomplete, type-safety) and perf (bytes, build time, browser style cost).
Biases from the notes, so the report addresses them head-on: prefers template literals; dislikes object syntax (StyleX, Panda) and Tailwind class soup; wants nested rules and MQs co-located in the wrapper.

## Decisions (from interview)
- Apps: `apps/{css-modules,tailwind,next-yak,linaria,stylex,panda}`. **Fully isolated.** Nothing shared, each app has its own lockfile and configs.
- Next `16.4.0`, React 19, App Router, TS strict, bun as package manager. Scripts run via `bun run` (Node ≥22 executes `next`, no `bun --bun`). **Exact version pins** (no `^`), see Pinned versions.
- Turbopack everywhere. Fall back to webpack per app only if it's broken, and log that in the Gotchas.
- **Fallback policy**: when a spike or setup fails, take the first fallback that keeps the app's authoring syntax unchanged (e.g. webpack for one app, `postcss-custom-media` → alternative plugin, `.ts` → `*.yak.ts`). Log every fallback in the README gotchas. Don't stop to ask unless no syntax-preserving fallback exists.
- **Not a monorepo.** No root `package.json`, workspaces, or shared configs. Every app-specific file (including `.gitignore` entries for `.next`, `styled-system`, `*.wyw-in-js.module.css`, generated `*.module.css.d.ts`) lives inside its app folder. Root holds only `PRD.md`, `PLAN.md`, `CLAUDE.md`, `README.md`, a minimal `.gitignore` (`node_modules`, `.DS_Store`) and `bench/`.
- Tokens: 2-tier (primitives → semantic), no prefix, descriptive names. Each app declares them the framework's native way.
- **Units: font sizes in `pt`, everything else in `px`. No `rem`/`em` anywhere** (tokens, breakpoints, container queries, one-off values). Tailwind: avoid default rem-based utilities by overriding `--spacing`/`--text-*`/`--radius-*`/`--breakpoint-*` in `@theme` with px/pt tokens. Panda: tokens defined in px/pt, no `preset-panda` rem scales.
- Theme: dark-first. `data-theme` on `<html>`, defaults from `prefers-color-scheme`, client `ThemeToggle`, localStorage persistence, blocking inline script (no flash). Each framework uses its native theming mechanism.
- RSC: everything is a server component except `ThemeToggle`.
- Extending must show: **reusable chunk/mixin** + **prop-driven variants**.
- Font: `next/font` Geist (sans + mono).
- Icons: `lucide-react` (exact pin, same version in every app). `Sun`/`Moon` in ThemeToggle, `Rocket` on the primary button, `Download` on the secondary, `MapPin` on list items. Icons are colored via `currentColor` and sized from a token (`icon-size-small` `16px`, `icon-size-medium` `20px`).
- States: hover + focus-visible only.
- Root `README.md` only (no per-app READMEs).
- Bench: root `bench/`, black-box (shells into apps, imports nothing from them). 10 runs, median + p95.
- Visual parity: checked by eye (no screenshot diff).

## Pinned versions (recorded 2026-10-14)
Use these exact versions in every app that needs them. Don't upgrade mid-project; if a bump is unavoidable, apply it to all affected apps and log it.

| Package | Version | Package | Version |
|---|---|---|---|
| next | 16.4.0 | @biomejs/biome | 2.5.15 |
| react / react-dom | 19.3.0 | @types/react | 19.3.0 |
| typescript | 7.0.2 (see note) | @types/node | 26.6.5 |
| lucide-react | 1.57.0 | postcss | 8.5.30 |
| tailwindcss / @tailwindcss/postcss | 4.3.3 | class-variance-authority | 0.7.1 |
| clsx | 2.1.1 | tailwind-merge | 3.7.0 |
| next-yak | 9.10.2 | @wyw-in-js/nextjs | 2.5.2 |
| @linaria/core / @linaria/react | 8.2.0 | @stylexjs/stylex / babel-plugin / postcss-plugin | 0.19.1 |
| @pandacss/dev / @pandacss/preset-base | 2.2.0 | postcss-custom-media | 12.0.3 |
| @csstools/postcss-global-data | 4.0.0 | | |
| playwright (bench) | 1.64.1 | | |

Toolchain: Node 24.15.0, bun 1.3.13, hyperfine (brew).
TypeScript note: 7.0.2 is the native Go compiler. Next 16.4 builds and type-checks with it. It can't load tsserver plugins, so `typescript-plugin-css-modules` was removed; see README "TypeScript 7".

## Design spec (identical in all apps)

### Layout
```
mobile (<768px)                    lg (≥1024px)
┌──────────────────────┐           ┌──────────────────────────────────────────┐
│               [Theme]│           │                                   [Theme]│
│ VISIT MARS (eyebrow) │           │ VISIT MARS          ┌──────────────────┐ │
│ The Red Planet       │           │ The Red Planet      │ Trip highlights  │ │
│ awaits (h1)          │           │ awaits (h1)         │ • Olympus Mons   │ │
│ Description…         │           │ Description…        │ • Valles Mar.    │ │
│ ┌──────────────────┐ │           │                     │ • Gale Crater    │ │
│ │ Trip highlights  │ │           │                     │ • Polar caps     │ │
│ │ • … (1 col)      │ │           │                     │ [Itinerary][Book]│ │
│ │ [Book your trip] │ │           │                     └──────────────────┘ │
│ │ [Itinerary]      │ │           └──────────────────────────────────────────┘
│ └──────────────────┘ │
└──────────────────────┘
```
- Page: `max-width: 1152px`, centered. Inline padding `spacing-6` → `spacing-12` @md.
- Hero: stacked (gap `spacing-8`) → 2-col grid `1fr 1fr`, gap `spacing-16`, vertically centered @lg.
- h1: `font-size-heading-small` → `-medium` @md → `-large` @lg.
- Card: padding `spacing-6` → `spacing-8` @md. List is 1 col → 2 cols @md.
- **Container query**: the card is `container-type: inline-size`. Footer buttons stack full-width by default and sit in a right-aligned row when the card's content box is ≥ `400px`.
- Buttons: `Book your trip` (variant `primary`, size `large`), `Download itinerary` (variant `secondary`, size `medium`).

### Content (`src/content.ts` per app)
Eyebrow "Visit Mars". h1 "The Red Planet awaits". One-paragraph description (≈40 words). Card title "Trip highlights". 4 items, each a title + one line: Olympus Mons, Valles Marineris, Gale Crater, Polar ice caps.

### Tokens
Primitives:
| name | value |
|---|---|
| neutral-950/900/800/700 | `#0B0D12` `#12151C` `#1C2029` `#2A2F3A` |
| neutral-600/400/200/100/50 | `#4A5060` `#8A90A0` `#D5D8E0` `#ECEEF2` `#F7F8FA` |
| white | `#FFFFFF` |
| mars-300/400/500/600/700 | `#F4A37E` `#EE7D4F` `#E2612E` `#C24E1F` `#9A3C17` |
| spacing-1/2/3/4/6/8/12/16 | `4` `8` `12` `16` `24` `32` `48` `64` px |
| radius-small/medium/large/full | `6px` `12px` `20px` `9999px` |
| font-size-small/body/large | `10.5` `12` `15` pt |
| font-size-heading-small/medium/large | `24` `33` `42` pt |
| font-weight-regular/medium/bold | 400 / 500 / 700 |
| font-family-sans / -mono | Geist vars from `next/font` |
| duration-fast / easing-standard | `150ms` / `cubic-bezier(.2,0,0,1)` |
| breakpoint-sm/md/lg | `640px` `768px` `1024px` (min-width) |
| container-card-wide | `400px` (measured on the card content box) |

Semantic (dark default → light override):
| token | dark | light |
|---|---|---|
| color-background | neutral-950 | neutral-50 |
| color-surface | neutral-900 | white |
| color-surface-hover | neutral-800 | neutral-100 |
| color-border | neutral-700 | neutral-200 |
| color-text-primary | neutral-50 | neutral-950 |
| color-text-secondary | neutral-400 | neutral-600 |
| color-accent | mars-400 | mars-700 |
| color-accent-hover | mars-300 | mars-600 |
| color-text-on-accent | neutral-950 | white |
| color-focus-ring | mars-300 | mars-600 |
| shadow-card | `0 8px 24px rgb(0 0 0/.4)` | `0 8px 24px rgb(16 18 24/.08)` |

### Components
- `Button`: props `variant: "primary" | "secondary"`, `size: "medium" | "large"`. Uses the `focusRing` mixin. Hover changes the background (primary → accent-hover; secondary → surface-hover).
- `Card`: title + list + footer slot. Uses the `surface` mixin (surface bg, border, radius-large, shadow-card). Hover lifts the border color to accent.
- `ThemeToggle` (`"use client"`): flips `data-theme` and persists it. Uses the `focusRing` mixin.
- Mixins every app must implement: **`surface`** and **`focusRing`** (`outline: 2px solid color-focus-ring; outline-offset: 2px` on `:focus-visible`).
- Base: `body { margin: 0; line-height: 1.5; background: color-background; color: color-text-primary; font: font-size-body font-family-sans }`, `button { font: inherit; color: inherit }`, `box-sizing: border-box` everywhere (matches Tailwind preflight so all apps render the same).
- `layout.tsx`: Geist fonts, inline theme script (`localStorage.theme` → else `matchMedia('(prefers-color-scheme: light)')` → else dark), `suppressHydrationWarning`.

## App structure (same in every app)
```
apps/<name>/
  package.json  bun.lock  tsconfig.json  next.config.ts  biome.json
  .vscode/{extensions,settings}.json
  src/app/{layout,page}.tsx  [globals.css]
  src/theme/      tokens, breakpoints, mixins (framework-native files)
  src/components/{Button,Card,ThemeToggle}.tsx (+ style files if the framework needs them)
  src/content.ts
  src/showcase/   framework-specific strength demo (see "Framework showcase"), route src/app/showcase/page.tsx
```
Scripts: `dev`, `build`, `start`, `lint` (`biome check`), `typecheck` (`tsc --noEmit`), plus framework codegen where needed.

## Per-framework spec
| | Tokens + theme | Breakpoints | Mixins | Variants | Config / tooling |
|---|---|---|---|---|---|
| **css-modules** | `theme/tokens.css`: `:root` (dark) + `[data-theme=light]` vars | `theme/breakpoints.css` `@custom-media --md (width >= 768px)`; injected globally by `@csstools/postcss-global-data` + `postcss-custom-media` | `composes: surface from "../theme/mixins.module.css"` | `styles[variant]`, `styles[size]` class lookup | `postcss.config.mjs`; class names untyped (Next's `*.module.css` wildcard), editor completion via `clinyong.vscode-css-modules` |
| **tailwind** v4.3 | `globals.css` `@theme` primitives; semantic vars in `:root` / `[data-theme=light]` mapped through `@theme inline` | `@theme { --breakpoint-*: initial; --breakpoint-sm/md/lg }`; `@container` + `@[400px]:` | `@utility surface`, `@utility focus-ring` | `cva` + `cn` (clsx + tailwind-merge, extended to know the custom utilities) | `@tailwindcss/postcss`; Biome `css.parser.tailwindDirectives: true`; `@custom-variant dark` only if needed |
| **next-yak** 9.10 | `globals.css` vars (dark/light) + `theme/tokens.ts` typed refs (`color.accent = "var(--color-accent)"`) used as `${color.accent}` | `theme/breakpoints.ts` `media.md = "@media (min-width: 768px)"`. Test a plain `.ts` import first, fall back to `*.yak.ts` | `export const surface = css\`…\`` → `${surface}` | `${({$variant}) => $variant === "secondary" && css\`…\`}` (transient props) | `withYak()`; Biome `experimentalEmbeddedSnippetsEnabled` |
| **linaria** | same as yak (globals.css vars + typed refs) | TS constants interpolated (wyw evaluates them at build time) | Plain string/template constant interpolated. Note: interpolating a `css` class embeds a selector, not rules. Verify and document | `&[data-variant="secondary"]` / `data-size` attribute selectors. Linaria prop interpolation can only set values, not conditional blocks. Document | `@wyw-in-js/nextjs` `withWyw()`; gitignore `*.wyw-in-js.module.css`; Biome embed flag |
| **stylex** 0.19 | `theme/tokens.stylex.ts` `defineVars` with `--`-prefixed keys (stable names), light overrides in `globals.css` under `[data-theme=light]` | `theme/breakpoints.stylex.ts` `defineConsts` with **overlapping mobile-first `min-width`** queries (same as the other apps) → `[bp.md]: …`. Ordering isn't guaranteed (`enableMediaQueryOrder` doesn't cover `defineConsts`); the spike checks it, and the README logs the risk | Shared `stylex.create` objects composed via `stylex.props(mixins.surface, styles.card)` | `stylex.props(styles.base, variants[variant], sizes[size])` | `babel.config.js` + `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin`, `@stylex;` in globals. **Not** `@stylexjs/nextjs-plugin` (deprecated) |
| **panda** v2.2 | `panda.config.ts` `theme.tokens` + `semanticTokens {base: dark, _light: light}`, condition `light: '[data-theme=light] &'`; only `@pandacss/preset-base` (no default tokens) | `theme.breakpoints` | `layerStyles.surface`; `focusRing` via `css.raw()` composition | config `recipes.button` (typed variants) | `panda init --postcss`, `prepare: panda codegen`, gitignore `styled-system`; object syntax (template literals were removed in v2, explained in README) |

VSCode recommendations (per app `.vscode/extensions.json`): all apps get `biomejs.biome`. Tailwind: `bradlc.vscode-tailwindcss`. yak/linaria: `styled-components.vscode-styled-components`. css-modules: `clinyong.vscode-css-modules`. panda: `chakra-ui.panda-css-vscode` (v2 compat unverified, document). stylex: none (TS types only).

Biome (per app `biome.json`): recommended lint + formatter. Ignore `.next`, `styled-system`, `*.wyw-in-js.module.css`, `*.module.css.d.ts`. Record which template-literal blocks get formatted vs skipped (anything with `${}` is skipped).

## Framework showcase (allowed divergence)
Each app may add **one** framework-specific piece that shows something the library does well and the others can't do as cleanly.
- **Isolation**: lives in `src/showcase/` and renders on a separate `/showcase` route. `/` stays identical across apps, so visual parity and the benchmarks aren't affected.
- **Subject**: built around the Card (a `TripCard` that reuses the app's `Card`/tokens), unless a different element shows the strength more clearly.
- **Size limit**: about 60 lines of styling + component code, one file pair at most. A short header comment says which strength it shows and why it matters.
- **README**: gets a "Showcase" section with one snippet + 2–3 sentences per framework, and an honest note if the strength is weaker in practice than advertised.

| App | Strength | Showcase |
|---|---|---|
| **stylex** | Typed style contracts (the "AI-safe design system" argument) | `TripCard` accepts `style?: StyleXStyles<{ marginBlock?, inlineSize?, maxInlineSize? }>`. Passing `color` or `padding` is a **type error**, so consumers (and agents) can only override layout. Overrides from the caller win deterministically ("last style wins") regardless of CSS order. |
| **next-yak** | styled-components API at zero runtime: component selectors + dynamic props as CSS vars | `TripCard` styles its `${Title}` and `${Icon}` children on `${Card}:hover &` (component-as-selector). A `$progress` prop (days until launch) drives a progress bar width via `${p => p.$progress}%`, compiled to a CSS custom property with no runtime CSS-in-JS. |
| **linaria** | Arbitrary JS evaluated at build time | A mission-route gradient and a stepped stripe pattern generated from a JS loop or helper (e.g. color stops computed from the mars palette) inside the template literal. wyw evaluates it at build time; the output is a static CSS file. |
| **tailwind** | Constrained design system + state variants without JS | `@theme { --color-*: initial; … }` removes default colors, so only project tokens exist and `bg-red-500` produces nothing. `TripCard` list items use `group`/`group-hover:`, `data-[selected=true]:`, `has-[:focus-visible]:` and `peer` to show selection and focus purely in markup. |
| **css-modules** | Platform-native CSS, zero tooling lock-in | `TripCard` uses `:has()` (the card highlights when a list item is hovered or focused), `@scope` to bound list styles, `@layer` ordering, and a style query (`@container style(--featured: true)`) with no build-step features. Browser support for each is noted. |
| **panda** | Typed multi-part recipes + strict tokens | `TripCard` as an `sva` slot recipe (`root`, `title`, `list`, `item`, `footer`) with a `tone: "default" \| "featured"` variant. `strictTokens: true` makes `css({ color: "#f00" })` a type error, so only tokens type-check. |

## Bench (`bench/`, own package.json: Playwright 1.64, hyperfine via brew)
1. `build.ts`: per app `bun install --frozen-lockfile`. hyperfine 1 warmup + 10 runs, **cold** (`rm -rf .next`) and **warm** (keep `.next/cache`).
2. `size.ts`: raw/gzip/brotli of `/`'s **first-load** CSS + JS (parse `<link>`/`<script>` from `next start` HTML), plus totals under `.next/static/{css,chunks}`. Framework runtime bytes from `next analyze --output` → `export` JSONL, filtered by package. (Next 16 no longer prints per-route sizes; `@next/bundle-analyzer` is webpack-only.)
3. `trace.ts`: `next start` per app. Playwright Chromium, CPU throttle 4×, 10 runs. Sum `ParseAuthorStyleSheet`, `UpdateLayoutTree` (Recalculate Style), `Layout`. CDP `Performance.getMetrics` (`RecalcStyleDuration`). FCP/LCP. **Plus the theme toggle**: click it and measure style recalc (theme-swap cost).
4. `report.ts`: `results/*.json` → median + p95 tables, written into README between `<!-- bench:start/end -->` markers.

Raw results are committed in `bench/results/*.json` alongside the README tables. **Privacy**: only record OS family + version, CPU model, core count, RAM, and Node/bun/Chromium versions. Never record hostname, username, absolute paths (store paths relative to repo root), IPs, serial numbers, or env vars. `report.ts` validates this before writing and fails if a home path or the hostname appears in any output.

## Root README
Setup/run → requirement matrix (rows = PRD criteria plus RSC and template literals; ✅/⚠️/❌ + note) → side-by-side snippets (Button variants + Card media/container query, all 6) → framework showcases → bench tables → gotchas log → opinionated recommendation for a styled-components migration. Includes the Panda template-literal explanation. Final pass: run the `/unslop` skill on README.md to strip AI-writing tells.

## Order
1. Spikes (half day, throwaway): TS 7 + tsserver plugins; StyleX overlapping `defineConsts` media queries (check h1 size at 1280px: must be the lg value); wyw Turbopack `next build`; yak plain-`.ts` constants; postcss-global-data + custom-media under Turbopack; typed-css-modules vs the Next wildcard; StyleX `--` keys + `[data-theme]` override; Linaria mixin semantics.
2. css-modules (reference impl) → tailwind → next-yak → linaria → stylex → panda. Each app's showcase is built after its `/` page is done.
3. bench → README → `/unslop` README.

## Verification
Per app: `bun run lint && bun run typecheck && bun run build`, then `next start`. Eyeball at 375/768/1280 × dark/light, toggle + reload (no flash), keyboard focus ring, container-query footer. css-modules: typo a class name and confirm `tsc` fails. Showcases: confirm the advertised guard actually fires (StyleX disallowed prop → `tsc` error; Panda raw hex → `tsc` error; Tailwind `bg-red-500` → no CSS emitted). Bench: `bun bench/run.ts` runs all four steps and produces the README tables.

## Deviations during implementation
- TypeScript moved from 6.0.3 to 7.0.2 after testing showed `next build` and `tsc` pass in all apps. `typescript-plugin-css-modules` (a tsserver plugin) was dropped; class names are untyped since typed-css-modules was also dropped. Benchmarks re-run on 7: cold builds 0.8–2.2 s faster.
- Container breakpoint `container-card-wide` 448px → 400px (the query measures the card's content box).
- Shared base spec gained `line-height: 1.5` and `button { font: inherit; color: inherit }` to match Tailwind's preflight.
- tailwind: semantic colors are `@theme` variables overridden under `[data-theme=light]` (no `@theme inline`).
- next-yak: spacing keys are `s1…s16` (yak's static resolver ignores numeric keys and `as const`).
- stylex: theming uses `light-dark()` + `color-scheme` (StyleX's documented recipe) instead of `--` keys + overrides; `Button` takes an `icon` prop (no descendant selectors).
- css-modules showcase: dropped `@layer` (it would lose to the unlayered card styles); `:has()`, `@scope`, and a style query remain.
- bench: framework runtime cost is reported as the first-load JS delta vs CSS Modules instead of `next analyze` per-package bytes; build peak RSS added.

- css-modules: `typed-css-modules` (generated `.d.ts` for class names) was removed to avoid the generation step. Misspelled class names no longer fail `tsc`; `clinyong.vscode-css-modules` provides completion and go to definition.

## Unresolved questions
- None. StyleX uses overlapping `min-width` constants so all codebases look the same; if the spike shows wrong ordering, fall back to non-overlapping ranges in StyleX only and log it.
