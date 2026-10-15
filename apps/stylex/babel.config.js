const path = require("node:path");

module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV !== "production",
        importSources: ["@stylexjs/stylex", { from: "@/theme/index.stylex", as: "stylex" }],
        runtimeInjection: false,
        enableInlinedConditionalMerge: true,
        treeshakeCompensation: true,
        aliases: { "@/*": [path.join(__dirname, "src", "*")] },
        unstable_moduleResolution: { type: "commonJS" },
      },
    ],
  ],
};
