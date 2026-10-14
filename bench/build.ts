import { readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { type App, appDir, apps, run, runs, summarize, writeResult } from "./lib.ts";

type Measurement = { time_wall_clock: { value: number }; memory_peak_resident: { value: number } };
type Hyperfine = { results: { measurements: Measurement[] }[] };

function hyperfine(app: App, mode: "cold" | "warm") {
  const out = path.join(os.tmpdir(), `hyperfine-${app}-${mode}.json`);
  const prepare = mode === "cold" ? ["--prepare", "rm -rf .next"] : [];
  run(
    "hyperfine",
    ["--warmup", "1", "--runs", String(runs), ...prepare, "--export-json", out, "bun run build"],
    appDir(app),
  );
  const { results } = JSON.parse(readFileSync(out, "utf8")) as Hyperfine;
  rmSync(out);
  const { measurements } = results[0];
  return {
    ms: summarize(measurements.map((m) => Math.round(m.time_wall_clock.value * 1000))),
    peakMemoryMb: summarize(
      measurements.map((m) => Math.round(m.memory_peak_resident.value / 1024 ** 2)),
    ),
  };
}

const selected = (process.argv[2] ? [process.argv[2]] : apps) as App[];
for (const app of selected) {
  run("bun", ["install", "--frozen-lockfile"], appDir(app));
  writeResult(`build-${app}`, {
    app,
    unit: "ms",
    cold: hyperfine(app, "cold"),
    warm: hyperfine(app, "warm"),
  });
}
