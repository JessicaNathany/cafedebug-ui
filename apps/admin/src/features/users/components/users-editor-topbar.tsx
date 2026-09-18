"use client";

type UsersEditorTopbarProps = {
  mode: "new" | "edit";
  onBack: () => void;
  disabled?: boolean;
};

export function UsersEditorTopbar({
  mode,
  onBack,
  disabled = false
}: UsersEditorTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-outline-variant/60 bg-surface-container-lowest px-6 py-5 lg:px-8 xl:px-10">
      <div className="flex items-center gap-4">
        <button
          aria-label="Back to users"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={onBack}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-xl">
            arrow_back
          </span>
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Users
          </span>
          <span className="text-sm font-medium text-on-surface">
            {mode === "new" ? "New users" : "Edit user"}
          </span>
        </div>
      </div>
    </header>
  );
}
