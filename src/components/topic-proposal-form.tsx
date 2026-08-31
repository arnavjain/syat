"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSafeBrowserStorage } from "./guided-onboarding";
import { MAXIMUM_QUESTION_LENGTH, MAXIMUM_REASON_LENGTH, readProposals, saveProposal, validateProposal, type TopicProposal } from "@/lib/topic-proposal";

export function TopicProposalForm({ themes }: { themes: readonly string[] }) {
  const [question, setQuestion] = useState("");
  const [reason, setReason] = useState("");
  const [theme, setTheme] = useState(themes[0] ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState<TopicProposal[]>([]);

  // Read after paint, matching how the guided onboarding reads local state.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSaved(readProposals(getSafeBrowserStorage())));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function submit() {
    const result = validateProposal({ question, reason, theme });
    if (!result.ok) {
      setMessage(result.reason);
      return;
    }
    const stored = saveProposal(getSafeBrowserStorage(), result.proposal);
    setSaved(readProposals(getSafeBrowserStorage()));
    setQuestion("");
    setReason("");
    setMessage(stored
      ? "Saved on this device. Nothing was sent anywhere, and nothing publishes automatically."
      : "Your browser is not storing data, so this could not be kept. The question is still worth asking.");
  }

  return (
    <section className="propose-form" aria-labelledby="propose-form-title">
      <h2 id="propose-form-title">Your question</h2>
      <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <label htmlFor="propose-question">The question</label>
        <input id="propose-question" maxLength={MAXIMUM_QUESTION_LENGTH} onChange={(event) => setQuestion(event.target.value)} placeholder="Who decides when a road stops being a place?" type="text" value={question} />

        <label htmlFor="propose-theme">Closest theme</label>
        <select id="propose-theme" onChange={(event) => setTheme(event.target.value)} value={theme}>
          {themes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <label htmlFor="propose-reason">Why it keeps opening (optional)</label>
        <textarea id="propose-reason" maxLength={MAXIMUM_REASON_LENGTH} onChange={(event) => setReason(event.target.value)} rows={5} value={reason} />

        <button className="primary-action" type="submit">Save this question</button>
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
