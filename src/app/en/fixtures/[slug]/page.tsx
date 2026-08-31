import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { fixtureDocuments, getFixtureDocument } from "@/lib/preview-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return fixtureDocuments.map((document) => ({ slug: document.slug }));
}

export default async function FixtureDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const document = getFixtureDocument((await params).slug);
  if (!document) notFound();

  return <SiteChrome active="about"><article className="story-page fixture-document"><header className="story-header"><p className="micro-copy">Fictional teaching document · private preview</p><h1>{document.title}</h1><p className="page-lede">{document.purpose}</p></header><section className="story-summary"><div><p className="micro-copy">What it cannot establish</p><p>{document.cannotEstablish}</p></div><div><p className="micro-copy">Why it is not reporting</p><p>{document.reportingBoundary}</p></div></section><section className="source-trail"><p className="micro-copy">Teaching material</p><h2>Read the small sample, then keep its limits in view.</h2>{document.sections.map((section) => <article key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p></article>)}</section></article></SiteChrome>;
}
