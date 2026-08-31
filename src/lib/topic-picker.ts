import type { TimelessTopic } from "./timeless-topics";

export function pickRandomTopic(topics: readonly TimelessTopic[], random = Math.random) {
  if (topics.length === 0) return undefined;
  return topics[Math.min(topics.length - 1, Math.floor(random() * topics.length))];
}
