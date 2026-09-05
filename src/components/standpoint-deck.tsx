"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DeckStandpoint = {
  label: string;
  sees: string;
  values: string;
  mayMiss: string;
  /** News perspectives carry two fields the Timeless standpoints do not. */
  rationale?: string;
  uses?: string;
  /** Anchors back to the source trail, rendered by the caller so the deck stays presentational. */
  sources?: React.ReactNode;
};

/**
 * The standpoints on a question, as a deck you move through one at a time.
 *
 * Stacked in a column, four standpoints are read as a list and skimmed. Side by side and one at a
 * time, they are read as positions in an argument, which is what they are. Comparing them is the
 * whole point of the page.
 *
 * It is built on CSS scroll snapping rather than a drag library, which matters more than it
 * sounds: every card stays in the document and in the page source, the native scrollbar and
 * trackpad work, arrow keys work because the track is a real focusable scroller, and a screen
 * reader still reads all four in order. The controls below are an addition for people using a
 * mouse, not the only way through. Nothing here hides content behind an interaction.
 */
export function StandpointDeck({ standpoints, idPrefix = "standpoint" }: { standpoints: readonly DeckStandpoint[]; idPrefix?: string }) {
  const trackRef = useRef<HTMLOListElement | null>(null);
  const [active, setActive] = useState(0);

  // Derived from scroll position rather than from the buttons, so dragging, flicking and
  // keyboard scrolling all keep the indicator honest.
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;
    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let smallest = Number.POSITIVE_INFINITY;
    for (const [index, card] of cards.entries()) {
      const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - centre);
      if (distance < smallest) { smallest = distance; nearest = index; }
    }
    setActive(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncActive();
    track.addEventListener("scroll", syncActive, { passive: true });
    return () => track.removeEventListener("scroll", syncActive);
  }, [syncActive]);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: card.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  }, []);

  const count = standpoints.length;

  return (
    <div className="standpoint-deck">
      <ol
        aria-label="Standpoints on this question"
        className="standpoint-track"
        ref={trackRef}
        tabIndex={0}
      >
        {standpoints.map((standpoint, index) => (
          <li aria-label={`Standpoint ${index + 1} of ${count}: ${standpoint.label}`} className="standpoint-card" id={`${idPrefix}-${index}`} key={standpoint.label}>
            <p className="standpoint-count" aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</p>
            <h3>{standpoint.label}</h3>
            {standpoint.rationale ? <p className="standpoint-rationale">{standpoint.rationale}</p> : null}
            <dl>
              <div><dt>Brings into view</dt><dd>{standpoint.sees}</dd></div>
              <div><dt>Treats as important</dt><dd>{standpoint.values}</dd></div>
              {standpoint.uses ? <div><dt>Uses</dt><dd>{standpoint.uses}</dd></div> : null}
              <div><dt>May miss</dt><dd>{standpoint.mayMiss}</dd></div>
            </dl>
            {standpoint.sources ? <div className="standpoint-sources">{standpoint.sources}</div> : null}
          </li>
        ))}
      </ol>

      <div className="deck-controls">
        <p className="deck-hint">Swipe, scroll or use the arrows. Every standpoint is on the page.</p>
        <div className="deck-buttons">
          <button aria-label="Previous standpoint" className="deck-arrow" disabled={active === 0} onClick={() => goTo(active - 1)} type="button">
            <span aria-hidden="true">←</span>
          </button>
          <ol className="deck-dots">
            {standpoints.map((standpoint, index) => (
              <li key={standpoint.label}>
                <button
                  aria-current={index === active ? "true" : undefined}
                  aria-label={`Go to standpoint ${index + 1}: ${standpoint.label}`}
                  className={index === active ? "deck-dot is-active" : "deck-dot"}
                  onClick={() => goTo(index)}
                  type="button"
                />
              </li>
            ))}
          </ol>
          <button aria-label="Next standpoint" className="deck-arrow" disabled={active === count - 1} onClick={() => goTo(active + 1)} type="button">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
