"use client";

type TeamMemberEditorTopbarProps = {
  mode: "new" | "edit";
  active: boolean;
  onBack: () => void;
  disabled?: boolean;
};

export function TeamMemberEditorTopbar({
  mode,
  active,
  onBack,
  disabled = false,
}: TeamMemberEditorTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-outline-variant/60 bg-surface-container-lowest px-6 py-5 lg:px-8 xl:px-10">
      <div className="flex items-center gap-4">
        <button
          aria-label="Back to team members"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={onBack}
          type="button"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-xl"
          >
            arrow_back
          </span>
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Team members
          </span>
          <span className="text-sm font-medium text-on-surface">
            {mode === "new" ? "New Team Member" : "Edit Team Member"}
          </span>
        </div>
      </div>
      <span
        aria-label={`Member is ${active ? "active" : "inactive"}`}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
          active
            ? "bg-primary-container text-on-primary-container"
            : "bg-surface-container-high text-on-surface"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </span>
    </header>
  );
}
