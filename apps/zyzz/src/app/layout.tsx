import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { script, vars } from "@/theme";
import "@/theme/globals";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Visit Mars · zyzz",
  description: "CSS framework comparison: zyzz",
};

// Follows the OS until the toggle saves a scheme, which `script()` restores before paint.
const scheme = vars({ colorScheme: "light dark" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${scheme.className} ${sans.variable} ${mono.variable}`}
      style={scheme.style}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: zyzz's static script prevents a theme flash */}
        <script dangerouslySetInnerHTML={{ __html: script() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
