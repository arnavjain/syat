import { Suspense } from "react";

import { ReframeWorkbench } from "@/components/reframe-workbench";
import { SiteChrome } from "@/components/site-chrome";

export default function ReframePage() {
  return <SiteChrome active="reframe"><section className="reframe-page"><p className="micro-copy">Reframe</p><h1>Hold a claim up to better questions.</h1><p className="page-lede">This private workbench starts locally. It gives you a disciplined way to read before any AI draft is allowed to exist.</p><Suspense fallback={<p>Preparing your local reading plan.</p>}><ReframeWorkbench /></Suspense></section></SiteChrome>;
}
