import { notFound } from "next/navigation";

import { HomeView } from "@/components/home-view";
import {
  getDesignDirection,
  getDesignDirectionStaticParams,
  isDesignDirection,
} from "@/lib/design-direction";

export const dynamicParams = false;

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return getDesignDirectionStaticParams();
}

export default async function DesignPreviewPage({ params }: { params: Promise<{ direction: string }> }) {
  const { direction } = await params;
  if (!isDesignDirection(direction)) notFound();

  return <HomeView mode="news" direction={getDesignDirection(direction)} isDesignReview />;
}
