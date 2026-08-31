import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import * as designDirection from "@/lib/design-direction";
import { getDesignDirection } from "@/lib/design-direction";

import { HomeView } from "./home-view";
import { SiteChrome } from "./site-chrome";

function renderHome(direction = "warm-commons") {
  return renderToStaticMarkup(
    createElement(HomeView, {
      mode: "news",
      direction: getDesignDirection(direction),
    }),
  );
}

// The fictional Syāt Frame is a connected design-review variant, not part of the
// reading-led public Home. It renders only under /preview/design/*.
function renderDesignReview(direction = "warm-commons") {
  return renderToStaticMarkup(
    createElement(HomeView, {
      mode: "news",
      direction: getDesignDirection(direction),
      isDesignReview: true,
    }),
  );
}

describe("Syāt home frame", () => {
  it("leads with reading actions instead of a Reframe input", () => {
    const html = renderHome();

    expect(html).toContain("Start reading");
    expect(html).toContain("Take the two-minute tour");
    expect(html).toContain('href="/en/onboarding"');
    expect(html).not.toContain("<form");
    expect(html).not.toContain('name="claim"');
    expect(html).not.toContain('type="file"');
  });

  it("keeps the fictional frame out of the reading-led Home", () => {
    const html = renderHome();

    expect(html).not.toContain('data-syat-frame="true"');
    expect(html).not.toContain("data-direction-signature");
    expect(html).not.toContain("Nadi Nagar");
  });

  it("renders a truthful, direction-specific signature in static HTML", () => {
    expect(renderDesignReview("annotated-evidence")).toContain('data-direction-signature="change-spine"');
    expect(renderDesignReview("warm-commons")).toContain('data-direction-signature="subject-frame"');

    const garden = renderDesignReview("signal-garden");
    expect(garden).toContain('data-direction-signature="credit-tray"');
    expect(garden).toContain("<dt>Creator</dt><dd>Syāt prototype team</dd>");
    expect(garden).toContain("<dt>Rights basis</dt><dd>Syāt-authored fixture</dd>");
    expect(garden).toContain("<dt>Publication</dt><dd>not publishable</dd>");
  });

  it("ships a fixed subject and a static viewpoint fallback in the first response", () => {
    const html = renderDesignReview();

    expect(html).toContain('data-syat-frame="true"');
    expect(html).toContain("The fictional Nadi Nagar plan reserves part of Bazaar Road");
    expect(html).toContain("Whole View");
    expect(html).toContain("Bus commuter");
    expect(html).toContain("Street vendor");
    expect(html).toContain("What this view uses");
  });

  it("makes the fixture statement's basis and limits available without calling it reporting", () => {
    const html = renderDesignReview();

    expect(html).toContain("View basis and limits");
    expect(html).toContain("Type: fictional Indian teaching fixture");
    expect(html).toContain("Basis: a made-up sample policy note and teaching prompts");
    expect(html).toContain("Source scope: this fixture only; it does not describe a real city, policy, person, or outcome");
    expect(html).toContain("Limits: it is not reporting, evidence about a live issue, or a prediction");
  });

  it("switches a viewpoint and lets Whole View reset the frame", () => {
    const selectView = (
      designDirection as typeof designDirection & {
        selectSyatFrameView?: (current: string, requested: string) => string;
      }
    ).selectSyatFrameView;

    expect(selectView).toBeTypeOf("function");
    if (!selectView) return;

    expect(selectView("whole", "commuter")).toBe("commuter");
    expect(selectView("commuter", "whole")).toBe("whole");
    expect(selectView("whole", "not-a-view")).toBe("whole");
  });
});

describe("primary navigation", () => {
  it("calls the permanent action Bring while preserving the Reframe route and active state", () => {
    const chromeProps = {
      active: "reframe" as const,
      children: createElement("p", null, "Workbench"),
    };
    const html = renderToStaticMarkup(
      createElement(SiteChrome, chromeProps),
    );

    expect(html).toContain('href="/en/reframe"');
    expect(html).not.toContain(">Reframe<");
    expect(html.match(/>Bring</gu)).toHaveLength(2);
    expect(html.match(/aria-current="page"/gu)).toHaveLength(2);
    expect(html).toContain('<main id="main-content"');
  });
});
