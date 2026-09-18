import type { UserListItem } from "../types/users.types";
import { UsersStatusBadge } from "./users-status-badge";

const formatDate = (value?: string): string => {
  if (!value) {
    return "—";
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(parsedValue);
};

const tableHeadCellClassName = "px-6 py-4 font-display text-sm font-semibold text-on-surface";
const tableCellClassName = "px-6 py-4";
const skeletonRows = Array.from({ length: 5 }, (_, index) => index + 1);

function UsersTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[960px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-outline-variant/60 bg-table-header-surface">
            <th className={tableHeadCellClassName}>Name</th>
            <th className={`${tableHeadCellClassName} w-[22%]`}>Email</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Status</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Created</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {skeletonRows.map((rowIndex) => (
            <tr key={`skeleton-${rowIndex}`}>
              <td className={tableCellClassName}>
                <span className="inline-block h-3 w-40 animate-pulse rounded bg-surface-container-high" />
              </td>
              <td className={tableCellClassName}>
                <span className="inline-block h-3 w-32 animate-pulse rounded bg-surface-container-high" />
              </td>
              <td className={tableCellClassName}>
                <span className="inline-block h-10 w-24 animate-pulse rounded-md bg-surface-container-high" />
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
    </div>
  );
}

type UsersTableProps = {
  items: UserListItem[];
  isLoading: boolean;
  onRowSelect: (id: number) => void;
};

export function UsersTable({ items, isLoading, onRowSelect }: UsersTableProps) {
  if (isLoading) {
    return <UsersTableSkeleton />;
  }

  const handleRowSelection = (id: number | null) => {
    if (typeof id !== "number" || id <= 0) {
      return;
    }

    onRowSelect(id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[960px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-outline-variant/60 bg-table-header-surface">
            <th className={tableHeadCellClassName}>Name</th>
            <th className={`${tableHeadCellClassName} w-[22%]`}>Email</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Status</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Created</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Updated</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/40 font-body">
          {items.map((user, index) => {
            const rowKey =
              typeof user.id === "number"
                ? `user-${user.id}`
                : `user-row-${index}`;
            const canNavigate = typeof user.id === "number" && user.id > 0;

            return (
              <tr
                className={[
                  "group transition-colors duration-150",
                  canNavigate ? "cursor-pointer hover:bg-table-row-hover" : "cursor-default"
                ].join(" ")}
                key={rowKey}
                onClick={() => handleRowSelection(user.id)}
              >
                <td className={tableCellClassName}>
                  <span className="font-medium text-on-surface transition-colors group-hover:text-primary">
                    {user.name}
                  </span>
                </td>

                <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                  {user.email}
                </td>

                <td className={tableCellClassName}>
                  <UsersStatusBadge isActive={user.isActive} />
                </td>

                <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                  {formatDate(user.createdAt)}
                </td>

                <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                  {formatDate(user.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
