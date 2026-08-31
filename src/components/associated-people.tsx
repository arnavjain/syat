import type { PreviewAssociation } from "@/lib/preview-content";
import type { ReaderStory } from "@/lib/reader-story-schema";

type Association = PreviewAssociation | ReaderStory["people"][number];

const kindLabels: Record<Association["kind"], string> = {
  person: "Person",
  institution: "Institution",
  community: "Community",
  unknown_unverified: "Unknown / unverified",
};

function sourceIdsFor(association: Association) {
  return "sourceIds" in association ? association.sourceIds : [association.sourceId];
}

export function AssociatedPeople({ associations, generated = false }: { associations: readonly Association[]; generated?: boolean }) {
  if (associations.length === 0) return null;
  return (
    <section className="associated-people" id="people" aria-labelledby="people-title">
      <div className="section-heading"><div>{generated ? <p className="reader-section-label">Associated with this record</p> : <p className="micro-copy">Who or what this fixture names</p>}<h2 id="people-title">People and roles</h2></div><p>These are evidence connections, not profile cards. A named role does not stand in for a whole community.</p></div>
      <ul>
        {associations.map((association) => <li key={association.id} className={`association ${association.kind}`}>
          <p className="association-kind">{kindLabels[association.kind]}</p>
          <h3>{association.label}</h3>
          {"fixtureLabel" in association && association.fixtureLabel ? <p className="fixture-label">{association.fixtureLabel}</p> : null}
          <p>{association.association}</p>
          {sourceIdsFor(association).map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>Source {sourceId}</a>)}
        </li>)}
      </ul>
    </section>
  );
}
