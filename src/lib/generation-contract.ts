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
  sourceIds: sourceIdsSchema
}).strict();

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

  const claimIds = new Set(draft.statements.map((statement) => statement.id));
  for (const [sectionIndex, section] of draft.bodySections.entries()) {
    for (const [paragraphIndex, paragraph] of section.paragraphs.entries()) {
      for (const claimId of paragraph.claimIds) {
        if (!claimIds.has(claimId)) addReferenceIssue(ctx, ["bodySections", sectionIndex, "paragraphs", paragraphIndex, "claimIds"], `Paragraph references unknown claim ${claimId}.`);
      }
    }
  }
  for (const claimId of draft.authoredVisual.claimIds) {
    if (!claimIds.has(claimId)) addReferenceIssue(ctx, ["authoredVisual", "claimIds"], `Authored visual references unknown claim ${claimId}.`);
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
    ...draft.authoredVisual.sourceIds,
    ...draft.mediaPlan.flatMap((media) => media.sourceIds)
  ];
}

function textNgrams(text: string, size = 6) {
  const tokens = text.toLocaleLowerCase("en-IN").normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? [];
  const grams = new Set<string>();
  for (let index = 0; index <= tokens.length - size; index += 1) grams.add(tokens.slice(index, index + size).join(" "));
  return grams;
}

function closelyCopiesSource(text: string, evidenceText: string) {
  const textGrams = textNgrams(text);
  const evidenceGrams = textNgrams(evidenceText);
  if (textGrams.size < 2 || evidenceGrams.size < 2) return false;
  let overlap = 0;
  for (const gram of textGrams) if (evidenceGrams.has(gram)) overlap += 1;
  return overlap / Math.min(textGrams.size, evidenceGrams.size) >= 0.72;
}

export function parseGeneratedStoryV2(value: unknown, sourceDossier: SourceDossierRecord[]): GeneratedStoryV2 {
  const approved = validateApprovedSourceDossier(sourceDossier);
  const draft = generatedStoryV2ResponseSchema.parse(value);
  const knownSourceIds = new Set(approved.map((source) => source.id));
  const unknownSourceId = allReferencedSourceIds(draft).find((sourceId) => !knownSourceIds.has(sourceId));
  if (unknownSourceId) throw new Error(`Generated story cited ${unknownSourceId}, which is not in the supplied dossier.`);
  const sourceById = new Map(approved.map((source) => [source.id, source]));
  for (const paragraph of draft.bodySections.flatMap((section) => section.paragraphs)) {
    for (const sourceId of paragraph.sourceIds) {
      const source = sourceById.get(sourceId);
      if (source && closelyCopiesSource(paragraph.text, source.evidenceText)) {
        throw new Error(`Paragraph ${paragraph.id} closely copies source wording instead of synthesising it.`);
      }
    }
  }
  return draft;
}

export function parseGeneratedStoryV2Json(json: string, sourceDossier: SourceDossierRecord[]): GeneratedStoryV2 {
  return parseGeneratedStoryV2(JSON.parse(json), sourceDossier);
}

export type StoryDraftV2PromptInput = {
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
- Vary sentence length and section shape. Prefer concrete nouns and active verbs.
- Set contractVersion to "syat.story-draft.v2" and editorialStatus to "needs_editorial_review".
- Return three to six titled body sections and one source-led authored visual specification.
- mediaPlan is a request for later human rights review. It never means an asset is cleared.
- Never include a publication field or claim approval.

Rejected generic openings include: "In a significant development...", "In a major move...", and "In today's rapidly evolving landscape...".

Language: ${input.language}
Mode: ${input.mode}
Format: ${input.format}
Editorial brief: ${input.editorialBrief}
India connection: ${input.indiaConnection}
Source roles: ${JSON.stringify(input.sourceRoles)}
Missing voices or evidence: ${JSON.stringify(input.missingVoices)}
Source dossier: ${JSON.stringify(approved)}`;
}
