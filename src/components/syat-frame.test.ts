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

describe("Syāt home frame", () => {
  it("submits an entered question to the accepted Reframe claim route", () => {
    const html = renderHome();

    expect(html).toMatch(/<form[^>]*action="\/en\/reframe"[^>]*method="get"/u);
    expect(html).toContain('name="claim"');
    expect(html).toContain('aria-describedby="bring-limit"');
    expect(html).toContain('id="bring-limit"');
    expect(html).toContain("Bring a link, quote, or question");
    expect(html).not.toContain('type="file"');
  });

  it("renders a truthful, direction-specific signature in static HTML", () => {
    expect(renderHome("annotated-evidence")).toContain('data-direction-signature="change-spine"');
    expect(renderHome("warm-commons")).toContain('data-direction-signature="subject-frame"');

    const garden = renderHome("signal-garden");
    expect(garden).toContain('data-direction-signature="credit-tray"');
    expect(garden).toContain("<dt>Creator</dt><dd>Syāt prototype team</dd>");
    expect(garden).toContain("<dt>Rights basis</dt><dd>Syāt-authored fixture</dd>");
    expect(garden).toContain("<dt>Publication</dt><dd>not publishable</dd>");
  });

  it("ships a fixed subject and a static viewpoint fallback in the first response", () => {
    const html = renderHome();

    expect(html).toContain('data-syat-frame="true"');
    expect(html).toContain("The fictional Nadi Nagar plan reserves part of Bazaar Road");
    expect(html).toContain("Whole View");
    expect(html).toContain("Bus commuter");
    expect(html).toContain("Street vendor");
    expect(html).toContain("What this view uses");
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
