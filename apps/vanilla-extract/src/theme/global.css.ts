import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

globalStyle("*, *::before, *::after", { boxSizing: "border-box" });

globalStyle("body", {
  background: vars.color.background,
  color: vars.color.textPrimary,
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.body,
  lineHeight: 1.5,
  margin: 0,
  WebkitFontSmoothing: "antialiased",
});

globalStyle("button", { color: "inherit", font: "inherit" });
