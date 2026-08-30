import intake from "../../data/news-intake.json";

export type NewsSignal = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceFeed: string;
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

export function formatSignalDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
