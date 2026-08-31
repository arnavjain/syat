import { z } from "zod";

import { sourcePackSourceSchema, type SourcePackSource } from "./source-pack";
import { canEnterModelInput } from "./source-rights";
import { getTimelessTopic } from "./timeless-topics";

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
const sourceIdsSchema = z.array(idSchema).min(1).max(12);
const claimIdsSchema = z.array(idSchema).min(1).max(16);
const storyFormatSchema = z.enum(["news_brief", "explainer", "timeline", "source_map", "public_impact"]);
const statementTypeSchema = z.enum(["documented", "interpreted", "experienced", "valued", "unresolved"]);
const statementBasisSchema = z.enum(["direct_record", "official_claim", "reported_observation", "interpretation", "missing_voice", "evidence_gap"]);

const flexibleTimeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("exact_date"), value: z.iso.date(), label: z.string().trim().min(3).max(80) }).strict(),
  z.object({ kind: z.literal("period"), value: z.string().trim().min(3).max(120), label: z.string().trim().min(3).max(120) }).strict(),
  z.object({ kind: z.literal("unknown"), label: z.string().trim().min(3).max(120) }).strict()
]);

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
  id: idSchema,
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
  kind: z.enum(["photo", "illustration", "chart", "video", "audio", "embed"]),
  placement: z.enum(["hero", "inline", "source_trail", "embed"]),
  purpose: z.string().trim().min(12).max(320),
  alt: z.string().trim().min(12).max(240),
  rightsRequirement: z.enum(["owned", "public_domain", "cc0", "cc_by", "cc_by_sa", "government_open_data", "official_embed", "commercial_license", "explicit_licence"]),
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
    topicSlug: idSchema,
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
  return text.toLocaleLowerCase("en-IN").normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? [];
}

const genericOfficialTokens = new Set(["a", "an", "and", "announced", "authority", "by", "for", "from", "government", "india", "indian", "ministry", "new", "of", "official", "policy", "programme", "public", "record", "scheme", "said", "says", "statement", "the", "to", "transport"]);

function distinctiveSharedRun(text: string, evidenceText: string, size = 7) {
  const visible = textTokens(text);
  const evidence = textTokens(evidenceText);
  if (visible.length < size || evidence.length < size) return false;
  const evidenceRuns = new Set<string>();
  for (let index = 0; index <= evidence.length - size; index += 1) evidenceRuns.add(evidence.slice(index, index + size).join(" "));
  for (let index = 0; index <= visible.length - size; index += 1) {
    const run = visible.slice(index, index + size);
    if (evidenceRuns.has(run.join(" ")) && run.filter((token) => !genericOfficialTokens.has(token)).length >= 4) return true;
  }
  return false;
}

type VisibleDraftField = { id: string; text: string; sourceIds: string[] };

function visibleDraftFields(draft: GeneratedStoryV2): VisibleDraftField[] {
  const sectionFields = draft.bodySections.flatMap((section) => [
    { id: `section:${section.id}`, text: section.title, sourceIds: [...new Set(section.paragraphs.flatMap((paragraph) => paragraph.sourceIds))] },
    ...section.paragraphs.map((paragraph) => ({ id: `paragraph:${paragraph.id}`, text: paragraph.text, sourceIds: paragraph.sourceIds }))
  ]);
  return [
    { id: "story:title", text: draft.story.title, sourceIds: draft.sourceIds },
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
    { id: "context-bridge", text: `${draft.contextBridge.question} ${draft.contextBridge.connection}`, sourceIds: draft.sourceIds },
    { id: "authored-visual", text: `${draft.authoredVisual.title} ${draft.authoredVisual.description} ${draft.authoredVisual.limitation}`, sourceIds: draft.authoredVisual.sourceIds },
    { id: "reframe", text: draft.story.reframe.value, sourceIds: draft.sourceIds }
  ];
}

export function findCloseCopyMatches(draft: GeneratedStoryV2, sourceDossier: SourceDossierRecord[]) {
  const sourceById = new Map(sourceDossier.map((source) => [source.id, source]));
  return visibleDraftFields(draft).flatMap((field) => field.sourceIds.flatMap((sourceId) => {
    const source = sourceById.get(sourceId);
    return source && distinctiveSharedRun(field.text, source.evidenceText) ? [{ fieldId: field.id, sourceId }] : [];
  }));
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
  if (time.kind === "period") {
    const value = time.value.toLocaleLowerCase("en-IN").normalize("NFKC");
    return evidence.includes(value);
  }
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
  }
  const knownSourceIds = new Set(approved.map((source) => source.id));
  const unknownSourceId = allReferencedSourceIds(draft).find((sourceId) => !knownSourceIds.has(sourceId));
  if (unknownSourceId) throw new Error(`Generated story cited ${unknownSourceId}, which is not in the supplied dossier.`);
  const sourceById = new Map<string, SourceDossierRecord>(approved.map((source) => [source.id, source]));
  if (!timeGroundedInSources(draft.story.eventTime, draft.story.eventTimeEvidence.sourceIds, sourceById)) throw new Error("Generated story event date or period is not grounded in cited source evidence.");
  for (const entry of draft.timeline) if (!timeGroundedInSources(entry.time, entry.sourceIds, sourceById)) throw new Error(`Timeline time ${entry.id} is not grounded in cited source evidence.`);
  const copy = findCloseCopyMatches(draft, approved)[0];
  if (copy) throw new Error(`Visible field ${copy.fieldId} closely copies source wording instead of synthesising it.`);
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
};

export function buildStoryDraftV2Prompt(input: StoryDraftV2PromptInput) {
  idSchema.parse(input.sourcePackId);
  const approved = validateApprovedSourceDossier(input.sourceDossier);
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
    "Begin with the concrete change, not a generic announcement phrase.",
    "Name official claims as claims and keep interpretation visibly separate.",
    "Include a standpoint only when a source explains why it belongs.",
    "Do not manufacture a second side or a personal reaction."
  ];

  return `You are an editorial research assistant for Syāt. Prepare a cautious, source-scoped draft for a human editor. Return exactly one JSON object and nothing else.

Contract:
${JSON.stringify(z.toJSONSchema(generatedStoryV2Shape), null, 2)}

Editorial rules:
${editorialRules.map((rule) => `- ${rule}`).join("\n")}
- Do not invent a person, quote, date, cause, reaction, result, or consensus.
- Give every statement its evidence basis, exact source scope, and limit.
- Copy sourcePackId exactly as "${input.sourcePackId}" and sourceIds exactly as ${JSON.stringify(approved.map((source) => source.id))}.
- Give eventTime and every timeline entry explicit claimIds and sourceIds. Use an exact date or period only when those sources contain it; otherwise use unknown.
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
Editorial brief: ${input.editorialBrief}
India connection: ${input.indiaConnection}
Source roles: ${JSON.stringify(input.sourceRoles)}
Missing voices or evidence: ${JSON.stringify(input.missingVoices)}
Source dossier: ${JSON.stringify(approved)}`;
}
