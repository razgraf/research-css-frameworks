import { run } from "./lib.ts";

const dir = import.meta.dirname;
for (const step of ["env.ts", "build.ts", "size.ts", "trace.ts", "report.ts"]) {
  run("node", [step], dir);
}
