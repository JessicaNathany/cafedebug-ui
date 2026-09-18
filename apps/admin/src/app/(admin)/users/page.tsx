import { Suspense } from "react";

import { UsersListPage } from "@/features/users/users-list-page";

export default function UsersPage() {
  return (
    <Suspense>
      <UsersListPage />
    </Suspense>
  );
}
