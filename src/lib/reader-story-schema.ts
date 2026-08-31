import { z } from "zod";

import { getTimelessTopic } from "./timeless-topics";

const readerIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
const sourceIdListSchema = z.array(readerIdSchema).min(1).max(12);
const claimIdListSchema = z.array(readerIdSchema).min(1).max(16);
const statementBasisSchema = z.enum(["direct_record", "official_claim", "reported_observation", "interpretation", "missing_voice", "evidence_gap"]);

export const readerTimeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("exact_date"), value: z.iso.date(), label: z.string().min(3).max(80) }).strict(),
  z.object({ kind: z.literal("period"), value: z.string().min(3).max(120), label: z.string().min(3).max(120) }).strict(),
  z.object({ kind: z.literal("unknown"), label: z.string().min(3).max(120) }).strict()
]);

const statementBaseSchema = z.object({
  id: readerIdSchema,
  text: z.string().min(12).max(500),
  sourceIds: sourceIdListSchema,
  basis: statementBasisSchema,
  sourceScope: z.string().min(12).max(300)
});

export const readerStatementSchema = z.discriminatedUnion("type", [
  statementBaseSchema.extend({ type: z.literal("documented"), limits: z.string().min(12).max(300) }).strict(),
  statementBaseSchema.extend({ type: z.literal("interpreted"), limits: z.string().min(12).max(300) }).strict(),
  statementBaseSchema.extend({ type: z.literal("experienced"), limits: z.string().min(12).max(300) }).strict(),
  statementBaseSchema.extend({ type: z.literal("valued"), limits: z.string().min(12).max(300) }).strict(),
  statementBaseSchema.extend({ type: z.literal("unresolved"), limits: z.string().min(12).max(300) }).strict()
]);

const readerSectionMarkerSchema = z.object({ id: readerIdSchema, title: z.string().min(4).max(100) }).strict();

export const readerContentBlockSchema = z.discriminatedUnion("kind", [
  z.object({
    id: readerIdSchema,
    kind: z.literal("paragraph"),
    text: z.string().min(12).max(1600),
    section: readerSectionMarkerSchema.optional(),
    claimIds: claimIdListSchema,
    sourceIds: sourceIdListSchema
  }).strict(),
  z.object({
    id: readerIdSchema,
    kind: z.literal("media"),
    mediaId: readerIdSchema,
    claimIds: claimIdListSchema,
    sourceIds: sourceIdListSchema
  }).strict()
]);

export const readerTimelineEntrySchema = z.object({
  id: readerIdSchema,
  time: readerTimeSchema,
  text: z.string().min(12).max(500),
  claimIds: claimIdListSchema,
  sourceIds: sourceIdListSchema
}).strict();

export const readerPerspectiveSchema = z.object({
  id: readerIdSchema,
  label: z.string().min(2).max(90),
  rationale: z.string().min(12).max(320),
  sees: z.string().min(12).max(320),
  values: z.string().min(12).max(320),
  uses: z.string().min(12).max(320),
  mayMiss: z.string().min(12).max(320),
  sourceIds: sourceIdListSchema
}).strict();

export const readerAssociationSchema = z.object({
  id: readerIdSchema,
  kind: z.enum(["person", "institution", "community", "unknown_unverified"]),
  label: z.string().min(2).max(160),
  association: z.string().min(12).max(320),
  sourceIds: sourceIdListSchema
}).strict();

export const readerQuestionSchema = z.object({
  id: readerIdSchema,
  question: z.string().min(12).max(300),
  whatWouldHelp: z.string().min(12).max(300),
  sourceIds: sourceIdListSchema
}).strict();

export const readerSourceSchema = z.object({
  id: readerIdSchema,
  publisher: z.string().min(1).max(160),
  title: z.string().min(1).max(320),
  url: z.url(),
  sourceKind: z.enum(["primary_document", "official_statement", "reputable_reporting", "research", "archive", "social_embed"]),
  publishedAt: z.iso.datetime(),
  accessedAt: z.iso.datetime(),
  use: z.string().min(12).max(300),
  scope: z.string().min(12).max(300),
  rightsBasis: z.enum(["link_only", "owned", "public_domain", "cc0", "cc_by", "cc_by_sa", "government_reproduction_policy", "government_open_data", "official_embed", "commercial_license"]),
  reviewStatus: z.literal("approved"),
  linkAllowed: z.boolean(),
  modelInputAllowed: z.boolean(),
  mediaReuseAllowed: z.boolean()
}).strict();

export const readerMediaRightsProofSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("licence_url"), url: z.url(), note: z.string().min(12).max(300) }).strict(),
  z.object({ kind: z.literal("documented_record"), recordId: readerIdSchema, note: z.string().min(12).max(300) }).strict()
]);

export const readerMediaSchema = z.object({
  id: readerIdSchema,
  planId: readerIdSchema.optional(),
  kind: z.enum(["photo", "illustration", "chart", "video", "audio", "embed"]),
  label: z.string().min(3).max(160),
  alt: z.string().min(12).max(320),
  caption: z.string().min(12).max(500),
  creator: z.string().min(2).max(160),
  creditLine: z.string().min(2).max(240),
  sourceUrl: z.url(),
  rightsBasis: z.enum(["owned", "public_domain", "cc0", "cc_by", "cc_by_sa", "government_open_data", "official_embed", "commercial_license"]),
  reviewStatus: z.literal("approved"),
  reviewedAt: z.iso.datetime(),
  rightsProof: readerMediaRightsProofSchema,
  limitation: z.string().min(12).max(320),
  claimIds: claimIdListSchema,
  sourceIds: sourceIdListSchema
}).strict();

export const readerAuthoredVisualSchema = z.object({
  mediaId: readerIdSchema,
  kind: z.enum(["timeline", "process", "relationship_map", "source_role_map", "number_stack", "comparison"]),
  title: z.string().min(4).max(120),
  description: z.string().min(20).max(500),
  limitation: z.string().min(12).max(320),
  claimIds: claimIdListSchema,
  sourceIds: sourceIdListSchema
}).strict();

const readerEvidencePathSchema = z.object({ claimIds: claimIdListSchema, sourceIds: sourceIdListSchema }).strict();

export const linkOnlySourceSchema = z.object({
  id: readerIdSchema,
  publisher: z.string().min(1).max(160),
  title: z.string().min(1).max(320),
  url: z.url(),
  publishedAt: z.iso.datetime(),
  use: z.string().min(12).max(300),
  linkAllowed: z.literal(true),
  modelInputAllowed: z.literal(false),
  mediaReuseAllowed: z.literal(false)
}).strict();

export const readerContextBridgeSchema = z.object({
  topicSlug: readerIdSchema,
  question: z.string().min(12).max(300),
  connection: z.string().min(12).max(500)
}).strict();

export const readerReframeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("claim"), value: z.string().min(12).max(320) }).strict(),
  z.object({ kind: z.literal("question"), value: z.string().min(12).max(320) }).strict()
]);

export const readerGenerationSchema = z.object({
  model: z.string().min(1).max(160),
  promptVersion: z.string().min(1).max(120),
  inputHash: z.string().regex(/^[a-f0-9]{64}$/),
  generatedBy: z.enum(["openrouter", "human_assisted"]),
  reviewedAt: z.iso.datetime()
}).strict();

const qualityScoreSchema = z.number().int().min(1).max(5);

export const readerQualitySchema = z.object({
  status: z.literal("passed"),
  blockers: z.array(z.string().min(1).max(300)).max(20),
  warnings: z.array(z.string().min(1).max(300)).max(20),
  scores: z.object({
    clarity: qualityScoreSchema,
    usefulness: qualityScoreSchema,
    evidenceDiscipline: qualityScoreSchema,
    indiaRelevance: qualityScoreSchema,
    humanVoice: qualityScoreSchema,
    perspectiveQuality: qualityScoreSchema,
    sourceTransparency: qualityScoreSchema
  }).strict()
}).strict().superRefine((quality, ctx) => {
  if (quality.blockers.length > 0) {
    ctx.addIssue({ code: "custom", message: "A passed quality review cannot contain blockers.", path: ["blockers"] });
  }
});

function addUnknownReferenceIssue(ctx: z.RefinementCtx, path: PropertyKey[], reference: string, value: string) {
  ctx.addIssue({
    code: "custom",
    message: `${reference} ${value} is not defined by this reader story.`,
    path
  });
}

function assertUniqueIds(ctx: z.RefinementCtx, values: Array<{ id: string }>, recordName: string, path: PropertyKey[]) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value.id)) {
      ctx.addIssue({ code: "custom", message: `${recordName} id ${value.id} is repeated.`, path });
    }
    seen.add(value.id);
  }
}

export function assertReaderReferences(story: z.infer<typeof readerStorySchemaShape>, ctx: z.RefinementCtx) {
  const sourceIds = new Set(story.sources.map((source) => source.id));
  const claimIds = new Set(story.statements.map((statement) => statement.id));
  const claimsById = new Map(story.statements.map((statement) => [statement.id, statement]));
  const mediaIds = new Set(story.media.map((media) => media.id));

  assertUniqueIds(ctx, story.body, "Content block", ["body"]);
  assertUniqueIds(ctx, story.statements, "Statement", ["statements"]);
  assertUniqueIds(ctx, story.timeline, "Timeline entry", ["timeline"]);
  assertUniqueIds(ctx, story.perspectives, "Perspective", ["perspectives"]);
  assertUniqueIds(ctx, story.people, "Association", ["people"]);
  assertUniqueIds(ctx, story.unresolved, "Unresolved question", ["unresolved"]);
  assertUniqueIds(ctx, story.sources, "Source", ["sources"]);
  assertUniqueIds(ctx, story.media, "Media", ["media"]);
  assertUniqueIds(ctx, story.relatedCoverage, "Related coverage", ["relatedCoverage"]);

  const checkSources = (ids: readonly string[], path: PropertyKey[]) => {
    for (const sourceId of ids) {
      if (!sourceIds.has(sourceId)) addUnknownReferenceIssue(ctx, path, "Source", sourceId);
    }
  };

  const checkClaimSupport = (referencedClaimIds: readonly string[], referencedSourceIds: readonly string[], path: PropertyKey[]) => {
    const usedSources = new Set<string>();
    for (const claimId of referencedClaimIds) {
      const claim = claimsById.get(claimId);
      if (!claim) continue;
      const supportingSources = claim.sourceIds.filter((sourceId) => referencedSourceIds.includes(sourceId));
      if (supportingSources.length === 0) {
        ctx.addIssue({ code: "custom", message: `The cited sources do not support claim ${claimId}.`, path });
      }
      supportingSources.forEach((sourceId) => usedSources.add(sourceId));
    }
    for (const sourceId of referencedSourceIds) {
      if (!usedSources.has(sourceId)) ctx.addIssue({ code: "custom", message: `Source ${sourceId} does not support any cited claim.`, path });
    }
  };

  for (const [index, block] of story.body.entries()) {
    if (block.kind === "paragraph" || block.kind === "media") {
      checkSources(block.sourceIds, ["body", index, "sourceIds"]);
      for (const claimId of block.claimIds) {
        if (!claimIds.has(claimId)) addUnknownReferenceIssue(ctx, ["body", index, "claimIds"], "Claim", claimId);
      }
      checkClaimSupport(block.claimIds, block.sourceIds, ["body", index]);
    }

    if (block.kind === "media" && !mediaIds.has(block.mediaId)) {
      addUnknownReferenceIssue(ctx, ["body", index, "mediaId"], "Media", block.mediaId);
    }
  }

  for (const [index, statement] of story.statements.entries()) checkSources(statement.sourceIds, ["statements", index, "sourceIds"]);
  for (const [index, entry] of story.timeline.entries()) {
    checkSources(entry.sourceIds, ["timeline", index, "sourceIds"]);
    for (const claimId of entry.claimIds) if (!claimIds.has(claimId)) addUnknownReferenceIssue(ctx, ["timeline", index, "claimIds"], "Claim", claimId);
    checkClaimSupport(entry.claimIds, entry.sourceIds, ["timeline", index]);
  }
  for (const [index, perspective] of story.perspectives.entries()) checkSources(perspective.sourceIds, ["perspectives", index, "sourceIds"]);
  for (const [index, person] of story.people.entries()) checkSources(person.sourceIds, ["people", index, "sourceIds"]);
  for (const [index, question] of story.unresolved.entries()) checkSources(question.sourceIds, ["unresolved", index, "sourceIds"]);
  for (const [index, media] of story.media.entries()) {
    checkSources(media.sourceIds, ["media", index, "sourceIds"]);
    for (const claimId of media.claimIds) if (!claimIds.has(claimId)) addUnknownReferenceIssue(ctx, ["media", index, "claimIds"], "Claim", claimId);
    checkClaimSupport(media.claimIds, media.sourceIds, ["media", index]);
  }

  checkSources(story.eventTimeEvidence.sourceIds, ["eventTimeEvidence", "sourceIds"]);
  for (const claimId of story.eventTimeEvidence.claimIds) if (!claimIds.has(claimId)) addUnknownReferenceIssue(ctx, ["eventTimeEvidence", "claimIds"], "Claim", claimId);
  checkClaimSupport(story.eventTimeEvidence.claimIds, story.eventTimeEvidence.sourceIds, ["eventTimeEvidence"]);

  checkSources(story.authoredVisual.sourceIds, ["authoredVisual", "sourceIds"]);
  for (const claimId of story.authoredVisual.claimIds) if (!claimIds.has(claimId)) addUnknownReferenceIssue(ctx, ["authoredVisual", "claimIds"], "Claim", claimId);
  checkClaimSupport(story.authoredVisual.claimIds, story.authoredVisual.sourceIds, ["authoredVisual"]);
  const authoredMedia = story.media.find((media) => media.id === story.authoredVisual.mediaId);
  if (!authoredMedia) {
    addUnknownReferenceIssue(ctx, ["authoredVisual", "mediaId"], "Media", story.authoredVisual.mediaId);
  } else {
    const expectedKind = story.authoredVisual.kind === "relationship_map" ? "illustration" : "chart";
    if (authoredMedia.creator !== "Syāt visual desk" || authoredMedia.label !== story.authoredVisual.title || authoredMedia.kind !== expectedKind) {
      ctx.addIssue({ code: "custom", message: "The authored visual does not match its approved Syāt media record.", path: ["authoredVisual"] });
    }
    const sameSources = authoredMedia.sourceIds.length === story.authoredVisual.sourceIds.length && authoredMedia.sourceIds.every((sourceId) => story.authoredVisual.sourceIds.includes(sourceId));
    if (!sameSources) ctx.addIssue({ code: "custom", message: "The authored visual and approved media record must use the same sources.", path: ["authoredVisual", "sourceIds"] });
    const sameClaims = authoredMedia.claimIds.length === story.authoredVisual.claimIds.length && authoredMedia.claimIds.every((claimId) => story.authoredVisual.claimIds.includes(claimId));
    if (!sameClaims) ctx.addIssue({ code: "custom", message: "The authored visual and approved media record must use the same claims.", path: ["authoredVisual", "claimIds"] });
  }

  if (!getTimelessTopic(story.contextBridge.topicSlug)) {
    addUnknownReferenceIssue(ctx, ["contextBridge", "topicSlug"], "Timeless topic", story.contextBridge.topicSlug);
  }
}

const readerStorySchemaShape = z.object({
  contractVersion: z.literal("syat.reader-story.v1"),
  id: readerIdSchema,
  slug: readerIdSchema,
  mode: z.literal("news"),
  locale: z.literal("en-IN"),
  status: z.literal("private_preview"),
  publicationAllowed: z.literal(false),
  disclosure: z.literal("AI-assisted private preview"),
  format: z.enum(["news_brief", "explainer", "timeline", "source_map", "public_impact"]),
  title: z.string().min(12).max(160),
  dek: z.string().min(20).max(320),
  theme: z.string().min(2).max(120),
  indiaConnection: z.string().min(12).max(500),
  eventTime: readerTimeSchema,
  eventTimeEvidence: readerEvidencePathSchema,
  collectedAt: z.iso.datetime(),
  generatedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  readingMinutes: z.number().int().min(1).max(30),
  body: z.array(readerContentBlockSchema).min(3).max(18),
  statements: z.array(readerStatementSchema).min(1).max(32),
  timeline: z.array(readerTimelineEntrySchema).max(18),
  perspectives: z.array(readerPerspectiveSchema).max(8),
  people: z.array(readerAssociationSchema).max(16),
  unresolved: z.array(readerQuestionSchema).max(12),
  contextBridge: readerContextBridgeSchema,
  sources: z.array(readerSourceSchema).min(1).max(12),
  media: z.array(readerMediaSchema).max(12),
  authoredVisual: readerAuthoredVisualSchema,
  relatedCoverage: z.array(linkOnlySourceSchema).max(12),
  reframe: readerReframeSchema,
  generation: readerGenerationSchema,
  quality: readerQualitySchema,
  publication: z.object({ approvedByHuman: z.literal(false), finalReporting: z.literal(false) }).strict()
}).strict();

export const readerStorySchema = readerStorySchemaShape.superRefine(assertReaderReferences);

export const readerStoryIndexItemSchema = z.object({
  slug: readerIdSchema,
  format: z.enum(["news_brief", "explainer", "timeline", "source_map", "public_impact"]),
  title: z.string().min(12).max(160),
  dek: z.string().min(20).max(320),
  theme: z.string().min(2).max(120),
  eventTime: readerTimeSchema,
  updatedAt: z.iso.datetime(),
  readingMinutes: z.number().int().min(1).max(30),
  featured: z.boolean()
}).strict();

export type ReaderStory = z.infer<typeof readerStorySchema>;
export type ReaderStoryIndexItem = z.infer<typeof readerStoryIndexItemSchema>;
