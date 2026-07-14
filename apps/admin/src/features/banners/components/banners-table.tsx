import type { BannerListItem } from "../types/banner.types";
import { BannerStatusBadge } from "./banner-status-badge";

const formatBannerDate = (value?: string): string => {
  if (!value) {
    return "—";
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(parsedValue);
};

const tableHeadCellClassName = "px-6 py-4 font-display text-sm font-medium text-on-surface";
const tableCellClassName = "px-6 py-4";
const skeletonRows = Array.from({ length: 5 }, (_, index) => index + 1);

function BannersTableSkeleton() {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-outline-variant/60 bg-table-header-surface">
          <th className={`${tableHeadCellClassName} w-16`}>Order</th>
          <th className={tableHeadCellClassName}>Name</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Status</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Start Date</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>End Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/40">
        {skeletonRows.map((rowIndex) => (
          <tr key={`skeleton-${rowIndex}`}>
            <td className={tableCellClassName}>
              <span className="inline-block h-3 w-8 animate-pulse rounded bg-surface-container-high" />
            </td>
            <td className={tableCellClassName}>
              <span className="inline-block h-3 w-48 animate-pulse rounded bg-surface-container-high" />
            </td>
            <td className={tableCellClassName}>
              <span className="inline-block h-5 w-20 animate-pulse rounded-[4px] bg-surface-container-high" />
            </td>
            <td className={tableCellClassName}>
              <span className="inline-block h-3 w-24 animate-pulse rounded bg-surface-container-high" />
            </td>
            <td className={tableCellClassName}>
              <span className="inline-block h-3 w-24 animate-pulse rounded bg-surface-container-high" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type BannersTableProps = {
  items: BannerListItem[];
  isLoading: boolean;
  onRowSelect: (id: number) => void;
};

export function BannersTable({ items, isLoading, onRowSelect }: BannersTableProps) {
  if (isLoading) {
    return <BannersTableSkeleton />;
  }

  const handleRowSelection = (id: number | null) => {
    if (typeof id !== "number" || id <= 0) {
      return;
    }

    onRowSelect(id);
  };

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-outline-variant/60 bg-table-header-surface">
          <th className={`${tableHeadCellClassName} w-16`}>Order</th>
          <th className={tableHeadCellClassName}>Name</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Status</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>Start Date</th>
          <th className={`${tableHeadCellClassName} w-1/6`}>End Date</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-outline-variant/40 font-body">
        {items.map((banner, index) => {
          const rowKey =
            typeof banner.id === "number" ? `banner-${banner.id}` : `banner-row-${index}`;
          const canNavigate = typeof banner.id === "number" && banner.id > 0;

          return (
            <tr
              className={[
                "group transition-colors duration-150",
                canNavigate ? "cursor-pointer hover:bg-[var(--color-table-row-hover)]" : "cursor-default"
              ].join(" ")}
              key={rowKey}
              onClick={() => handleRowSelection(banner.id)}
            >
              <td className={`${tableCellClassName} text-sm text-on-surface`}>
                {typeof banner.order === "number" ? banner.order : "—"}
              </td>

              <td className={tableCellClassName}>
                {canNavigate ? (
                  <button
                    className="w-full rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRowSelection(banner.id);
                    }}
                    type="button"
                  >
                    <span className="font-medium text-on-surface transition-colors group-hover:text-primary">
                      {banner.name}
                    </span>
                  </button>
                ) : (
                  <span className="font-medium text-on-surface">{banner.name}</span>
                )}
              </td>

              <td className={tableCellClassName}>
                <BannerStatusBadge active={banner.active} />
              </td>

              <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                {formatBannerDate(banner.startDate)}
              </td>

              <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                {formatBannerDate(banner.endDate)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
