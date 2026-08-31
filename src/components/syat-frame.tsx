import Link from "next/link";

import { SyatFrameSwitcher, type FrameView } from "./syat-frame-switcher";

const frameViews: FrameView[] = [
  {
    id: "whole",
    label: "Whole View",
    sees: "The published plan and the different routines it touches.",
    values: "Holding shared facts and unequal effects together.",
    uses: "A fictional policy note, route prompts, and four clearly labelled teaching standpoints.",
    mayMiss: "Voices and evidence that this small teaching fixture does not include.",
  },
  {
    id: "commuter",
    label: "Bus commuter",
    sees: "Whether one bus journey becomes more dependable or more crowded.",
    values: "Reliable time and an affordable trip.",
    uses: "Shift hours, bus frequency, and the fictional published plan.",
    mayMiss: "The limits faced by people who cannot use that route.",
  },
  {
    id: "vendor",
    label: "Street vendor",
    sees: "Whether customers and suppliers can still reach the market edge.",
    values: "A viable day’s trade and predictable access.",
    uses: "Delivery windows, footfall, and local relationships.",
    mayMiss: "Benefits that arrive beyond the immediate market edge.",
  },
  {
    id: "access",
    label: "Wheelchair user",
    sees: "Whether the promised route is continuous in practice, not only on a map.",
    values: "Access, dignity, and dependable assistance.",
    uses: "Kerbs, crossings, obstructions, and each trip’s constraints.",
    mayMiss: "Other residents’ different access needs.",
  },
  {
    id: "care",
    label: "School caregiver",
    sees: "How the changed road meets a chain of pick-up, work, and care.",
    values: "Safety and reliable time.",
    uses: "School hours, walking conditions, and family routines.",
    mayMiss: "System-wide effects beyond one family’s day.",
  },
];

export function SyatFrame() {
  return (
    <section className="syat-frame" data-syat-frame="true" aria-labelledby="syat-frame-title">
      <div className="frame-corner corner-top-left" aria-hidden="true" />
      <div className="frame-corner corner-top-right" aria-hidden="true" />
      <div className="frame-corner corner-bottom-left" aria-hidden="true" />
      <div className="frame-corner corner-bottom-right" aria-hidden="true" />

      <header className="syat-frame-header">
        <div>
          <p className="frame-eyebrow">Fixed subject · fictional Indian teaching fixture</p>
          <h2 id="syat-frame-title">One plan. Four daily realities.</h2>
        </div>
        <p className="frame-instruction">Choose a viewpoint. The subject stays fixed.</p>
      </header>

      <div className="fixed-subject">
        <span>Subject stays fixed</span>
        <blockquote>The fictional Nadi Nagar plan reserves part of Bazaar Road for buses, walking, and short deliveries.</blockquote>
        <p>Not a real city, policy, person, or measured outcome.</p>
      </div>

      <SyatFrameSwitcher views={frameViews} />

      <footer className="syat-frame-footer">
        <p><strong>Documented:</strong> the fixture describes the rule. <strong>Open:</strong> how daily access would work.</p>
        <Link href="/en/news/street-plan-daily-realities">Read the full teaching story <span aria-hidden="true">↗</span></Link>
      </footer>
    </section>
  );
}
