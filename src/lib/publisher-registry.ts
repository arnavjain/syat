import { cagUseDecision, linkOnlyUseDecision, pibUseDecision, type SourceUseDecision } from "./source-rights";

export type PublisherRegistryEntry = {
  id: string;
  name: string;
  kind: "public record" | "legacy newsroom" | "digital newsroom" | "specialist newsroom";
  intake: "rss metadata" | "manual editor pick";
  publicUse: "link-only until review";
  sourceUse: SourceUseDecision;
  note: string;
};

// This is a diversity record, not a political scorecard. Syāt does not infer a
// publisher's ideology. An editor still checks the source pack for each story.
export const publisherRegistry: readonly PublisherRegistryEntry[] = [
  { id: "pib", name: "Press Information Bureau", kind: "public record", intake: "rss metadata", publicUse: "link-only until review", sourceUse: pibUseDecision, note: "Direct government statements; never the only source for a contested claim." },
  { id: "cag", name: "Comptroller and Auditor General of India", kind: "public record", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: cagUseDecision, note: "Audit findings constrain a department's own account of itself, so a CAG record is the counterweight to a single official statement. Report bodies are PDFs behind a JavaScript listing, so collection is not automated yet." },
  { id: "the-hindu", name: "The Hindu", kind: "legacy newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The Hindu", "https://www.thehindu.com/"), note: "National reporting intake." },
  { id: "indian-express", name: "The Indian Express", kind: "legacy newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The Indian Express", "https://indianexpress.com/"), note: "India, city, public-interest, business, technology, health and education intake." },
  { id: "the-print", name: "ThePrint", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("ThePrint", "https://theprint.in/"), note: "No reliable machine-readable feed is enabled; editors add original links manually." },
  { id: "the-wire", name: "The Wire", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The Wire", "https://thewire.in/"), note: "No reliable machine-readable feed is enabled; editors add original links manually." },
  { id: "scroll", name: "Scroll", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Scroll", "https://scroll.in/"), note: "Editors add original links manually until a stable, permitted feed is confirmed." },
  { id: "mongabay-india", name: "Mongabay India", kind: "specialist newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Mongabay India", "https://india.mongabay.com/"), note: "Environment and climate intake; verify the original source and permissions before use." },
  { id: "times-of-india", name: "The Times of India", kind: "legacy newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The Times of India", "https://timesofindia.indiatimes.com/"), note: "Top stories and India feeds." },
  { id: "hindustan-times", name: "Hindustan Times", kind: "legacy newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Hindustan Times", "https://www.hindustantimes.com/"), note: "India news feed." },
  { id: "economic-times", name: "The Economic Times", kind: "legacy newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The Economic Times", "https://economictimes.indiatimes.com/"), note: "Business and economy intake." },
  { id: "frontline", name: "Frontline", kind: "specialist newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Frontline", "https://frontline.thehindu.com/"), note: "Long-form reporting and analysis intake." },
  { id: "opindia", name: "OpIndia", kind: "digital newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("OpIndia", "https://www.opindia.com/"), note: "Digital-only intake." },
  { id: "organiser", name: "Organiser", kind: "digital newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Organiser", "https://organiser.org/"), note: "Weekly digital intake." },
  { id: "newslaundry", name: "Newslaundry", kind: "specialist newsroom", intake: "rss metadata", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Newslaundry", "https://www.newslaundry.com/"), note: "Media criticism and reporting intake." },
  { id: "telegraph-india", name: "The Telegraph", kind: "legacy newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The Telegraph", "https://www.telegraphindia.com/"), note: "The feed refuses automated requests, so editors add links by hand." },
  { id: "deccan-herald", name: "Deccan Herald", kind: "legacy newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Deccan Herald", "https://www.deccanherald.com/"), note: "No working public feed path was confirmed; editors add links by hand." },
  { id: "firstpost", name: "Firstpost", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Firstpost", "https://www.firstpost.com/"), note: "The feed refuses automated requests, so editors add links by hand." },
  { id: "swarajya", name: "Swarajya", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Swarajya", "https://swarajyamag.com/"), note: "The feed responds but carries no current items, so editors add links by hand." },
  { id: "the-caravan", name: "The Caravan", kind: "specialist newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The Caravan", "https://caravanmagazine.in/"), note: "No working public feed path was confirmed; editors add links by hand." },
  { id: "down-to-earth", name: "Down To Earth", kind: "specialist newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("Down To Earth", "https://www.downtoearth.org.in/"), note: "Environment reporting; no working public feed path was confirmed." },
  { id: "the-news-minute", name: "The News Minute", kind: "digital newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("The News Minute", "https://www.thenewsminute.com/"), note: "Southern-states reporting; the feed carries no current items." },
  { id: "ndtv", name: "NDTV", kind: "legacy newsroom", intake: "manual editor pick", publicUse: "link-only until review", sourceUse: linkOnlyUseDecision("NDTV", "https://www.ndtv.com/"), note: "Editors add original links manually unless an exact source override is reviewed." }
] as const;
