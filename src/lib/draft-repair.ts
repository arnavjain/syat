import { findCloseCopySpansForRepair, type GeneratedStoryV2, type SourceDossierRecord } from "./generation-contract";

function digits(text: string): string[] {
  const withFullYears = text
    .replace(/\b(\d{2})(\d{2})\s*[-–/]\s*(\d{2})\b/g, (_match, century: string, year: string, next: string) => `${century}${year}-${century}${next}`)
    .replace(/\bFY\s*(\d{2})\b/gi, (_match, year: string) => `20${year}`);

  const raw = (withFullYears.match(/\d[\d,.]*(?:\s*-\s*\d[\d,.]*)?/g) ?? [])
    .map((value) => value.replace(/\s+/g, ""))
    .map((value) => value.replace(/[,.]+$/, ""))
    .map((value) => value.replace(/,/g, ""))
    .flatMap((value) => (value.includes("-") ? value.split("-") : [value]))
    .filter((value) => value.length > 0);

  // A bare two-digit year and its four-digit form are the same fact, but only where the text is
  // actually talking about that year. Expanding every two-digit number would quietly make "24
  // districts" and "2024" the same figure, which is how an invented number gets through.
  const fullYears = new Set(raw.filter((value) => /^(?:19|20)\d{2}$/.test(value)));
  return raw.map((value) => (/^\d{2}$/.test(value) && fullYears.has(`20${value}`) ? `20${value}` : value));
}

/** Values in `left` that `right` does not cover, counting repeats, so a doubled figure still shows. */
function countExcess(left: readonly string[], right: readonly string[]): string[] {
  const remaining = [...right];
  const excess: string[] = [];
  for (const value of left) {
    const at = remaining.indexOf(value);
    if (at === -1) excess.push(value);
    else remaining.splice(at, 1);
  }
  return excess;
}

export type RepairTarget = { fieldId: string; sourceId: string; currentText: string; avoidWording: string; sourceText: string; figures: readonly string[] };

/** A rewrite of one visible field, keyed by the field id the detector flagged. */
export type RepairPatch = Record<string, string>;

// Every flagged field must be offered, or the re-parse fails on one that was left behind.
const MAXIMUM_REPAIR_FIELDS = 20;

const MAXIMUM_SOURCE_EXCERPT = 4_000;

export function collectRepairTargets(draft: GeneratedStoryV2, sourceDossier: SourceDossierRecord[]): RepairTarget[] {
  const evidenceById = new Map(sourceDossier.map((source) => [source.id, source.evidenceText]));
  const byField = new Map<string, RepairTarget>();
  for (const span of findCloseCopySpansForRepair(draft, sourceDossier)) {
    if (byField.has(span.fieldId)) continue;
    byField.set(span.fieldId, {
      fieldId: span.fieldId,
      sourceId: span.sourceId,
      currentText: span.currentText,
      avoidWording: span.sharedText,
      sourceText: (evidenceById.get(span.sourceId) ?? "").slice(0, MAXIMUM_SOURCE_EXCERPT),
      figures: digits(span.currentText)
    });
  }
  return [...byField.values()].slice(0, MAXIMUM_REPAIR_FIELDS);
}

export function buildRepairPrompt(targets: readonly RepairTarget[]): string {
  // The model cannot avoid wording it cannot see. Without the source text it simply swaps one
  // borrowed run for another, which is exactly what the first repair run did.
  const sources = [...new Map(targets.map((target) => [target.sourceId, target.sourceText])).entries()]
    .map(([sourceId, text]) => `source_id: ${sourceId}\nsource_text: ${text}`)
    .join("\n\n");

  const fields = targets.map((target) => [
    `field_id: ${target.fieldId}`,
    `cites_source: ${target.sourceId}`,
    `current_text: ${target.currentText}`,
    `run_already_reused: ${target.avoidWording}`,
    `figures_that_must_appear_unchanged: ${target.figures.length > 0 ? target.figures.join(", ") : "none"}`
  ].join("\n")).join("\n\n");

  return [
    "You are rewriting a few fields of an Indian news draft that reused its source's wording.",
    "",
    "The source text is below. Your rewrite must not reuse any seven consecutive words from it.",
    "Changing one or two words is not enough. Reorder the sentence, change which clause leads,",
    "and choose different everyday words for the source's formal ones.",
    "",
    "Keep exactly the same meaning, the same facts, the same numbers and the same dates.",
    "",
    "Rules:",
    "- No run of seven consecutive words may match the source text.",
    "- Reproduce every figure listed for a field exactly. You may state a date or figure the source text itself carries; you may not invent one it does not. Dropping a listed figure is rejected outright.",
    "- Do not add a new claim, name, place or cause. Only restate what current_text already says.",
    "- Change the grammatical subject of each sentence and move the figure to a different position. Swapping individual words leaves the run intact; changing what the sentence is about is what breaks it.",
    "- Length may differ from current_text. Splitting one long sentence into two, or merging two into one, is a good way to break a reused run and is expected.",
    "- Use plain words. No em dash, no en dash, and no official register such as \"inter alia\", \"the said\", \"vide\" or \"in this regard\".",
    "",
    "Return only a JSON object mapping each field_id to its rewritten text. No other keys, no commentary.",
    "",
    "SOURCES",
    sources,
    "",
    "FIELDS TO REWRITE",
    fields
  ].join("\n");
}



function assignField(draft: GeneratedStoryV2, fieldId: string, text: string): boolean {
  const [kind, ...rest] = fieldId.split(":");

  if (fieldId === "story:title") { draft.story.title = text; return true; }
  if (fieldId === "story:dek") { draft.story.dek = text; return true; }
  if (fieldId === "reframe") { draft.story.reframe.value = text; return true; }
  if (kind === "context-bridge") {
    if (rest[0] === "question") draft.contextBridge.question = text;
    else if (rest[0] === "connection") draft.contextBridge.connection = text;
    else return false;
    return true;
  }
  if (kind === "authored-visual") {
    if (rest[0] === "title") draft.authoredVisual.title = text;
    else if (rest[0] === "description") draft.authoredVisual.description = text;
    else if (rest[0] === "limitation") draft.authoredVisual.limitation = text;
    else return false;
    return true;
  }

  if (kind === "section") {
    const section = draft.bodySections.find((item) => item.id === rest[0]);
    if (!section) return false;
    section.title = text;
    return true;
  }
  if (kind === "paragraph") {
    for (const section of draft.bodySections) {
      const paragraph = section.paragraphs.find((item) => item.id === rest[0]);
      if (paragraph) { paragraph.text = text; return true; }
    }
    return false;
  }
  if (kind === "timeline") {
    const entry = draft.timeline.find((item) => item.id === rest[0]);
    if (!entry) return false;
    entry.text = text;
    return true;
  }
  if (kind === "statement") {
    const statement = draft.statements.find((item) => item.id === rest[0]);
    if (!statement) return false;
    if (rest[1] === "text") statement.text = text;
    else if (rest[1] === "scope") statement.sourceScope = text;
    else if (rest[1] === "limits") statement.limits = text;
    else return false;
    return true;
  }
  if (kind === "perspective") {
    const perspective = draft.perspectives.find((item) => item.id === rest[0]);
    const slot = Number(rest[1]);
    if (!perspective || !Number.isInteger(slot)) return false;
    const keys = ["rationale", "sees", "values", "uses", "mayMiss"] as const;
    const key = keys[slot];
    if (!key) return false;
    perspective[key] = text;
    return true;
  }
  if (kind === "association") {
    const person = draft.people.find((item) => item.id === rest[0]);
    if (!person) return false;
    person.association = text;
    return true;
  }
  if (kind === "unresolved") {
    const question = draft.unresolved.find((item) => item.id === rest[0]);
    if (!question) return false;
    if (rest[1] === "question") question.question = text;
    else if (rest[1] === "need") question.whatWouldHelp = text;
    else return false;
    return true;
  }
  return false;
}

/**
 * Applies a rewrite to the flagged visible fields and nothing else.
 *
 * This function is the only thing standing between a narrow wording fix and a way to launder
 * a bad draft past the parser, so it refuses anything it was not asked to do. The patched
 * draft still goes through `parseGeneratedStoryV2`, so the seven-token guard, the time
 * grounding check and the dossier binding all run again on the rewritten text.
 */
export function applyRepairPatch(draft: GeneratedStoryV2, patch: unknown, targets: readonly RepairTarget[]): GeneratedStoryV2 {
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) throw new Error("Repair response was not a JSON object of field rewrites.");

  const allowed = new Map(targets.map((target) => [target.fieldId, target]));
  const entries = Object.entries(patch as Record<string, unknown>);
  if (entries.length === 0) throw new Error("Repair response rewrote no fields.");

  const repaired = structuredClone(draft);

  for (const [fieldId, value] of entries) {
    const target = allowed.get(fieldId);
    if (!target) throw new Error(`Repair response tried to change ${fieldId}, which was not flagged for repair.`);
    if (typeof value !== "string") throw new Error(`Repair response gave a non-string rewrite for ${fieldId}.`);

    const text = value.trim();
    if (text.length === 0) throw new Error(`Repair response emptied ${fieldId}.`);

    // A rewrite may never drop a figure the reader was given, and may never invent one. It may
    // restate a figure that the cited evidence itself carries: de-copying a sentence often means
    // naming the year or unit the borrowed run had left implicit, and that is grounded, not new.
    const before = digits(target.currentText);
    const after = digits(text);
    const grounded = new Set(digits(target.sourceText));
    const dropped = countExcess(before, after);
    const added = countExcess(after, before).filter((value) => !grounded.has(value));
    if (dropped.length > 0 || added.length > 0) {
      const detail = [dropped.length > 0 ? `dropped ${dropped.join(", ")}` : "", added.length > 0 ? `added ungrounded ${added.join(", ")}` : ""].filter(Boolean).join("; ");
      throw new Error(`Repair response changed the numbers in ${fieldId} (${detail}); a rewrite may not drop a figure or invent one the source does not carry.`);
    }
    const withoutDashes = text
      .replace(/(\d)\s*[–—]\s*(\d)/g, "$1 to $2")
      .replace(/\s*[–—]\s*/g, ", ")
      .replace(/,\s*,/g, ",");
    if (/[–—]/.test(withoutDashes)) throw new Error(`Repair response introduced a decorative dash in ${fieldId}.`);
    if (!assignField(repaired, fieldId, withoutDashes)) throw new Error(`Repair response named ${fieldId}, which is not a repairable visible field.`);
  }

  // Nothing outside the flagged visible strings may move.
  const frozen = [
    ["sourcePackId", draft.sourcePackId, repaired.sourcePackId],
    ["language", draft.language, repaired.language],
    ["format", draft.format, repaired.format],
    ["mode", draft.story.mode, repaired.story.mode],
    ["indiaConnection", draft.story.indiaConnection, repaired.story.indiaConnection],
    ["eventTime", JSON.stringify(draft.story.eventTime), JSON.stringify(repaired.story.eventTime)],
    ["eventTimeEvidence", JSON.stringify(draft.story.eventTimeEvidence), JSON.stringify(repaired.story.eventTimeEvidence)],
    ["sourceIds", JSON.stringify(draft.sourceIds), JSON.stringify(repaired.sourceIds)],
    ["timelineTimes", JSON.stringify(draft.timeline.map((entry) => entry.time)), JSON.stringify(repaired.timeline.map((entry) => entry.time))],
    ["claimIds", JSON.stringify(draft.statements.map((statement) => statement.id)), JSON.stringify(repaired.statements.map((statement) => statement.id))],
    ["mediaPlan", JSON.stringify(draft.mediaPlan), JSON.stringify(repaired.mediaPlan)]
  ] as const;

  for (const [name, before, after] of frozen) {
    if (before !== after) throw new Error(`Repair changed ${name}, which a wording fix may never touch.`);
  }

  return repaired;
}
