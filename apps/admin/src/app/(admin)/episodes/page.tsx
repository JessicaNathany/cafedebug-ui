import { Suspense } from "react";

import { EpisodesListPage } from "@/features/episodes/episodes-list-page";

export default function EpisodesPage() {
  return (
    <Suspense>
      <EpisodesListPage />
    </Suspense>
  );
}
