import { HomeView } from "@/components/home-view";
import { getDesignDirection } from "@/lib/design-direction";

export default function HomePage() {
  return <HomeView mode="news" direction={getDesignDirection(undefined)} />;
}
