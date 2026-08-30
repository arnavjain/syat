import { z } from "zod";

import { contentBlockSchema, parseContentBlocks } from "./content-blocks";

const sourceIdList = z.array(z.string().min(1)).min(1).max(8);
const statementType = z.enum(["documented", "interpreted", "experienced", "valued", "unresolved"]);

const timelineEntrySchema = z
  .object({
    happenedAt: z.iso.date(),
    text: z.string().min(12).max(360),
    sourceIds: sourceIdList
  })
  .strict();

const statementSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/).max(64),
    type: statementType,
    text: z.string().min(12).max(500),
    sourceIds: sourceIdList,
    scope: z.string().min(12).max(300).optional()
  })
  .strict();

const perspectiveSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/).max(64),
    label: z.string().min(2).max(90),
    sees: z.string().min(12).max(320),
    values: z.string().min(12).max(320),
    uses: z.string().min(12).max(320),
    mayMiss: z.string().min(12).max(320),
    sourceIds: sourceIdList
  })
  .strict();

const unresolvedSchema = z
  .object({
    question: z.string().min(12).max(300),
    whatWouldHelp: z.string().min(12).max(300),
    sourceIds: sourceIdList
  })
  .strict();

const mediaPlanSchema = z
  .object({
    kind: z.enum(["photo", "illustration", "chart", "video", "audio", "embed"]),
    placement: z.enum(["hero", "inline", "source_trail", "embed"]),
    alt: z.string().min(12).max(240),
    rightsRequirement: z.enum(["owned", "public_domain", "cc0", "cc_by", "cc_by_sa", "government_open_data", "official_embed", "commercial_license"])
  })
  .strict();

export const generatedStoryResponseSchema = z
  .object({
    contractVersion: z.literal("syat.story-draft.v1"),
    language: z.enum(["en-IN", "hi-IN"]),
    editorialStatus: z.literal("needs_editorial_review"),
    story: z
      .object({
        mode: z.enum(["news", "timeless"]),
        title: z.string().min(12).max(160),
        dek: z.string().min(20).max(320),
        whatHappened: z.string().min(20).max(800),
        whatChanged: z.string().min(20).max(600),
        whyItMattersNow: z.string().min(20).max(600)
      })
      .strict(),
    timeline: z.array(timelineEntrySchema).min(1).max(12),
    statements: z.array(statementSchema).min(1).max(32),
    contentBlocks: z.array(contentBlockSchema).min(1).max(80),
    perspectives: z.array(perspectiveSchema).min(2).max(8),
    unresolved: z.array(unresolvedSchema).min(1).max(8),
    mediaPlan: z.array(mediaPlanSchema).max(8),
    modelNotes: z.array(z.string().min(5).max(300)).max(12)
  })
  .strict();

export type SourceDossierRecord = {
  sourceId: string;
  publisher: string;
  title: string;
  url: string;
  excerpt: string;
};

export type GeneratedStory = z.infer<typeof generatedStoryResponseSchema> & {
  status: "needs_editorial_review";
};

function assertKnownSources(story: z.infer<typeof generatedStoryResponseSchema>, sourceDossier: SourceDossierRecord[]) {
  const knownSourceIds = new Set(sourceDossier.map((source) => source.sourceId));
  const referencedSourceIds = [
    ...story.timeline.flatMap((entry) => entry.sourceIds),
    ...story.statements.flatMap((entry) => entry.sourceIds),
    ...story.perspectives.flatMap((entry) => entry.sourceIds),
    ...story.unresolved.flatMap((entry) => entry.sourceIds)
  ];

  const unsupportedSourceId = referencedSourceIds.find((sourceId) => !knownSourceIds.has(sourceId));
  if (unsupportedSourceId) {
    throw new Error(`Generated story cited ${unsupportedSourceId}, which is not in the supplied dossier.`);
  }

  parseContentBlocks(story.contentBlocks, {
    claimIds: story.statements.map((statement) => statement.id),
    sourceIds: sourceDossier.map((source) => source.sourceId)
  });
}

export function parseGeneratedStory(value: unknown, sourceDossier: SourceDossierRecord[]): GeneratedStory {
  const story = generatedStoryResponseSchema.parse(value);
  assertKnownSources(story, sourceDossier);

  return { ...story, status: "needs_editorial_review" };
}

export function parseGeneratedStoryJson(json: string, sourceDossier: SourceDossierRecord[]): GeneratedStory {
  return parseGeneratedStory(JSON.parse(json), sourceDossier);
}

export function buildStoryDraftPrompt(input: {
  language: "en-IN" | "hi-IN";
  mode: "news" | "timeless";
  editorialBrief: string;
  sourceDossier: SourceDossierRecord[];
}) {
  return `You are an editorial research assistant for Syāt. Your job is to prepare a cautious, source-linked draft for a human editor. You are not a publisher and must not invent facts, sources, quotes, dates, people, images, or consensus. Use only the supplied dossier. If the dossier cannot support a statement, leave it as an unresolved question and explain what evidence would help. Treat direct evidence, interpretation, experience, and values as different kinds of statements. Do not turn disagreement into a false balance.

Return exactly one JSON object. No markdown, no prose before or after it. It must match this contract exactly:
${JSON.stringify(z.toJSONSchema(generatedStoryResponseSchema), null, 2)}

Rules:
- Set contractVersion to "syat.story-draft.v1" and editorialStatus to "needs_editorial_review".
- Every sourceIds value must use only a sourceId from the dossier.
- Give every statement a stable lowercase id. Every content block must name the statement ids and source ids it relies on.
- The title and dek must be precise, not sensational.
- Make at least two distinct perspectives. Do not make up personal testimony.
- mediaPlan requests a rights requirement only. It never asserts that a media asset is cleared.
- Write in ${input.language}. Mode is ${input.mode}.

Editorial brief:
${input.editorialBrief}

Source dossier:
${JSON.stringify(input.sourceDossier, null, 2)}`;
}
