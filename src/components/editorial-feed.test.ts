import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getHomeContent } from "@/lib/home-content";

import { EditorialFeed } from "./editorial-feed";

describe("EditorialFeed", () => {
  it("uses four distinct editorial modules and marks source signals as non-stories", () => {
    const html = renderToStaticMarkup(createElement(EditorialFeed, { content: getHomeContent("news") }));

    expect(html).toContain('class="feed-lead-strip"');
    expect(html).toContain('class="feed-story-row"');
    expect(html).toContain('class="context-bridge"');
    expect(html).toContain('class="feed-framing-trail"');
    expect(html).toContain("does not turn source signals into published Syāt reporting");
    expect(html).toContain("A framing trail names where to look next.");
  });
});
