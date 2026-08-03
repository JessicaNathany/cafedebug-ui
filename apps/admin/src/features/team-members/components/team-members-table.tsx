import type { ReactNode } from "react";

import type { TeamMemberListItem } from "../types/team-member.types";
import { TeamMemberStatusBadge } from "./team-member-status-badge";

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

function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.412-4.041-1.412-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.798 24 17.301 24 12c0-6.627-5.373-12-12-12Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5ZM8 19H5V8h3v11ZM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764ZM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19Z" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      aria-label={label}
      className="rounded-md p-1 text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      href={href}
      onClick={(event) => event.stopPropagation()}
      rel="noreferrer noopener"
      target="_blank"
    >
      {children}
    </a>
  );
}

function TeamMembersTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[960px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-outline-variant/60 bg-table-header-surface">
            <th className={tableHeadCellClassName}>Name + Email</th>
            <th className={`${tableHeadCellClassName} w-[16%]`}>Role</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Social Media</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Status</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Created</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {skeletonRows.map((rowIndex) => (
            <tr key={`skeleton-${rowIndex}`}>
              <td className={tableCellClassName}>
                <div className="flex flex-col gap-2">
                  <span className="inline-block h-3 w-40 animate-pulse rounded bg-surface-container-high" />
                  <span className="inline-block h-3 w-32 animate-pulse rounded bg-surface-container-high" />
                </div>
              </td>
              <td className={tableCellClassName}>
                <span className="inline-block h-3 w-24 animate-pulse rounded bg-surface-container-high" />
              </td>
              <td className={tableCellClassName}>
                <span className="inline-block h-3 w-16 animate-pulse rounded bg-surface-container-high" />
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

type TeamMembersTableProps = {
  items: TeamMemberListItem[];
  isLoading: boolean;
  onRowSelect: (id: number) => void;
};

export function TeamMembersTable({
  items,
  isLoading,
  onRowSelect
}: TeamMembersTableProps) {
  if (isLoading) {
    return <TeamMembersTableSkeleton />;
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
            <th className={tableHeadCellClassName}>Name + Email</th>
            <th className={`${tableHeadCellClassName} w-[16%]`}>Role</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Social Media</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Status</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Created</th>
            <th className={`${tableHeadCellClassName} w-[14%]`}>Updated</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/40 font-body">
          {items.map((teamMember, index) => {
            const rowKey =
              typeof teamMember.id === "number"
                ? `team-member-${teamMember.id}`
                : `team-member-row-${index}`;
            const canNavigate = typeof teamMember.id === "number" && teamMember.id > 0;
            const hasSocialLinks = Boolean(teamMember.gitHubUrl || teamMember.linkedInUrl);

            return (
              <tr
                className={[
                  "group transition-colors duration-150",
                  canNavigate ? "cursor-pointer hover:bg-table-row-hover" : "cursor-default"
                ].join(" ")}
                key={rowKey}
                onClick={() => handleRowSelection(teamMember.id)}
              >
                <td className={tableCellClassName}>
                  {canNavigate ? (
                    <button
                      className="w-full rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRowSelection(teamMember.id);
                      }}
                      type="button"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface transition-colors group-hover:text-primary">
                          {teamMember.name}
                        </span>
                        <span className="mt-0.5 text-sm text-on-surface-variant">
                          {teamMember.email}
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">{teamMember.name}</span>
                      <span className="mt-0.5 text-sm text-on-surface-variant">
                        {teamMember.email}
                      </span>
                    </div>
                  )}
                </td>

                <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                  {teamMember.podcastRole}
                </td>

                <td className={tableCellClassName}>
                  {hasSocialLinks ? (
                    <div className="flex items-center gap-2">
                      {teamMember.gitHubUrl ? (
                        <SocialLink href={teamMember.gitHubUrl} label={`${teamMember.name} GitHub profile`}>
                          <GitHubIcon />
                        </SocialLink>
                      ) : null}
                      {teamMember.linkedInUrl ? (
                        <SocialLink href={teamMember.linkedInUrl} label={`${teamMember.name} LinkedIn profile`}>
                          <LinkedInIcon />
                        </SocialLink>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-sm text-on-surface-variant">—</span>
                  )}
                </td>

                <td className={tableCellClassName}>
                  <TeamMemberStatusBadge isActive={teamMember.isActive} />
                </td>

                <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                  {formatDate(teamMember.createdAt)}
                </td>

                <td className={`${tableCellClassName} text-sm text-on-surface-variant`}>
                  {formatDate(teamMember.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}