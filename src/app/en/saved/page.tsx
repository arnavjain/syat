import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

export default function SavedPage() {
  return <SiteChrome active="saved"><section className="empty-page"><p className="micro-copy">Saved</p><h1>Make room for the question you want to return to.</h1><p className="page-lede">Your shelf appears after account sync is connected. Until then, try the reading method on a teaching story.</p><Link className="primary-action" href="/en/news/street-plan-daily-realities">Read the fixture <span aria-hidden="true">↗</span></Link></section></SiteChrome>;
}
