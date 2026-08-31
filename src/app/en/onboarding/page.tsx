import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

const tour = [
  ["Read the event", "Start with what a source can directly support. A blue documented mark does not mean the whole story is settled."],
  ["Notice the standpoint", "A person’s experience, values, and constraints change what matters. It should be named, not smuggled in as neutral fact."],
  ["Keep uncertainty visible", "Syāt leaves an unresolved question on the page when the evidence is not enough. That is a feature, not an unfinished design."],
  ["Choose your next step", "Save a question, open a source trail, or use Reframe when a claim deserves a slower read."],
] as const;

export default function OnboardingPage() {
  return <SiteChrome active="about"><section className="guided-page"><p className="micro-copy">First-time guide · about two minutes</p><h1>News is more useful when its edges stay visible.</h1><p className="page-lede">This gentle tour introduces the reading tools before you see a feed. It works without an account.</p><ol className="tour-steps">{tour.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{description}</p></div></li>)}</ol><section className="feature-gates" aria-labelledby="preview-features"><div><h2 id="preview-features">Available now</h2><p>Read the teaching fixtures, browse one hundred questions, open original source links, and use the private Reframe workbench.</p></div><div><h2>Waiting for your account</h2><p>Synced saves and reading progress appear after Google sign-in and editor-approved account testing on a stable address.</p></div><div><h2>Waiting for a human review</h2><p>News drafts, public perspectives, comments, notifications, recommendations, translations, and social embeds stay closed until their evidence, moderation, cost, and rights gates are ready.</p></div></section><div className="page-actions"><Link className="primary-action" href="/">Open today’s reading <span aria-hidden="true">↗</span></Link><Link className="text-action" href="/en/about">Read about the method</Link></div></section></SiteChrome>;
}
