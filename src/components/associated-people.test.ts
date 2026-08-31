import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AssociatedPeople } from "./associated-people";

describe("AssociatedPeople", () => {
  it("labels fictional people, institutions, communities, and unknown records without profile-card claims", () => {
    const html = renderToStaticMarkup(createElement(AssociatedPeople, {
      associations: [
        { id: "person", kind: "person", label: "Asha", fixtureLabel: "Fictional teaching record", association: "A sample commuter prompt makes timing legible.", sourceId: "fixture-experience" },
        { id: "institution", kind: "institution", label: "Nadi Nagar municipal council", association: "It issues the fixture notice.", sourceId: "fixture-policy" },
        { id: "community", kind: "community", label: "Market-edge workers", association: "The prompt keeps delivery access in view.", sourceId: "fixture-experience" },
        { id: "unknown", kind: "unknown_unverified", label: "Unnamed people affected by the change", association: "The fixture does not identify them.", sourceId: "fixture-policy" },
      ],
    }));
    expect(html).toContain("People and roles");
    expect(html).toContain("Fictional teaching record");
    expect(html).toContain("Institution");
    expect(html).toContain("Community");
    expect(html).toContain("Unknown / unverified");
    expect(html).toContain("Source fixture-policy");
    expect(html).not.toContain("Followers");
  });
});
