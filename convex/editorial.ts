import { v } from "convex/values";

import { authComponent } from "./auth";
import { mutation, query } from "./_generated/server";
import { applyReviewDecision, encodeReviewEventForStorage, projectStoredReviewEvents, type StoredReviewEvent } from "../src/lib/review-queue";

const decisionValidator = v.union(
  v.literal("needs_source_pack"),
  v.literal("held"),
  v.literal("rejected"),
  v.literal("source_pack_ready")
);

const checklistValidator = v.object({
  openedOriginalLink: v.boolean(),
  keptLinkOnly: v.boolean(),
  namedNextNeed: v.boolean()
});

function allowedEditorSubjects() {
  return new Set((process.env.SYAT_EDITOR_SUBJECTS ?? "").split(",").map((subject) => subject.trim()).filter(Boolean));
}

async function requireAllowedEditor(ctx: Parameters<typeof authComponent.getAuthUser>[0]) {
  const user = await authComponent.getAuthUser(ctx);
  const subject = user ? String(user.userId ?? user._id) : "";

  if (!subject || !allowedEditorSubjects().has(subject)) {
    throw new Error("editor access is not configured for this identity");
  }

  return subject;
}

// This is intentionally append-only. Its input has no role, approval, or
// publication field, and its decision union describes research steps only.
export const recordReviewDecision = mutation({
  args: {
    sourceSignalId: v.string(),
    decision: decisionValidator,
    note: v.string(),
    checklist: checklistValidator
  },
  handler: async (ctx, args) => {
    const actorSubject = await requireAllowedEditor(ctx);
    const createdAt = Date.now();
    const result = applyReviewDecision({
      targetId: args.sourceSignalId,
      decision: args.decision,
      note: args.note,
      checklist: args.checklist,
      occurredAt: new Date(createdAt).toISOString()
    });

    if (!result.ok) throw new Error(result.reason);

    const stored = encodeReviewEventForStorage(result.event);
    await ctx.db.insert("reviewEvents", {
      targetType: "source",
      targetId: args.sourceSignalId,
      action: stored.action,
      actorSubject,
      note: stored.note,
      beforeState: stored.beforeState,
      afterState: stored.afterState,
      createdAt
    });

    return { decision: result.event.decision, publicationAllowed: false as const };
  }
});

export const getReviewProjection = query({
  args: { sourceSignalId: v.string() },
  handler: async (ctx, args) => {
    await requireAllowedEditor(ctx);
    const stored = await ctx.db
      .query("reviewEvents")
      .withIndex("by_target_and_created_at", (index) => index.eq("targetType", "source").eq("targetId", args.sourceSignalId))
      .collect();
    const events: StoredReviewEvent[] = stored.flatMap((event) => event.action === "commented" && event.afterState && event.beforeState && event.note !== undefined
      ? [{ targetId: event.targetId, action: "commented", afterState: event.afterState, beforeState: event.beforeState, note: event.note, createdAt: new Date(event.createdAt).toISOString() }]
      : []);

    return projectStoredReviewEvents(args.sourceSignalId, events);
  }
});
