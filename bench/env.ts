import { execFileSync } from "node:child_process";
import os from "node:os";
import { chromium } from "playwright";
import { writeResult } from "./lib.ts";

const browser = await chromium.launch();

writeResult("env", {
  os: `${os.type()} ${os.release()}`,
  arch: os.arch(),
  cpu: os.cpus()[0]?.model ?? "unknown",
  cores: os.cpus().length,
  memoryGb: Math.round(os.totalmem() / 1024 ** 3),
  node: process.version,
  bun: execFileSync("bun", ["--version"], { encoding: "utf8" }).trim(),
  chromium: browser.version(),
  date: new Date().toISOString().slice(0, 10),
});

await browser.close();
