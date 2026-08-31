"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { makeReframePlan, resolveReframeInitialInput } from "@/lib/reframe-plan";

export function ReframeWorkbench() {
  const searchParams = useSearchParams();
  const { value: initialValue } = resolveReframeInitialInput(searchParams.get("topic"), searchParams.get("claim"));
  const [value, setValue] = useState(initialValue);
  const [submitted, setSubmitted] = useState(false);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const plan = submitted ? makeReframePlan(value) : undefined;

  function submitPlan() {
    setSlotValues({});
    setSubmitted(true);
  }

  return (
    <div className="reframe-workbench">
      <form onSubmit={(event) => { event.preventDefault(); submitPlan(); }}>
        <fieldset>
          <legend>Start with something you want to understand more carefully</legend>
          {initialValue && <p className="muted-note">Starting with: {initialValue}</p>}
          <label className="sr-only" htmlFor="reframe-input">Text to reframe</label>
          <textarea id="reframe-input" value={value} onChange={(event) => { setValue(event.target.value); setSubmitted(false); }} placeholder="Paste a claim, passage, or question." rows={7} />
          <button className="primary-action" type="submit">Make a reading plan <span aria-hidden="true">↗</span></button>
        </fieldset>
      </form>
      <aside className="reframe-result" aria-live="polite">
        {!plan && <p>Nothing is sent anywhere while you are preparing a reading plan.</p>}
        {plan?.state === "needs_input" && <p>Add a little text first. A good Reframe begins with the original close at hand.</p>}
        {plan?.state === "ready_for_review" && <>
          <p className="micro-copy">Your local reading plan</p>
          <p><strong>Original input · {plan.inputKind}</strong><br />{plan.original}</p>
          {plan.inputKind === "passage" && <ol className="reframe-statements">{plan.statements?.map((statement, index) => <li key={`${index}-${statement}`}>{statement}</li>)}</ol>}
          <ol>{plan.steps.map((step) => <li key={step.id}><strong>{step.title}</strong><span>{step.description}</span></li>)}</ol>
          <div className="reframe-slots" aria-label="Editable reading notes">
            {plan.slots?.map((slot) => <label key={slot.id}><strong>{slot.title}</strong>{" "}<span>{slot.prompt}</span><textarea aria-label={`${slot.title} note`} value={slotValues[slot.id] ?? ""} onChange={(event) => setSlotValues((current) => ({ ...current, [slot.id]: event.target.value }))} placeholder="Write your own note here." rows={3} /></label>)}
          </div>
          <p className="muted-note">AI drafting is deliberately off here. This workbench does not fetch links or upload files.</p>
        </>}
      </aside>
    </div>
  );
}
