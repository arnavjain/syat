"use client";

import { useState } from "react";

import { makeReframePlan, type ReframeInputKind } from "@/lib/reframe-plan";

export function ReframeWorkbench() {
  const [value, setValue] = useState("");
  const [kind, setKind] = useState<ReframeInputKind>("text");
  const [submitted, setSubmitted] = useState(false);
  const plan = submitted ? makeReframePlan(value, kind) : undefined;

  return (
    <div className="reframe-workbench">
      <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
        <fieldset>
          <legend>Start with something you want to understand more carefully</legend>
          <div className="input-kind-row" role="radiogroup" aria-label="Input type">
            {(["text", "link", "document"] as const).map((option) => <label key={option}><input type="radio" checked={kind === option} onChange={() => setKind(option)} /> {option === "text" ? "Paste text" : option === "link" ? "Bring a link" : "Extract a document"}</label>)}
          </div>
          <label className="sr-only" htmlFor="reframe-input">Text to reframe</label>
          <textarea id="reframe-input" value={value} onChange={(event) => setValue(event.target.value)} placeholder={kind === "link" ? "Paste a URL. Syāt will ask which text you approve before any analysis." : "Paste a claim, passage, or question."} rows={7} />
          <button className="primary-action" type="submit">Make a reading plan <span aria-hidden="true">↗</span></button>
        </fieldset>
      </form>
      <aside className="reframe-result" aria-live="polite">
        {!plan && <p>Nothing is sent anywhere while you are preparing a reading plan.</p>}
        {plan?.state === "needs_input" && <p>Add a little text first. A good Reframe begins with the original close at hand.</p>}
        {plan?.state === "ready_for_review" && <>
          <p className="micro-copy">Your local reading plan</p>
          <ol>{plan.steps.map((step) => <li key={step.id}><strong>{step.title}</strong><span>{step.description}</span></li>)}</ol>
          <p className="muted-note">AI drafting is deliberately off here. When enabled later, only text you approve will be sent to the source-bound draft pipeline; the original file is never uploaded.</p>
        </>}
      </aside>
    </div>
  );
}
