import { describe, expect, it } from "vitest";

import { getDesignDirection } from "./design-direction";

describe("getDesignDirection", () => {
  it("uses the warm rounded reading direction by default", () => {
    expect(getDesignDirection(undefined).id).toBe("warm-commons");
  });

  it("keeps the two review variants available without accepting arbitrary values", () => {
    expect(getDesignDirection("annotated-evidence").label).toBe("Annotated Evidence");
    expect(getDesignDirection("signal-garden").label).toBe("Signal Garden");
    expect(getDesignDirection("neon-dashboard").id).toBe("warm-commons");
  });
});
