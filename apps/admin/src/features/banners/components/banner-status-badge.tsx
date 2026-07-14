type BannerStatusBadgeProps = {
  active: boolean;
};

export function BannerStatusBadge({ active }: BannerStatusBadgeProps) {
  if (active) {
    return (
      <span className="inline-flex items-center rounded-[4px] bg-status-published-surface px-2.5 py-1 text-xs font-medium text-status-published-on">
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-[4px] border border-status-draft-border bg-status-draft-surface px-2.5 py-1 text-xs font-medium text-status-draft-on">
      Draft
    </span>
  );
}
