import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PostTimeline } from "./post-timeline";

describe("PostTimeline", () => {
  it("keeps a chronological fixture timeline, including an explicit unknown time", () => {
    const html = renderToStaticMarkup(createElement(PostTimeline, {
      events: [
        { order: 1, eventType: "Published rule", time: { kind: "period", label: "Before the plan begins" }, text: "A fictional notice appears.", sourceIds: ["fixture-policy"], uncertainty: "Fixture document; not reporting." },
        { order: 2, eventType: "Outcome to check", time: { kind: "unknown", label: "Time not yet known" }, text: "Access still needs evidence.", sourceIds: ["fixture-experience"], uncertainty: "No outcome is asserted." },
      ],
    }));
    expect(html.indexOf("Before the plan begins")).toBeLessThan(html.indexOf("Time not yet known"));
    expect(html).toContain("Published rule");
    expect(html).toContain("Source fixture-policy");
    expect(html).toContain("No outcome is asserted.");
  });
});
