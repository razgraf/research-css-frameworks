## Requirements

Before running this experiment, we're going to establish some requirements.

> [!IMPORTANT]
> Caveat: These priorities are my own lens. Most items are objective, and some are subjective. The latter are based on prior usage and preference on native CSS or CSS-in-JS libraries allowing for clean non-object syntax (`styled-components` I'm looking at you). To apply your own priorities, skip to [Questions](#questions).

### Priority: Must-have

1. Syntax highlight and editor utilities. _Fine-tuning and tweaks still have a human in the loop_
   - go-to-definition
   - rule autocomplete
   - variable/token autocomplete (e.g. `var(--size-...)`)
2. Formatting
   - rule and class ordering
3. Linting
   - acknowledgement of unknown or misspelled rules
4. Design system or design token support
   - `@media` queries _shouldn't have hardcoded repeated values_
5. Server-side support (RSC)

### Priority: Nice-to-have

6. Reduced or no relative imports hell
   - absolute > relative paths _to keep refactor maintenance low_
   - few utility imports _barrel imports mean single entry-point and fewer conflicts on rebase_
7. Access to variables in JS. _Even with native CSS options, access to the design tokens in JS would be great_
8. Maintained by some active community

### Priority: Preferred-but-optional

9. Nesting allowed in some form. _`& > *:first-child` or `& > span` should not be frowned upon_
10. Elegant setup
    - no or few auto-generated files
11. Elegant syntax
    - no class soup, easy to refactor "chunks"
    - template literals or native CSS support > object syntax
    - composability
12. Performance at scale _(not measured here, see the note under [Findings](#findings))_

## Experiment

The same Next.js landing page ("Visit Mars") built eight times, once per styling approach. All with light or zero runtime work.

| Framework       | Reason                                                         |
| --------------- | -------------------------------------------------------------- |
| CSS Modules     | The native, battle-tested solution                             |
| Tailwind        | Largest community support, AI friendly                         |
| StyleX          | Built for AI and projects/teams at scale (Linear, Polar, Meta) |
| Panda           | CSS-in-JS, one of the popular picks (6K stars)                 |
| Linaria         | styled-components popular drop-in replacement (12.4K stars)    |
| next-yak        | styled-component replacement with SWC + Turbopack support      |
| vanilla-extract | Test the “CSS Modules-in-TypeScript” statement                 |
| zyzz            | wevm's new typed styling library (web + React Native)          |

Others that have been considered

| Framework | Reason for dropping                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| dx-styles | Maintainer from Linaria wrote it. Drops `styled()` syntax, template literals etc. in favor of performance. Only 60 stars so not very wide spread. |
| emotion   | No RSC support, just like styled-components                                                                                                       |

## Findings

Some per-solution findings.

> [!NOTE]
> Build and bundle numbers come from a single-page benchmark. They measure each tool's fixed overhead, not performance at scale, so they're listed as neutral.

### CSS Modules

| Key     | Advantage                                                                                                 |
| ------- | --------------------------------------------------------------------------------------------------------- |
| Syntax  | Native CSS                                                                                                |
| Nesting | Native nesting, plus platform features like `@scope`, `:has()` and container style queries                |
| Linting | Biome lints and formats it fully, including property order and `noDescendingSpecificity`                  |
| Lock-in | None. It's the platform, and the fallback for most other options (next-yak compiles to `.yak.module.css`) |

| Key           | Disadvantage                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Composability | Specificity issue. Based on how the bundler chunks CSS per route, styles are applied in a different order. Potential semi-fix: `@layer`       |
| Imports       | `composes: x from "@y.css"` needs path management. Paths aren't clickable, autocompleted or linted by Biome. Potential fix: custom VSCode Ext |
| Tokens        | `@custom-media` needs PostCSS for reusable `@media` (won't work for`@container` tho)                                                          |

| Key     | Temporary / minor inconvenience                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup   | For full type-safety in CI/CD, it has to produce `*.d.ts` files to match class names. Editor auto-complete is handled by `clinyong.vscode-css-modules`. |
| Editor  | `var(--…)` autocomplete only with the CSS Variables extension (`vunguyentuan.vscode-css-variables`)                                                     |
| Linting | Biome's `noUndeclaredCustomProperties` is nursery and needs `@import "@/theme/tokens.css"` at the top of each file                                      |

| Key          | Neutral or informational                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| (Co)Location | 👐 Separate files for styling and components                                                                                 |
| Size         | Not measured at scale. CSS is expected to grow with the number of components, while atomic CSS (StyleX, Tailwind) levels off |

### Tailwind

| Key           | Advantage                                                                         |
| ------------- | --------------------------------------------------------------------------------- |
| Composability | Easy to extend styles without imports through `@utility`                          |
| Tokens        | `@theme` turns tokens into utilities, including container queries (`@card-wide:`) |
| Editor        | Tailwind IntelliSense covers autocomplete and unknown classes                     |
| Community     | Largest community, AI friendly                                                    |
| Styles        | Tons of ready-made styles and edge-cases taken care of from their utility classes |

| Key     | Disadvantage                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| Syntax  | Class soup and custom syntax for everything. Media queries are prefixes on every class, no nesting                       |
| Linting | Biome doesn't flag unknown classes (`bg-red-500`). Only IntelliSense does, so they're caught in the editor but not in CI |

| Key      | Temporary / minor inconvenience                                                                    |
| -------- | -------------------------------------------------------------------------------------------------- |
| Refactor | Very annoying to refactor media rules due to class soup, needs best-practices and class-name split |

| Key          | Neutral or informational     |
| ------------ | ---------------------------- |
| Variants     | Need `cva`                   |
| (Co)Location | 🤝 Styles live in the markup |

### StyleX

| Key         | Advantage                                                                   |
| ----------- | --------------------------------------------------------------------------- |
| Type-safety | Style-contracts `StyleXStyles<{ margin?: string \| number }>`, good for AI  |
| Editor      | Everything is TypeScript, so autocomplete and typo checks need no extension |

| Key     | Disadvantage                                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Imports | Design tokens need to be imported every time, and only as named imports from a `*.stylex.ts` file                                       |
| Imports | Impossible to colocate all imports due to how the parser looks for `stylex.ts` files. Components here need 2 (`index.stylex` + mixins). |
| Linting | Official plugin is ESLint only. Biome can't check values or sort keys, so only TypeScript types catch mistakes                          |

| Key          | Neutral or informational                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| (Co)Location | 🤝 Styles live in the component file                                                                                                  |
| Build        | Needs a pass with Babel over all app code. Slowest cold build here (+1.4 s over CSS Modules)                                          |
| Community    | Backed by Meta, used by Linear and Polar                                                                                              |
| Syntax       | `{...stylex.props(…)}` spread everywhere. Fixed (in most places) with `sx` on the element, but not on external components e.g. Lucide |

### Panda

| Key         | Advantage                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| Type-safety | Typed tokens with `strictTokens`, typed recipes and slot recipes (`sva`). |

| Key    | Disadvantage                                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Setup  | Produces a `styled-system` folder (~130 generated files) for type annotations                                                                                                                                |
| Syntax | Object syntax with a `css()` wrapper on all rules. Panda's own keys (`px`, `_hover`, `{ base, md }`) are mostly optional, since `&:hover` and raw `@media` work too, but token breakpoints need its `md` key |

| Key   | Temporary / minor inconvenience                                                                                                                                                                                                   |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup | `prepare: panda codegen` fails on first install. Breakpoints written in `px` are emitted as `rem`                                                                                                                                 |
| Size  | `css()` ships a ~5 KB runtime in client components. The docs' fix is source transforms, which need webpack in Next 16. On Turbopack, styling in server components and passing class names down avoids it (tested, not documented) |

### Linaria

| Key    | Advantage                                                                   |
| ------ | --------------------------------------------------------------------------- |
| Build  | No Babel. WyW evaluates arbitrary JS at build time (e.g. loops over tokens) |
| Syntax | Template literals and nesting, styled-components-like                       |

| Key        | Disadvantage                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Editor     | Relies on a styled-components extension (last updated 2023) for autocomplete and highlighting                    |
| Editor     | Bad syntax highlighting. Mixins are plain strings, so editors don't highlight them and Biome doesn't format them |
| Formatting | Styled-components rule sorting relied on ESLint/Stylelint plugins, which are outdated                            |

| Key       | Neutral or informational                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| Community | Popular (12.4K stars), now maintained under `wyw-in-js` (although creator started dx-styles as a replacement for Linaria ) |
| Build     | About 1 s slower cold build than CSS Modules                                                                               |
| Imports   | Tokens, breakpoints and mixins can come from one `@/theme` barrel (tested, identical output). The app uses three imports   |

### next-yak

| Key    | Advantage                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| Syntax | Template literals. `styled`, `css` mixins, prop variants, component selectors and nesting port from styled-components as-is |
| Build  | SWC, zero runtime                                                                                                           |

| Key        | Disadvantage                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------- |
| Editor     | Relies on a styled-components extension (last updated 2023) for autocomplete and highlighting |
| Linting    | Biome skips formatting any template that contains `${}`                                       |
| Formatting | Styled-components rule sorting relied on ESLint/Stylelint plugins, which are outdated         |

| Key     | Temporary / minor inconvenience                                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Imports | The `${theme => …}` import reverts to **runtime**: a function call per interpolation, inline `style="--x: …"`, larger HTML, and a React re-render on theme switch |
| Tokens  | Declared twice (CSS variables and TS refs). The constant parser only reads identifier keys and no `as const`, so `spacing.s8` instead of `spacing[8]`             |

| Key       | Neutral or informational                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| Community | Small, backed by a single company (Digitec Galaxus)                                                                      |
| Build     | +0.45 s cold build, +0.8 KB client JS                                                                                    |
| Imports   | Tokens, breakpoints and mixins can come from one `@/theme` barrel (tested, identical output). The app uses three imports |

### vanilla-extract

| Key         | Advantage                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| Type-safety | Class names are exports, so `styles.itemTitel` fails `tsc`. Typed tokens, recipes and theme contracts |
| Imports     | Barrel import from `@/theme` works, since `.css.ts` files are evaluated at build time                 |
| Size        | No runtime JS                                                                                         |

| Key    | Disadvantage                                                                               |
| ------ | ------------------------------------------------------------------------------------------ |
| Syntax | Object syntax. Children (e.g. `svg`) need a separate `globalStyle` rule instead of nesting |
| Build  | Turbopack support is `unstable_turbopack`                                                  |

| Key     | Temporary / minor inconvenience                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| Linting | Biome's `useSortedKeys` sorts alphabetically and moves `:hover`, `@media` and `@container` to the top         |
| Tokens  | Var names are hashed by default, so `createGlobalThemeContract` needs a map function to keep `--color-accent` |

| Key          | Neutral or informational                                              |
| ------------ | --------------------------------------------------------------------- |
| (Co)Location | Separate `.css.ts` files for styling and components, like CSS Modules |
| Build        | Slowest warm build (2.9 s) and highest peak memory                    |

### zyzz

| Key         | Advantage                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| Type-safety | Values must be tokens; variants and dynamic values (`${number}%`) are typed. The compiler checks values again at build time |
| Nesting     | Children are styled inside the same object (`selectors: { "& svg" }`), unlike vanilla-extract and StyleX                    |
| Tokens      | `@media >=md` and `@container card >=cardWide` aliases, no literals                                                         |
| Imports     | One `@/theme` barrel for the API, tokens and mixins                                                                         |
| Theming     | `light-dark()` color pairs, plus a built-in no-flash script and persistence                                                 |

| Key      | Disadvantage                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Syntax   | Object syntax, and ` !custom` on every raw value, even `0px` (25 in this small app)                                          |
| Size     | Most CSS (5.0 KB) and HTML (2× raw) of all apps, from long atomic class names, one rule per token and `cx` duplicating rules |
| Theming  | No `data-theme`. Switches that aren't colors rely on internal `z_scheme-*` classes                                           |
| Linting  | Rules only exist as an oxlint plugin (alpha JS plugin API). Biome checks nothing zyzz-specific                               |
| Maturity | 0.0.x, published the day it was tested, breaking changes in patch releases                                                   |

| Key       | Temporary / minor inconvenience                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------- |
| Typecheck | `tsc` 0.74 s vs 0.13–0.24 s for the others                                                               |
| Types     | `Props.Variants` clashes with `ComponentProps<"button">`, so `Button` only takes variants and `children` |
| Setup     | 124 MB package. Next 16.4 untested upstream, but `dev` and `build` work on Turbopack                     |

| Key          | Neutral or informational                                                                   |
| ------------ | ------------------------------------------------------------------------------------------ |
| (Co)Location | 🤝 Styles in the component file (`namespace styles`), can move to a sibling `*.styles.ts`   |
| Build        | 4.3 s cold (with Linaria and vanilla-extract), 1.7 s warm; +1.7 KB JS in client components |
| Community    | wevm (viem, wagmi), 4 human contributors so far                                            |

### Questions

Each answer only removes options. Answer them in any order, and whatever is left is your shortlist.

> [!CAUTION]
> Biome-only setups (as in every app here): Tailwind's unknown classes are only flagged by IntelliSense, StyleX's value checks and key sorting live in `@stylexjs/eslint-plugin`, and zyzz's rules ship only as an oxlint plugin. All three are caught in the editor (IntelliSense, TypeScript types) or by `tsc`, not by Biome in CI. Tailwind and StyleX have ESLint plugins, and zyzz needs oxlint, if you run either next to Biome.

#### Q: Which syntax would you reject? (pick any)

- **A** (Native CSS / template literals): drop css-modules, next-yak, linaria
- **B** (Object syntax): drop stylex, vanilla-extract, zyzz, panda[^panda]
- **C** (Custom syntax): drop tailwind

[^panda]: Panda's own keys (`px`, `_hover`, `{ base, md }`) are mostly optional. `&:hover` and raw `@media` work too, but token breakpoints need its `md` key.

#### Q: Are you migrating a styled-components codebase?

- **Yes**: keep only linaria and next-yak. next-yak ports `styled`, `css` mixins and prop variants as-is, while linaria turns conditional variants into data attributes
- **No**: drop nothing

#### Q: Is styled-components syntax worth degraded syntax highlighting, formatting and autocomplete?

- **Yes**: drop nothing
- **No**: drop linaria, next-yak. Highlighting and autocomplete rely on a styled-components extension last updated in 2023, Biome skips formatting templates that contain `${}`, and rule sorting relied on outdated ESLint/Stylelint plugins

#### Q: Must the library, tokens, breakpoints and mixins come from a single import?

- **Yes**: drop stylex. Tokens only resolve as named imports from `*.stylex.ts` files, so a component needs at least 2 theme imports
- **No**: drop nothing

#### Q: How large and active a community do you need?

Measured 2026-10-18 (zyzz on 2026-10-21). Contributors are distinct human commit authors (bots excluded) on the default branch over the last 12 months. Commit counts depend on merge style (squash vs merge commits), so compare contributors and releases first. CSS Modules is part of the platform.

| Library         | npm/week | Stars                       | Contributors (12 mo) | Commits 2025 / 2026 | Stable releases 2025 / 2026 | Latest release |
| --------------- | -------- | --------------------------- | -------------------- | ------------------- | --------------------------- | -------------- |
| tailwind        | 85.3M    | 97.9K                       | 66                   | 712 / 300           | 39 / 9                      | 2026-07-16     |
| vanilla-extract | 1.61M    | 10.4K                       | 23                   | 73 / 78             | 6 / 8                       | 2026-10-08     |
| stylex          | 1.18M    | 10.4K                       | 55                   | 427 / 240           | 25 / 7                      | 2026-09-15     |
| linaria         | 293K     | 12.4K                       | 4                    | 12 / 51             | 1 / 6                       | 2026-08-10     |
| ↳ `wyw-in-js`   | 109K     | 0.3K                        | 14                   | 39 / 449            | 4 / 31                      | 2026-10-15     |
| panda           | 291K     | 6.2K                        | 22                   | 301 / 975           | 28 / 21                     | 2026-10-09     |
| next-yak        | 7.8K     | 0.6K                        | 10                   | 141 / 143           | 24 / 15                     | 2026-09-28     |
| zyzz            | 4.4K     | 66                          | 4                    | 0 / 494             | 0 / 0 (33 × 0.0.x)          | 2026-10-21     |

- **Large and active** (≥ 1M downloads/week and ≥ 20 contributors in 12 months): drop panda, linaria, next-yak, zyzz
- **Actively maintained, any size** (a stable release in the last 6 months and ≥ 10 contributors in 12 months): drop linaria, zyzz. Linaria's engine `wyw-in-js` is busy, but the `@linaria/*` packages had 12 commits and 1 release in 2025, and 4 contributors in the last year
- **Don't care**: drop nothing

#### Q: Where should styles live?

- **In the component file**: drop css-modules, vanilla-extract (both require a separate file)
- **Separable from markup**: drop tailwind (stylex, panda, linaria, next-yak and zyzz can move styles to a sibling `*.styles.ts`)
- **Don't care**: drop nothing

## My view

> [!NOTE]
> I have past experience with styled-components, CSS/Sass and Tailwind. Over time I came to like the DX of styled-components, and the utility of Tailwind for its zero-headache classes (although I did get annoyed by the class soup).

- CSS-modules are the sweet spot. They can do the job, but they're not sexy.
- StyleX would be a cool try that AI would love and we would probably hate for DX. Panda looks better.
- Tailwind needs good best practices from us to fix class soup. It does encourage design systems the most. But it's far from native css writing.
