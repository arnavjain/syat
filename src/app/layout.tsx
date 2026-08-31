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
  title: "Syāt — see what you are missing",
  description: "A reading-first product for stories and enduring ideas seen through more than one standpoint.",
  robots: {
    index: false,
    follow: false
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
