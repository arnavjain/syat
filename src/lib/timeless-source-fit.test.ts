import { describe, expect, it } from "vitest";

import { auditTopicFits, fitTopicToRecord } from "./timeless-source-fit";
import { getTimelessTopic, timelessTopics } from "./timeless-topics";

const waterAudit = "The audit examined the drinking water supply scheme and found that the canal and reservoir works were incomplete during the period under review.";
const artText = "The gallery displayed an original work beside a copy, and visitors were asked which felt more original.";

describe("timeless source fit", () => {
  it("names only real Timeless topics, with no duplicates", () => {
    const slugs = auditTopicFits.map((fit) => fit.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(getTimelessTopic(slug), slug).toBeDefined();
  });

  it("pairs a record with a question it genuinely illustrates", () => {
    expect(fitTopicToRecord(waterAudit, new Set())?.slug).toBe("water-sharing");
  });

  it("refuses a record that supports no question, rather than forcing one", () => {
    // This is the failure the curated map exists to prevent: a loose word match once filed a
    // procurement audit under "What makes an original feel original?".
    expect(fitTopicToRecord(artText, new Set())).toBeUndefined();
    expect(fitTopicToRecord("A short notice with no subject matter at all.", new Set())).toBeUndefined();
  });

  it("never returns a question that already has a story", () => {
    expect(fitTopicToRecord(waterAudit, new Set(["water-sharing"]))?.slug).not.toBe("water-sharing");
  });

  it("claims well under half the hundred topics, because audit records cannot reach the rest", () => {
    // History, art and language questions need archives this project does not hold. Recording the
    // shortfall here stops a future change from quietly widening the map to hit a target.
    expect(auditTopicFits.length).toBeLessThan(timelessTopics.length / 2);
    const themes = new Set(auditTopicFits.map((fit) => getTimelessTopic(fit.slug)!.theme));
    expect(themes.has("History and memory")).toBe(false);
    expect(themes.has("Art and interpretation")).toBe(false);
    expect(themes.has("Language and belonging")).toBe(false);
  });
});
