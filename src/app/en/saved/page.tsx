import { ReadingShelf } from "@/components/reading-shelf";
import { SiteChrome } from "@/components/site-chrome";

export const metadata = {
  title: "Your shelf · Syāt",
  description: "Questions you have saved to return to, kept on your own device."
};

export default function SavedPage() {
  return (
    <SiteChrome active="saved">
      <section className="shelf-page">
        <p className="micro-copy">Saved</p>
        <h1>The questions you wanted to return to.</h1>
        <p className="page-lede">Your shelf lives on this device. There are no accounts yet, so nothing here is uploaded, synced or visible to anyone else. Clearing your browser data clears it.</p>
        <ReadingShelf />
      </section>
    </SiteChrome>
  );
}
