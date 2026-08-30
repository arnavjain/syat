import { createStoryDraft } from "../src/lib/openrouter-story-client";

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set in the private environment.");

  const result = await createStoryDraft({
    apiKey,
    input: {
      language: "en-IN",
      mode: "timeless",
      editorialBrief: "Create a non-published teaching draft only. The sole source is fictional, and every statement must stay within its text.",
      sourceDossier: [{
        sourceId: "teaching-note",
        publisher: "Syāt teaching desk",
        title: "Fictional note about a shared garden",
        url: "https://example.invalid/syat-teaching-note",
        excerpt: "A fictional neighbourhood note says that a shared garden opens on 1 September. The note names volunteers, local residents, and a city maintenance team as participants. It does not measure outcomes or claim agreement."
      }]
    }
  });

  console.log(JSON.stringify({
    status: result.draft.status,
    title: result.draft.story.title,
    blocks: result.draft.contentBlocks.length,
    promptTokens: result.usage.promptTokens,
    completionTokens: result.usage.completionTokens,
    estimatedCostInrPaise: result.estimatedCostInrPaise
  }, null, 2));
}

void main();
