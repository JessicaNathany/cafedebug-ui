import { Suspense } from "react";

import { TeamMembersListPage } from "@/features/team-members/team-members-list-page";

export default function TeamMembersPage() {
  return (
    <Suspense>
      <TeamMembersListPage />
    </Suspense>
  );
}