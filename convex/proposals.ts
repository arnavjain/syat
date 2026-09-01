import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const MAXIMUM_QUESTION_LENGTH = 160;
const MAXIMUM_REASON_LENGTH = 600;
const MAXIMUM_PER_BUCKET_PER_HOUR = 5;
const HOUR_IN_MS = 60 * 60 * 1000;

function tidy(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/**
 * Accepts a reader's proposed question.
 *
 * This is the only public write in the app, so it is deliberately narrow: bounded text, a
 * required question mark, a per-visitor hourly cap, and a state that always starts pending.
 * Nothing here triggers a model call, and nothing it stores is readable from a public page,
 * so a proposal cannot put unreviewed text about a real person in front of anyone.
 */
export const submitTopicProposal = mutation({
  args: {
    question: v.string(),
    reason: v.string(),
    themeSlug: v.string(),
    submitterBucket: v.string()
  },
  handler: async (context, args) => {
    const question = tidy(args.question);
    const reason = tidy(args.reason);
    const themeSlug = tidy(args.themeSlug);
    const submitterBucket = tidy(args.submitterBucket).slice(0, 64);

    if (question.length < 12) return { ok: false as const, reason: "A question needs a little more than that." };
    if (question.length > MAXIMUM_QUESTION_LENGTH) return { ok: false as const, reason: `Keep the question under ${MAXIMUM_QUESTION_LENGTH} characters.` };
    if (!question.includes("?")) return { ok: false as const, reason: "Write it as a question, ending with a question mark." };
    if (reason.length > MAXIMUM_REASON_LENGTH) return { ok: false as const, reason: `Keep the note under ${MAXIMUM_REASON_LENGTH} characters.` };
    if (!/^[a-z0-9-]{3,60}$/.test(themeSlug)) return { ok: false as const, reason: "Choose one of the listed themes." };
    if (!submitterBucket) return { ok: false as const, reason: "This submission could not be checked for rate limiting." };

    const since = Date.now() - HOUR_IN_MS;
    const recent = await context.db
      .query("topicProposals")
      .withIndex("by_bucket_and_created_at", (q) => q.eq("submitterBucket", submitterBucket).gt("createdAt", since))
      .collect();
    if (recent.length >= MAXIMUM_PER_BUCKET_PER_HOUR) {
      return { ok: false as const, reason: "That is several questions in a short time. Come back in an hour." };
    }

    const now = Date.now();
    await context.db.insert("topicProposals", {
      question,
      reason,
      themeSlug,
      state: "pending",
      submitterBucket,
      createdAt: now,
      updatedAt: now
    });

    return { ok: true as const, reason: "Received. A person reads every proposal before anything is published." };
  }
});

/**
 * Moves a proposal through review. A proposal never becomes a public page here: accepting one
 * records the decision, and a person still writes the catalogue entry by hand.
 */
export const reviewProposal = mutation({
  args: {
    proposalId: v.id("topicProposals"),
    state: v.union(v.literal("under_review"), v.literal("accepted"), v.literal("declined")),
    moderationNote: v.optional(v.string())
  },
  handler: async (context, args) => {
    const existing = await context.db.get(args.proposalId);
    if (!existing) return { ok: false as const, reason: "That proposal no longer exists." };

    await context.db.patch(args.proposalId, {
      state: args.state,
      moderationNote: args.moderationNote?.slice(0, 400),
      updatedAt: Date.now()
    });
    return { ok: true as const, reason: `Marked ${args.state}.` };
  }
});

/** Pending proposals for a reviewer. Not exposed to any public page. */
export const listPendingProposals = query({
  args: {},
  handler: async (context) => {
    const pending = await context.db
      .query("topicProposals")
      .withIndex("by_state_and_created_at", (q) => q.eq("state", "pending"))
      .order("desc")
      .take(50);
    return pending.map((proposal) => ({
      id: proposal._id,
      question: proposal.question,
      themeSlug: proposal.themeSlug,
      createdAt: proposal.createdAt
    }));
  }
});

/** Counts only. A public page may say how many questions are waiting, never what they say. */
export const proposalCount = query({
  args: {},
  handler: async (context) => {
    const pending = await context.db
      .query("topicProposals")
      .withIndex("by_state_and_created_at", (q) => q.eq("state", "pending"))
      .collect();
    return { pending: pending.length };
  }
});
