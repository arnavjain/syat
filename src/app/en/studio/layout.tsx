import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Private Review Studio · Syāt",
  robots: { index: false, follow: false }
};

export default function StudioLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="page-shell studio-private-shell">
      <a className="skip-link" href="#studio-main">Skip to Studio content</a>
      <header className="masthead studio-private-header">
        <Link className="wordmark" href="/" aria-label="Syāt private preview home">Syāt<span aria-hidden="true">.</span></Link>
        <p>Private Review Studio</p>
      </header>
      {children}
    </div>
  );
}
