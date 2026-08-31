import { describe, expect, it } from "vitest";

import { pickRandomTopic } from "./topic-picker";
import { timelessTopics } from "./timeless-topics";

describe("topic picker", () => {
  it("selects a topic from the supplied catalogue without changing the catalogue", () => {
    expect(pickRandomTopic(timelessTopics, () => 0)?.id).toBe(timelessTopics[0]?.id);
    expect(pickRandomTopic(timelessTopics, () => 0.999999)?.id).toBe(timelessTopics.at(-1)?.id);
    expect(timelessTopics).toHaveLength(100);
  });

  it("returns nothing when there is no topic to choose", () => {
    expect(pickRandomTopic([])).toBeUndefined();
  });
});
