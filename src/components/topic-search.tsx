"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { searchTopics, type SearchEntry } from "@/lib/topic-search";

export function TopicSearch({ entries, heading = "Find a question", placeholder = "Try water, memory, work, language", noun = "questions" }: { entries: SearchEntry[]; heading?: string; placeholder?: string; noun?: string }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchTopics(entries, query), [entries, query]);
  const searching = query.trim().length >= 2;

  return (
    <section className="topic-search" aria-labelledby="topic-search-title">
      <h2 id="topic-search-title">{heading}</h2>
      <label className="sr-only" htmlFor="topic-search-input">Search the questions</label>
      <input
        autoComplete="off"
        id="topic-search-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={query}
      />
      <p className="topic-search-note" role="status">
        {searching ? `${results.length} of ${entries.length} ${noun} match` : `${entries.length} ${noun}, searched on this device`}
      </p>
      {searching ? (
        <ul className="topic-search-results">
          {results.map((entry) => (
            <li key={`${entry.kind ?? "timeless"}-${entry.slug}`}>
              <Link href={entry.href ?? `/en/timeless/topic/${entry.slug}`}>{entry.title}</Link>
              <span>{entry.kind === "news" ? `News preview · ${entry.theme}` : entry.theme}</span>
              {entry.summary ? <small>{entry.summary}</small> : null}
            </li>
          ))}
          {results.length === 0 ? <li className="topic-search-empty">Nothing matched. Try a single plainer word.</li> : null}
        </ul>
      ) : null}
    </section>
  );
}
