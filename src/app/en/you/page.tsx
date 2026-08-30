import { AccountConnection } from "@/components/account-connection";
import { SiteChrome } from "@/components/site-chrome";

export default function YouPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <SiteChrome active="you"><section className="you-page"><p className="micro-copy">Your space</p><h1>A reading trail, not an attention trap.</h1><p className="page-lede">Saves, progress, and recommendations are designed to stay understandable and reversible. None are collecting data in this private preview.</p><AccountConnection googleEnabled={googleEnabled} /><div className="feature-gates"><div><h2>Saves and sync</h2><p>Ready after your first Google sign-in.</p></div><div><h2>Recommendations</h2><p>Kept off until the owner approves the personalisation policy.</p></div><div><h2>Notifications</h2><p>Kept off until quiet hours and consent are reviewed.</p></div></div></section></SiteChrome>;
}
