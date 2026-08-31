"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { isOnboardingComplete, markOnboardingComplete, onboardingActionHref, onboardingSteps } from "@/lib/onboarding";

/** The story the guide teaches with. A real accepted preview when one exists. */
export type OnboardingExample = {
  slug: string;
  title: string;
  isTeachingFixture: boolean;
};

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

export function GuidedOnboarding({ example }: { example: OnboardingExample }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [hasFinishedBefore, setHasFinishedBefore] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasChangedStep = useRef(false);
  const step = onboardingSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === onboardingSteps.length - 1;
  const storyPath = `/en/news/${example.slug}`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasFinishedBefore(isOnboardingComplete(getSafeBrowserStorage()));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Move focus to the new step so a keyboard or screen-reader user is not left behind
  // on the button they just pressed. Never steal focus on first paint.
  useEffect(() => {
    if (!hasChangedStep.current) return;
    headingRef.current?.focus();
  }, [stepIndex]);

  function goToStep(next: number) {
    hasChangedStep.current = true;
    setStepIndex(next);
  }

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

      {hasFinishedBefore ? (
        <>
          <p className="micro-copy">Welcome back</p>
          <h1 id="guided-onboarding-title" ref={headingRef} tabIndex={-1}>A useful place to begin again.</h1>
          <p className="page-lede">You have already been through the guide. Open the reading example whenever you want to practise the method again.</p>
          <div className="page-actions">
            <Link className="primary-action" href={storyPath}>Open the reading example <span aria-hidden="true">↗</span></Link>
            <button className="text-button" type="button" onClick={() => { setHasFinishedBefore(false); goToStep(0); }}>Take the guide again</button>
          </div>
        </>
      ) : (
        <>
          <p className="micro-copy">{step.eyebrow}</p>
          <h1 id="guided-onboarding-title" ref={headingRef} tabIndex={-1}>{step.title}</h1>
          <p className="page-lede">{step.description}</p>

          <aside className="onboarding-practice" aria-label="Try this step">
            <p className="micro-copy">Do it now</p>
            <p>{step.action.note}</p>
            <Link className="onboarding-action" href={onboardingActionHref(step.action, storyPath)}>
              {step.action.label} <span aria-hidden="true">↗</span>
            </Link>
            <p className="onboarding-example-note">
              {example.isTeachingFixture
                ? "This opens a clearly labelled fictional teaching story. No accepted preview has passed its evidence checks yet."
                : "This opens a real accepted preview, kept in private review and labelled as AI-assisted."}
            </p>
          </aside>

          <div className="page-actions guided-actions">
            <button className="text-button" type="button" disabled={isFirstStep} onClick={() => goToStep(stepIndex - 1)}>
              <span aria-hidden="true">←</span> Back
            </button>
            {isLastStep
              ? <Link className="primary-action" href={storyPath} onClick={finishGuide}>Start reading <span aria-hidden="true">↗</span></Link>
              : <button className="primary-action" type="button" onClick={() => goToStep(stepIndex + 1)}>Next <span aria-hidden="true">→</span></button>}
            <Link className="text-action" href={storyPath} onClick={finishGuide}>Skip the guide</Link>
          </div>
        </>
      )}
    </section>
  );
}
