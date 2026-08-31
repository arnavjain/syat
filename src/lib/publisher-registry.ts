export type PublisherRegistryEntry = {
  id: string;
  name: string;
  kind: "public record" | "legacy newsroom" | "digital newsroom" | "specialist newsroom";
  intake: "rss metadata" | "manual editor pick";
  publicUse: "link-only until review";
  note: string;
};

// This is a diversity record, not a political scorecard. Syāt does not infer a
// publisher's ideology. An editor still checks the source pack for each story.
export const publisherRegistry: readonly PublisherRegistryEntry[] = [
  { id: "pib", name: "Press Information Bureau", kind: "public record", intake: "rss metadata", publicUse: "link-only until review", note: "Direct government statements; never the only source for a contested claim." },
  { id: "the-hindu", name: "The Hindu", kind: "legacy newsroom", intake: "rss metadata", publicUse: "link-only until review", note: "National reporting intake." },
  { id: "indian-express", name: "The Indian Express", kind: "legacy newsroom", intake: "rss metadata", publicUse: "link-only until review", note: "India, city, public-interest, business, technology, health and education intake." },
  { id: "the-print", name: "ThePrint", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", note: "No reliable machine-readable feed is enabled; editors add original links manually." },
  { id: "the-wire", name: "The Wire", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", note: "No reliable machine-readable feed is enabled; editors add original links manually." },
  { id: "scroll", name: "Scroll", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", note: "Editors add original links manually until a stable, permitted feed is confirmed." },
  { id: "mongabay-india", name: "Mongabay India", kind: "specialist newsroom", intake: "rss metadata", publicUse: "link-only until review", note: "Environment and climate intake; verify the original source and permissions before use." }
] as const;
