import { describe, expect, it } from "vitest";

import { reviewEditorialQuality } from "./editorial-quality";
import { parseGeneratedStoryV2, type GeneratedStoryV2, type SourceDossierRecord } from "./generation-contract";

const dossier: SourceDossierRecord[] = [{
  id: "city-record", publisherId: "pib", publisher: "Press Information Bureau", title: "Bazaar Road bus trial record",
  url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000003", sourceKind: "official_statement",
  publishedAt: "2026-08-28T06:00:00.000Z", accessedAt: "2026-08-31T06:00:00.000Z",
  evidenceText: "The city transport record says a bus-priority trial is planned for Bazaar Road from 1 September.",
  linkAllowed: true, modelInputAllowed: true, mediaReuseAllowed: false, rightsBasis: "government_reproduction_policy",
  policyUrl: "https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3", reviewedAt: "2026-08-31T06:00:00.000Z",
  creditLine: "Source: Press Information Bureau"
}];

function makeStory(paragraphs?: [string, string, string]): GeneratedStoryV2 {
  const body = paragraphs ?? [
    "A bus-priority trial is due to start on Bazaar Road on 1 September, according to a city transport record. The plan identifies one road corridor and a start date. It does not provide travel-time results, pedestrian counts or interviews with traders. Those limits matter because the record describes an intended change rather than an observed outcome.",
    "The official account supports a narrow statement: the authority announced a trial and named when it expected the change to begin. A later road visit would be needed to confirm whether signs, lane markings and bus movements changed on the ground. Comparable morning and evening journey records would help an editor distinguish a short disruption from a lasting shift.",
    "Bus riders, walkers and people working beside Bazaar Road can encounter the same lane decision in different ways. The supplied record does not document any of their experiences, so this draft does not assign them reactions. Access checks, route data and conversations with affected people would make the next report more useful while keeping the official announcement in its proper scope."
  ];
  return parseGeneratedStoryV2({
    contractVersion: "syat.story-draft.v2", language: "en-IN", editorialStatus: "needs_editorial_review", format: "explainer",
    story: { mode: "news", title: "Bazaar Road bus-priority trial gets a planned start date", dek: "The city record names the road and date, while travel effects and on-ground implementation remain unverified.", theme: "Cities and public life", indiaConnection: "The transport record concerns Bazaar Road in an Indian municipal setting and people who use it.", eventTime: { kind: "exact_date", value: "2026-09-01", label: "From 1 September 2026" }, reframe: { kind: "question", value: "What evidence would show how the bus-priority change works on the ground?" } },
    bodySections: [
      { id: "announcement", title: "The announced change", paragraphs: [{ id: "opening", text: body[0], claimIds: ["planned-trial"], sourceIds: ["city-record"] }] },
      { id: "verification", title: "What needs verification", paragraphs: [{ id: "verification-record", text: body[1], claimIds: ["planned-trial", "implementation-open"], sourceIds: ["city-record"] }] },
      { id: "public-effect", title: "Whose experience is missing", paragraphs: [{ id: "missing-experience", text: body[2], claimIds: ["experience-open"], sourceIds: ["city-record"] }] }
    ],
    timeline: [{ id: "start", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The record gives this as the planned start date for the trial.", sourceIds: ["city-record"] }],
    statements: [
      { id: "planned-trial", type: "documented", basis: "official_claim", text: "The city record says a bus-priority trial is planned from 1 September.", sourceIds: ["city-record"], sourceScope: "The statement reports the plan described by the city transport record.", limits: "It does not confirm on-ground implementation or any measured effect." },
      { id: "implementation-open", type: "unresolved", basis: "evidence_gap", text: "On-ground implementation has not been independently verified.", sourceIds: ["city-record"], sourceScope: "The supplied record is an announcement rather than an observation from Bazaar Road.", limits: "No site visit, image record or independent report is present." },
      { id: "experience-open", type: "unresolved", basis: "missing_voice", text: "The experiences of road users and workers are absent from the supplied record.", sourceIds: ["city-record"], sourceScope: "The record does not include interviews or public feedback.", limits: "The draft cannot infer whether any affected group supports or opposes the plan." }
    ],
    perspectives: [{ id: "bus-rider", label: "Bus rider", rationale: "The record concerns a lane intended to change bus movement on this road.", sees: "A planned change to a route through Bazaar Road.", values: "Reliable travel and clear information about route changes.", uses: "The route and date described in the city record.", mayMiss: "How access beside the road changes for traders and walkers.", sourceIds: ["city-record"] }],
    people: [{ id: "city-transport-authority", kind: "institution", label: "City transport authority", association: "The institution issued the record that describes the planned trial.", sourceIds: ["city-record"] }],
    unresolved: [{ id: "journey-effect", question: "How do journey times and street access change during the trial?", whatWouldHelp: "Comparable route data, access checks and interviews collected during the trial.", sourceIds: ["city-record"] }],
    contextBridge: { topicSlug: "local-decision", question: "How should a local decision be made?", connection: "The trial links an administrative decision to public experiences that still need direct reporting." },
    authoredVisual: { kind: "process", title: "Announcement, observation, assessment", description: "A source-led process separates the announced plan from later road observation and outcome assessment.", limitation: "The visual does not claim that implementation or outcomes have occurred.", claimIds: ["planned-trial", "implementation-open"], sourceIds: ["city-record"] },
    mediaPlan: [], modelNotes: ["Keep the official claim separate from later observation."]
  }, dossier);
}

describe("reviewEditorialQuality", () => {
  it("blocks generic AI openings and a body that is near-duplicate of another story", () => {
    const original = makeStory();
    const changed = makeStory([`In a significant development, ${original.bodySections[0].paragraphs[0].text}`, original.bodySections[1].paragraphs[0].text, original.bodySections[2].paragraphs[0].text]);
    const report = reviewEditorialQuality(changed, [original]);
    expect(report.blockers.map((item) => item.code)).toContain("generic-opening");
    expect(report.blockers.map((item) => item.code)).toContain("near-duplicate-body");
  });

  it("blocks hype and unsupported causal language", () => {
    const story = makeStory([
      "Bazaar Road faces a groundbreaking transformation because the trial will eliminate delays for every commuter in the city.",
      "The official record names a road and a planned date. It supplies no result measurements or commuter interviews for that claim.",
      "Road observations and comparable route records would be needed before describing any effect on buses, walkers or local traders."
    ]);
    const codes = reviewEditorialQuality(story, []).blockers.map((item) => item.code);
    expect(codes).toContain("hype-language");
    expect(codes).toContain("unsupported-causal-language");
  });

  it("flags repetitive sentence rhythm and repeated paragraph openings", () => {
    const repeated = "The official record says the planned trial starts soon. The official record says the route is Bazaar Road. The official record says the lane is for buses. The official record says no outcome is available.";
    const story = makeStory([repeated, repeated.replaceAll("official", "city"), repeated.replaceAll("official", "transport")]);
    const codes = [...reviewEditorialQuality(story, []).blockers, ...reviewEditorialQuality(story, []).warnings].map((item) => item.code);
    expect(codes).toContain("repeated-opening");
    expect(codes).toContain("sentence-length-monotony");
  });

  it("passes a concrete, source-scoped India story with varied language", () => {
    const report = reviewEditorialQuality(makeStory(), []);
    expect(report.blockers).toEqual([]);
    expect(report.status).toBe("passed");
    expect(report.scores.evidenceDiscipline).toBeGreaterThanOrEqual(4);
  });
});
