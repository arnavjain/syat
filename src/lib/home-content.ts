import { formatSignalDate, latestNewsSignals } from "./news-signals";

export type HomeMode = "news" | "timeless";

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
    kicker: "Learn the reading method",
    title: "A city toll can be one policy and six different daily realities",
    dek: "A clearly fictional teaching story for the private preview. It shows how Syāt separates the event from the different ways people live with it.",
    perspectives: ["Daily commuter", "Small business", "Disabled resident", "City planner"],
    cta: { label: "Read the story", href: "/en/news/city-toll-daily-realities" }
  },
  sections: [
    {
      title: "Last seven days: source signals",
      intro: "One hundred dated RSS records are in the review queue. These links open the original publishers; they are not Syāt stories.",
      items: latestNewsSignals.slice(0, 2).map((signal) => ({
        title: signal.title,
        dek: `Source signal from ${signal.publisher}. It remains link-only until a source trail and editorial draft are reviewed.`,
        href: signal.url,
        label: `${signal.publisher} · ${formatSignalDate(signal.publishedAt)}`,
        type: "internet" as const
      }))
    },
    {
      title: "More signals, waiting for context",
      intro: "A current headline can point somewhere important, but a headline alone is not enough to publish a perspective story.",
      items: latestNewsSignals.slice(2, 4).map((signal) => ({
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
    title: "Why do cities keep asking the same question about movement?",
    dek: "Transport is not only a technical problem. It is also a question of public space, access, work, and what a city owes its residents.",
    perspectives: ["Historian", "Mobility researcher", "Street vendor", "Parent"],
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
          href: "/en/timeless/what-makes-a-place-public",
          label: "Society",
          type: "subject"
        },
        {
          title: "What does a map make visible, and what does it leave out?",
          dek: "Read maps as tools, arguments, and records of power.",
          href: "/en/timeless/maps-and-power",
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
          href: "/en/timeless/river-letter",
          label: "Archive reading",
          type: "subject"
        },
        {
          title: "When a measurement becomes a value judgement.",
          dek: "How science explains uncertainty without abandoning care.",
          href: "/en/timeless/measurement-and-values",
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
