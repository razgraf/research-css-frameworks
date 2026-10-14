Goal: compare and contrast different ways to set up CSS in Next/React projects using some of the more popular frameworks based on a set of requirements and preferred practices
Task: in this repository, create one project for each mentioned framework with the same exact components, pages and configurations.

Project

- Each framework will implement (as much as possible) the exact same project
- The project will include a single page with a heading, a description, a card component with a list and a button. Content will be about visiting a new planet in the solar system.
- Dark mode, with white mode support for page and all design tokens
- Each project should include: media queries, usage of design tokens, extending of components design or styles

Particularities

- All design should start from a design system with design tokens pre-configured
- There need to be examples in-code of: using these design tokens, creating reusable chunks of CSS and extending it later in the card component
- Media queries (without hardcoding the values)
- Biome linting and formatting
- Autocomplete and syntax highlighting in VSCode (suggest extensions if any), type-safety where possible

Preferences

- Native CSS and template literals with variables
- Few imports and path management (similar to how styled components inserted ${props})

Rules

- Keep the code simple enough to allow the reader to efficiently compare and contrast implementations

Extras

- Run a comparison for bundle size, parsing speed for each project and post a report at the end, highlighting the efficiency of each implementation

---

The libraries in question

1. StyleX
2. Next-yak
3. Linaria
4. TailwindCSS
5. PandaCSS
6. CSS with CSS modules
