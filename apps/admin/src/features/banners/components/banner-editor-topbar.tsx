import type { BannerEditorMode } from "../types/banner.types";

type BannerEditorTopBarProps = {
  active: boolean;
  mode: BannerEditorMode;
  onBack: () => void;
};

export function BannerEditorTopBar({ active, mode, onBack }: BannerEditorTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-outline-variant/60 bg-surface-container-lowest px-6 py-5 lg:px-8 xl:px-10">
      <div className="flex items-center gap-4">
        <button
          aria-label="Back to banners"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={onBack}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
            arrow_back
          </span>
        </button>

        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
            Banners
          </span>
          <span className="text-sm font-medium text-on-surface">
            {mode === "new" ? "Creating Banner" : "Editing Banner"}
          </span>
        </div>
      </div>

      <span
        className={[
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
          active
            ? "bg-status-published-surface text-status-published-on"
            : "border border-status-draft-border bg-status-draft-surface text-status-draft-on"
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={[
            "h-2 w-2 rounded-full",
            active ? "bg-success" : "bg-status-draft-on"
          ].join(" ")}
        />
        {active ? "Published" : "Draft"}
      </span>
    </header>
  );
}
