import type { ReaderStoryIndexItem } from "@/lib/reader-story-schema";

/**
 * An owned motif for a News story.
 *
 * The News lane cannot carry publisher photography: every newsroom source is link-only, so no
 * third-party image may appear beside a story. Rather than leave the index as an unbroken column
 * of text, Syāt draws its own mark for each story from the story's own slug. Nothing to license,
 * nothing to clear, no request to make, and no risk of an image implying evidence it does not hold.
 *
 * The geometry follows the story format rather than decorating at random: a brief files a record,
 * an explainer opens a thing up, a timeline runs a spine, a source map connects, a public-impact
 * piece spreads outward unevenly. It illustrates the shape of the reading, and establishes nothing.
 */

type MotifFormat = ReaderStoryIndexItem["format"];

/** Small deterministic hash so a slug always draws the same mark. */
function seedFrom(slug: string): number {
  let hash = 2166136261;
  for (let index = 0; index < slug.length; index += 1) {
    hash ^= slug.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function sequence(seed: number, count: number): number[] {
  const values: number[] = [];
  let current = seed;
  for (let index = 0; index < count; index += 1) {
    current = (current * 1103515245 + 12345) & 0x7fffffff;
    values.push(current / 0x7fffffff);
  }
  return values;
}

const ink = "#241021";
const cobalt = "#2b4bff";
const marigold = "#ffc63b";
const hibiscus = "#b4144b";
const teal = "#0b7a5e";

function BriefMotif({ random }: { random: number[] }) {
  // A filed record: lines of evidence, one of them lifted out and marked.
  const pulled = Math.floor(random[0] * 4) + 1;
  return (
    <g>
      {Array.from({ length: 6 }, (_, row) => {
        const y = 16 + row * 15;
        const width = 44 + random[row] * 84;
        const isPulled = row === pulled;
        return <rect key={row} x={isPulled ? 26 : 18} y={y} width={isPulled ? width * 0.72 : width} height={6} rx={3} fill={isPulled ? marigold : cobalt} opacity={isPulled ? 1 : 0.42} />;
      })}
      <rect x={18} y={16 + pulled * 15 - 4} width={4} height={14} rx={2} fill={hibiscus} />
    </g>
  );
}

function ExplainerMotif({ random }: { random: number[] }) {
  // Nested frames opening outward: a thing taken apart to be understood.
  return (
    <g>
      {Array.from({ length: 4 }, (_, ring) => {
        const inset = ring * 13;
        const shift = (random[ring] - 0.5) * 14;
        return <rect key={ring} x={22 + inset + shift} y={16 + inset} width={116 - inset * 2} height={78 - inset * 2} rx={6} fill="none" stroke={ring % 2 === 0 ? cobalt : marigold} strokeWidth={ring === 0 ? 3 : 2} opacity={0.9 - ring * 0.13} />;
      })}
    </g>
  );
}

function TimelineMotif({ random }: { random: number[] }) {
  // A spine with markers at uneven intervals, because events do not arrive on a grid.
  const marked = Math.floor(random[2] * 5);
  return (
    <g>
      <line x1={20} y1={55} x2={140} y2={55} stroke={ink} strokeWidth={2} opacity={0.35} />
      {Array.from({ length: 5 }, (_, index) => {
        const x = 24 + index * 28 + (random[index] - 0.5) * 13;
        const height = 13 + random[(index + 2) % random.length] * 24;
        const up = index % 2 === 0;
        return (
          <g key={index}>
            <line x1={x} y1={55} x2={x} y2={up ? 55 - height : 55 + height} stroke={index === marked ? hibiscus : cobalt} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={x} cy={up ? 55 - height : 55 + height} r={index === marked ? 6 : 4} fill={index === marked ? marigold : cobalt} />
          </g>
        );
      })}
    </g>
  );
}

function SourceMapMotif({ random }: { random: number[] }) {
  // One account, several records standing behind it at different distances.
  const nodes = Array.from({ length: 5 }, (_, index) => {
    const angle = (index / 5) * Math.PI * 2 + random[0] * 2;
    const reach = 30 + random[index] * 26;
    return { x: 80 + Math.cos(angle) * reach, y: 55 + Math.sin(angle) * reach * 0.72 };
  });
  return (
    <g>
      {nodes.map((node, index) => <line key={index} x1={80} y1={55} x2={node.x} y2={node.y} stroke={cobalt} strokeWidth={1.8} opacity={0.5} />)}
      {nodes.map((node, index) => <circle key={index} cx={node.x} cy={node.y} r={index === 0 ? 7 : 5} fill={index === 0 ? teal : cobalt} opacity={0.92} />)}
      <circle cx={80} cy={55} r={10} fill={marigold} />
      <circle cx={80} cy={55} r={10} fill="none" stroke={ink} strokeWidth={2} />
    </g>
  );
}

function ImpactMotif({ random }: { random: number[] }) {
  // Ripples that do not reach equally far, since effects are never evenly distributed.
  return (
    <g>
      {Array.from({ length: 5 }, (_, ring) => {
        const radius = 11 + ring * 13 + random[ring] * 7;
        return <ellipse key={ring} cx={72} cy={55} rx={radius} ry={radius * (0.56 + random[(ring + 1) % random.length] * 0.3)} fill="none" stroke={ring % 2 === 0 ? cobalt : hibiscus} strokeWidth={ring === 0 ? 4 : 2} opacity={0.86 - ring * 0.12} />;
      })}
      <circle cx={72} cy={55} r={5} fill={marigold} />
    </g>
  );
}

export function StoryMotif({ story }: { story: Pick<ReaderStoryIndexItem, "slug" | "format" | "title"> }) {
  const random = sequence(seedFrom(story.slug), 10);
  const motif: Record<MotifFormat, React.ReactElement> = {
    news_brief: <BriefMotif random={random} />,
    explainer: <ExplainerMotif random={random} />,
    timeline: <TimelineMotif random={random} />,
    source_map: <SourceMapMotif random={random} />,
    public_impact: <ImpactMotif random={random} />
  };

  return (
    <figure className={`story-motif motif-${story.format.replaceAll("_", "-")}`} aria-hidden="true">
      <svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid meet" focusable="false">{motif[story.format]}</svg>
    </figure>
  );
}
