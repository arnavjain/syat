export type TimelessTopic = {
  id: string;
  slug: string;
  theme: string;
  title: string;
  prompt: string;
  readingLens: "archive" | "system" | "place" | "practice" | "idea";
};

const themes = [
  ["Cities and public life", "place", [
    ["public-place", "Who gets to call a place public?"],
    ["street-after-dark", "What changes when a street belongs to the night?"],
    ["market-and-square", "When does a market become a civic square?"],
    ["waiting-in-city", "Who is expected to wait in a city, and where?"],
    ["shade-and-heat", "How does shade become public infrastructure?"],
    ["bench-politics", "Why can a bench be a political object?"],
    ["access-to-toilet", "What does access to a toilet say about a city?"],
    ["neighbourhood-boundary", "How do neighbourhood boundaries become real?"],
    ["street-vending", "What does a street vendor make possible?"],
    ["city-sound", "Whose sounds are treated as part of city life?"],
  ]],
  ["History and memory", "archive", [
    ["archive-silence", "What does an archive leave out?"],
    ["family-history", "How does a family story become history?"],
    ["monument-afterlife", "What happens after a monument stops speaking for everyone?"],
    ["oral-memory", "When is oral memory the record that matters most?"],
    ["map-and-power", "What does a map make visible, and what does it hide?"],
    ["anniversary", "Why do anniversaries change the past we notice?"],
    ["museum-label", "Who gets to write the label beside an object?"],
    ["lost-language", "What is lost when a language falls quiet?"],
    ["migration-memory", "How does migration reshape a shared memory?"],
    ["forgotten-work", "Why is some work missing from the historical record?"],
  ]],
  ["Science and uncertainty", "system", [
    ["measurement", "When does a measurement become a value judgement?"],
    ["scientific-uncertainty", "How can uncertainty make a scientific claim stronger?"],
    ["risk-and-precaution", "Who decides how much risk is acceptable?"],
    ["model-and-world", "What can a model see that a person cannot?"],
    ["evidence-threshold", "How much evidence is enough to act?"],
    ["clinical-trial", "Who is represented in a clinical trial?"],
    ["weather-and-climate", "What changes when weather becomes climate evidence?"],
    ["data-gap", "What does a missing data point conceal?"],
    ["expert-disagreement", "What should we do when experts disagree?"],
    ["scientific-repair", "How does science correct itself in public?"],
  ]],
  ["Work and care", "practice", [
    ["invisible-work", "Which work remains invisible because it is expected?"],
    ["time-and-care", "Who pays when care takes time?"],
    ["shift-work", "How does shift work reorder a household?"],
    ["repair-work", "Why is repair work easy to overlook?"],
    ["automation-and-dignity", "What does automation change about dignity at work?"],
    ["informal-work", "When does informal work become essential infrastructure?"],
    ["apprenticeship", "What is passed on through apprenticeship?"],
    ["rest", "Who gets to treat rest as a right?"],
    ["wage-and-worth", "Why is a wage not the same as worth?"],
    ["care-in-public", "What happens when care moves into public view?"],
  ]],
  ["Food and land", "place", [
    ["seed", "Who owns a seed after it travels?"],
    ["water-sharing", "How do communities decide who gets water first?"],
    ["seasonal-food", "What does seasonal food remember?"],
    ["soil", "Why is soil more than a growing medium?"],
    ["fishing-right", "Who gets to define a fishing ground?"],
    ["grain-storage", "What does a grain store protect besides food?"],
    ["kitchen-knowledge", "How does kitchen knowledge become expertise?"],
    ["commons", "When does land become a commons?"],
    ["food-price", "What does a food price fail to include?"],
    ["crop-and-climate", "How does a changing climate alter a crop’s meaning?"],
  ]],
  ["Technology and power", "system", [
    ["algorithm", "What does an algorithm decide before we notice?"],
    ["internet-memory", "Who remembers the early internet, and how?"],
    ["repairable-device", "Why does a repairable device matter?"],
    ["identity-system", "When does an identity system make life harder?"],
    ["platform-labour", "What does a platform call flexibility?"],
    ["digital-archive", "Who can enter a digital archive?"],
    ["automation-bias", "How can automation repeat an old bias?"],
    ["network-outage", "What does an outage reveal about dependence?"],
    ["interface-language", "How does an interface teach us what is normal?"],
    ["right-to-disconnect", "What would a right to disconnect protect?"],
  ]],
  ["Art and interpretation", "idea", [
    ["seeing-art", "What changes when we look at the same work twice?"],
    ["translation", "What can translation carry across a language?"],
    ["song-and-place", "How does a song keep a place alive?"],
    ["craft-and-art", "Who decides when craft becomes art?"],
    ["theatre-audience", "How does an audience complete a performance?"],
    ["copy-and-original", "What makes an original feel original?"],
    ["public-art", "When does art belong to a public?"],
    ["voice-and-recording", "What is changed when a voice is recorded?"],
    ["colour-and-meaning", "Why can one colour mean different things at once?"],
    ["criticism", "What does good criticism make room for?"],
  ]],
  ["Language and belonging", "idea", [
    ["mother-tongue", "What does a mother tongue hold that translation cannot?"],
    ["accent", "When does an accent become a boundary?"],
    ["naming-place", "Who has the power to name a place?"],
    ["everyday-word", "How does an everyday word gather history?"],
    ["silence", "When can silence be a form of speech?"],
    ["bilingual-life", "What does it mean to think between languages?"],
    ["polite-language", "Who gets protected by polite language?"],
    ["translation-loss", "What should a translation refuse to smooth over?"],
    ["sign-language", "What does a language look like in motion?"],
    ["dictionary", "Who decides what belongs in a dictionary?"],
  ]],
  ["Bodies and health", "practice", [
    ["disability-access", "What does accessibility reveal about a place?"],
    ["pain", "How do people describe pain when words fall short?"],
    ["public-health", "When does public health become personal?"],
    ["rest-and-recovery", "What does recovery require besides treatment?"],
    ["ageing", "How does a city change when we notice ageing?"],
    ["body-and-work", "What does a job ask of a body?"],
    ["mental-health-language", "Which words make it easier to ask for help?"],
    ["care-record", "Who gets to write a person’s care record?"],
    ["sport-and-belonging", "When does sport become a place of belonging?"],
    ["healing-practice", "How do healing practices travel across communities?"],
  ]],
  ["The freedom struggle, argued", "archive", [
    ["revolt-1857", "Was 1857 a mutiny, a rebellion, or a first war of independence?"],
    ["moderates-and-extremists", "What did the Moderates win that the Extremists could not?"],
    ["swadeshi-1905", "Did the Swadeshi movement build a nation or narrow one?"],
    ["champaran-method", "What made Champaran a template rather than an episode?"],
    ["khilafat-alliance", "What did joining Khilafat to Non-Cooperation cost, and buy?"],
    ["chauri-chaura", "Was calling off Non-Cooperation principle, or retreat?"],
    ["salt-as-symbol", "Why did salt work when older grievances did not?"],
    ["revolutionary-path", "What did the revolutionaries offer that mass politics did not?"],
    ["quit-india-1942", "Who was leading Quit India once the leadership was jailed?"],
    ["ina-trials", "Why did the INA trials move opinion more than the INA campaign?"],
  ]],
  ["Partition and its arithmetic", "archive", [
    ["two-nation-claim", "When did the two-nation claim become a political fact?"],
    ["cabinet-mission", "What did the Cabinet Mission Plan actually offer?"],
    ["direct-action-day", "How did one day in Calcutta change what was thinkable?"],
    ["radcliffe-line", "What can a boundary drawn in five weeks not know?"],
    ["punjab-and-bengal", "Why were Punjab and Bengal partitioned differently in memory?"],
    ["migration-1947", "What does a refugee column carry besides people?"],
    ["princely-choice", "What choice did a princely state actually have in 1947?"],
    ["partition-women", "Whose recovery was the state arranging after 1947?"],
  ]],
  ["Writing the Constitution", "idea", [
    ["constituent-assembly", "Who was in the room, and who was spoken for?"],
    ["fundamental-rights-limits", "Why were rights written with their limits attached?"],
    ["directive-principles", "What is a promise that cannot be enforced in court for?"],
    ["reservation-debate", "What did the Assembly think reservation was for?"],
    ["language-question", "How did India avoid choosing one national language?"],
    ["federal-balance", "Why did a federal constitution keep a strong centre?"],
    ["emergency-provisions", "Why write the suspension of the constitution into it?"],
    ["ambedkar-dissent", "What was Ambedkar warning about on the last day?"],
  ]],

  ["Democracy and common life", "system", [
    ["listening", "What does it mean to be heard in public?"],
    ["protest", "When does protest change a public conversation?"],
    ["rule-and-exception", "Who lives with the exception to a rule?"],
    ["local-decision", "How should a local decision be made?"],
    ["citizenship", "What does citizenship ask beyond a document?"],
    ["public-trust", "How is public trust earned and repaired?"],
    ["neighbourhood-assembly", "Who is missing from a neighbourhood meeting?"],
    ["vote-and-voice", "Why is a vote not the whole of political voice?"],
    ["mutual-aid", "What can mutual aid do that institutions cannot?"],
    ["disagreement", "How can disagreement remain a shared practice?"],
  ]],
] as const;

export const timelessTopics: readonly TimelessTopic[] = themes.flatMap(([theme, readingLens, entries]) =>
  entries.map(([slug, title]) => ({
    id: `timeless-${slug}`,
    slug,
    theme,
    title,
    prompt: `A source-led reading path through ${title.slice(0, -1).toLocaleLowerCase("en-IN")}.`,
    readingLens
  }))
);

export function getTimelessTopic(slug: string): TimelessTopic | undefined {
  return timelessTopics.find((topic) => topic.slug === slug);
}

/** Stable URL segment for a theme name. */
export function themeSlug(theme: string): string {
  return theme.toLocaleLowerCase("en-IN").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const timelessThemes: ReadonlyArray<{ theme: string; slug: string; readingLens: TimelessTopic["readingLens"]; count: number }> =
  [...new Map(timelessTopics.map((topic) => [topic.theme, topic])).values()].map((topic) => ({
    theme: topic.theme,
    slug: themeSlug(topic.theme),
    readingLens: topic.readingLens,
    count: timelessTopics.filter((item) => item.theme === topic.theme).length
  }));

export function topicsInTheme(theme: string): readonly TimelessTopic[] {
  return timelessTopics.filter((topic) => topic.theme === theme);
}

export function getThemeBySlug(slug: string) {
  return timelessThemes.find((theme) => theme.slug === slug);
}

export const readingLenses: ReadonlyArray<{ lens: TimelessTopic["readingLens"]; count: number }> =
  [...new Set(timelessTopics.map((topic) => topic.readingLens))].map((lens) => ({
    lens,
    count: timelessTopics.filter((topic) => topic.readingLens === lens).length
  }));

export function timelessTopicPath(slug: string): string | undefined {
  return getTimelessTopic(slug) ? `/en/timeless/topic/${slug}` : undefined;
}
