import { z } from "zod";

const blockId = z.string().regex(/^[a-z0-9-]+$/).max(80);
const sourceIdList = z.array(z.string().min(1)).min(1).max(8);

export const contentBlockSchema = z.discriminatedUnion("kind", [
  z.object({ id: blockId, kind: z.literal("paragraph"), text: z.string().min(12).max(1600), claimIds: z.array(z.string().min(1)).min(1).max(12), sourceIds: sourceIdList }).strict(),
  z.object({ id: blockId, kind: z.literal("quote"), text: z.string().min(1).max(800), quoteId: z.string().min(1), sourceId: z.string().min(1), translatedText: z.string().min(1).max(800).optional() }).strict(),
  z.object({ id: blockId, kind: z.literal("media"), mediaPlanIndex: z.number().int().min(0).max(7), relatedClaimIds: z.array(z.string().min(1)).min(1).max(12) }).strict()
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export function parseContentBlocks(value: unknown, known: { claimIds: string[]; sourceIds: string[] }) {
  const blocks = z.array(contentBlockSchema).min(1).max(80).parse(value);
  const claimIds = new Set(known.claimIds);
  const sourceIds = new Set(known.sourceIds);
  const blockIds = new Set<string>();

  for (const block of blocks) {
    if (blockIds.has(block.id)) throw new Error(`Content block ${block.id} is repeated.`);
    blockIds.add(block.id);
    const referencedSources = block.kind === "quote" ? [block.sourceId] : block.kind === "paragraph" ? block.sourceIds : [];
    const unknownSource = referencedSources.find((sourceId) => !sourceIds.has(sourceId));
    if (unknownSource) throw new Error(`Content block ${block.id} references unknown source ${unknownSource}.`);
    const referencedClaims = block.kind === "media" ? block.relatedClaimIds : block.kind === "paragraph" ? block.claimIds : [];
    const unknownClaim = referencedClaims.find((claimId) => !claimIds.has(claimId));
    if (unknownClaim) throw new Error(`Content block ${block.id} references unknown claim ${unknownClaim}.`);
  }

  return blocks;
}
