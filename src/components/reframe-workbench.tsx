"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { makeReframePlan, resolveReframeInitialInput } from "@/lib/reframe-plan";

export function ReframeWorkbench() {
  const searchParams = useSearchParams();
  const { value: initialValue, kind: initialKind } = resolveReframeInitialInput(searchParams.get("topic"), searchParams.get("claim"));
  const [value, setValue] = useState(initialValue);
  const [submitted, setSubmitted] = useState(false);
  const plan = submitted ? makeReframePlan(value, initialKind) : undefined;

  return (
    <div className="reframe-workbench">
      <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
        <fieldset>
          <legend>Start with something you want to understand more carefully</legend>
          {initialValue && <p className="muted-note">Starting with: {initialValue}</p>}
          <label className="sr-only" htmlFor="reframe-input">Text to reframe</label>
          <textarea id="reframe-input" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Paste a claim, passage, or question." rows={7} />
          <button className="primary-action" type="submit">Make a reading plan <span aria-hidden="true">↗</span></button>
        </fieldset>
      </form>
      <aside className="reframe-result" aria-live="polite">
        {!plan && <p>Nothing is sent anywhere while you are preparing a reading plan.</p>}
        {plan?.state === "needs_input" && <p>Add a little text first. A good Reframe begins with the original close at hand.</p>}
        {plan?.state === "ready_for_review" && <>
          <p className="micro-copy">Your local reading plan</p>
          <ol>{plan.steps.map((step) => <li key={step.id}><strong>{step.title}</strong><span>{step.description}</span></li>)}</ol>
          <p className="muted-note">AI drafting is deliberately off here. This workbench does not fetch links or upload files.</p>
        </>}
      </aside>
    </div>
  );
}
