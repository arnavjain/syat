import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

const tour = [
  ["Read the event", "Start with what a source can directly support. A blue documented mark does not mean the whole story is settled."],
  ["Notice the standpoint", "A person’s experience, values, and constraints change what matters. It should be named, not smuggled in as neutral fact."],
  ["Keep uncertainty visible", "Syāt leaves an unresolved question on the page when the evidence is not enough. That is a feature, not an unfinished design."],
  ["Choose your next step", "Save a question, open a source trail, or use Reframe when a claim deserves a slower read."],
] as const;

export default function OnboardingPage() {
  return <SiteChrome active="about"><section className="guided-page"><p className="micro-copy">First-time guide · about two minutes</p><h1>News is more useful when its edges stay visible.</h1><p className="page-lede">This gentle tour introduces the reading tools before you see a feed. It works without an account.</p><ol className="tour-steps">{tour.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{description}</p></div></li>)}</ol><div className="page-actions"><Link className="primary-action" href="/">Open today’s reading <span aria-hidden="true">↗</span></Link><Link className="text-action" href="/en/about">Read about the method</Link></div></section></SiteChrome>;
}
