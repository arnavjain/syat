import { getPreviewStory } from "./preview-content";
import { getNewsStory, getNewsStoryIndexProjection } from "./reader-stories";

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
  type: "story" | "subject" | "internet" | "workspace";
};

export type HomeContent = {
  modeLabel: "News" | "Timeless";
  helper: string;
  generatedNewsCount?: number;
  feature: {
    kicker: string;
    title: string;
    dek: string;
    perspectives: string[];
    cta: { label: string; href: string };
  };
  sections: Array<{ title: string; intro: string; items: StoryTeaser[] }>;
  contextBridge?: { targetSlug?: string; topicSlug?: string; question: string; connection: string };
};

function newsContent(): HomeContent {
  const index = getNewsStoryIndexProjection();
  const lead = index.find((story) => story.featured) ?? index[0];

  if (!lead) {
    const fixture = getPreviewStory("street-plan-daily-realities");
    if (!fixture) throw new Error("The News teaching fixture is missing.");
    return {
      modeLabel: "News",
      helper: "Developing stories and current affairs",
      generatedNewsCount: 0,
      feature: {
        kicker: "Teaching story · India-first reading method",
        title: fixture.title,
        dek: fixture.dek,
        perspectives: fixture.perspectives.map((item) => item.label),
        cta: { label: "Start with the teaching story", href: `/en/news/${fixture.slug}` }
      },
      sections: [
        {
          title: "News library",
          intro: "Reviewed News previews will appear here as soon as a complete pilot passes every evidence and language check.",
          items: [{ title: "Browse the pilot archive", dek: "See the current preview count and open every accepted News page from one quiet index.", href: "/en/news", label: "Private preview archive", type: "story" }]
        },
        {
          title: "Review before scale",
          intro: "Source records can be inspected without turning a publisher headline into a Syāt article.",
          items: [{ title: "Open the private source desk", dek: "Review source signals with their original links and recorded use limits.", href: "/en/studio", label: "Review Studio", type: "workspace" }]
        }
      ],
      contextBridge: fixture.contextBridge
    };
  }

  const latestItems = index.filter((story) => story.slug !== lead.slug).slice(0, 8).map<StoryTeaser>((story) => ({
    title: story.title,
    dek: story.dek,
    href: `/en/news/${story.slug}`,
    label: `${story.theme} · ${story.format.replaceAll("_", " ")}`,
    type: "story"
  }));

  const themes = [...new Set(index.map((story) => story.theme))].slice(0, 5).map<StoryTeaser>((theme) => ({
    title: theme,
    dek: `Read accepted previews filed under ${theme.toLocaleLowerCase("en-IN")}.`,
    href: `/en/news#theme-${theme.toLocaleLowerCase("en-IN").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    label: "Theme",
    type: "story"
  }));

  return {
    modeLabel: "News",
    helper: "Developing stories and current affairs",
    generatedNewsCount: index.length,
    feature: {
      kicker: `${lead.theme} · ${lead.format.replaceAll("_", " ")} · AI-assisted private preview`,
      title: lead.title,
      dek: lead.dek,
      perspectives: [],
      cta: { label: "Start reading", href: `/en/news/${lead.slug}` }
    },
    sections: [
      {
        title: index.length === 100 ? "Latest News previews" : "The reviewed pilot",
        intro: latestItems.length > 0 ? "Recent pages, arranged as an editorial reading list rather than a feed." : "The first accepted preview is ready to read.",
        items: [...latestItems, { title: index.length === 100 ? "Browse all 100 News previews" : "Browse the pilot", dek: "Open the complete News archive by theme and date.", href: "/en/news", label: `${index.length} accepted ${index.length === 1 ? "preview" : "previews"}`, type: "story" }]
      },
      {
        title: "Follow a subject",
        intro: "Move across the News library by public question, not by an endless stream.",
        items: themes
      }
    ],
    contextBridge: getNewsStory(lead.slug)?.contextBridge ?? getPreviewStory("street-plan-daily-realities")?.contextBridge
  };
}

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
        { title: "Who gets to call a place public?", dek: "A guided path through streets, parks, platforms and informal gathering places.", href: "/en/explore", label: "Society", type: "subject" },
        { title: "What does a map make visible, and what does it leave out?", dek: "Read maps as tools, arguments, and records of power.", href: "/en/explore", label: "History and design", type: "subject" }
      ]
    },
    {
      title: "From the archive",
      intro: "A work, document or recording placed back into several contexts.",
      items: [
        { title: "The letter that changed how one community described its river.", dek: "Original words, later reception, and the questions that remain.", href: "/en/explore", label: "Archive reading", type: "subject" },
        { title: "When a measurement becomes a value judgement.", dek: "How science explains uncertainty without abandoning care.", href: "/en/explore", label: "Science", type: "subject" }
      ]
    }
  ],
  contextBridge: getPreviewStory("how-cities-move")?.contextBridge
};

export function getHomeContent(mode: HomeMode): HomeContent {
  return mode === "timeless" ? timelessContent : newsContent();
}

export function getHomeModeHref(mode: HomeMode) {
  return homeModeHrefs[mode];
}

export function isCurrentFixtureDestination(href: string) {
  // A theme anchor on the archive is a real destination, so compare the path without it.
  const path = href.split("#")[0];
  if (path === "/en/studio" || path === "/en/news") return true;
  const match = path.match(/^\/en\/(news|timeless)\/([^/#]+)$/);
  if (!match) return false;

  const [, mode, slug] = match;
  if (mode === "news" && getNewsStoryIndexProjection().some((story) => story.slug === slug)) return true;
  return getPreviewStory(slug)?.mode === mode;
}
