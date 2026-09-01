import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const storyMode = v.union(v.literal("news"), v.literal("timeless"));
const storyStatus = v.union(v.literal("draft"), v.literal("ready_for_review"), v.literal("approved"), v.literal("published"), v.literal("archived"));
const reviewState = v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("needs_changes"));
const rightsBasis = v.union(v.literal("owned"), v.literal("public_domain"), v.literal("cc0"), v.literal("cc_by"), v.literal("cc_by_sa"), v.literal("government_open_data"), v.literal("official_embed"), v.literal("commercial_license"));
const sourceRightsBasis = v.union(v.literal("link_only"), rightsBasis);
const sourceKind = v.union(v.literal("primary_document"), v.literal("official_statement"), v.literal("reputable_reporting"), v.literal("research"), v.literal("archive"), v.literal("social_embed"));
const statementType = v.union(v.literal("documented"), v.literal("interpreted"), v.literal("experienced"), v.literal("valued"), v.literal("unresolved"));

export default defineSchema({
  stories: defineTable({
    publicId: v.string(),
    mode: storyMode,
    primaryLocale: v.string(),
    status: storyStatus,
    activeVersionId: v.optional(v.id("storyVersions")),
    eventTime: v.optional(v.number()),
    lastSubstantialUpdateAt: v.number(),
    updateSummary: v.optional(v.string()),
    correctionState: v.optional(v.union(v.literal("none"), v.literal("corrected"), v.literal("clarified"))),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_public_id", ["publicId"])
    .index("by_mode_and_status", ["mode", "status"])
    .index("by_recent_update", ["lastSubstantialUpdateAt"]),

  storyVersions: defineTable({
    storyId: v.id("stories"),
    locale: v.string(),
    version: v.number(),
    title: v.string(),
    dek: v.string(),
    body: v.string(),
    readingMinutes: v.number(),
    evidenceStatus: v.union(v.literal("reported"), v.literal("developing"), v.literal("contextual"), v.literal("disputed")),
    editorialNotes: v.optional(v.string()),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    status: storyStatus,
    createdAt: v.number()
  })
    .index("by_story_and_locale", ["storyId", "locale"])
    .index("by_story_and_version", ["storyId", "version"]),

  sources: defineTable({
    publicId: v.string(),
    publisher: v.string(),
    publisherUrl: v.optional(v.string()),
    title: v.string(),
    url: v.string(),
    kind: sourceKind,
    author: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    accessedAt: v.number(),
    language: v.string(),
    quoteScope: v.optional(v.string()),
    archiveUrl: v.optional(v.string()),
    // Older source rows may lack this while they are migrated. Generation rejects them at its boundary.
    rightsBasis: v.optional(sourceRightsBasis),
    reviewStatus: reviewState,
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number()
  })
    .index("by_public_id", ["publicId"])
    .index("by_review_status", ["reviewStatus"]),

  sourceIntakeRecords: defineTable({
    publicId: v.string(),
    sourceId: v.optional(v.id("sources")),
    collectionRunId: v.string(),
    publisher: v.string(),
    feedUrl: v.string(),
    canonicalUrl: v.string(),
    title: v.string(),
    discoveredAt: v.number(),
    fetchedAt: v.number(),
    rawContentHash: v.string(),
    intakeState: v.union(v.literal("candidate"), v.literal("accepted"), v.literal("duplicate"), v.literal("stale"), v.literal("rejected"), v.literal("needs_editorial_review")),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number()
  })
    .index("by_public_id", ["publicId"])
    .index("by_collection_run", ["collectionRunId"])
    .index("by_source", ["sourceId"])
    .index("by_intake_state", ["intakeState"]),

  mediaAssets: defineTable({
    publicId: v.string(),
    kind: v.union(v.literal("photo"), v.literal("illustration"), v.literal("chart"), v.literal("video"), v.literal("audio"), v.literal("embed")),
    url: v.string(),
    alt: v.string(),
    caption: v.optional(v.string()),
    creditLine: v.string(),
    creator: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    rightsBasis,
    licenseUrl: v.optional(v.string()),
    licenceText: v.optional(v.string()),
    reviewStatus: reviewState,
    sourceAssetHash: v.optional(v.string()),
    visualRole: v.optional(v.union(v.literal("subject"), v.literal("evidence"), v.literal("change"), v.literal("chronology"), v.literal("place"), v.literal("scale"), v.literal("process"), v.literal("comparison"), v.literal("archive"), v.literal("framing"), v.literal("context"))),
    whatItShows: v.optional(v.string()),
    whatItCannotShow: v.optional(v.array(v.string())),
    rightsProofUrl: v.optional(v.string()),
    rightsCheckedAt: v.optional(v.number()),
    rightsCheckedBy: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    accessibilityEn: v.optional(v.object({ alt: v.string(), caption: v.string(), longDescription: v.optional(v.string()), transcript: v.optional(v.string()) })),
    accessibilityHi: v.optional(v.object({ alt: v.string(), caption: v.string(), longDescription: v.optional(v.string()), transcript: v.optional(v.string()) })),
    createdAt: v.number()
  })
    .index("by_public_id", ["publicId"])
    .index("by_review_status", ["reviewStatus"]),

  mediaCandidates: defineTable({
    publicId: v.string(),
    storyId: v.optional(v.id("stories")),
    discoveredVia: v.union(v.literal("official_api"), v.literal("rss"), v.literal("source_page"), v.literal("openverse"), v.literal("wikimedia"), v.literal("editor")),
    canonicalPageUrl: v.string(),
    possibleAssetUrl: v.optional(v.string()),
    provider: v.string(),
    suggestedRole: v.string(),
    rightsState: v.union(v.literal("unknown"), v.literal("reviewing"), v.literal("rejected"), v.literal("promoted")),
    termsUrl: v.optional(v.string()),
    discoveredAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string())
  })
    .index("by_public_id", ["publicId"])
    .index("by_rights_state", ["rightsState"]),

  mediaRenditions: defineTable({
    mediaAssetId: v.id("mediaAssets"),
    url: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    bytes: v.number(),
    mimeType: v.string(),
    sha256: v.string(),
    createdAt: v.number()
  }).index("by_media_asset", ["mediaAssetId"]),

  storySources: defineTable({
    storyVersionId: v.id("storyVersions"),
    sourceId: v.id("sources"),
    usage: v.union(v.literal("background"), v.literal("claim"), v.literal("quote"), v.literal("timeline"), v.literal("media_credit")),
    note: v.optional(v.string()),
    createdAt: v.number()
  }).index("by_story_version", ["storyVersionId"]),

  storyTimelineEntries: defineTable({
    storyVersionId: v.id("storyVersions"),
    publicId: v.string(),
    eventType: v.union(v.literal("reported_change"), v.literal("documented_event"), v.literal("unresolved_context")),
    timeKind: v.union(v.literal("exact_date"), v.literal("period"), v.literal("unknown")),
    happenedAt: v.optional(v.number()),
    periodLabel: v.optional(v.string()),
    text: v.string(),
    uncertaintyNote: v.optional(v.string()),
    sourceIds: v.array(v.id("sources")),
    sortOrder: v.number(),
    createdAt: v.number()
  })
    .index("by_story_version", ["storyVersionId"])
    .index("by_story_version_and_public_id", ["storyVersionId", "publicId"]),

  storyPeopleAssociations: defineTable({
    storyVersionId: v.id("storyVersions"),
    publicId: v.string(),
    entityKind: v.union(v.literal("person"), v.literal("institution"), v.literal("community"), v.literal("unknown_role")),
    displayName: v.string(),
    association: v.string(),
    whyRelevant: v.string(),
    sourceIds: v.array(v.id("sources")),
    verificationState: v.union(v.literal("story_approved"), v.literal("fictional_fixture"), v.literal("unverified_role")),
    createdAt: v.number()
  })
    .index("by_story_version", ["storyVersionId"])
    .index("by_story_version_and_public_id", ["storyVersionId", "publicId"]),

  storyTopicLinks: defineTable({
    storyId: v.id("stories"),
    topicPublicId: v.string(),
    relation: v.union(v.literal("context_for"), v.literal("asks_same_question"), v.literal("historical_context"), v.literal("contrasts_with")),
    createdAt: v.number()
  })
    .index("by_story", ["storyId"])
    .index("by_topic_public_id", ["topicPublicId"]),

  storyMedia: defineTable({
    storyVersionId: v.id("storyVersions"),
    mediaAssetId: v.id("mediaAssets"),
    placement: v.union(v.literal("hero"), v.literal("inline"), v.literal("source_trail"), v.literal("embed")),
    sortOrder: v.number(),
    createdAt: v.number()
  }).index("by_story_version", ["storyVersionId"]),

  perspectives: defineTable({
    storyVersionId: v.id("storyVersions"),
    publicId: v.string(),
    label: v.string(),
    description: v.optional(v.string()),
    sees: v.string(),
    values: v.string(),
    uses: v.string(),
    mayMiss: v.string(),
    sortOrder: v.number(),
    createdAt: v.number()
  })
    .index("by_story_version", ["storyVersionId"])
    .index("by_public_id", ["publicId"]),

  statements: defineTable({
    storyVersionId: v.id("storyVersions"),
    publicId: v.string(),
    perspectiveId: v.optional(v.id("perspectives")),
    type: statementType,
    text: v.string(),
    sourceIds: v.array(v.id("sources")),
    scope: v.optional(v.string()),
    unresolvedBy: v.optional(v.string()),
    sortOrder: v.number(),
    createdAt: v.number()
  })
    .index("by_story_version", ["storyVersionId"])
    .index("by_perspective", ["perspectiveId"])
    .index("by_public_id", ["publicId"]),

  contentBlocks: defineTable({
    storyVersionId: v.id("storyVersions"),
    blockId: v.string(),
    kind: v.union(v.literal("paragraph"), v.literal("quote"), v.literal("media")),
    text: v.optional(v.string()),
    claimPublicIds: v.array(v.string()),
    sourcePublicIds: v.array(v.string()),
    quoteId: v.optional(v.string()),
    mediaAssetId: v.optional(v.id("mediaAssets")),
    mediaPlanIndex: v.optional(v.number()),
    sortOrder: v.number(),
    createdAt: v.number()
  })
    .index("by_story_version", ["storyVersionId"])
    .index("by_story_version_and_block", ["storyVersionId", "blockId"]),

  storyRelations: defineTable({
    fromStoryId: v.id("stories"),
    toStoryId: v.id("stories"),
    relation: v.union(v.literal("context_for"), v.literal("related_news"), v.literal("contrasts_with"), v.literal("same_question")),
    createdAt: v.number()
  }).index("by_from_story", ["fromStoryId"]),

  readingSaves: defineTable({
    userSubject: v.string(),
    storyId: v.id("stories"),
    createdAt: v.number(),
    lastReadAt: v.optional(v.number()),
    note: v.optional(v.string())
  })
    .index("by_user", ["userSubject"])
    .index("by_user_and_story", ["userSubject", "storyId"]),

  readingProgress: defineTable({
    userSubject: v.string(),
    storyVersionId: v.id("storyVersions"),
    progress: v.number(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number()
  }).index("by_user_and_story_version", ["userSubject", "storyVersionId"]),

  pulses: defineTable({
    storyId: v.id("stories"),
    question: v.string(),
    options: v.array(v.object({ id: v.string(), label: v.string() })),
    opensAt: v.number(),
    closesAt: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("open"), v.literal("closed")),
    createdAt: v.number()
  }).index("by_story", ["storyId"]),

  pulseResponses: defineTable({
    pulseId: v.id("pulses"),
    userSubject: v.string(),
    optionId: v.string(),
    createdAt: v.number()
  }).index("by_pulse_and_user", ["pulseId", "userSubject"]),

  perspectiveSubmissions: defineTable({
    storyId: v.id("stories"),
    userSubject: v.optional(v.string()),
    body: v.string(),
    sourceUrls: v.array(v.string()),
    state: v.union(v.literal("draft"), v.literal("submitted"), v.literal("under_review"), v.literal("accepted"), v.literal("declined")),
    moderationNote: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_story_and_state", ["storyId", "state"]),

  comments: defineTable({
    storyId: v.id("stories"),
    parentCommentId: v.optional(v.id("comments")),
    userSubject: v.string(),
    body: v.string(),
    state: v.union(v.literal("hidden"), v.literal("pending"), v.literal("published"), v.literal("removed")),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_story_and_state", ["storyId", "state"]),

  moderationReports: defineTable({
    targetType: v.union(v.literal("comment"), v.literal("submission")),
    targetId: v.string(),
    reporterSubject: v.optional(v.string()),
    reason: v.string(),
    state: v.union(v.literal("open"), v.literal("reviewing"), v.literal("resolved")),
    resolution: v.optional(v.string()),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number())
  }).index("by_state", ["state"]),

  recommendationEvents: defineTable({
    userSubject: v.string(),
    storyId: v.id("stories"),
    event: v.union(v.literal("impression"), v.literal("opened"), v.literal("saved"), v.literal("completed"), v.literal("dismissed")),
    source: v.string(),
    createdAt: v.number()
  }).index("by_user_and_created_at", ["userSubject", "createdAt"]),

  notifications: defineTable({
    userSubject: v.string(),
    channel: v.union(v.literal("in_app"), v.literal("email"), v.literal("push")),
    kind: v.string(),
    payload: v.string(),
    state: v.union(v.literal("pending"), v.literal("sent"), v.literal("read"), v.literal("failed"), v.literal("suppressed")),
    sendAfter: v.number(),
    createdAt: v.number()
  }).index("by_user_and_state", ["userSubject", "state"]),

  editions: defineTable({
    storyVersionId: v.id("storyVersions"),
    locale: v.string(),
    status: v.union(v.literal("source"), v.literal("machine_draft"), v.literal("reviewed"), v.literal("published")),
    translator: v.optional(v.string()),
    title: v.string(),
    dek: v.string(),
    body: v.string(),
    reviewedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_story_version_and_locale", ["storyVersionId", "locale"]),

  generationJobs: defineTable({
    requestId: v.string(),
    userSubject: v.optional(v.string()),
    jobType: v.union(v.literal("source_extract"), v.literal("story_draft"), v.literal("translation"), v.literal("reframe"), v.literal("recommendation")),
    inputHash: v.string(),
    model: v.string(),
    budgetMonth: v.optional(v.string()),
    estimatedMaxPaise: v.optional(v.number()),
    reservedPaise: v.optional(v.number()),
    state: v.union(v.literal("queued"), v.literal("running"), v.literal("succeeded"), v.literal("failed"), v.literal("cancelled")),
    costInrPaise: v.optional(v.number()),
    outputRef: v.optional(v.string()),
    errorCode: v.optional(v.string()),
    attempts: v.number(),
    leaseExpiresAt: v.optional(v.number()),
    retryAfter: v.optional(v.number()),
    externalResponseId: v.optional(v.string()),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_request_id", ["requestId"])
    .index("by_state", ["state"])
    .index("by_input_hash", ["inputHash"])
    .index("by_budget_month_and_state", ["budgetMonth", "state"]),

  generationJobSources: defineTable({
    generationJobId: v.id("generationJobs"),
    sourceId: v.id("sources"),
    sourcePublicId: v.string(),
    sourceKind,
    rightsBasis: sourceRightsBasis,
    reviewStatus: reviewState,
    dossierSnapshotHash: v.string(),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    createdAt: v.number()
  })
    .index("by_generation_job", ["generationJobId"])
    .index("by_source", ["sourceId"]),

  generationAttempts: defineTable({
    generationJobId: v.id("generationJobs"),
    attemptNumber: v.number(),
    inputHash: v.string(),
    budgetMonth: v.string(),
    reservationPaise: v.number(),
    actualSpendPaise: v.optional(v.number()),
    state: v.union(v.literal("reserved"), v.literal("sent"), v.literal("succeeded"), v.literal("failed"), v.literal("cancelled")),
    externalResponseId: v.optional(v.string()),
    failureCode: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number())
  })
    .index("by_generation_job_and_attempt", ["generationJobId", "attemptNumber"])
    .index("by_input_hash", ["inputHash"])
    .index("by_budget_month_and_state", ["budgetMonth", "state"]),

  draftReviews: defineTable({
    generationJobId: v.id("generationJobs"),
    storyId: v.optional(v.id("stories")),
    contractVersion: v.string(),
    status: v.union(v.literal("blocked"), v.literal("needs_editorial_review")),
    publicationAllowed: v.literal(false),
    checks: v.object({
      sourceReferences: v.literal("passed"),
      directQuotes: v.union(v.literal("passed"), v.literal("blocked")),
      repeatedClaims: v.union(v.literal("passed"), v.literal("blocked")),
      publisherDiversity: v.union(v.literal("limited"), v.literal("multiple_publishers")),
      mediaRights: v.union(v.literal("not_requested"), v.literal("human_review_required")),
      indiaContext: v.union(v.literal("provided"), v.literal("missing"))
    }),
    findings: v.array(v.object({
      code: v.string(),
      severity: v.union(v.literal("blocker"), v.literal("warning"), v.literal("note")),
      message: v.string(),
      relatedId: v.optional(v.string())
    })),
    editorDecisionNote: v.optional(v.string()),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number()
  })
    .index("by_generation_job", ["generationJobId"])
    .index("by_status", ["status"]),

  reviewEvents: defineTable({
    targetType: v.union(v.literal("source"), v.literal("source_dossier"), v.literal("generation_job"), v.literal("draft_review"), v.literal("story_version"), v.literal("media_asset")),
    targetId: v.string(),
    action: v.union(v.literal("created"), v.literal("submitted"), v.literal("approved"), v.literal("rejected"), v.literal("needs_changes"), v.literal("commented"), v.literal("reserved_budget"), v.literal("recorded_spend")),
    actorSubject: v.optional(v.string()),
    note: v.optional(v.string()),
    beforeState: v.optional(v.string()),
    afterState: v.optional(v.string()),
    createdAt: v.number()
  })
    .index("by_target_and_created_at", ["targetType", "targetId", "createdAt"])
    .index("by_created_at", ["createdAt"]),

  publicationOutbox: defineTable({
    storyVersionId: v.id("storyVersions"),
    eventType: v.union(v.literal("story_published"), v.literal("story_revalidated"), v.literal("edition_published")),
    idempotencyKey: v.string(),
    state: v.union(v.literal("queued"), v.literal("processing"), v.literal("delivered"), v.literal("failed")),
    attempts: v.number(),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
    deliveredAt: v.optional(v.number())
  }).index("by_idempotency_key", ["idempotencyKey"]),

  // A question proposed by a reader. This is the one table the public can write to, so it
  // holds only short, bounded text, always starts pending, and is never read by a public
  // page. A proposal becomes a catalogue entry when a person writes that entry by hand.
  topicProposals: defineTable({
    question: v.string(),
    reason: v.string(),
    themeSlug: v.string(),
    state: v.union(v.literal("pending"), v.literal("under_review"), v.literal("accepted"), v.literal("declined")),
    // Coarse per-visitor bucket used only to slow bursts. Not an identity.
    submitterBucket: v.string(),
    moderationNote: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_state_and_created_at", ["state", "createdAt"])
    .index("by_bucket_and_created_at", ["submitterBucket", "createdAt"])
});
