import { createHash } from "node:crypto";

import { z } from "zod";

import { sourcePackSourceSchema, type SourcePackSource } from "./source-pack";
import { canEnterModelInput } from "./source-rights";
import { getTimelessTopic, timelessTopics } from "./timeless-topics";

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
const sourceIdsSchema = z.array(idSchema).min(1).max(12);
const claimIdSchema = z.string().regex(/^claim-[1-9][0-9]*$/).max(80);
const claimIdsSchema = z.array(claimIdSchema).min(1).max(16);
const timelessTopicSlugSchema = z.enum(timelessTopics.map((topic) => topic.slug), { error: "Unknown Timeless topic slug." });
const storyFormatSchema = z.enum(["news_brief", "explainer", "timeline", "source_map", "public_impact"]);
const statementTypeSchema = z.enum(["documented", "interpreted", "experienced", "valued", "unresolved"]);
const statementBasisSchema = z.enum(["direct_record", "official_claim", "reported_observation", "interpretation", "missing_voice", "evidence_gap"]);
const UNKNOWN_TIME_LABEL = "Date not established in the supplied evidence";

function canonicalExactDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00.000Z`));
}

const flexibleTimeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("exact_date"), value: z.iso.date(), label: z.string().trim().min(3).max(80) }).strict(),
  z.object({ kind: z.literal("unknown"), label: z.literal(UNKNOWN_TIME_LABEL) }).strict()
]).superRefine((time, ctx) => {
  if (time.kind === "exact_date" && time.label !== canonicalExactDateLabel(time.value)) {
    ctx.addIssue({ code: "custom", path: ["label"], message: `Exact-date label must use the canonical label ${canonicalExactDateLabel(time.value)}.` });
  }
});

const paragraphSchema = z.object({
  id: idSchema,
  text: z.string().trim().min(40).max(1_600),
  claimIds: claimIdsSchema,
  sourceIds: sourceIdsSchema
}).strict();

const bodySectionSchema = z.object({
  id: idSchema,
  title: z.string().trim().min(4).max(100),
  paragraphs: z.array(paragraphSchema).min(1).max(4)
}).strict();

const statementSchema = z.object({
  id: claimIdSchema,
  type: statementTypeSchema,
  basis: statementBasisSchema,
  text: z.string().trim().min(12).max(500),
  sourceIds: sourceIdsSchema,
  sourceScope: z.string().trim().min(12).max(300),
  limits: z.string().trim().min(12).max(300)
}).strict();

const timelineEntrySchema = z.object({
  id: idSchema,
  time: flexibleTimeSchema,
  text: z.string().trim().min(12).max(500),
  claimIds: claimIdsSchema,
  sourceIds: sourceIdsSchema
}).strict();

const evidencePathSchema = z.object({ claimIds: claimIdsSchema, sourceIds: sourceIdsSchema }).strict();

const perspectiveSchema = z.object({
  id: idSchema,
  label: z.string().trim().min(2).max(90),
  rationale: z.string().trim().min(12).max(320),
  sees: z.string().trim().min(12).max(320),
  values: z.string().trim().min(12).max(320),
  uses: z.string().trim().min(12).max(320),
  mayMiss: z.string().trim().min(12).max(320),
  sourceIds: sourceIdsSchema
}).strict();

const associationSchema = z.object({
  id: idSchema,
  kind: z.enum(["person", "institution", "community", "unknown_unverified"]),
  label: z.string().trim().min(2).max(160),
  association: z.string().trim().min(12).max(320),
  sourceIds: sourceIdsSchema
}).strict();

const unresolvedSchema = z.object({
  id: idSchema,
  question: z.string().trim().min(12).max(300),
  whatWouldHelp: z.string().trim().min(12).max(300),
  sourceIds: sourceIdsSchema
}).strict();

const authoredVisualSchema = z.object({
  kind: z.enum(["timeline", "process", "relationship_map", "source_role_map", "number_stack", "comparison"]),
  title: z.string().trim().min(4).max(120),
  description: z.string().trim().min(20).max(500),
  limitation: z.string().trim().min(12).max(320),
  claimIds: claimIdsSchema,
  sourceIds: sourceIdsSchema
}).strict();

const mediaPlanSchema = z.object({
  id: idSchema,
  kind: z.enum(["photo", "illustration", "chart", "video", "audio", "embed"]),
  placement: z.enum(["hero", "inline", "source_trail", "embed"]),
  purpose: z.string().trim().min(12).max(320),
  alt: z.string().trim().min(12).max(240),
  rightsRequirement: z.enum(["owned", "public_domain", "cc0", "cc_by", "cc_by_sa", "government_open_data", "official_embed", "commercial_license", "explicit_licence"]),
  claimIds: claimIdsSchema,
  sourceIds: sourceIdsSchema
}).strict();

const generatedStoryV2Shape = z.object({
  contractVersion: z.literal("syat.story-draft.v2"),
  sourcePackId: idSchema,
  sourceIds: sourceIdsSchema,
  language: z.enum(["en-IN", "hi-IN"]),
  editorialStatus: z.literal("needs_editorial_review"),
  format: storyFormatSchema,
  story: z.object({
    mode: z.enum(["news", "timeless"]),
    title: z.string().trim().min(12).max(160),
    dek: z.string().trim().min(20).max(320),
    theme: z.string().trim().min(2).max(120),
    indiaConnection: z.string().trim().min(12).max(500),
    eventTime: flexibleTimeSchema,
    eventTimeEvidence: evidencePathSchema,
    reframe: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("claim"), value: z.string().trim().min(12).max(320) }).strict(),
      z.object({ kind: z.literal("question"), value: z.string().trim().min(12).max(320) }).strict()
    ])
  }).strict(),
  bodySections: z.array(bodySectionSchema).min(3).max(6),
  timeline: z.array(timelineEntrySchema).max(18),
  statements: z.array(statementSchema).min(1).max(32),
  perspectives: z.array(perspectiveSchema).max(8),
  people: z.array(associationSchema).max(16),
  unresolved: z.array(unresolvedSchema).min(1).max(12),
  contextBridge: z.object({
    topicSlug: timelessTopicSlugSchema,
    question: z.string().trim().min(12).max(300),
    connection: z.string().trim().min(12).max(500)
  }).strict(),
  authoredVisual: authoredVisualSchema,
  mediaPlan: z.array(mediaPlanSchema).max(8),
  modelNotes: z.array(z.string().trim().min(5).max(300)).max(12)
}).strict();

function addReferenceIssue(ctx: z.RefinementCtx, path: PropertyKey[], message: string) {
  ctx.addIssue({ code: "custom", path, message });
}

function assertUniqueIds(ctx: z.RefinementCtx, records: readonly { id: string }[], path: PropertyKey[]) {
  const seen = new Set<string>();
  for (const [index, record] of records.entries()) {
    if (seen.has(record.id)) addReferenceIssue(ctx, [...path, index, "id"], `Record id ${record.id} is repeated.`);
    seen.add(record.id);
  }
}

export const generatedStoryV2ResponseSchema = generatedStoryV2Shape.superRefine((draft, ctx) => {
  if (draft.bodySections.reduce((count, section) => count + section.paragraphs.length, 0) > 18) {
    addReferenceIssue(ctx, ["bodySections"], "A draft can contain at most 18 body paragraphs so it fits the ReaderStory contract.");
  }
  assertUniqueIds(ctx, draft.bodySections, ["bodySections"]);
  assertUniqueIds(ctx, draft.bodySections.flatMap((section) => section.paragraphs), ["bodySections"]);
  assertUniqueIds(ctx, draft.timeline, ["timeline"]);
  assertUniqueIds(ctx, draft.statements, ["statements"]);
  assertUniqueIds(ctx, draft.perspectives, ["perspectives"]);
  assertUniqueIds(ctx, draft.people, ["people"]);
  assertUniqueIds(ctx, draft.unresolved, ["unresolved"]);
  assertUniqueIds(ctx, draft.mediaPlan, ["mediaPlan"]);
  for (const [index, statement] of draft.statements.entries()) {
    const expectedId = `claim-${index + 1}`;
    if (statement.id !== expectedId) addReferenceIssue(ctx, ["statements", index, "id"], `Statement IDs must be sequential claim-1 through claim-N; expected ${expectedId}.`);
  }
  if (new Set(draft.sourceIds).size !== draft.sourceIds.length) addReferenceIssue(ctx, ["sourceIds"], "Draft source IDs must be unique.");

  const claimIds = new Set(draft.statements.map((statement) => statement.id));
  const claimsById = new Map(draft.statements.map((statement) => [statement.id, statement]));
  const draftSourceIds = new Set(draft.sourceIds);
  const checkClaimSupport = (referencedClaimIds: readonly string[], referencedSourceIds: readonly string[], path: PropertyKey[]) => {
    if (referencedSourceIds.some((sourceId) => !draftSourceIds.has(sourceId))) return;
    const usedSources = new Set<string>();
    for (const claimId of referencedClaimIds) {
      const claim = claimsById.get(claimId);
      if (!claim) continue;
      const supportingSources = claim.sourceIds.filter((sourceId) => referencedSourceIds.includes(sourceId));
      if (supportingSources.length === 0) addReferenceIssue(ctx, path, `The cited sources do not support claim ${claimId}.`);
      supportingSources.forEach((sourceId) => usedSources.add(sourceId));
    }
    for (const sourceId of referencedSourceIds) {
      if (!usedSources.has(sourceId)) addReferenceIssue(ctx, path, `Source ${sourceId} does not support any cited claim.`);
    }
  };
  for (const [sectionIndex, section] of draft.bodySections.entries()) {
    for (const [paragraphIndex, paragraph] of section.paragraphs.entries()) {
      for (const claimId of paragraph.claimIds) {
        if (!claimIds.has(claimId)) addReferenceIssue(ctx, ["bodySections", sectionIndex, "paragraphs", paragraphIndex, "claimIds"], `Paragraph references unknown claim ${claimId}.`);
      }
      checkClaimSupport(paragraph.claimIds, paragraph.sourceIds, ["bodySections", sectionIndex, "paragraphs", paragraphIndex]);
    }
  }
  for (const [index, entry] of draft.timeline.entries()) {
    for (const claimId of entry.claimIds) if (!claimIds.has(claimId)) addReferenceIssue(ctx, ["timeline", index, "claimIds"], `Timeline references unknown claim ${claimId}.`);
    checkClaimSupport(entry.claimIds, entry.sourceIds, ["timeline", index]);
  }
  for (const claimId of draft.story.eventTimeEvidence.claimIds) if (!claimIds.has(claimId)) addReferenceIssue(ctx, ["story", "eventTimeEvidence", "claimIds"], `Event time references unknown claim ${claimId}.`);
  checkClaimSupport(draft.story.eventTimeEvidence.claimIds, draft.story.eventTimeEvidence.sourceIds, ["story", "eventTimeEvidence"]);
  for (const claimId of draft.authoredVisual.claimIds) {
    if (!claimIds.has(claimId)) addReferenceIssue(ctx, ["authoredVisual", "claimIds"], `Authored visual references unknown claim ${claimId}.`);
  }
  checkClaimSupport(draft.authoredVisual.claimIds, draft.authoredVisual.sourceIds, ["authoredVisual"]);
  for (const [index, media] of draft.mediaPlan.entries()) {
    for (const claimId of media.claimIds) if (!claimIds.has(claimId)) addReferenceIssue(ctx, ["mediaPlan", index, "claimIds"], `Media plan references unknown claim ${claimId}.`);
    checkClaimSupport(media.claimIds, media.sourceIds, ["mediaPlan", index]);
  }
  if (!getTimelessTopic(draft.contextBridge.topicSlug)) {
    addReferenceIssue(ctx, ["contextBridge", "topicSlug"], `Timeless topic ${draft.contextBridge.topicSlug} is not in the approved catalogue.`);
  }
});

export type GeneratedStoryV2 = z.infer<typeof generatedStoryV2ResponseSchema>;
export type GeneratedStory = GeneratedStoryV2;
export type SourceDossierRecord = SourcePackSource;
export type ApprovedSourceDossierRecord = SourcePackSource;

export function validateApprovedSourceDossier(sourceDossier: SourceDossierRecord[]): ApprovedSourceDossierRecord[] {
  const parsed = z.array(sourcePackSourceSchema).min(1).max(12).safeParse(sourceDossier);
  if (!parsed.success) throw new Error("Source dossier must contain complete source-pack records before a draft can be prepared.");
  const sourceIds = parsed.data.map((source) => source.id);
  if (new Set(sourceIds).size !== sourceIds.length) throw new Error("Source dossier contains duplicate source IDs and cannot be used to prepare a draft.");
  if (parsed.data.some((source) => !canEnterModelInput(source))) {
    throw new Error("Every source dossier record must have explicit model input permission and reusable evidence text.");
  }
  return parsed.data;
}

function allReferencedSourceIds(draft: GeneratedStoryV2) {
  return [
    ...draft.bodySections.flatMap((section) => section.paragraphs.flatMap((paragraph) => paragraph.sourceIds)),
    ...draft.timeline.flatMap((entry) => entry.sourceIds),
    ...draft.statements.flatMap((statement) => statement.sourceIds),
    ...draft.perspectives.flatMap((perspective) => perspective.sourceIds),
    ...draft.people.flatMap((person) => person.sourceIds),
    ...draft.unresolved.flatMap((question) => question.sourceIds),
    ...draft.story.eventTimeEvidence.sourceIds,
    ...draft.authoredVisual.sourceIds,
    ...draft.mediaPlan.flatMap((media) => media.sourceIds)
  ];
}

function textTokens(text: string) {
  return text.toLocaleLowerCase("en-IN").normalize("NFKC").replace(/([\p{L}])['’]s\b/giu, "$1s").match(/[\p{L}\p{N}]+/gu) ?? [];
}

const nameConnectors = new Set(["and", "of", "for", "the", "in", "on", "to", "a", "an"]);

/**
 * A run that is simply a proper name as the source writes it: a statute, scheme, institution
 * or place. "Mahatma Gandhi National Rural Employment Guarantee Act" is seven tokens, and a
 * story about that Act has to name it. Paraphrasing a statutory name would make the story
 * wrong, so matching one is not evidence of copied analysis.
 *
 * This narrows the guard's precision, it does not lower its bar. Copying anything beyond a
 * name still trips the neighbouring windows, which is asserted in the tests.
 */
function runIsProperName(run: readonly string[], evidenceText: string): boolean {
  const significant = run.filter((token) => !nameConnectors.has(token));
  if (significant.length < 3) return false;
  // A name is a noun phrase. A copied headline is Title Case too, so capitalisation alone is
  // not enough: "Minister Kavita Rao Opens ..." must still be caught, and it carries a verb.
  if (run.some((token) => isHeadlineActionVerb(token))) return false;

  const originalTokens = evidenceText.normalize("NFKC").replace(/([\p{L}])['’]s\b/giu, "$1s").match(/[\p{L}\p{M}]+/gu) ?? [];
  const lowered = originalTokens.map((token) => token.toLocaleLowerCase("en-IN"));

  for (let index = 0; index <= lowered.length - run.length; index += 1) {
    if (run.some((token, offset) => lowered[index + offset] !== token)) continue;
    const span = originalTokens.slice(index, index + run.length);
    const significantSpan = span.filter((token) => !nameConnectors.has(token.toLocaleLowerCase("en-IN")));
    const capitalised = significantSpan.filter((token) => /^\p{Lu}/u.test(token)).length;
    if (significantSpan.length > 0 && capitalised === significantSpan.length) return true;
  }
  return false;
}

function sharedRun(text: string, evidenceText: string, size: number) {
  const visible = textTokens(text);
  const evidence = textTokens(evidenceText);
  if (visible.length < size || evidence.length < size) return null;
  const evidenceRuns = new Set<string>();
  for (let index = 0; index <= evidence.length - size; index += 1) evidenceRuns.add(evidence.slice(index, index + size).join(" "));
  for (let index = 0; index <= visible.length - size; index += 1) {
    const run = visible.slice(index, index + size);
    const normalisedRun = run.join(" ");
    if (!evidenceRuns.has(normalisedRun)) continue;
    if (runIsProperName(run, evidenceText)) continue;
    return { tokenCount: size, matchHash: createHash("sha256").update(normalisedRun).digest("hex"), sharedText: normalisedRun };
  }
  return null;
}

type VisibleDraftField = { id: string; text: string; sourceIds: string[]; compactLabel?: true };

const headlineActionVerbs = new Set(["announce", "approve", "close", "direct", "expand", "inaugurate", "launch", "open", "order", "release", "review", "start", "unveil", "visit"]);

function isHeadlineActionVerb(token: string) {
  const word = token.toLocaleLowerCase("en-IN");
  const forms = [word, word.replace(/ies$/, "y"), word.replace(/es$/, ""), word.replace(/s$/, ""), word.replace(/ed$/, ""), word.replace(/d$/, ""), word.replace(/ing$/, ""), word.replace(/ing$/, "e")];
  return forms.some((form) => headlineActionVerbs.has(form));
}

function withoutOpeningEntityOrOffice(text: string) {
  const tokens = text.normalize("NFKC").replace(/([\p{L}])['’]s\b/giu, "$1s").match(/[\p{L}\p{M}]+/gu) ?? [];
  let spanEnd = 0;
  for (const [index, token] of tokens.entries()) {
    if (isHeadlineActionVerb(token)) break;
    const followsConnector = index > 0 && /^(?:and|for|of|the)$/i.test(tokens[index - 1]);
    if ((index < 3 || followsConnector) && /^\p{Lu}/u.test(token)) {
      spanEnd = index + 1;
      continue;
    }
    if (spanEnd === index && /^(?:and|for|of|the)$/i.test(token)) {
      spanEnd = index + 1;
      continue;
    }
    break;
  }
  return tokens.slice(spanEnd).join(" ");
}

function visibleDraftFields(draft: GeneratedStoryV2): VisibleDraftField[] {
  const sectionFields = draft.bodySections.flatMap((section) => [
    { id: `section:${section.id}`, text: section.title, sourceIds: [...new Set(section.paragraphs.flatMap((paragraph) => paragraph.sourceIds))], compactLabel: true as const },
    ...section.paragraphs.map((paragraph) => ({ id: `paragraph:${paragraph.id}`, text: paragraph.text, sourceIds: paragraph.sourceIds }))
  ]);
  return [
    { id: "story:title", text: draft.story.title, sourceIds: draft.sourceIds, compactLabel: true },
    { id: "story:dek", text: draft.story.dek, sourceIds: draft.sourceIds },
    ...sectionFields,
    ...draft.timeline.map((entry) => ({ id: `timeline:${entry.id}`, text: entry.text, sourceIds: entry.sourceIds })),
    ...draft.statements.flatMap((statement) => [
      { id: `statement:${statement.id}:text`, text: statement.text, sourceIds: statement.sourceIds },
      { id: `statement:${statement.id}:scope`, text: statement.sourceScope, sourceIds: statement.sourceIds },
      { id: `statement:${statement.id}:limits`, text: statement.limits, sourceIds: statement.sourceIds }
    ]),
    ...draft.perspectives.flatMap((perspective) => [perspective.rationale, perspective.sees, perspective.values, perspective.uses, perspective.mayMiss].map((text, index) => ({ id: `perspective:${perspective.id}:${index}`, text, sourceIds: perspective.sourceIds }))),
    ...draft.people.map((person) => ({ id: `association:${person.id}`, text: `${person.label} ${person.association}`, sourceIds: person.sourceIds })),
    ...draft.unresolved.flatMap((question) => [
      { id: `unresolved:${question.id}:question`, text: question.question, sourceIds: question.sourceIds },
      { id: `unresolved:${question.id}:need`, text: question.whatWouldHelp, sourceIds: question.sourceIds }
    ]),
    { id: "context-bridge:question", text: draft.contextBridge.question, sourceIds: draft.sourceIds },
    { id: "context-bridge:connection", text: draft.contextBridge.connection, sourceIds: draft.sourceIds },
    { id: "authored-visual:title", text: draft.authoredVisual.title, sourceIds: draft.authoredVisual.sourceIds },
    { id: "authored-visual:description", text: draft.authoredVisual.description, sourceIds: draft.authoredVisual.sourceIds },
    { id: "authored-visual:limitation", text: draft.authoredVisual.limitation, sourceIds: draft.authoredVisual.sourceIds },
    { id: "reframe", text: draft.story.reframe.value, sourceIds: draft.sourceIds }
  ];
}

function closeCopyMatches(draft: GeneratedStoryV2, sourceDossier: SourceDossierRecord[]) {
  const sourceById = new Map(sourceDossier.map((source) => [source.id, source]));
  return visibleDraftFields(draft).flatMap((field) => field.sourceIds.flatMap((sourceId) => {
    const source = sourceById.get(sourceId);
    const visibleText = field.compactLabel ? withoutOpeningEntityOrOffice(field.text) : field.text;
    const runSize = field.compactLabel ? 6 : 7;
    const match = source ? sharedRun(visibleText, source.evidenceText, runSize) : null;
    return match ? [{ fieldId: field.id, sourceId, currentText: field.text, ...match }] : [];
  }));
}

/**
 * The reportable form. Carries only a truncated hash of the overlap, so a finding can be
 * logged or written to a report without ever recording the wording itself.
 */
export function findCloseCopyMatches(draft: GeneratedStoryV2, sourceDossier: SourceDossierRecord[]) {
  return closeCopyMatches(draft, sourceDossier).map(({ fieldId, sourceId, tokenCount, matchHash }) => ({ fieldId, sourceId, tokenCount, matchHash }));
}

/**
 * The repair form. Includes the overlapping wording and the field's current text so a narrow
 * rewrite request can name exactly what to avoid. For building one in-memory prompt only:
 * never log it, never write it to disk, never return it to a caller that might.
 */
export function findCloseCopySpansForRepair(draft: GeneratedStoryV2, sourceDossier: SourceDossierRecord[]) {
  return closeCopyMatches(draft, sourceDossier);
}

function normaliseBindingText(text: string) {
  return text.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function sameIds(left: readonly string[], right: readonly string[]) {
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.length === sortedRight.length && sortedLeft.every((value, index) => value === sortedRight[index]);
}

function timeGroundedInSources(time: z.infer<typeof flexibleTimeSchema>, sourceIds: readonly string[], sourceById: Map<string, SourceDossierRecord>) {
  if (time.kind === "unknown") return true;
  const evidence = sourceIds.map((sourceId) => sourceById.get(sourceId)?.evidenceText ?? "").join(" ").toLocaleLowerCase("en-IN").normalize("NFKC").replace(/[^\p{L}\p{N}-]+/gu, " ");
  if (evidence.includes(time.value)) return true;
  const [year, month, day] = time.value.split("-");
  const monthName = new Intl.DateTimeFormat("en-IN", { month: "long", timeZone: "UTC" }).format(new Date(`${year}-${month}-${day}T00:00:00.000Z`)).toLocaleLowerCase("en-IN");
  const plainDay = String(Number(day));
  return evidence.includes(`${plainDay} ${monthName} ${year}`) || evidence.includes(`${monthName} ${plainDay} ${year}`);
}

export type StoryDraftExpectedBinding = {
  sourcePackId: string;
  language: "en-IN" | "hi-IN";
  mode: "news" | "timeless";
  format: z.infer<typeof storyFormatSchema>;
  indiaConnection: string;
  selectedExactTime?: SelectedExactTime | null;
};

export function parseGeneratedStoryV2(value: unknown, sourceDossier: SourceDossierRecord[], expected?: StoryDraftExpectedBinding): GeneratedStoryV2 {
  const approved = validateApprovedSourceDossier(sourceDossier);
  const draft = generatedStoryV2ResponseSchema.parse(value);
  if (!sameIds(draft.sourceIds, approved.map((source) => source.id))) throw new Error("Generated story is not bound to the exact source dossier.");
  if (expected) {
    if (draft.sourcePackId !== expected.sourcePackId) throw new Error("Generated story source pack does not match the requested source pack.");
    if (draft.language !== expected.language) throw new Error("Generated story language does not match the requested language.");
    if (draft.story.mode !== expected.mode) throw new Error("Generated story mode does not match the requested mode.");
    if (draft.format !== expected.format) throw new Error("Generated story format does not match the requested format.");
    if (normaliseBindingText(draft.story.indiaConnection) !== normaliseBindingText(expected.indiaConnection)) throw new Error("Generated story India connection does not match the requested India connection.");
    const selectedExactTime = expected.selectedExactTime;
    if (selectedExactTime !== undefined) {
      const times = [draft.story.eventTime, ...draft.timeline.map((entry) => entry.time)];
      const invalidExactTime = times.find((time) => time.kind === "exact_date" && (
        selectedExactTime === null ||
        time.value !== selectedExactTime.value ||
        time.label !== selectedExactTime.label
      ));
      if (invalidExactTime) throw new Error("Generated exact time was not the preselected evidence pair; unattended generation must use unknown.");
    }
  }
  const knownSourceIds = new Set(approved.map((source) => source.id));
  const unknownSourceId = allReferencedSourceIds(draft).find((sourceId) => !knownSourceIds.has(sourceId));
  if (unknownSourceId) throw new Error(`Generated story cited ${unknownSourceId}, which is not in the supplied dossier.`);
  const sourceById = new Map<string, SourceDossierRecord>(approved.map((source) => [source.id, source]));
  if (!timeGroundedInSources(draft.story.eventTime, draft.story.eventTimeEvidence.sourceIds, sourceById)) throw new Error("Generated story event date is not grounded in cited source evidence.");
  for (const entry of draft.timeline) if (!timeGroundedInSources(entry.time, entry.sourceIds, sourceById)) throw new Error(`Timeline time ${entry.id} is not grounded in cited source evidence.`);
  const copy = findCloseCopyMatches(draft, approved)[0];
  if (copy) throw new Error(`Visible field ${copy.fieldId} closely copies a ${copy.tokenCount}-token source span instead of synthesising it (fingerprint ${copy.matchHash.slice(0, 12)}).`);
  return draft;
}

export function parseGeneratedStoryV2Json(json: string, sourceDossier: SourceDossierRecord[], expected?: StoryDraftExpectedBinding): GeneratedStoryV2 {
  return parseGeneratedStoryV2(JSON.parse(json), sourceDossier, expected);
}

export type StoryDraftV2PromptInput = {
  sourcePackId: string;
  language: "en-IN" | "hi-IN";
  mode: "news" | "timeless";
  format: z.infer<typeof storyFormatSchema>;
  editorialBrief: string;
  indiaConnection: string;
  sourceRoles: Array<{ sourceId: string; role: string }>;
  missingVoices: string[];
  sourceDossier: SourceDossierRecord[];
  selectedExactTime?: SelectedExactTime;
};

export type SelectedExactTime = {
  value: string;
  label: string;
};

// v2.7 adds the bounded in-memory close-copy repair. The version is part of the durable
// input hash, so a pipeline change gives every pack a fresh identity to attempt.
export const STORY_DRAFT_PROMPT_VERSION = "syat.story-draft.v3.7";

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function closeSourceIdChoices(value: unknown, sourceIds: readonly string[]) {
  if (Array.isArray(value)) {
    value.forEach((item) => closeSourceIdChoices(item, sourceIds));
    return;
  }
  if (!isJsonObject(value)) return;
  const properties = value.properties;
  if (isJsonObject(properties) && isJsonObject(properties.sourceIds)) {
    const items = properties.sourceIds.items;
    properties.sourceIds.items = { ...(isJsonObject(items) ? items : {}), enum: [...sourceIds] };
  }
  Object.values(value).forEach((child) => closeSourceIdChoices(child, sourceIds));
}

function setJsonSchemaConst(schema: JsonObject, path: string[], value: string) {
  let current: unknown = schema;
  for (const segment of path) {
    if (!isJsonObject(current)) throw new Error("Story draft provider schema is missing an expected binding path.");
    current = current[segment];
  }
  if (!isJsonObject(current)) throw new Error("Story draft provider schema binding is not an object.");
  current.const = value;
  delete current.enum;
}

const monthNumbers = new Map([
  ["january", "01"], ["february", "02"], ["march", "03"], ["april", "04"],
  ["may", "05"], ["june", "06"], ["july", "07"], ["august", "08"],
  ["september", "09"], ["october", "10"], ["november", "11"], ["december", "12"]
]);

function extractExactEvidenceDates(sources: readonly ApprovedSourceDossierRecord[]) {
  const dates = new Set<string>();
  for (const source of sources) {
    for (const match of source.evidenceText.matchAll(/\b\d{4}-\d{2}-\d{2}\b/g)) {
      if (z.iso.date().safeParse(match[0]).success) dates.add(match[0]);
    }
    for (const match of source.evidenceText.matchAll(/\b([0-3]?\d)(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})\b/gi)) {
      const month = monthNumbers.get(match[2].toLocaleLowerCase("en-IN"));
      if (!month) continue;
      const date = `${match[3]}-${month}-${match[1].padStart(2, "0")}`;
      if (z.iso.date().safeParse(date).success) dates.add(date);
    }
  }
  return [...dates].sort();
}

function selectedExactEvidenceDates(selectedExactTime: SelectedExactTime | undefined, sources: readonly ApprovedSourceDossierRecord[]) {
  if (!selectedExactTime) return [];
  const parsedValue = z.iso.date().safeParse(selectedExactTime.value);
  if (!parsedValue.success || selectedExactTime.label !== canonicalExactDateLabel(selectedExactTime.value)) {
    throw new Error("Selected exact time must use a valid evidence date and its canonical label.");
  }
  if (!extractExactEvidenceDates(sources).includes(selectedExactTime.value)) {
    throw new Error("Selected exact time is not present in the approved source evidence.");
  }
  return [selectedExactTime.value];
}

function closeFlexibleTimeChoices(timeSchema: unknown, allowedDates: readonly string[]) {
  if (!isJsonObject(timeSchema) || !Array.isArray(timeSchema.oneOf)) throw new Error("Story draft provider schema is missing flexible time choices.");
  const exactDate = timeSchema.oneOf.find((option) => isJsonObject(option) && isJsonObject(option.properties) && isJsonObject(option.properties.kind) && option.properties.kind.const === "exact_date");
  const unknown = timeSchema.oneOf.find((option) => isJsonObject(option) && isJsonObject(option.properties) && isJsonObject(option.properties.kind) && option.properties.kind.const === "unknown");
  if (!isJsonObject(unknown) || !isJsonObject(unknown.properties) || !isJsonObject(unknown.properties.label)) throw new Error("Story draft provider schema is missing the unknown time choice.");
  unknown.properties.label.const = UNKNOWN_TIME_LABEL;
  delete unknown.properties.label.enum;
  if (allowedDates.length === 0) {
    timeSchema.oneOf = [unknown];
    return;
  }
  if (!isJsonObject(exactDate) || !isJsonObject(exactDate.properties)) throw new Error("Story draft provider schema is missing the exact-date value choice.");
  const exactDateProperties = exactDate.properties;
  if (!isJsonObject(exactDateProperties.value) || !isJsonObject(exactDateProperties.label)) throw new Error("Story draft provider schema is missing the exact-date value choice.");
  const exactDateValue = exactDateProperties.value;
  const exactDateLabel = exactDateProperties.label;
  const exactDateChoices = allowedDates.map((date) => {
    const value: JsonObject = { ...exactDateValue, const: date };
    const label: JsonObject = { ...exactDateLabel, const: canonicalExactDateLabel(date) };
    delete value.enum;
    delete label.enum;
    return { ...exactDate, properties: { ...exactDateProperties, value, label } };
  });
  timeSchema.oneOf = [...exactDateChoices, unknown];
}

export function buildStoryDraftProviderJsonSchema(input: StoryDraftV2PromptInput) {
  const approved = validateApprovedSourceDossier(input.sourceDossier);
  const sourceIds = approved.map((source) => source.id);
  const allowedDates = selectedExactEvidenceDates(input.selectedExactTime, approved);
  const schema = z.toJSONSchema(generatedStoryV2ResponseSchema);
  if (!isJsonObject(schema)) throw new Error("Story draft provider schema could not be constructed.");
  closeSourceIdChoices(schema, sourceIds);
  setJsonSchemaConst(schema, ["properties", "sourcePackId"], input.sourcePackId);
  setJsonSchemaConst(schema, ["properties", "language"], input.language);
  setJsonSchemaConst(schema, ["properties", "format"], input.format);
  setJsonSchemaConst(schema, ["properties", "story", "properties", "mode"], input.mode);
  setJsonSchemaConst(schema, ["properties", "story", "properties", "indiaConnection"], input.indiaConnection);
  const properties = schema.properties;
  if (!isJsonObject(properties) || !isJsonObject(properties.story) || !isJsonObject(properties.story.properties) || !isJsonObject(properties.timeline) || !isJsonObject(properties.timeline.items) || !isJsonObject(properties.timeline.items.properties)) {
    throw new Error("Story draft provider schema is missing expected time binding paths.");
  }
  closeFlexibleTimeChoices(properties.story.properties.eventTime, allowedDates);
  closeFlexibleTimeChoices(properties.timeline.items.properties.time, allowedDates);
  delete schema.$schema;
  return schema;
}

export function buildStoryDraftV2Prompt(input: StoryDraftV2PromptInput) {
  idSchema.parse(input.sourcePackId);
  const approved = validateApprovedSourceDossier(input.sourceDossier);
  const allowedDates = selectedExactEvidenceDates(input.selectedExactTime, approved);
  const allowedDateLabels = allowedDates.map((date) => `${date} -> ${canonicalExactDateLabel(date)}`);
  const knownIds = new Set(approved.map((source) => source.id));
  if (input.sourceRoles.length < 1 || input.sourceRoles.some((record) => !knownIds.has(record.sourceId) || record.role.trim().length < 8)) {
    throw new Error("Source roles must explain the role of a source in the approved dossier.");
  }
  if (input.missingVoices.length < 1 || input.missingVoices.some((voice) => voice.trim().length < 4)) {
    throw new Error("The prompt must name at least one missing voice or evidence need.");
  }

  const editorialRules = [
    "Use only the supplied dossier; do not use remembered facts.",
    "Do not quote or closely copy source wording.",
    "Write the title and dek with fresh sentence structure.",
    "Outside exact proper names and necessary technical labels, do not reuse any six-token source span in the title or any seven-token source span in the dek.",
    "Exact proper names and necessary technical labels may repeat only as terms; the surrounding grammar must be new.",
    "Begin with the concrete change, not a generic announcement phrase.",
    "Name official claims as claims and keep interpretation visibly separate.",
    "Include a standpoint only when a source explains why it belongs.",
    "Do not manufacture a second side or a personal reaction.",
    "Every source in the dossier must ground at least one statement. A source you cite but never use is a failure.",
    "When two records describe the same subject differently, say so plainly and attribute each account to the record that makes it. Do not average them into one voice and do not decide which is right.",
    "An audit and the institution it audits are not the same voice. Keep the audit's finding and the institution's own account clearly apart.",
    "Do not open with the document's own framing, such as what a report relates to or contains. Open with the specific thing the record shows about a place, a service or a sum of money.",
    "Vary the opening. Do not begin with the institution's name or the document type.",
    "A statement's limit must say something its source scope does not. Repeating the scope in other words is not a limit."
  ];

  return `You are an editorial research assistant for Syāt. Prepare a cautious, source-scoped draft for a human editor. Return exactly one JSON object and nothing else.

Prompt version: ${STORY_DRAFT_PROMPT_VERSION}

Contract:
${JSON.stringify(buildStoryDraftProviderJsonSchema(input), null, 2)}

Editorial rules:
${editorialRules.map((rule) => `- ${rule}`).join("\n")}
- Do not invent a person, quote, date, cause, reaction, result, or consensus.
- Give every statement its evidence basis, exact source scope, and limit.
- Use statement IDs exactly claim-1 through claim-N in statements array order, with no gaps, aliases, or descriptive IDs.
- Final internal reference-set check: make a set from statements[].id, then verify every claimIds value in body paragraphs, timeline, eventTimeEvidence, authoredVisual, and mediaPlan belongs to that set. Return nothing until no reference is missing.
- Copy sourcePackId exactly as "${input.sourcePackId}" and sourceIds exactly as ${JSON.stringify(approved.map((source) => source.id))}.
- Give eventTime and every timeline entry explicit claimIds and sourceIds. Use an exact date only when the input preselected its evidence-backed value and canonical label; otherwise use unknown. Free-form periods are not allowed in this pilot.
- ${allowedDates.length === 0 ? `Allowed exact dates and labels: none. Use unknown for eventTime and every timeline time with label exactly "${UNKNOWN_TIME_LABEL}".` : `Allowed exact dates and labels: ${allowedDateLabels.join(", ")}. Use unknown for every other eventTime and timeline time with label exactly "${UNKNOWN_TIME_LABEL}".`}
- Vary sentence length and section shape. Prefer concrete nouns and active verbs.
- Set contractVersion to "syat.story-draft.v2" and editorialStatus to "needs_editorial_review".
- Return three to six titled body sections and one source-led authored visual specification.
- mediaPlan is a request for later human rights review. It never means an asset is cleared.
- Never include a publication field or claim approval.

Rejected generic openings include: "In a significant development...", "In a major move...", and "In today's rapidly evolving landscape...".

Language: ${input.language}
Mode: ${input.mode}
Format: ${input.format}
Source pack: ${input.sourcePackId}
Allowed Context Bridge topicSlug choices: ${timelessTopics.map((topic) => topic.slug).join(", ")}
Editorial brief: ${input.editorialBrief}
India connection: ${input.indiaConnection}
Source roles: ${JSON.stringify(input.sourceRoles)}
Missing voices or evidence: ${JSON.stringify(input.missingVoices)}
Source dossier: ${JSON.stringify(approved)}`;
}
