import { type Browser, chromium, type Page } from "playwright";
import { type App, apps, runs, startServer, summarize, writeResult } from "./lib.ts";

type TraceEvent = { name: string; ph: string; dur?: number };

const categories = ["devtools.timeline", "disabled-by-default-devtools.timeline"];
function sum(trace: Buffer) {
  const { traceEvents } = JSON.parse(trace.toString()) as { traceEvents: TraceEvent[] };
  const total = (name: string) =>
    traceEvents
      .filter((e) => e.name === name && e.ph === "X")
      .reduce((ms, e) => ms + (e.dur ?? 0) / 1000, 0);
  return {
    parseStylesheet: total("ParseAuthorStyleSheet"),
    recalcStyle: total("UpdateLayoutTree"),
    layout: total("Layout"),
  };
}

async function openPage(browser: Browser, url: string): Promise<Page> {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await browser.startTracing(page, { categories });
  await page.goto(url, { waitUntil: "load" });
  return page;
}

async function measureRun(browser: Browser, url: string) {
  const page = await openPage(browser, url);
  const paint = await page.evaluate(
    () =>
      new Promise<{ fcp: number; lcp: number }>((resolve) => {
        const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve({ fcp, lcp: entries[entries.length - 1]?.startTime ?? 0 });
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
  const load = sum(await browser.stopTracing());

  await browser.startTracing(page, { categories });
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
  const toggle = sum(await browser.stopTracing());

  await page.context().close();
  return { ...load, ...paint, toggleRecalcStyle: toggle.recalcStyle };
}

const selected = (process.argv[2] ? [process.argv[2]] : apps) as App[];
const browser = await chromium.launch();
for (const [index, app] of selected.entries()) {
  const port = 3300 + index;
  const server = await startServer(app, port);
  try {
    await measureRun(browser, `http://localhost:${port}/`);
    const samples: Awaited<ReturnType<typeof measureRun>>[] = [];
    for (let i = 0; i < runs; i++)
      samples.push(await measureRun(browser, `http://localhost:${port}/`));
    const metric = (key: keyof (typeof samples)[number]) =>
      summarize(samples.map((s) => +s[key].toFixed(2)));
    writeResult(`trace-${app}`, {
      app,
      unit: "ms",
      cpuThrottle: 4,
      parseStylesheet: metric("parseStylesheet"),
      recalcStyle: metric("recalcStyle"),
      layout: metric("layout"),
      fcp: metric("fcp"),
      lcp: metric("lcp"),
      toggleRecalcStyle: metric("toggleRecalcStyle"),
    });
  } finally {
    server.kill();
  }
}
await browser.close();
