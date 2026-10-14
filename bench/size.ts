import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { type App, appDir, apps, startServer, writeResult } from "./lib.ts";

const measure = (buffers: Buffer[]) => ({
  raw: buffers.reduce((n, b) => n + b.length, 0),
  gzip: buffers.reduce((n, b) => n + gzipSync(b, { level: 9 }).length, 0),
  brotli: buffers.reduce((n, b) => n + brotliCompressSync(b).length, 0),
});

function staticFiles(app: App, extension: string) {
  const dir = path.join(appDir(app), ".next/static/chunks");
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(extension))
    .map((file) => readFileSync(path.join(dir, file)));
}

async function firstLoad(app: App, port: number) {
  const server = await startServer(app, port);
  try {
    const html = await (await fetch(`http://localhost:${port}/`)).text();
    const urls = [...html.matchAll(/(?:href|src)="(\/_next\/static\/[^"]+\.(?:css|js))"/g)].map(
      (m) => m[1],
    );
    const unique = [...new Set(urls)];
    const read = (ext: string) =>
      unique
        .filter((url) => url.endsWith(ext))
        .map((url) => readFileSync(path.join(appDir(app), ".next", url.replace("/_next/", ""))));
    return {
      html: measure([Buffer.from(html)]),
      css: measure(read(".css")),
      js: measure(read(".js")),
    };
  } finally {
    server.kill();
  }
}

const selected = (process.argv[2] ? [process.argv[2]] : apps) as App[];
for (const [index, app] of selected.entries()) {
  writeResult(`size-${app}`, {
    app,
    unit: "bytes",
    firstLoad: await firstLoad(app, 3200 + index),
    total: { css: measure(staticFiles(app, ".css")), js: measure(staticFiles(app, ".js")) },
  });
}
