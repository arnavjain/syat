import { createHash } from "node:crypto";

import type { DraftReview } from "./draft-review";
import type { EditorialQualityReport } from "./editorial-quality";
import { parseGeneratedStoryV2, type GeneratedStoryV2 } from "./generation-contract";
import { readerMediaSchema, readerStorySchema, type ReaderStory } from "./reader-story-schema";
import { validatePreviewSourcePack, type SourcePack, type SourcePackSource } from "./source-pack";

type ApprovedMedia = ReaderStory["media"][number];

function mapSourceKind(source: SourcePackSource): ReaderStory["sources"][number]["sourceKind"] {
  if (source.sourceKind === "government_open_data") return "primary_document";
  return source.sourceKind;
}

function mapRightsBasis(source: SourcePackSource): ReaderStory["sources"][number]["rightsBasis"] {
  if (source.rightsBasis === "explicit_licence") {
    throw new Error(`Source ${source.id} needs a licence-specific ReaderStory rights record before promotion.`);
  }
  return source.rightsBasis;
}

function approvedMediaForPlans(draft: GeneratedStoryV2, approvedMedia: ApprovedMedia[]) {
  const parsedMedia = approvedMedia.map((media) => readerMediaSchema.parse(media));
  const expectedAuthoredKind = draft.authoredVisual.kind === "relationship_map" ? "illustration" : "chart";
  const expectedAuthoredId = `authored-${draft.sourcePackId}-${draft.authoredVisual.kind}`;
  const authoredMedia = parsedMedia.find((media) =>
    media.id === expectedAuthoredId
    && media.creator === "Syāt visual desk"
    && media.kind === expectedAuthoredKind
    && media.label === draft.authoredVisual.title
    && media.claimIds.length === draft.authoredVisual.claimIds.length
    && media.claimIds.every((claimId) => draft.authoredVisual.claimIds.includes(claimId))
    && media.sourceIds.length === draft.authoredVisual.sourceIds.length
    && media.sourceIds.every((sourceId) => draft.authoredVisual.sourceIds.includes(sourceId))
  );
  if (!authoredMedia) {
    throw new Error("An approved media record for the Syāt-authored visual is required before promotion.");
  }
  const usedMediaIds = new Set([authoredMedia.id]);
  const matchedExternalMedia: ApprovedMedia[] = [];
  for (const plan of draft.mediaPlan) {
    if (plan.rightsRequirement === "explicit_licence") throw new Error(`The ${plan.kind} media plan needs an exact representable explicit licence before promotion.`);
    const approved = parsedMedia.find((media) =>
      media.creator !== "Syāt visual desk"
      && !usedMediaIds.has(media.id)
      && media.planId === plan.id
      && media.kind === plan.kind
      && media.alt === plan.alt
      && media.claimIds.length === plan.claimIds.length
      && plan.claimIds.every((claimId) => media.claimIds.includes(claimId))
      && media.sourceIds.length === plan.sourceIds.length
      && plan.sourceIds.every((sourceId) => media.sourceIds.includes(sourceId))
      && media.rightsBasis === plan.rightsRequirement
    );
    if (!approved) throw new Error(`The ${plan.kind} media plan has no matching approved media rights record.`);
    usedMediaIds.add(approved.id);
    matchedExternalMedia.push(approved);
  }
  return { media: [authoredMedia, ...matchedExternalMedia], authoredMedia };
}

function mapStatement(statement: GeneratedStoryV2["statements"][number]): ReaderStory["statements"][number] {
  const base = { id: statement.id, type: statement.type, basis: statement.basis, text: statement.text, sourceIds: statement.sourceIds, sourceScope: statement.sourceScope };
  return { ...base, type: statement.type, limits: statement.limits };
}

function sourceUseAndScope(draft: GeneratedStoryV2, sourceId: string) {
  const statements = draft.statements.filter((statement) => statement.sourceIds.includes(sourceId));
  const fallbackUse = "Supports source-linked details in this private preview.";
  let use = "Supports statement IDs:";
  for (const statement of statements) {
    const next = `${use}${use.endsWith(":") ? " " : ", "}${statement.id}`;
    if (`${next}.`.length > 300) break;
    use = next;
  }
  if (statements.length === 0) use = fallbackUse;
  else use = `${use}.`;
  const scope = statements[0]?.sourceScope ?? "Use is limited to the linked source record and its recorded permissions.";
  return { use, scope };
}

export function promoteGeneratedStory({
  draft,
  draftReview,
  qualityReview,
  sourcePack,
  approvedMedia
}: {
  draft: GeneratedStoryV2;
  draftReview: DraftReview;
  qualityReview: EditorialQualityReport;
  sourcePack: SourcePack;
  approvedMedia: ApprovedMedia[];
}): ReaderStory {
  if (draftReview.status === "blocked" || qualityReview.status === "blocked" || qualityReview.blockers.length > 0) {
    throw new Error("A blocked draft cannot become a reader preview.");
  }
  if (draft.language !== "en-IN" || draft.story.mode !== "news") {
    throw new Error("This ReaderStory promotion path accepts only en-IN news drafts.");
  }
  if (draft.editorialStatus !== "needs_editorial_review") throw new Error("Only a draft awaiting editorial review can become a reader preview.");
  const pack = validatePreviewSourcePack(sourcePack);
  const checkedDraft = parseGeneratedStoryV2(draft, pack.sources, { sourcePackId: pack.id, language: "en-IN", mode: "news", format: draft.format, indiaConnection: pack.indiaConnection });
  const { media, authoredMedia } = approvedMediaForPlans(checkedDraft, approvedMedia);
  const body = checkedDraft.bodySections.flatMap((section) => section.paragraphs.map((paragraph, paragraphIndex) => ({
    id: paragraph.id,
    kind: "paragraph" as const,
    text: paragraph.text,
    ...(paragraphIndex === 0 ? { section: { id: section.id, title: section.title } } : {}),
    claimIds: paragraph.claimIds,
    sourceIds: paragraph.sourceIds
  })));
  const bodyWordCount = body.reduce((total, block) => total + (block.text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0), 0);
  const now = new Date().toISOString();
  const inputHash = createHash("sha256").update(JSON.stringify({ sourcePack: pack, draft: checkedDraft })).digest("hex");

  return readerStorySchema.parse({
    contractVersion: "syat.reader-story.v1",
    id: `news-${pack.id}`,
    slug: pack.id,
    mode: "news",
    locale: "en-IN",
    status: "private_preview",
    publicationAllowed: false,
    disclosure: "AI-assisted private preview",
    format: checkedDraft.format,
    title: checkedDraft.story.title,
    dek: checkedDraft.story.dek,
    theme: checkedDraft.story.theme,
    indiaConnection: checkedDraft.story.indiaConnection,
    eventTime: checkedDraft.story.eventTime,
    eventTimeEvidence: checkedDraft.story.eventTimeEvidence,
    collectedAt: pack.collectedAt,
    generatedAt: now,
    updatedAt: now,
    readingMinutes: Math.max(1, Math.ceil(bodyWordCount / 225)),
    body,
    statements: checkedDraft.statements.map(mapStatement),
    timeline: checkedDraft.timeline,
    perspectives: checkedDraft.perspectives.map((perspective) => ({
      id: perspective.id,
      label: perspective.label,
      rationale: perspective.rationale,
      sees: perspective.sees,
      values: perspective.values,
      uses: perspective.uses,
      mayMiss: perspective.mayMiss,
      sourceIds: perspective.sourceIds
    })),
    people: checkedDraft.people,
    unresolved: checkedDraft.unresolved,
    contextBridge: checkedDraft.contextBridge,
    sources: pack.sources.map((source) => ({
      id: source.id,
      publisher: source.publisher,
      title: source.title,
      url: source.url,
      sourceKind: mapSourceKind(source),
      publishedAt: source.publishedAt,
      accessedAt: source.accessedAt,
      ...sourceUseAndScope(checkedDraft, source.id),
      rightsBasis: mapRightsBasis(source),
      reviewStatus: "approved" as const,
      linkAllowed: source.linkAllowed,
      modelInputAllowed: source.modelInputAllowed,
      mediaReuseAllowed: source.mediaReuseAllowed
    })),
    media,
    authoredVisual: { ...checkedDraft.authoredVisual, mediaId: authoredMedia.id },
    relatedCoverage: pack.relatedCoverage.map((source) => ({
      id: source.id,
      publisher: source.publisher,
      title: source.title,
      url: source.url,
      publishedAt: source.publishedAt,
      use: "Provides attributed link-only context and was not used as model evidence.",
      linkAllowed: true,
      modelInputAllowed: false,
      mediaReuseAllowed: false
    })),
    reframe: checkedDraft.story.reframe,
    generation: {
      model: "deepseek/deepseek-v4-flash-0731",
      promptVersion: "syat.story-draft.v2",
      inputHash,
      generatedBy: "openrouter",
      reviewedAt: now
    },
    quality: {
      status: "passed",
      blockers: [],
      warnings: qualityReview.warnings.map((warning) => warning.message),
      scores: qualityReview.scores
    },
    publication: { approvedByHuman: false, finalReporting: false }
  });
}
