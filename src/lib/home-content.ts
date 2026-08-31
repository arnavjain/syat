import { formatSignalDate, previewNewsSignals } from "./news-signals";
import { getPreviewStory } from "./preview-content";

export type HomeMode = "news" | "timeless";

const homeModeHrefs: Record<HomeMode, "/" | "/en/timeless"> = {
  news: "/",
  timeless: "/en/timeless"
};

export type StoryTeaser = {
  title: string;
  dek: string;
  href: string;
  label: string;
  type: "story" | "subject" | "internet";
};

export type HomeContent = {
  modeLabel: "News" | "Timeless";
  helper: string;
  feature: {
    kicker: string;
    title: string;
    dek: string;
    perspectives: string[];
    cta: { label: string; href: string };
  };
  sections: Array<{ title: string; intro: string; items: StoryTeaser[] }>;
};

const newsContent: HomeContent = {
  modeLabel: "News",
  helper: "Developing stories and current affairs",
  feature: {
    kicker: "Learn the reading method · India-first fixture",
    title: "One street plan, five different daily realities",
    dek: "A clearly fictional Indian teaching story for this private preview. It separates a municipal decision from the different ways people live with it.",
    perspectives: ["Bus commuter", "Street vendor", "Wheelchair user", "School caregiver"],
    cta: { label: "Read the story", href: "/en/news/street-plan-daily-realities" }
  },
  sections: [
    {
      title: "India, last seven days: source signals",
      intro: "One hundred dated India-first RSS records are in the review queue. These links open the original publishers; they are not Syāt stories.",
      items: previewNewsSignals.slice(0, 2).map((signal) => ({
        title: signal.title,
        dek: `India source signal from ${signal.publisher}. It remains link-only until a source trail and editorial draft are reviewed.`,
        href: signal.url,
        label: `${signal.publisher} · ${formatSignalDate(signal.publishedAt)}`,
        type: "internet" as const
      }))
    },
    {
      title: "More India signals, waiting for context",
      intro: "A current headline can point somewhere important, but a headline alone is not enough to publish a perspective story.",
      items: previewNewsSignals.slice(2, 4).map((signal) => ({
        title: signal.title,
        dek: `Original source: ${signal.publisher}. Open its link; Syāt has not made claims about it.`,
        href: signal.url,
        label: `${signal.publisher} · ${formatSignalDate(signal.publishedAt)}`,
        type: "internet" as const
      }))
    }
  ]
};

const timelessContent: HomeContent = {
  modeLabel: "Timeless",
  helper: "Culture, history, science and enduring ideas",
  feature: {
    kicker: "Timeless question",
    title: "How do Indian cities decide who gets time on a street?",
    dek: "Movement is not only a technical problem. It is also a question of public space, access, work, care, and what a city owes its residents.",
    perspectives: ["Historian", "Mobility researcher", "Street vendor", "Caregiver"],
    cta: { label: "Explore the subject", href: "/en/timeless/how-cities-move" }
  },
  sections: [
    {
      title: "A question people keep returning to",
      intro: "Objects, ideas and systems that look different from every era.",
      items: [
        {
          title: "Who gets to call a place public?",
          dek: "A guided path through streets, parks, platforms and informal gathering places.",
          href: "/en/explore",
          label: "Society",
          type: "subject"
        },
        {
          title: "What does a map make visible, and what does it leave out?",
          dek: "Read maps as tools, arguments, and records of power.",
          href: "/en/explore",
          label: "History and design",
          type: "subject"
        }
      ]
    },
    {
      title: "From the archive",
      intro: "A work, document or recording placed back into several contexts.",
      items: [
        {
          title: "The letter that changed how one community described its river.",
          dek: "Original words, later reception, and the questions that remain.",
          href: "/en/explore",
          label: "Archive reading",
          type: "subject"
        },
        {
          title: "When a measurement becomes a value judgement.",
          dek: "How science explains uncertainty without abandoning care.",
          href: "/en/explore",
          label: "Science",
          type: "subject"
        }
      ]
    }
  ]
};

export function getHomeContent(mode: HomeMode): HomeContent {
  return mode === "timeless" ? timelessContent : newsContent;
}

export function getHomeModeHref(mode: HomeMode) {
  return homeModeHrefs[mode];
}

export function isCurrentFixtureDestination(href: string) {
  const match = href.match(/^\/en\/(news|timeless)\/([^/]+)$/);
  if (!match) return false;

  const [, mode, slug] = match;
  return getPreviewStory(slug)?.mode === mode;
}
