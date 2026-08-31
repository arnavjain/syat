import Link from "next/link";

import { getTimelessTopic } from "@/lib/timeless-topics";

export function ContextBridge({ bridge }: { bridge: { targetSlug: string; question: string; connection: string } }) {
  const topic = getTimelessTopic(bridge.targetSlug);
  if (!topic) return null;

  return (
    <aside className="context-bridge" aria-labelledby="context-bridge-title">
      <div className="context-bridge-route" aria-hidden="true"><span>News</span><i /><span>Timeless</span></div>
      <p className="micro-copy">Context Bridge</p>
      <h2 id="context-bridge-title">{bridge.question}</h2>
      <p>{bridge.connection}</p>
      <Link href={`/en/timeless/topic/${topic.slug}`}>Follow the question: {topic.title} <span aria-hidden="true">↗</span></Link>
    </aside>
  );
}
