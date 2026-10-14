import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { apps, readResult, root } from "./lib.ts";

type Stat = { median: number; p95: number };
type Bytes = { raw: number; gzip: number; brotli: number };
type Env = Record<string, string | number>;
type BuildRun = { ms: Stat; peakMemoryMb: Stat };
type Build = { cold: BuildRun; warm: BuildRun };
type Size = { firstLoad: { html: Bytes; css: Bytes; js: Bytes } };
type Trace = Record<
  "parseStylesheet" | "recalcStyle" | "layout" | "fcp" | "lcp" | "toggleRecalcStyle",
  Stat
>;

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
const ms = (value: number) => `${value.toFixed(1)}`;
const stat = (s: Stat, format = ms) => `${format(s.median)} (${format(s.p95)})`;
const seconds = (value: number) => (value / 1000).toFixed(2);
const table = (head: string[], rows: string[][]) =>
  [head, head.map(() => "---"), ...rows].map((r) => `| ${r.join(" | ")} |`).join("\n");

const env = readResult<Env>("env");
const builds = apps.map((app) => readResult<Build>(`build-${app}`));
const sizes = apps.map((app) => readResult<Size>(`size-${app}`));
const traces = apps.map((app) => readResult<Trace>(`trace-${app}`));
const baselineJs = sizes[0].firstLoad.js.brotli;

const section = [
  `Measured ${env.date} on ${env.cpu} (${env.cores} cores, ${env.memoryGb} GB), ${env.os}, Node ${env.node}, bun ${env.bun}, Chromium ${env.chromium}. Values are median (p95) of 10 runs. Raw data: \`bench/results/\`.`,
  "### Build time (seconds, `bun run build`)",
  table(
    ["App", "Cold (no `.next`)", "Warm (cached)", "Peak RSS, cold (MB, largest process)"],
    apps.map((app, i) => [
      app,
      stat(builds[i].cold.ms, seconds),
      stat(builds[i].warm.ms, seconds),
      stat(builds[i].cold.peakMemoryMb, (v) => v.toFixed(0)),
    ]),
  ),
  "### First-load bytes for `/` (brotli)",
  table(
    ["App", "CSS", "JS", "JS vs CSS Modules", "HTML"],
    apps.map((app, i) => {
      const { css, js, html } = sizes[i].firstLoad;
      const delta = js.brotli - baselineJs;
      return [
        app,
        kb(css.brotli),
        kb(js.brotli),
        `${delta >= 0 ? "+" : ""}${kb(delta)}`,
        kb(html.brotli),
      ];
    }),
  ),
  "### Browser cost for `/` (ms, Chromium, 4× CPU throttle)",
  table(
    [
      "App",
      "Parse stylesheets",
      "Recalculate style",
      "Layout",
      "FCP",
      "LCP",
      "Theme toggle recalc",
    ],
    apps.map((app, i) => {
      const t = traces[i];
      return [
        app,
        stat(t.parseStylesheet),
        stat(t.recalcStyle),
        stat(t.layout),
        stat(t.fcp),
        stat(t.lcp),
        stat(t.toggleRecalcStyle),
      ];
    }),
  ),
].join("\n\n");

const readme = path.join(root, "README.md");
const content = readFileSync(readme, "utf8");
const pattern = /<!-- bench:start -->[\s\S]*<!-- bench:end -->/;
if (!pattern.test(content)) throw new Error("README.md is missing the bench markers");
writeFileSync(
  readme,
  content.replace(pattern, `<!-- bench:start -->\n\n${section}\n\n<!-- bench:end -->`),
);
