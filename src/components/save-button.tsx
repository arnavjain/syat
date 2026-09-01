"use client";

import { useEffect, useState } from "react";

import { getSafeBrowserStorage } from "./guided-onboarding";
import { isSaved, readShelf, toggleSaved, type ShelfItem } from "@/lib/reading-shelf";

export function SaveButton({ entry }: { entry: Omit<ShelfItem, "savedAt"> }) {
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSaved(isSaved(readShelf(getSafeBrowserStorage()), entry.kind, entry.slug)));
    return () => window.cancelAnimationFrame(frame);
  }, [entry.kind, entry.slug]);

  function onToggle() {
    const result = toggleSaved(getSafeBrowserStorage(), entry);
    setSaved(result.saved);
    setNote(result.stored ? null : "This browser is not storing data, so the shelf cannot remember it.");
  }

  return (
    <div className="save-control">
      <button aria-pressed={saved} className={`save-button ${saved ? "is-saved" : ""}`} onClick={onToggle} type="button">
        {saved ? "Saved to your shelf" : "Save to your shelf"}
      </button>
      <span>{saved ? "On this device. There are no accounts yet, so it stays here." : "Kept on this device only."}</span>
      {note ? <span className="save-note" role="status">{note}</span> : null}
    </div>
  );
}
