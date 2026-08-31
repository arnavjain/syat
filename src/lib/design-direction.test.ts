import { describe, expect, it } from "vitest";

import {
  getDesignDirection,
  getDesignDirectionStaticParams,
  getViewpointPositionClass,
} from "./design-direction";

describe("getDesignDirection", () => {
  it("uses the warm rounded reading direction by default", () => {
    expect(getDesignDirection(undefined).id).toBe("warm-commons");
  });

  it("keeps the two review variants available without accepting arbitrary values", () => {
    expect(getDesignDirection("annotated-evidence").label).toBe("Annotated Evidence");
    expect(getDesignDirection("signal-garden").label).toBe("Signal Garden");
    expect(getDesignDirection("neon-dashboard").id).toBe("warm-commons");
  });

  it("publishes one stable static review parameter for each direction", () => {
    expect(getDesignDirectionStaticParams()).toEqual([
      { direction: "annotated-evidence" },
      { direction: "warm-commons" },
      { direction: "signal-garden" },
    ]);
  });

  it("assigns a deterministic unique position class to every supported viewpoint", () => {
    for (let count = 2; count <= 8; count += 1) {
      const positions = Array.from({ length: count }, (_, index) => getViewpointPositionClass(index, count));
      expect(new Set(positions).size).toBe(count);
      expect(positions).toEqual(
        Array.from({ length: count }, (_, index) => `viewpoint-position viewpoint-position--${count}-${index + 1}`),
      );
    }
  });
});
