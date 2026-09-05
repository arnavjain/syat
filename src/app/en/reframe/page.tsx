import { Suspense } from "react";

import { ReframeWorkbench } from "@/components/reframe-workbench";
import { SiteChrome } from "@/components/site-chrome";

export default function ReframePage() {
  return <SiteChrome active="reframe"><section className="reframe-page"><p className="micro-copy">Reframe</p><h1>Hold a claim up to better questions.</h1><p className="page-lede">Paste a claim, a passage or a question you want to think about more carefully. Syāt turns it into a reading plan: what would count as evidence, what is being read into it, and what would change your mind. Nothing is sent anywhere and no AI writes anything here.</p><Suspense fallback={<p>Preparing your local reading plan.</p>}><ReframeWorkbench /></Suspense></section></SiteChrome>;
}
