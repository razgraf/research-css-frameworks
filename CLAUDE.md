# CLAUDE.md

Research repo comparing CSS approaches in Next.js. `PLAN.md` is the spec and `PRD.md` is the brief. Read `PLAN.md` before working.

## Rules

- Not a monorepo. Each `apps/<name>` is fully standalone: its own `package.json`, `bun.lock`, configs, `.gitignore`, `biome.json`, `.vscode/`. Never share code, tokens or configs between apps, and never add a root `package.json` or workspaces.
- Keep app-specific files inside the app folder. Root holds only `PRD.md`, `PLAN.md`, `CLAUDE.md`, `README.md`, `.gitignore` and `bench/`.
- Pin exact versions (no `^`/`~`) from the "Pinned versions" table in `PLAN.md`. Don't upgrade one app alone.
- `/` must render identically in every app (same markup, content, tokens, layout). Framework-specific extras go only in `src/showcase/` on the `/showcase` route, about 60 lines max.
- Units: font sizes in `pt`, everything else in `px`. Never `rem` or `em`.
- Write each app the framework's idiomatic way, but keep code minimal and readable for side-by-side comparison.
- `bench/` treats apps as black boxes (shell commands and build artifacts only). Results must not contain hostname, username, absolute paths or other identifying machine info.
- When a setup step fails, take the first fallback that keeps the authoring syntax unchanged and log it in the README gotchas.
- Run scripts with `bun run` (Node executes `next`). Turbopack by default.
- Per app, before calling work done: `bun run lint && bun run typecheck && bun run build`.
- Use `px` and `pt` not `rem`
