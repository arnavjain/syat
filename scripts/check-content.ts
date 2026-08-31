import { readFile } from "node:fs/promises";

import { isIntakeSnapshotCurrent, validateIntakeDocument } from "../src/lib/news-intake";

async function main() {
  const json = JSON.parse(await readFile("data/news-intake.json", "utf8")) as unknown;
  const errors = validateIntakeDocument(json);
  if (errors.length > 0) throw new Error(`News intake failed validation: ${errors.join("; ")}`);
  const candidate = json as { items: Array<{ publisher: string }>; maximumPerPublisher: number; generatedAt: string; windowDays: number };
  const distribution = [...candidate.items.reduce((counts, item) => counts.set(item.publisher, (counts.get(item.publisher) ?? 0) + 1), new Map<string, number>()).entries()].map(([publisher, count]) => `${publisher}: ${count}`).join("; ");
  const isCurrent = isIntakeSnapshotCurrent(candidate);
  console.log(`Checked ${candidate.items.length} source signals (cap ${candidate.maximumPerPublisher} per publisher): ${distribution || "none"}. Snapshot is ${isCurrent ? "within" : "outside"} its declared freshness window and remains Studio-only.`);
}

void main();
