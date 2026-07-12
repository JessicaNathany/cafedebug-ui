type TeamMemberStatusBadgeProps = {
  isActive: boolean;
};

const badgeBaseClassName =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 font-display text-sm font-semibold leading-none";

export function TeamMemberStatusBadge({ isActive }: TeamMemberStatusBadgeProps) {
  if (isActive) {
    return (
      <span
        className={`${badgeBaseClassName} bg-status-published-surface text-status-published-on`}
      >
        Active
      </span>
    );
  }

  return (
    <span
      className={`${badgeBaseClassName} border border-status-archived-border bg-status-archived-surface text-status-archived-on`}
    >
      Inactive
    </span>
  );
}