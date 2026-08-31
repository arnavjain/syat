import intake from "../../data/news-intake.json";

import { decodeHtmlEntities } from "./news-intake";

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

export type NewsSignalSnapshot = Pick<IntakeDocument, "generatedAt" | "windowDays">;

const document = intake as IntakeDocument;

export const newsSignalMetadata = {
  generatedAt: document.generatedAt,
  windowDays: document.windowDays,
  itemCount: document.itemCount
} as const;

// RSS titles are metadata, not copy Syāt has written. Decode only the visible
// character entities so readers can inspect the publisher's title normally.
export const latestNewsSignals: readonly NewsSignal[] = document.items.map((signal) => ({ ...signal, title: decodeHtmlEntities(signal.title) }));

const previewSensitiveTerms = /\b(assault|attack|death|dead|dies|died|killed|killing|murder|rape|raped|suicide|terror|violence|war|bullet(?:-| )?ridden|body found|shoot(?:er|ing)|encounter)\b/i;

export function isSensitiveNewsSignal(signal: Pick<NewsSignal, "title">) {
  return previewSensitiveTerms.test(signal.title);
}

export function isSignalSnapshotCurrent(snapshot: NewsSignalSnapshot, now = new Date()) {
  const generatedAt = new Date(snapshot.generatedAt).valueOf();
  const freshnessWindow = snapshot.windowDays * 24 * 60 * 60 * 1000;
  const age = now.valueOf() - generatedAt;
  return Number.isFinite(generatedAt) && Number.isFinite(freshnessWindow) && freshnessWindow > 0 && age >= 0 && age <= freshnessWindow;
}

export function selectPublicPreviewSignals(signals: readonly NewsSignal[], reviewedFixtureIds: readonly string[]) {
  const reviewedIds = new Set(reviewedFixtureIds);
  return signals.filter((signal) => reviewedIds.has(signal.id) && !isSensitiveNewsSignal(signal));
}

// Public home pages do not automatically borrow publisher headlines. An owner
// can add a tiny, named reviewed fixture ID here after editorial review. Until
// then the source queue is visible only in private Studio.
export const reviewedPublicPreviewSignalIds: readonly string[] = [];
export const previewNewsSignals = selectPublicPreviewSignals(latestNewsSignals, reviewedPublicPreviewSignalIds);

export function formatSignalDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
