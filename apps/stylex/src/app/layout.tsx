import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { stylex, theme } from "@/theme/index.stylex";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Visit Mars · StyleX",
  description: "CSS framework comparison: StyleX",
};

const themeScript = `try{const t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"||t==="dark"?t:matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}catch{}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  const marker = stylex.props(stylex.defaultMarker()).className;
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable} ${marker}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script prevents a theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body sx={styles.body}>{children}</body>
    </html>
  );
}

const styles = stylex.create({
  body: {
    margin: 0,
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    fontFamily: theme.font.familySans,
    fontSize: theme.font.sizeBody,
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
  },
});
