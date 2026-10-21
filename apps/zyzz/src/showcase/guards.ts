// Never imported, so Next doesn't compile it and only `tsc` checks it. The zyzz compiler rejects the
// same raw value at build time.
import { style } from "@/theme";

// @ts-expect-error raw colors aren't tokens; opting out takes an explicit ` !custom`
export const raw = style({ color: "#f00" });
