import { HomeView } from "@/components/home-view";
import { getDesignDirection } from "@/lib/design-direction";

export default function TimelessPage() {
  return <HomeView mode="timeless" direction={getDesignDirection(undefined)} />;
}
