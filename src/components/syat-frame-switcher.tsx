"use client";

import { useState, type KeyboardEvent } from "react";

import { selectSyatFrameView } from "@/lib/design-direction";

export type FrameView = {
  id: string;
  label: string;
  sees: string;
  values: string;
  uses: string;
  mayMiss: string;
};

export function SyatFrameSwitcher({ views }: { views: FrameView[] }) {
  const [activeId, setActiveId] = useState("whole");
  const activeView = views.find((view) => view.id === activeId) ?? views[0];

  function choose(requested: string) {
    setActiveId((current) => selectSyatFrameView(current, requested));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? views.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + views.length) % views.length;
    const next = views[nextIndex];
    choose(next.id);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
  }

  return (
    <div className="frame-switcher">
      <div className="viewpoint-tabs" role="tablist" aria-label="Change the viewpoint around the fixed subject">
        {views.map((view, index) => (
          <button
            aria-controls="syat-frame-view"
            aria-selected={activeView.id === view.id}
            className={activeView.id === view.id ? "is-selected" : undefined}
            id={`syat-frame-tab-${view.id}`}
            key={view.id}
            onClick={() => choose(view.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            role="tab"
            tabIndex={activeView.id === view.id ? 0 : -1}
            type="button"
          >
            {view.label}
          </button>
        ))}
      </div>
      <section aria-labelledby={`syat-frame-tab-${activeView.id}`} className="active-view" id="syat-frame-view" role="tabpanel" tabIndex={0}>
        <p className="active-view-label">Current frame · {activeView.label}</p>
        <div className="view-reading">
          <div><span>Sees</span><p>{activeView.sees}</p></div>
          <div><span>Values</span><p>{activeView.values}</p></div>
          <div><span>What this view uses</span><p>{activeView.uses}</p></div>
          <div><span>May miss</span><p>{activeView.mayMiss}</p></div>
        </div>
      </section>
    </div>
  );
}
