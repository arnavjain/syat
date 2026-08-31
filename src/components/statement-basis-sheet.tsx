import type { PreviewEvidence } from "@/lib/preview-content";

export function StatementBasisSheet({ statement, basis, sourceIds }: { statement: string; basis: PreviewEvidence["basis"]; sourceIds: string[] }) {
  const exactStatement = statement;

  return (
    <details className="statement-basis-sheet" id={basis.id}>
      <summary>Tap for basis <span className="sr-only">for: {exactStatement}</span></summary>
      <div className="statement-basis-content">
        <dl>
          <div><dt>Statement type</dt><dd>{basis.statementType}</dd></div>
          <div><dt>Basis</dt><dd>{basis.basis}</dd></div>
          <div><dt>Source scope</dt><dd>{basis.sourceScope}</dd></div>
          <div><dt>Limits</dt><dd>{basis.limits}</dd></div>
        </dl>
        <p>{sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>Source {sourceId}</a>)}</p>
      </div>
    </details>
  );
}
