import { GuidedOnboarding, type OnboardingExample } from "@/components/guided-onboarding";
import { SiteChrome } from "@/components/site-chrome";
import { getNewsStoryIndexProjection } from "@/lib/reader-stories";

const teachingFixture: OnboardingExample = {
  slug: "street-plan-daily-realities",
  title: "One street plan, four different daily realities",
  isTeachingFixture: true
};

/** Teach with a real accepted preview when one exists, and say so honestly when it does not. */
export function getOnboardingExample(): OnboardingExample {
  const index = getNewsStoryIndexProjection();
  const lead = index.find((story) => story.featured) ?? index[0];
  return lead ? { slug: lead.slug, title: lead.title, isTeachingFixture: false } : teachingFixture;
}

export default function OnboardingPage() {
  return <SiteChrome active="about"><GuidedOnboarding example={getOnboardingExample()} /></SiteChrome>;
}
