import Link from "next/link";

import { SyatLogo } from "./syat-logo";
import type { ReactNode } from "react";

type Section = "home" | "explore" | "search" | "reframe" | "saved" | "you" | "about" | "studio";

const links: Array<{ section: Exclude<Section, "about" | "studio">; href: string; label: string }> = [
  { section: "home", href: "/", label: "Home" },
  { section: "explore", href: "/en/explore", label: "Explore" },
  { section: "search", href: "/en/search", label: "Search" },
  { section: "reframe", href: "/en/reframe", label: "Reframe" },
  { section: "saved", href: "/en/saved", label: "Saved" },
  { section: "you", href: "/en/you", label: "You" }
];

export function SiteChrome({ active, children, compact = false, className = "" }: { active: Section; children: ReactNode; compact?: boolean; className?: string }) {
  return (
    <div className={`page-shell ${compact ? "page-shell-compact" : ""} ${className}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="masthead">
        <Link className="wordmark" href="/" aria-label="Syāt home"><SyatLogo /><span className="wordmark-text">Syāt<span aria-hidden="true">.</span></span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => <Link aria-current={active === link.section ? "page" : undefined} className={`nav-link ${active === link.section ? "is-active" : ""}`} href={link.href} key={link.section}>{link.label}</Link>)}
        </nav>
        <Link className="language-link" href="/hi" lang="hi">हिंदी</Link>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <p>Syāt writes its own questions and draws its own artwork. Links to other newsrooms are credited and belong to them.</p>
        <div><Link href="/en/about">About the method</Link><Link href="/en/onboarding">How to read Syāt</Link><Link href="/en/propose">Propose a question</Link><Link href="/en/privacy">Privacy</Link><Link href="/en/terms">Terms</Link><Link href="/en/studio">Review Studio</Link></div>
      </footer>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {links.map((link) => <Link aria-current={active === link.section ? "page" : undefined} className={`mobile-nav-link ${active === link.section ? "active" : ""}`} href={link.href} key={link.section}>{link.label}</Link>)}
      </nav>
    </div>
  );
}
