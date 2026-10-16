## Requirements

Before running this experiment, we're going to establish some requirements.

> [!IMPORTANT]
> Caveat: Most items are objective, and some are subjective. The latter are based on prior usage and preference on native CSS or CSS-in-JS libraries allowing for clean non-object syntax (`styled-components` I'm looking at you).

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
   - media queries _shouldn't have hardcoded repeated values_
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
12. Performance at scale

## Experiment

The same Next.js landing page ("Visit Mars") built seven times, once per styling approach. All with light or zero runtime work.

| Framework       | Reason                                                         |
| --------------- | -------------------------------------------------------------- |
| CSS Modules     | The native, battle-tested solution                             |
| Tailwind        | Largest community support, AI friendly                         |
| StyleX          | Built for AI and projects/teams at scale (Linear, Polar, Meta) |
| Panda           | CSS-in-JS, one of the popular picks (6K stars)                 |
| Linaria         | styled-components popular drop-in replacement (12.4K stars)    |
| next-yak        | styled-component replacement with SWC + Turbopack support      |
| vanilla-extract | Test the “CSS Modules-in-TypeScript” statement                 |

Others that have been considered

| Framework | Reason for dropping                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| dx-styles | Maintainer from Linaria wrote it. Drops `styled()` syntax, template literals etc. in favor of performance. Only 60 stars so not very wide spread. |
| emotion   | No RSC support, just like styled-components                                                                                                       |

## Findings

Some per-solution findings.

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
| Size    | Only at large scale. CSS grows with the number of components, while atomic CSS (StyleX, Tailwind) levels off                                            |

| Key          | Neutral or informational                     |
| ------------ | -------------------------------------------- |
| (Co)Location | 👐 Separate files for styling and components |

### Tailwind

| Key           | Advantage                                                                         |
| ------------- | --------------------------------------------------------------------------------- |
| Composability | Easy to extend styles without imports through `@utility`                          |
| Tokens        | `@theme` turns tokens into utilities, including container queries (`@card-wide:`) |
| Editor        | Tailwind IntelliSense covers autocomplete and unknown classes                     |
| Community     | Largest community, AI friendly                                                    |
| Styles        | Tons of ready-made styles and edge-cases taken care of from their utility classes |

| Key     | Disadvantage                                                                                       |
| ------- | -------------------------------------------------------------------------------------------------- |
| Syntax  | Class soup and custom syntax for everything. Media queries are prefixes on every class, no nesting |
| Linting | Biome doesn't flag unknown classes (`bg-red-500`), only IntelliSense does                          |

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

| Key     | Disadvantage                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Imports | Design tokens need to be imported every time, and only as named imports from a `*.stylex.ts` file                               |
| Imports | Impossible to colocate all imports due to how the parser looks for `stylex.ts` files. Regular files could need up to 3 imports. |
| Build   | Needs a pass with Babel over all app code, slowest cold build (+1.4 s over CSS Modules)                                         |
| Linting | Official plugin is ESLint only, Biome can't check values or sort keys                                                           |

| Key          | Neutral or informational                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| (Co)Location | 🤝 Styles live in the component file                                                                                                  |
| Community    | Backed by Meta, used by Linear and Polar                                                                                              |
| Syntax       | `{...stylex.props(…)}` spread everywhere. Fixed (in most places) with `sx` on the element, but not on external components e.g. Lucide |

### Panda

| Key         | Advantage                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| Type-safety | Typed tokens with `strictTokens`, typed recipes and slot recipes (`sva`). |

| Key    | Disadvantage                                                                                                                           |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Setup  | Produces a `styled-system` folder (~130 generated files) for type annotations                                                          |
| Syntax | Object syntax with a `css()` wrapper on all rules, and custom syntax, in particular for media queries (`px: { base: "6", md: "12" }`). |
| Size   | Most client JS of the seven (+5.2 KB), since `css()` and `cx` compute class names at runtime                                           |

| Key   | Temporary / minor inconvenience                                                                   |
| ----- | ------------------------------------------------------------------------------------------------- |
| Setup | `prepare: panda codegen` fails on first install. Breakpoints written in `px` are emitted as `rem` |

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

| Key     | Temporary / minor inconvenience                                 |
| ------- | --------------------------------------------------------------- |
| Build   | About 1 s slower cold build than CSS Modules                    |
| Imports | Design tokens need to be imported every time (same as next-yak) |

| Key       | Neutral or informational                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| Community | Popular (12.4K stars), now maintained under `wyw-in-js` (although creator started dx-styles as a replacement for Linaria ) |

### next-yak

| Key    | Advantage                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| Syntax | Template literals. `styled`, `css` mixins, prop variants, component selectors and nesting port from styled-components as-is |
| Build  | SWC, zero runtime, small cost (+0.45 s cold, +0.8 KB client JS)                                                             |

| Key        | Disadvantage                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------- |
| Editor     | Relies on a styled-components extension (last updated 2023) for autocomplete and highlighting |
| Linting    | Biome skips formatting any template that contains `${}`                                       |
| Formatting | Styled-components rule sorting relied on ESLint/Stylelint plugins, which are outdated         |

| Key     | Temporary / minor inconvenience                                                                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Imports | Design tokens need to be imported every time.                                                                                                                     |
| Imports | The `${theme => …}` import reverts to **runtime**: a function call per interpolation, inline `style="--x: …"`, larger HTML, and a React re-render on theme switch |
| Tokens  | Declared twice (CSS variables and TS refs). The constant parser only reads identifier keys and no `as const`, so `spacing.s8` instead of `spacing[8]`             |

| Key       | Neutral or informational                            |
| --------- | --------------------------------------------------- |
| Community | Small, backed by a single company (Digitec Galaxus) |

### vanilla-extract

| Key         | Advantage                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| Type-safety | Class names are exports, so `styles.itemTitel` fails `tsc`. Typed tokens, recipes and theme contracts |
| Imports     | Barrel import from `@/theme` works, since `.css.ts` files are evaluated at build time                 |
| Size        | No runtime JS                                                                                         |

| Key    | Disadvantage                                                                                  |
| ------ | --------------------------------------------------------------------------------------------- |
| Syntax | Object syntax. Children (e.g. `svg`) need a separate `globalStyle` rule instead of nesting    |
| Build  | Slowest warm build (2.9 s) and highest peak memory. Turbopack support is `unstable_turbopack` |

| Key     | Temporary / minor inconvenience                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| Linting | Biome's `useSortedKeys` sorts alphabetically and moves `:hover`, `@media` and `@container` to the top         |
| Tokens  | Var names are hashed by default, so `createGlobalThemeContract` needs a map function to keep `--color-accent` |

| Key          | Neutral or informational                                              |
| ------------ | --------------------------------------------------------------------- |
| (Co)Location | Separate `.css.ts` files for styling and components, like CSS Modules |

## Analysis (Subjective)

- 🐼-🤔 Vanilla-extract gets dropped since
  1.  if we're going with object syntax, StyleX has much better tooling and no special-generated-folder overhead.

- 🐼-🤔 Panda gets dropped since
  1.  if we're going with object syntax, StyleX has much better tooling and no special-generated-folder overhead.

- ☀️-🤔 | 🐂-🤔 Linaria and next-yak (`@yak/react`)
  1.  rely on an old styled components VSCode extension for syntax highlighting.
  2.  template literals with inserted variables and wrapped objects seem to bring more runtime work, so they're not as performant

- 🔷-🤔 StyleX seems to have the worst DX our of all, although best AIX

### Questions

Between `css-modules`, `stylex`, `linaria`, `next-yak`, `panda`

#### Q: A:Native-CSS Syntax or B:Object Syntax

- **A** (Native-CSS Syntax): css-modules, next-yak, linaria
- **B** (Object Syntax): stylex, vanilla-extract, panda

#### Q: Is styled-components important enough to lose (or experience degraded) syntax highlighting, formatting and auto-complete

- **Yes**
- **No**: Drop linaria, next-yak

#### Q: Are we using A: Biome, B: ESLint or C: Both

- **A** Biome: stylex probably dropped, since some linting that's only available to ESLint
- **B** ESLint
- **C** Both

### Q: Are multiple imports acceptable

- **Yes**
- **No**: Drop stylex

### Q: Are we aiming for a large community / lots of support

- **Yes**: Lean towards tailwind, css-modules, maybe stylex
- **No**

### Q: Is colocation of styles and markup a good thing?

### Some thoughts

- CSS-modules are the sweet spot. They can do the job, but they're not sexy.
- StyleX would be a cool try that AI would love and we would probably hate for DX. Panda looks better.
- Tailwind needs good best practices from us to fix class soup. It does encourage design systems the most. But it's far from native css writing.

## Decisions

We like: CSS-Modules, Panda.

CSS-Modules: Work on biome rules for CI/CD checks, work on an Extension to highlight and show more details for `composes`. Try https://github.com/mizdra/css-modules-kit.
Panda: Try it out, see what can be improved in syntax (invest some practices), see if we can order things with biome (e.g. rules)
