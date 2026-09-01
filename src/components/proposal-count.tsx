"use client";

import { useEffect, useState } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Live count of questions waiting for review.
 *
 * This reads real production data, but only a number: no proposal text is ever exposed to a
 * public page. If the backend is unreachable the component renders nothing rather than an
 * error, because a missing count should never interrupt reading.
 */
export function ProposalCount() {
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    if (!convexUrl) return;
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(`${convexUrl}/api/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "proposals:proposalCount", args: {}, format: "json" })
        });
        if (!response.ok) return;
        const body: unknown = await response.json();
        const value = (body as { value?: { pending?: number } })?.value?.pending;
        if (!cancelled && typeof value === "number") setPending(value);
      } catch {
        // Silent: a count is not worth an error state.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (pending === null) return null;

  return (
    <p className="proposal-count" role="status">
      {pending === 0
        ? "No reader questions are waiting for review right now."
        : `${pending} reader ${pending === 1 ? "question is" : "questions are"} waiting for review.`}
    </p>
  );
}
