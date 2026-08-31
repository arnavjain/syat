"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { isOnboardingComplete, markOnboardingComplete, onboardingSteps } from "@/lib/onboarding";

const teachingStoryPath = "/en/news/street-plan-daily-realities";

export function getOnboardingProgressLabel(hasFinishedBefore: boolean, stepIndex: number, stepCount: number): string {
  return hasFinishedBefore ? "Guide completed" : `Step ${stepIndex + 1} of ${stepCount}`;
}

export function getOnboardingStepAriaCurrent(index: number, stepIndex: number, hasFinishedBefore: boolean): "step" | undefined {
  return !hasFinishedBefore && index === stepIndex ? "step" : undefined;
}

export function getSafeBrowserStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function GuidedOnboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [hasFinishedBefore, setHasFinishedBefore] = useState(false);
  const step = onboardingSteps[stepIndex];
  const isLastStep = stepIndex === onboardingSteps.length - 1;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasFinishedBefore(isOnboardingComplete(getSafeBrowserStorage()));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function finishGuide() {
    markOnboardingComplete(getSafeBrowserStorage());
  }

  return (
    <section className="guided-page" aria-labelledby="guided-onboarding-title">
      <div className="guided-progress" aria-label={getOnboardingProgressLabel(hasFinishedBefore, stepIndex, onboardingSteps.length)}>
        <p className="micro-copy">{hasFinishedBefore ? "Guide completed" : `First-time guide · step ${stepIndex + 1} of ${onboardingSteps.length}`}</p>
        {!hasFinishedBefore && <ol>
          {onboardingSteps.map((item, index) => <li aria-current={getOnboardingStepAriaCurrent(index, stepIndex, hasFinishedBefore)} className={index <= stepIndex ? "is-current" : undefined} key={item.id}><span className="sr-only">{index === stepIndex ? "Current: " : ""}</span>{index + 1}</li>)}
        </ol>}
      </div>
      <p className="micro-copy">{step.eyebrow}</p>
      <h1 id="guided-onboarding-title">{hasFinishedBefore ? "A useful place to begin again." : step.title}</h1>
      <p className="page-lede">{hasFinishedBefore ? "You have already seen the guide. Return to the teaching story whenever you want to practise the method." : step.description}</p>
      {!hasFinishedBefore && step.practice && <aside className="onboarding-practice" aria-labelledby="onboarding-practice-title">
        <p className="micro-copy">Try the method</p>
        <h2 id="onboarding-practice-title">{step.practice.title}</h2>
        <ol>{step.practice.steps.map((instruction, index) => <li key={instruction}>{index === 0 ? <Link href={`${teachingStoryPath}#evidence`}>{instruction}</Link> : index === 1 ? <Link href="/en/fixtures/nadi-nagar-policy-note">{instruction}</Link> : <Link href={`${teachingStoryPath}#perspectives`}>{instruction}</Link>}</li>)}</ol>
        <p>These links open a clearly labelled fictional teaching example. They do not send your writing anywhere.</p>
      </aside>}
      {hasFinishedBefore ? <div className="page-actions"><Link className="primary-action" href={teachingStoryPath}>Open the teaching story <span aria-hidden="true">↗</span></Link><button className="text-button" type="button" onClick={() => { setHasFinishedBefore(false); setStepIndex(0); }}>Take the guide again</button></div> : <div className="page-actions guided-actions">
        <Link className="text-action" href={teachingStoryPath} onClick={finishGuide}>Skip to the teaching story</Link>
        {isLastStep ? <Link className="primary-action" href={teachingStoryPath} onClick={finishGuide}>Read the teaching story <span aria-hidden="true">↗</span></Link> : <button className="primary-action" type="button" onClick={() => setStepIndex((index) => index + 1)}>Next <span aria-hidden="true">→</span></button>}
      </div>}
    </section>
  );
}
