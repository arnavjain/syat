"use client";

import Link from "next/link";
import { useState } from "react";

import { pickRandomTopic } from "@/lib/topic-picker";
import type { TimelessTopic } from "@/lib/timeless-topics";

export function RandomTopicPicker({ topics }: { topics: readonly TimelessTopic[] }) {
  const [topic, setTopic] = useState<TimelessTopic | undefined>();

  function chooseTopic() {
    setTopic(pickRandomTopic(topics));
  }

  return (
    <section className="topic-picker" aria-labelledby="topic-picker-title">
      <div>
        <p className="micro-copy">A question for right now</p>
        <h2 id="topic-picker-title">Let a question find you.</h2>
        <p>Choose one of the hundred timeless starting points. It is a prompt for attention, not a recommendation about you.</p>
        <button className="topic-picker-button" type="button" onClick={chooseTopic}>Pick a question <span aria-hidden="true">↗</span></button>
      </div>
      <div className="topic-picker-result" aria-live="polite">
        {topic ? <><p>{topic.theme} · {topic.readingLens} lens</p><h3>{topic.title}</h3><Link href={topic.slug === "how-cities-move" ? "/en/timeless/how-cities-move" : `/en/reframe?topic=${topic.slug}`}>Open this reading path <span aria-hidden="true">↗</span></Link></> : <p>One question can open a wider reading path.</p>}
      </div>
    </section>
  );
}
