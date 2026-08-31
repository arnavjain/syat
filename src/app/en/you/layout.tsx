import type { ReactNode } from "react";

import { ConvexClientProvider } from "../../convex-client-provider";

export default function YouLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
