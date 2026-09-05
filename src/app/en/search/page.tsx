import { SiteChrome } from "@/components/site-chrome";
import { TopicSearch } from "@/components/topic-search";
import { getNewsStoryIndexProjection } from "@/lib/reader-stories";
import { buildCombinedSearchIndex } from "@/lib/topic-search";

export const metadata = {
  title: "Search Syāt",
  description: "Search every enduring question and every News preview at once. The index is sent to your device and searched there.",
  robots: { index: false, follow: false }
};

export default function SearchPage() {
  const entries = buildCombinedSearchIndex(getNewsStoryIndexProjection().map((story) => ({ slug: story.slug, title: story.title, dek: story.dek, theme: story.theme })));

  return (
    <SiteChrome active="explore">
      <div className="search-page">
        <header>
          <p className="micro-copy">Search</p>
          <h1>One search across both libraries.</h1>
          <p className="page-lede">Enduring questions and News previews together. The whole index is sent to your device and searched there, so nothing you type is sent anywhere or recorded.</p>
        </header>
        <TopicSearch entries={entries} heading="Search everything" noun="entries" placeholder="Try water, work, waiting, health, memory" />
      </div>
    </SiteChrome>
  );
}
