import { AccountConnection } from "@/components/account-connection";
import { SiteChrome } from "@/components/site-chrome";

export default function YouPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <SiteChrome active="you"><section className="you-page"><p className="micro-copy">Your space</p><h1>A reading trail, not an attention trap.</h1><p className="page-lede">There are no accounts yet, so nothing here is collecting data about you. What works today works on this device and nowhere else.</p><AccountConnection googleEnabled={googleEnabled} /><div className="feature-gates"><div><h2>Your shelf</h2><p>Working now, kept on this device. Sync would need an account, which does not exist yet.</p></div><div><h2>Recommendations</h2><p>Off. Suggesting reading would mean profiling you, and that needs a policy first.</p></div><div><h2>Notifications</h2><p>Off. Nothing will contact you, because there is no way to reach you and no reason to.</p></div></div></section></SiteChrome>;
}
