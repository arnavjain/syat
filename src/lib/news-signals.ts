import intake from "../../data/news-intake.json";

export type NewsSignal = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceFeed: string;
  editorialScope: "india_first";
  sourceClass: "official_public_record" | "newsroom_rss";
  publishedAt: string;
  accessedAt: string;
  sourceType: "rss_metadata";
  status: "needs_editorial_review";
  rights: "link_only";
  note: string;
};

type IntakeDocument = {
  contractVersion: "syat.news-intake.v1";
  generatedAt: string;
  windowDays: number;
  itemCount: number;
  items: NewsSignal[];
};

const document = intake as IntakeDocument;

export const newsSignalMetadata = {
  generatedAt: document.generatedAt,
  windowDays: document.windowDays,
  itemCount: document.itemCount
} as const;

export const latestNewsSignals: readonly NewsSignal[] = document.items;

const previewSensitiveTerms = /\b(assault|attack|death|dead|dies|died|killed|killing|murder|rape|raped|suicide|terror|violence|war)\b/i;

export function isSensitiveNewsSignal(signal: Pick<NewsSignal, "title">) {
  return previewSensitiveTerms.test(signal.title);
}

// A sensitive event remains in the private review queue. It does not become a
// casual home-page teaser before an editor has decided how it should be framed.
export const previewNewsSignals = latestNewsSignals.filter((signal) => !isSensitiveNewsSignal(signal));

export function formatSignalDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
