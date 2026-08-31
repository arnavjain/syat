"use client";

import { useEffect, useMemo, useState } from "react";

import {
  filterReviewItems,
  getReviewSummary,
  mergeReviewRecords,
  type ModerationDecision,
  type ModerationRecord,
  type ModerationSource,
  type ReviewFilter
} from "@/lib/review-queue";

const storageKey = "syat.private-review-queue.v1";

const filters: Array<{ id: ReviewFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "needs_source_pack", label: "Needs source pack" },
  { id: "sensitive", label: "Sensitive" },
  { id: "held", label: "Held" },
  { id: "source_pack_ready", label: "Pack ready" },
  { id: "rejected", label: "Rejected" }
];

const decisionLabels: Record<ModerationDecision, string> = {
  needs_source_pack: "Needs source pack",
  held: "Held for context",
  rejected: "Rejected from this queue",
  source_pack_ready: "Source pack ready"
};

function isRecord(value: unknown): value is ModerationRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ModerationRecord>;
  return ["needs_source_pack", "held", "rejected", "source_pack_ready"].includes(candidate.decision ?? "")
    && typeof candidate.note === "string"
    && typeof candidate.updatedAt === "string";
}

function readBrowserRecords() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}") as Record<string, unknown>;
    return Object.fromEntries(Object.entries(stored).filter((entry): entry is [string, ModerationRecord] => isRecord(entry[1])));
  } catch {
    return {} as Record<string, ModerationRecord>;
  }
}

function writeBrowserRecords(records: Record<string, ModerationRecord>) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function ModerationQueue({ sources }: { sources: ModerationSource[] }) {
  const [records, setRecords] = useState<Record<string, ModerationRecord>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [selectedId, setSelectedId] = useState(sources[0]?.id ?? "");
  const items = useMemo(() => mergeReviewRecords(sources, records), [sources, records]);
  const visibleItems = useMemo(() => filterReviewItems(items, filter), [filter, items]);
  const selected = items.find((item) => item.id === selectedId) ?? visibleItems[0];
  const summary = getReviewSummary(items);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRecords(readBrowserRecords());
      setIsHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isHydrated) writeBrowserRecords(records);
  }, [isHydrated, records]);

  function changeRecord(id: string, change: Partial<ModerationRecord>) {
    setRecords((current) => ({
      ...current,
      [id]: {
        decision: current[id]?.decision ?? "needs_source_pack",
        note: current[id]?.note ?? "",
        updatedAt: new Date().toISOString(),
        ...change
      }
    }));
  }

  function chooseFilter(nextFilter: ReviewFilter) {
    setFilter(nextFilter);
    const nextItems = filterReviewItems(items, nextFilter);
    if (!nextItems.some((item) => item.id === selectedId)) setSelectedId(nextItems[0]?.id ?? "");
  }

  function resetBrowserQueue() {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // The on-screen state can still reset when a browser blocks storage.
    }
    setRecords({});
    setFilter("all");
    setSelectedId(sources[0]?.id ?? "");
  }

  return (
    <section className="moderation-queue" aria-labelledby="moderation-queue-title">
      <div className="moderation-heading">
        <div>
          <p className="micro-copy">Moderation queue · {sources.length} source signals</p>
          <h2 id="moderation-queue-title">Review a source before it becomes a story.</h2>
          <p>Choose one signal, read its original link, and leave a decision for the next editorial step. There is no approval or publish action here.</p>
        </div>
        <div className="moderation-counts" aria-label="Current moderation counts">
          <span><b>{summary.needs_source_pack}</b> waiting</span>
          <span><b>{summary.held}</b> held</span>
          <span><b>{summary.source_pack_ready}</b> packs ready</span>
        </div>
      </div>

      <p className="browser-only-note">Changes save in this browser only. They move to the shared review database after editor sign-in and Convex are connected.</p>

      <div className="moderation-workbench">
        <section className="moderation-list" aria-label="Source signals to moderate">
          <div className="moderation-filters" aria-label="Filter moderation queue">
            {filters.map((candidate) => <button type="button" aria-pressed={filter === candidate.id} className={filter === candidate.id ? "active" : ""} key={candidate.id} onClick={() => chooseFilter(candidate.id)}>{candidate.label}</button>)}
          </div>
          {visibleItems.length > 0 ? <ol>
            {visibleItems.map((item) => <li key={item.id}>
              <button type="button" className={`moderation-item ${selected?.id === item.id ? "selected" : ""}`} aria-current={selected?.id === item.id ? "true" : undefined} onClick={() => setSelectedId(item.id)}>
                <span className={`decision-mark ${item.decision}`} aria-hidden="true" />
                <span><small>{item.sourceClass === "official_public_record" ? "Official record" : "Newsroom RSS"} · {item.publisher}</small><strong>{item.title}</strong><em>{decisionLabels[item.decision]}{item.isSensitive ? " · sensitive framing" : ""}</em></span>
              </button>
            </li>)}
          </ol> : <div className="moderation-empty"><h3>Nothing in this slice.</h3><p>Try another filter or reset the decisions saved in this browser.</p></div>}
        </section>

        {selected ? <aside className="moderation-docket" aria-label={`Review details for ${selected.title}`}>
          <p className="micro-copy">Selected source signal</p>
          <p className={`docket-status ${selected.decision}`}>{decisionLabels[selected.decision]}</p>
          <h3>{selected.title}</h3>
          <dl>
            <div><dt>Publisher</dt><dd>{selected.publisher}</dd></div>
            <div><dt>Published</dt><dd>{formatDate(selected.publishedAt)}</dd></div>
            <div><dt>Use</dt><dd>Link-only; not Syāt reporting</dd></div>
          </dl>
          <a className="docket-source-link" href={selected.url} rel="noreferrer" target="_blank">Open the original source <span aria-hidden="true">↗</span></a>
          <fieldset className="decision-actions">
            <legend>Choose the next review step</legend>
            <button type="button" className={selected.decision === "needs_source_pack" ? "active" : ""} onClick={() => changeRecord(selected.id, { decision: "needs_source_pack" })}>Keep in source queue</button>
            <button type="button" className={selected.decision === "held" ? "active" : ""} onClick={() => changeRecord(selected.id, { decision: "held" })}>Hold for context</button>
            <button type="button" className={selected.decision === "source_pack_ready" ? "active" : ""} onClick={() => changeRecord(selected.id, { decision: "source_pack_ready" })}>Source pack ready</button>
            <button type="button" className={`reject ${selected.decision === "rejected" ? "active" : ""}`} onClick={() => changeRecord(selected.id, { decision: "rejected" })}>Reject from queue</button>
          </fieldset>
          <label className="moderation-note"><span>Private review note</span><textarea value={selected.note} onChange={(event) => changeRecord(selected.id, { note: event.target.value })} placeholder="What evidence or context should the next editor look for?" rows={4} /></label>
          <p className="docket-boundary">“Source pack ready” means the next research step may begin. It does not approve a story, quote, image, or publication.</p>
        </aside> : null}
      </div>

      <button type="button" className="reset-browser-queue" onClick={resetBrowserQueue}>Reset decisions saved in this browser</button>
    </section>
  );
}
