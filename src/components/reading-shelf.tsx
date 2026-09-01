"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSafeBrowserStorage } from "./guided-onboarding";
import { readShelf, removeFromShelf, type ShelfItem } from "@/lib/reading-shelf";

export function ReadingShelf() {
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setItems(readShelf(getSafeBrowserStorage()));
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!ready) return <p className="shelf-loading">Reading your shelf.</p>;

  if (items.length === 0) {
    return (
      <div className="shelf-empty">
        <p>Nothing saved yet. Open a question and use <strong>Save to your shelf</strong> to keep it here.</p>
        <Link className="primary-action" href="/en/explore">Browse the questions <span aria-hidden="true">↗</span></Link>
      </div>
    );
  }

  return (
    <>
      <p className="shelf-count">{items.length} {items.length === 1 ? "question" : "items"} on this device.</p>
      <ul className="shelf-list">
        {items.map((item) => (
          <li key={`${item.kind}-${item.slug}`}>
            <div>
              <span>{item.context}</span>
              <Link href={item.kind === "topic" ? `/en/timeless/topic/${item.slug}` : `/en/news/${item.slug}`}>{item.title}</Link>
            </div>
            <button onClick={() => setItems(removeFromShelf(getSafeBrowserStorage(), item.kind, item.slug))} type="button">
              Remove<span className="sr-only"> {item.title} from your shelf</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
