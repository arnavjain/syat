import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource/anton/400.css";
import "@fontsource/spectral/400.css";
import "@fontsource/spectral/600.css";
import "@fontsource/spectral/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./globals.css";

export const metadata: Metadata = {
  // syat.vercel.app belongs to an unrelated project. Pointing at it would have sent every
  // canonical and share URL to someone else's site.
  metadataBase: new URL("https://syat-seven.vercel.app"),
  title: {
    default: "Syāt — questions that keep opening",
    template: "%s"
  },
  description: "One hundred open questions, each written out with the standpoints that genuinely disagree about it, what each brings into view, and what it misses.",
  openGraph: {
    title: "Syāt — questions that keep opening",
    description: "Read one subject from more than one honest standpoint.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
