import { v } from "convex/values";

import { authComponent } from "./auth";
import { mutation, query } from "./_generated/server";
import { applyReviewDecision, projectReviewEvents, type ReviewDecisionEvent } from "../src/lib/review-queue";

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

function parseChecklist(value: string | undefined) {
  try {
    const parsed = JSON.parse(value ?? "{}") as Partial<ReviewDecisionEvent["checklist"]>;
    return {
      openedOriginalLink: parsed.openedOriginalLink === true,
      keptLinkOnly: parsed.keptLinkOnly === true,
      namedNextNeed: parsed.namedNextNeed === true
    };
  } catch {
    return { openedOriginalLink: false, keptLinkOnly: false, namedNextNeed: false };
  }
}

function storedSourceEvent(event: {
  targetId: string;
  action: string;
  afterState?: string;
  beforeState?: string;
  note?: string;
  createdAt: number;
}): ReviewDecisionEvent | null {
  if (event.action !== "commented" || !event.afterState) return null;
  const result = applyReviewDecision({
    targetId: event.targetId,
    decision: event.afterState,
    note: event.note ?? "",
    checklist: parseChecklist(event.beforeState),
    occurredAt: new Date(event.createdAt).toISOString()
  });

  return result.ok ? result.event : null;
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

    await ctx.db.insert("reviewEvents", {
      targetType: "source",
      targetId: args.sourceSignalId,
      action: "commented",
      actorSubject,
      note: result.event.note,
      beforeState: JSON.stringify({ checklist: result.event.checklist }),
      afterState: result.event.decision,
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
    const events = stored.flatMap((event) => {
      const parsed = storedSourceEvent(event);
      return parsed ? [parsed] : [];
    });

    return projectReviewEvents(args.sourceSignalId, events);
  }
});
