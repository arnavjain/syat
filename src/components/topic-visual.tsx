import type { TimelessTopic } from "@/lib/timeless-topics";

/**
 * An owned, generated motif for a Timeless topic.
 *
 * Syāt draws this from the topic's own slug, so every question gets a distinct image with no
 * third-party rights attached and nothing to clear. The geometry follows the reading lens
 * rather than decorating at random: an archive stacks, a system connects, a place contours,
 * a practice repeats, an idea radiates. It is inline SVG, so it costs no request and needs
 * no image pipeline.
 */

type MotifColour = { ink: string; line: string; accent: string };

const palette: Record<TimelessTopic["readingLens"], MotifColour> = {
  archive: { ink: "#241021", line: "#2b4bff", accent: "#ffc63b" },
  system: { ink: "#241021", line: "#0b7a5e", accent: "#ffc63b" },
  place: { ink: "#241021", line: "#b4144b", accent: "#ffc63b" },
  practice: { ink: "#241021", line: "#2b4bff", accent: "#d81e5b" },
  idea: { ink: "#241021", line: "#b4144b", accent: "#0b7a5e" }
};

/** Small deterministic hash so a slug always produces the same drawing. */
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

function ArchiveMotif({ random, colour }: { random: number[]; colour: MotifColour }) {
  // Strata: layers laid down over time, with one band interrupted where the record breaks.
  const gap = Math.floor(random[0] * 4) + 1;
  return (
    <g>
      {Array.from({ length: 7 }, (_, row) => {
        const y = 18 + row * 22;
        const width = 60 + random[row] * 150;
        const broken = row === gap;
        return (
          <g key={row}>
            <rect x={26} y={y} width={width} height={9} rx={4} fill={row % 2 === 0 ? colour.line : colour.accent} opacity={broken ? 0.22 : 0.9} />
            {broken ? <rect x={26 + width + 14} y={y} width={38} height={9} rx={4} fill={colour.line} opacity={0.9} /> : null}
          </g>
        );
      })}
    </g>
  );
}

function SystemMotif({ random, colour }: { random: number[]; colour: MotifColour }) {
  // A network where one node sits outside the connected set.
  const nodes = Array.from({ length: 7 }, (_, index) => ({
    x: 40 + random[index] * 200,
    y: 30 + random[(index + 3) % random.length] * 130
  }));
  return (
    <g>
      {nodes.slice(0, -1).map((node, index) => (
        <line key={index} x1={node.x} y1={node.y} x2={nodes[index + 1].x} y2={nodes[index + 1].y} stroke={colour.line} strokeWidth={2} opacity={0.55} />
      ))}
      {nodes.map((node, index) => (
        <circle key={index} cx={node.x} cy={node.y} r={index === nodes.length - 1 ? 11 : 7} fill={index === nodes.length - 1 ? colour.accent : colour.line} />
      ))}
    </g>
  );
}

function PlaceMotif({ random, colour }: { random: number[]; colour: MotifColour }) {
  // Contours around a centre, one of them open rather than closed.
  return (
    <g>
      {Array.from({ length: 6 }, (_, ring) => {
        const radius = 18 + ring * 15;
        const open = ring === Math.floor(random[1] * 6);
        return (
          <circle
            key={ring}
            cx={140}
            cy={95}
            r={radius}
            fill="none"
            stroke={ring % 2 === 0 ? colour.line : colour.accent}
            strokeWidth={ring === 0 ? 6 : 2.5}
            opacity={0.85}
            strokeDasharray={open ? "6 10" : undefined}
          />
        );
      })}
    </g>
  );
}

function PracticeMotif({ random, colour }: { random: number[]; colour: MotifColour }) {
  // Repetition with drift: the same act done many times, never identically.
  return (
    <g>
      {Array.from({ length: 11 }, (_, index) => {
        const x = 30 + index * 21;
        const height = 34 + random[index % random.length] * 76;
        return <rect key={index} x={x} y={150 - height} width={11} height={height} rx={5} fill={index % 3 === 0 ? colour.accent : colour.line} opacity={0.55 + (index % 3) * 0.2} />;
      })}
    </g>
  );
}

function IdeaMotif({ random, colour }: { random: number[]; colour: MotifColour }) {
  // Spokes from one question, of unequal reach.
  return (
    <g>
      {Array.from({ length: 9 }, (_, index) => {
        const angle = (index / 9) * Math.PI * 2;
        const length = 40 + random[index % random.length] * 52;
        return (
          <line
            key={index}
            x1={140}
            y1={95}
            x2={140 + Math.cos(angle) * length}
            y2={95 + Math.sin(angle) * length}
            stroke={index % 2 === 0 ? colour.line : colour.accent}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      <circle cx={140} cy={95} r={9} fill={colour.ink} />
    </g>
  );
}

export function TopicVisual({ topic }: { topic: Pick<TimelessTopic, "slug" | "readingLens" | "title"> }) {
  const random = sequence(seedFrom(topic.slug), 12);
  const colour = palette[topic.readingLens];
  const motif = {
    archive: <ArchiveMotif random={random} colour={colour} />,
    system: <SystemMotif random={random} colour={colour} />,
    place: <PlaceMotif random={random} colour={colour} />,
    practice: <PracticeMotif random={random} colour={colour} />,
    idea: <IdeaMotif random={random} colour={colour} />
  }[topic.readingLens];

  return (
    <figure className={`topic-visual lens-${topic.readingLens}`}>
      <svg viewBox="0 0 280 190" role="img" aria-labelledby={`topic-visual-${topic.slug}`} preserveAspectRatio="xMidYMid meet">
        <title id={`topic-visual-${topic.slug}`}>{`An abstract ${topic.readingLens} motif drawn for the question: ${topic.title}`}</title>
        {motif}
      </svg>
      <figcaption>Drawn by the Syāt visual desk from this question&rsquo;s reading lens. It illustrates, and establishes nothing.</figcaption>
    </figure>
  );
}
