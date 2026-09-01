"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSafeBrowserStorage } from "./guided-onboarding";
import { getSubmitterBucket } from "@/lib/submitter-bucket";
import { MAXIMUM_QUESTION_LENGTH, MAXIMUM_REASON_LENGTH, readProposals, saveProposal, validateProposal, type TopicProposal } from "@/lib/topic-proposal";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Sends the proposal to the review queue when a backend is configured, and keeps a copy on the
 * device either way. If the network or the backend is unavailable the reader still keeps their
 * question rather than losing it, which is why the local copy is not conditional.
 */
async function sendToReviewQueue(proposal: TopicProposal, themeSlug: string): Promise<"queued" | "local-only"> {
  if (!convexUrl) return "local-only";
  try {
    const response = await fetch(`${convexUrl}/api/mutation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "proposals:submitTopicProposal",
        args: {
          question: proposal.question,
          reason: proposal.reason,
          themeSlug,
          submitterBucket: getSubmitterBucket(getSafeBrowserStorage())
        },
        format: "json"
      })
    });
    if (!response.ok) return "local-only";
    const body: unknown = await response.json();
    const value = (body as { status?: string; value?: { ok?: boolean } })?.value;
    return value?.ok === true ? "queued" : "local-only";
  } catch {
    return "local-only";
  }
}

export function TopicProposalForm({ themes, themeSlugs }: { themes: readonly string[]; themeSlugs: Record<string, string> }) {
  const [question, setQuestion] = useState("");
  const [reason, setReason] = useState("");
  const [theme, setTheme] = useState(themes[0] ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState<TopicProposal[]>([]);
  const [sending, setSending] = useState(false);

  // Read after paint, matching how the guided onboarding reads local state.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSaved(readProposals(getSafeBrowserStorage())));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function submit() {
    const result = validateProposal({ question, reason, theme });
    if (!result.ok) {
      setMessage(result.reason);
      return;
    }
    setSending(true);
    const slug = themeSlugs[theme] ?? "";
    const outcome = await sendToReviewQueue(result.proposal, slug);
    const stored = saveProposal(getSafeBrowserStorage(), result.proposal);
    setSaved(readProposals(getSafeBrowserStorage()));
    setQuestion("");
    setReason("");
    setSending(false);
    if (outcome === "queued") {
      setMessage("Sent for review, and kept on this device too. A person reads every proposal, so nothing publishes automatically.");
      return;
    }
    setMessage(stored
      ? "Kept on this device. The review queue could not be reached, so send it again later if you want it considered."
      : "Your browser is not storing data and the review queue could not be reached. The question is still worth asking.");
  }

  return (
    <section className="propose-form" aria-labelledby="propose-form-title">
      <h2 id="propose-form-title">Your question</h2>
      <form onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <label htmlFor="propose-question">The question</label>
        <input id="propose-question" maxLength={MAXIMUM_QUESTION_LENGTH} onChange={(event) => setQuestion(event.target.value)} placeholder="Who decides when a road stops being a place?" type="text" value={question} />

        <label htmlFor="propose-theme">Closest theme</label>
        <select id="propose-theme" onChange={(event) => setTheme(event.target.value)} value={theme}>
          {themes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <label htmlFor="propose-reason">Why it keeps opening (optional)</label>
        <textarea id="propose-reason" maxLength={MAXIMUM_REASON_LENGTH} onChange={(event) => setReason(event.target.value)} rows={5} value={reason} />

        <button className="primary-action" disabled={sending} type="submit">{sending ? "Sending…" : "Send this question"}</button>
      </form>
      {message ? <p className="propose-message" role="status">{message}</p> : null}

      {saved.length > 0 ? (
        <div className="propose-saved">
          <h3>Questions you have proposed</h3>
          <ul>
            {saved.map((proposal) => (
              <li key={`${proposal.proposedAt}-${proposal.question}`}>
                <strong>{proposal.question}</strong>
                <span>{proposal.theme}</span>
              </li>
            ))}
          </ul>
          <p>These are on this device only. To have one considered for the public catalogue, send it with the <Link href="/en/about">contact route on the About page</Link>.</p>
        </div>
      ) : null}
    </section>
  );
}
