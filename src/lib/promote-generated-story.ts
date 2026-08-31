import { createHash } from "node:crypto";

import type { DraftReview } from "./draft-review";
import type { EditorialQualityReport } from "./editorial-quality";
import type { GeneratedStoryV2 } from "./generation-contract";
import { readerMediaSchema, readerStorySchema, type ReaderStory } from "./reader-story-schema";
import { validatePreviewSourcePack, type SourcePack, type SourcePackSource } from "./source-pack";

type ApprovedMedia = ReaderStory["media"][number];

function normalise(text: string) {
  return text.normalize("NFKC").replace(/\s+/g, " ").trim();
}

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
  if (!parsedMedia.some((media) => media.creator === "Syāt visual desk")) {
    throw new Error("An approved media record for the Syāt-authored visual is required before promotion.");
  }
  for (const plan of draft.mediaPlan) {
    const approved = parsedMedia.some((media) =>
      media.creator !== "Syāt visual desk"
      && media.kind === plan.kind
      && plan.sourceIds.every((sourceId) => media.sourceIds.includes(sourceId))
      && (plan.rightsRequirement === "explicit_licence" || media.rightsBasis === plan.rightsRequirement)
    );
    if (!approved) throw new Error(`The ${plan.kind} media plan has no matching approved media rights record.`);
  }
  return parsedMedia;
}

function mapStatement(statement: GeneratedStoryV2["statements"][number]): ReaderStory["statements"][number] {
  if (statement.type === "documented") return { id: statement.id, type: statement.type, text: statement.text, sourceIds: statement.sourceIds };
  if (statement.type === "unresolved") return { id: statement.id, type: statement.type, text: statement.text, sourceIds: statement.sourceIds, whatWouldHelp: statement.limits };
  return { id: statement.id, type: statement.type, text: statement.text, sourceIds: statement.sourceIds, scope: statement.sourceScope, limitation: statement.limits };
}

function sourceUseAndScope(draft: GeneratedStoryV2, sourceId: string) {
  const statements = draft.statements.filter((statement) => statement.sourceIds.includes(sourceId));
  const use = statements.length > 0
    ? `Supports: ${statements.slice(0, 2).map((statement) => statement.text).join(" ")}`
    : "Supports source-linked details in this private preview.";
  const scope = statements.length > 0
    ? statements.slice(0, 2).map((statement) => `${statement.sourceScope} Limit: ${statement.limits}`).join(" ")
    : "Use is limited to the linked source record and its recorded permissions.";
  return { use: use.slice(0, 300), scope: scope.slice(0, 300) };
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
  if (normalise(draft.story.indiaConnection) !== normalise(pack.indiaConnection)) {
    throw new Error("The draft India connection must remain exactly scoped to the approved source pack.");
  }
  const media = approvedMediaForPlans(draft, approvedMedia);
  const body = draft.bodySections.flatMap((section) => section.paragraphs.map((paragraph, paragraphIndex) => ({
    id: paragraph.id,
    kind: "paragraph" as const,
    text: paragraphIndex === 0 ? `${section.title}\n\n${paragraph.text}` : paragraph.text,
    claimIds: paragraph.claimIds,
    sourceIds: paragraph.sourceIds
  })));
  const bodyWordCount = body.reduce((total, block) => total + (block.text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0), 0);
  const now = new Date().toISOString();
  const inputHash = createHash("sha256").update(JSON.stringify({ sourcePack: pack, draft })).digest("hex");

  return readerStorySchema.parse({
    contractVersion: "syat.reader-story.v1",
    id: `news-${pack.id}`,
    slug: pack.id,
    mode: "news",
    locale: "en-IN",
    status: "private_preview",
    publicationAllowed: false,
    disclosure: "AI-assisted private preview",
    format: draft.format,
    title: draft.story.title,
    dek: draft.story.dek,
    theme: draft.story.theme,
    indiaConnection: draft.story.indiaConnection,
    eventTime: draft.story.eventTime,
    collectedAt: pack.collectedAt,
    generatedAt: now,
    updatedAt: now,
    readingMinutes: Math.max(1, Math.ceil(bodyWordCount / 225)),
    body,
    statements: draft.statements.map(mapStatement),
    timeline: draft.timeline,
    perspectives: draft.perspectives.map((perspective) => ({
      id: perspective.id,
      label: perspective.label,
      sees: perspective.sees,
      values: perspective.values,
      uses: perspective.uses,
      mayMiss: perspective.mayMiss,
      sourceIds: perspective.sourceIds
    })),
    people: draft.people,
    unresolved: draft.unresolved,
    contextBridge: draft.contextBridge,
    sources: pack.sources.map((source) => ({
      id: source.id,
      publisher: source.publisher,
      title: source.title,
      url: source.url,
      sourceKind: mapSourceKind(source),
      publishedAt: source.publishedAt,
      accessedAt: source.accessedAt,
      ...sourceUseAndScope(draft, source.id),
      rightsBasis: mapRightsBasis(source),
      reviewStatus: "approved" as const,
      linkAllowed: source.linkAllowed,
      modelInputAllowed: source.modelInputAllowed,
      mediaReuseAllowed: source.mediaReuseAllowed
    })),
    media,
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
    reframe: draft.story.reframe,
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
