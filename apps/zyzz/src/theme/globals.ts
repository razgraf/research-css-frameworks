import { global } from "zyzz/web";
import { vars } from "./zyzz.config";

global({
  "*, *::before, *::after": { boxSizing: "border-box" },
  body: {
    backgroundColor: vars.color.background,
    color: vars.color.textPrimary,
    fontFamily: vars.fontFamily.sans,
    fontSize: vars.fontSize.body,
    lineHeight: 1.5,
    margin: "0px",
    WebkitFontSmoothing: "antialiased",
  },
  button: { color: "inherit", font: "inherit" },
});
