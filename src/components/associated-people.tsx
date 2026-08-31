import type { PreviewAssociation } from "@/lib/preview-content";

const kindLabels: Record<PreviewAssociation["kind"], string> = {
  person: "Person",
  institution: "Institution",
  community: "Community",
  unknown_unverified: "Unknown / unverified",
};

export function AssociatedPeople({ associations }: { associations: readonly PreviewAssociation[] }) {
  return (
    <section className="associated-people" id="people" aria-labelledby="people-title">
      <div className="section-heading"><div><p className="micro-copy">Who or what this fixture names</p><h2 id="people-title">People and roles</h2></div><p>These are reading connections, not profile cards. A role can open a question; it cannot stand in for a whole community.</p></div>
      <ul>
        {associations.map((association) => <li key={association.id} className={`association ${association.kind}`}>
          <p className="association-kind">{kindLabels[association.kind]}</p>
          <h3>{association.label}</h3>
          {association.fixtureLabel && <p className="fixture-label">{association.fixtureLabel}</p>}
          <p>{association.association}</p>
          <a href={`#${association.sourceId}`}>Source {association.sourceId}</a>
        </li>)}
      </ul>
    </section>
  );
}
