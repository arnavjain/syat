import { z } from "zod";

const sourceSchema = z.object({
  id: z.string().min(1),
  publisher: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  sourceKind: z.enum([
    "primary_document",
    "official_statement",
    "reputable_reporting",
    "research",
    "archive",
    "social_embed"
  ]),
  publishedAt: z.iso.datetime(),
  accessedAt: z.iso.datetime()
});

const mediaSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["photo", "illustration", "chart", "video", "audio", "embed"]),
  alt: z.string().min(1),
  creditLine: z.string().min(1),
  rightsBasis: z.enum([
    "owned",
    "public_domain",
    "cc0",
    "cc_by",
    "cc_by_sa",
    "government_open_data",
    "official_embed",
    "commercial_license"
  ]),
  reviewStatus: z.enum(["approved", "needs_review"])
});

const viewpointSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sees: z.string().min(1),
  values: z.string().min(1),
  uses: z.string().min(1),
  mayMiss: z.string().min(1)
});

export const publicationStorySchema = z
  .object({
    id: z.string().regex(/^(news|timeless)-[a-z0-9-]+$/),
    mode: z.enum(["news", "timeless"]),
    locale: z.enum(["en-IN", "hi-IN"]),
    title: z.string().min(12).max(160),
    dek: z.string().min(20).max(320),
    status: z.enum(["draft", "ready_for_review", "approved", "published"]),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    sources: z.array(sourceSchema).min(1),
    media: z.array(mediaSchema),
    viewpoints: z.array(viewpointSchema).min(2).max(8)
  })
  .superRefine((story, ctx) => {
    const duplicateViewpoint = story.viewpoints.find(
      (viewpoint, index) => story.viewpoints.findIndex((candidate) => candidate.id === viewpoint.id) !== index
    );

    if (duplicateViewpoint) {
      ctx.addIssue({
        code: "custom",
        message: `Viewpoint id ${duplicateViewpoint.id} is repeated.`,
        path: ["viewpoints"]
      });
    }

    if (story.status === "published" && story.media.some((media) => media.reviewStatus !== "approved")) {
      ctx.addIssue({
        code: "custom",
        message: "Published stories require approved media.",
        path: ["media"]
      });
    }
  });

export type PublicationStory = z.infer<typeof publicationStorySchema>;
