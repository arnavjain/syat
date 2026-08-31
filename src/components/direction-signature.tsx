import type { DesignDirection } from "@/lib/design-direction";

export function DirectionSignature({ direction }: { direction: DesignDirection }) {
  if (direction.signature === "change-spine") {
    return (
      <aside className="direction-signature evidence-signature" data-direction-signature="change-spine" aria-label="Annotated Evidence signature">
        <p className="signature-kicker">Change spine</p>
        <ol>
          <li><span>Now</span><strong>Plan announced</strong></li>
          <li><span>Earlier</span><strong>Street shared informally</strong></li>
          <li><span>Changed</span><strong>Daytime access rules</strong></li>
          <li><span>Open</span><strong>Daily effects</strong></li>
        </ol>
        <p className="signature-note">Fixture chronology · not live reporting</p>
      </aside>
    );
  }

  if (direction.signature === "credit-tray") {
    return (
      <aside className="direction-signature garden-signature" data-direction-signature="credit-tray" aria-label="Signal Garden signature">
        <div className="authored-media" role="img" aria-label="Abstract authored street fixture showing a bus lane, market edge, school gate, and crossing">
          <span className="media-route route-one" />
          <span className="media-route route-two" />
          <span className="media-block block-one" />
          <span className="media-block block-two" />
          <span className="media-block block-three" />
          <span className="media-label">Authored fixture</span>
        </div>
        <dl className="credit-tray">
          <div><dt>Creator</dt><dd>Syāt prototype team</dd></div>
          <div><dt>Source</dt><dd>Original teaching fixture</dd></div>
          <div><dt>Rights basis</dt><dd>Syāt-authored fixture</dd></div>
          <div><dt>Review</dt><dd>Fixture metadata checked</dd></div>
          <div><dt>Publication</dt><dd>not publishable</dd></div>
        </dl>
      </aside>
    );
  }

  return (
    <aside className="direction-signature warm-signature" data-direction-signature="subject-frame" aria-label="Warm Commons signature">
      <p className="signature-kicker">The subject stays still</p>
      <div className="warm-subject-mark">
        <span>One plan</span>
        <strong>Four daily realities</strong>
        <small>Change the viewpoint, not the subject.</small>
      </div>
      <p className="signature-note">Rounded comfort around a structured evidence frame.</p>
    </aside>
  );
}
