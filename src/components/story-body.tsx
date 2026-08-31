import type { ReaderStory } from "@/lib/reader-story-schema";

type StoryBlock = ReaderStory["body"][number];

type BodySection = {
  id: string;
  title: string;
  blocks: StoryBlock[];
};

function groupSections(blocks: readonly StoryBlock[]): BodySection[] {
  const sections: BodySection[] = [];
  let current: BodySection | undefined;

  for (const block of blocks) {
    if (block.kind === "paragraph" && block.section) {
      current = { id: block.section.id, title: block.section.title, blocks: [] };
      sections.push(current);
    }
    if (!current) {
      current = { id: "story-reading", title: "The story", blocks: [] };
      sections.push(current);
    }
    current.blocks.push(block);
  }

  return sections;
}

function EvidenceLinks({ sourceIds }: { sourceIds: readonly string[] }) {
  return (
    <span className="story-paragraph-sources" aria-label="Sources for this passage">
      {sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>{sourceId}</a>)}
    </span>
  );
}

export function StoryBody({ blocks }: { blocks: readonly StoryBlock[] }) {
  return (
    <div className="reader-story-body" id="story-body">
      {groupSections(blocks).map((section) => (
        <section className="reader-body-section" aria-labelledby={`${section.id}-title`} key={section.id}>
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.blocks.map((block) => block.kind === "paragraph" ? (
            <div className="reader-paragraph" key={block.id}>
              <p>{block.text}</p>
              <EvidenceLinks sourceIds={block.sourceIds} />
            </div>
          ) : (
            <aside className="reader-media-reference" key={block.id} aria-label="Approved media position">
              <span>Approved media position</span>
              <p>This point refers to media record <code>{block.mediaId}</code>. Its rights and limits appear in the visual record.</p>
              <EvidenceLinks sourceIds={block.sourceIds} />
            </aside>
          ))}
        </section>
      ))}
    </div>
  );
}
