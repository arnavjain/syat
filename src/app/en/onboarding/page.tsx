import { GuidedOnboarding } from "@/components/guided-onboarding";
import { SiteChrome } from "@/components/site-chrome";

export default function OnboardingPage() {
  return <SiteChrome active="about"><GuidedOnboarding /></SiteChrome>;
}
