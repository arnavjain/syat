import { getTimelessTopic } from "./timeless-topics";

/**
 * Which enduring questions a government audit record can honestly illustrate.
 *
 * A Timeless story is about the question, but the evidence under it still has to be real evidence
 * for that question. Matching a record to a topic by shared words does not work: it files a
 * procurement audit under "What makes an original feel original?" because both mention originals.
 *
 * So the fit is curated rather than inferred. Each entry names the concrete things a record must
 * actually be about before it may stand under that question. Topics that audit records cannot
 * speak to are deliberately absent, and a pack that fits none is skipped. The gap is a sourcing
 * problem to solve with different archives, not something to paper over with a loose threshold.
 */

export type TopicFit = {
  slug: string;
  /** Terms the record must contain for the pairing to be genuine. */
  markers: readonly string[];
  /** How many distinct markers must appear before the pairing counts. */
  minimumMarkers: number;
};

export const auditTopicFits: readonly TopicFit[] = [
  // Cities and public life
  { slug: "public-place", markers: ["municipal", "urban", "public space", "park", "civic", "encroach"], minimumMarkers: 2 },
  { slug: "waiting-in-city", markers: ["pending", "delay", "queue", "waiting", "backlog", "grievance"], minimumMarkers: 2 },
  { slug: "access-to-toilet", markers: ["sanitation", "toilet", "swachh", "sewer", "open defecation"], minimumMarkers: 2 },
  { slug: "street-vending", markers: ["vendor", "hawker", "street vending", "licence", "informal trade"], minimumMarkers: 2 },

  // Science and uncertainty
  { slug: "measurement", markers: ["indicator", "baseline", "target", "measurement", "benchmark", "survey"], minimumMarkers: 2 },
  { slug: "data-gap", markers: ["not maintained", "no records", "missing", "incomplete data", "not available", "unreliable"], minimumMarkers: 2 },
  { slug: "evidence-threshold", markers: ["verification", "sanction", "approval", "appraisal", "feasibility", "scrutiny"], minimumMarkers: 2 },
  { slug: "risk-and-precaution", markers: ["risk", "safety", "hazard", "precaution", "mitigation", "disaster"], minimumMarkers: 2 },

  // Work and care
  { slug: "invisible-work", markers: ["muster roll", "worker", "labour", "wage", "employment guarantee"], minimumMarkers: 2 },
  { slug: "wage-and-worth", markers: ["wage", "payment", "remuneration", "honorarium", "minimum wage", "arrears"], minimumMarkers: 2 },
  { slug: "informal-work", markers: ["contract labour", "casual", "daily wage", "unorganised", "informal"], minimumMarkers: 2 },
  { slug: "apprenticeship", markers: ["training", "apprentice", "skill", "trainee", "vocational", "institute"], minimumMarkers: 2 },
  { slug: "time-and-care", markers: ["anganwadi", "caregiver", "childcare", "creche", "nutrition", "attendant"], minimumMarkers: 2 },
  { slug: "care-in-public", markers: ["welfare", "beneficiary", "scheme", "entitlement", "pension"], minimumMarkers: 3 },

  // Food and land
  { slug: "water-sharing", markers: ["water supply", "irrigation", "canal", "groundwater", "drinking water", "reservoir"], minimumMarkers: 2 },
  { slug: "grain-storage", markers: ["storage", "godown", "procurement", "food grain", "warehouse", "buffer stock"], minimumMarkers: 2 },
  { slug: "soil", markers: ["soil", "land degradation", "fertiliser", "erosion", "watershed"], minimumMarkers: 2 },
  { slug: "commons", markers: ["forest", "common land", "grazing", "village land", "encroachment", "afforestation"], minimumMarkers: 2 },
  { slug: "food-price", markers: ["subsidy", "price", "public distribution", "ration", "procurement price"], minimumMarkers: 2 },
  { slug: "crop-and-climate", markers: ["crop", "agriculture", "rainfall", "drought", "climate", "horticulture"], minimumMarkers: 2 },

  // Technology and power
  { slug: "identity-system", markers: ["aadhaar", "beneficiary database", "registration", "identity", "verification", "duplicate"], minimumMarkers: 2 },
  { slug: "digital-archive", markers: ["portal", "database", "digitisation", "records management", "information system"], minimumMarkers: 2 },
  { slug: "automation-bias", markers: ["software", "system generated", "application", "module", "validation control"], minimumMarkers: 2 },
  { slug: "network-outage", markers: ["downtime", "connectivity", "network", "server", "outage", "disruption"], minimumMarkers: 2 },

  // Bodies and health
  { slug: "public-health", markers: ["health", "hospital", "dispensary", "immunisation", "disease", "patient"], minimumMarkers: 2 },
  { slug: "disability-access", markers: ["disability", "divyang", "accessibility", "ramp", "barrier free", "special needs"], minimumMarkers: 2 },
  { slug: "care-record", markers: ["patient record", "case sheet", "register", "medical record", "documentation"], minimumMarkers: 2 },
  { slug: "body-and-work", markers: ["occupational", "injury", "safety equipment", "workplace", "accident"], minimumMarkers: 2 },
  { slug: "ageing", markers: ["old age", "elderly", "senior citizen", "geriatric", "pension"], minimumMarkers: 2 },

  // Democracy and common life
  { slug: "public-trust", markers: ["irregularity", "embezzlement", "misappropriation", "fraud", "accountability"], minimumMarkers: 2 },
  { slug: "local-decision", markers: ["panchayat", "municipality", "local body", "gram sabha", "devolution", "district"], minimumMarkers: 2 },
  { slug: "rule-and-exception", markers: ["deviation", "exemption", "relaxation", "without approval", "non compliance", "violation"], minimumMarkers: 2 },
  { slug: "citizenship", markers: ["entitlement", "eligibility", "exclusion", "ineligible", "denied", "coverage"], minimumMarkers: 2 },
  { slug: "neighbourhood-assembly", markers: ["gram sabha", "public consultation", "participation", "committee", "meeting"], minimumMarkers: 2 },
  { slug: "listening", markers: ["grievance", "complaint", "redressal", "feedback", "hearing"], minimumMarkers: 2 }
];

/** Returns the best genuine fit, or undefined when the record supports no question honestly. */
export function fitTopicToRecord(recordText: string, alreadyUsed: ReadonlySet<string>): { slug: string; matched: number } | undefined {
  const haystack = recordText.toLocaleLowerCase("en-IN");
  let best: { slug: string; matched: number } | undefined;

  for (const fit of auditTopicFits) {
    if (alreadyUsed.has(fit.slug)) continue;
    if (!getTimelessTopic(fit.slug)) throw new Error(`Topic fit names an unknown Timeless topic: ${fit.slug}`);
    const matched = new Set(fit.markers.filter((marker) => haystack.includes(marker))).size;
    if (matched < fit.minimumMarkers) continue;
    if (!best || matched > best.matched) best = { slug: fit.slug, matched };
  }
  return best;
}

/** Every question audit records can reach. The rest need archives this project does not yet hold. */
export const auditReachableTopicCount = auditTopicFits.length;
