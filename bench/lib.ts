import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export const root = path.resolve(import.meta.dirname, "..");
export const resultsDir = path.join(import.meta.dirname, "results");
export const apps = [
  "css-modules",
  "tailwind",
  "next-yak",
  "linaria",
  "stylex",
  "panda",
  "vanilla-extract",
] as const;
export type App = (typeof apps)[number];
export const runs = 10;

export const appDir = (app: App) => path.join(root, "apps", app);

export function run(cmd: string, args: string[], cwd: string) {
  const result = spawnSync(cmd, args, { cwd, stdio: "inherit" });
  if (result.status !== 0)
    throw new Error(`${cmd} ${args.join(" ")} failed in ${path.relative(root, cwd)}`);
}

export function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function p95(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)];
}

export const summarize = (values: number[]) => ({
  median: median(values),
  p95: p95(values),
  runs: values,
});

export async function startServer(app: App, port: number): Promise<ChildProcess> {
  const server = spawn("bun", ["run", "start"], {
    cwd: appDir(app),
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(`http://localhost:${port}/`)).ok) return server;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  server.kill();
  throw new Error(`${app} did not start on port ${port}`);
}

const forbidden = [os.homedir(), os.hostname(), os.userInfo().username].filter((s) => s.length > 2);

export function writeResult(name: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const leak = forbidden.find((value) => json.includes(value));
  if (leak) throw new Error(`Refusing to write ${name}: output contains machine-identifying data`);
  writeFileSync(path.join(resultsDir, `${name}.json`), `${json}\n`);
}

export const readResult = <T>(name: string): T =>
  JSON.parse(readFileSync(path.join(resultsDir, `${name}.json`), "utf8"));
