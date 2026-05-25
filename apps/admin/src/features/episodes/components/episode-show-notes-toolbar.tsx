"use client";

import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ButtonAction = {
  kind: "button";
  label: string;
  icon: string;
  active: boolean;
  onAction: () => void;
};

type HeadingDropdownAction = {
  kind: "heading-dropdown";
  label: string;
  activeLevel: 0 | 1 | 2 | 3 | 4; // 0 = paragraph
  onHeadingChange: (level: 0 | 1 | 2 | 3 | 4) => void;
};

type ListDropdownAction = {
  kind: "list-dropdown";
  label: string;
  activeBullet: boolean;
  activeOrdered: boolean;
  activeTask: boolean;
  onBulletList: () => void;
  onOrderedList: () => void;
  onTaskList: () => void;
};

type SeparatorItem = {
  kind: "separator";
  label: string; // used as React key
};

export type ToolbarItem = ButtonAction | HeadingDropdownAction | ListDropdownAction | SeparatorItem;

type EpisodeShowNotesToolbarProps = {
  items: ToolbarItem[];
  disabled: boolean;
};

// ── Tooltip ───────────────────────────────────────────────────────────────────

function ToolbarTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const show = () => {
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
    }
  };

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={() => setPos(null)}
      onFocus={show}
      onBlur={() => setPos(null)}
    >
      {children}
      {pos && (
        <span
          aria-hidden="true"
          className="fixed z-[9999] -translate-x-1/2 rounded-md bg-on-surface px-2 py-1 text-[11px] font-medium text-surface shadow-md pointer-events-none whitespace-nowrap"
          style={{ top: pos.top, left: pos.left }}
        >
          {label}
        </span>
      )}
    </span>
  );
}

// ── Heading dropdown options ──────────────────────────────────────────────────

const HEADING_OPTIONS: { value: 0 | 1 | 2 | 3 | 4; label: string; sub: string }[] = [
  { value: 0, label: "Paragraph", sub: "P" },
  { value: 1, label: "Heading 1", sub: "H1" },
  { value: 2, label: "Heading 2", sub: "H2" },
  { value: 3, label: "Heading 3", sub: "H3" },
  { value: 4, label: "Heading 4", sub: "H4" }
];

// ── Shared fixed-menu hook ────────────────────────────────────────────────────

function useFixedMenu() {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen((prev) => !prev);
  };

  return { open, setOpen, menuPos, buttonRef, menuRef, toggle };
}

// ── HeadingDropdown ───────────────────────────────────────────────────────────

function HeadingDropdown({
  activeLevel,
  disabled,
  onHeadingChange
}: Pick<HeadingDropdownAction, "activeLevel" | "onHeadingChange"> & { disabled: boolean }) {
  const { open, setOpen, menuPos, buttonRef, menuRef, toggle } = useFixedMenu();
  const triggerLabel = activeLevel === 0 ? "H" : `H${activeLevel}`;
  const isActive = activeLevel > 0;

  return (
    <>
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Heading level"
        className={[
          "flex items-center gap-0.5 rounded-lg px-1.5 py-1.5 transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isActive ? "bg-primary/15 text-primary" : "hover:bg-surface-container-low hover:text-on-surface"
        ].join(" ")}
        disabled={disabled}
        type="button"
        onClick={toggle}
      >
        <span className="text-[18px] leading-none font-semibold">{triggerLabel}</span>
        <svg aria-hidden="true" className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && menuPos && (
        <div
          ref={menuRef}
          aria-label="Heading level"
          className="fixed z-[9999] min-w-[9rem] overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest shadow-lg"
          role="listbox"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {HEADING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              aria-selected={activeLevel === opt.value}
              className={[
                "flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition",
                "hover:bg-surface-container-low focus-visible:outline-none focus-visible:bg-surface-container-low",
                activeLevel === opt.value ? "font-semibold text-primary" : "text-on-surface"
              ].join(" ")}
              role="option"
              type="button"
              onClick={(e) => { e.preventDefault(); onHeadingChange(opt.value); setOpen(false); }}
            >
              <span className="w-6 text-center text-[10px] font-bold text-on-surface-variant opacity-70">{opt.sub}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ── ListDropdown ──────────────────────────────────────────────────────────────

const LIST_OPTIONS = [
  { id: "bullet",   label: "Bullet List",   icon: "format_list_bulleted" },
  { id: "ordered",  label: "Ordered List",  icon: "format_list_numbered" },
  { id: "task",     label: "Task List",     icon: "checklist" }
] as const;

type ListOptionId = (typeof LIST_OPTIONS)[number]["id"];

function ListDropdown({
  activeBullet,
  activeOrdered,
  activeTask,
  disabled,
  onBulletList,
  onOrderedList,
  onTaskList
}: Pick<ListDropdownAction, "activeBullet" | "activeOrdered" | "activeTask" | "onBulletList" | "onOrderedList" | "onTaskList"> & { disabled: boolean }) {
  const { open, setOpen, menuPos, buttonRef, menuRef, toggle } = useFixedMenu();
  const isActive = activeBullet || activeOrdered || activeTask;

  const activeMap: Record<ListOptionId, boolean> = {
    bullet: activeBullet,
    ordered: activeOrdered,
    task: activeTask
  };

  const actionMap: Record<ListOptionId, () => void> = {
    bullet: onBulletList,
    ordered: onOrderedList,
    task: onTaskList
  };

  return (
    <>
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="List type"
        className={[
          "flex items-center gap-0.5 rounded-lg px-1.5 py-1.5 transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isActive ? "bg-primary/15 text-primary" : "hover:bg-surface-container-low hover:text-on-surface"
        ].join(" ")}
        disabled={disabled}
        type="button"
        onClick={toggle}
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
        <svg aria-hidden="true" className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && menuPos && (
        <div
          ref={menuRef}
          aria-label="List type"
          className="fixed z-[9999] min-w-[10rem] overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest shadow-lg"
          role="listbox"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {LIST_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              aria-selected={activeMap[opt.id]}
              className={[
                "flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition",
                "hover:bg-surface-container-low focus-visible:outline-none focus-visible:bg-surface-container-low",
                activeMap[opt.id] ? "font-semibold text-primary" : "text-on-surface"
              ].join(" ")}
              role="option"
              type="button"
              onClick={(e) => { e.preventDefault(); actionMap[opt.id](); setOpen(false); }}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-on-surface-variant">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

export function EpisodeShowNotesToolbar({ items, disabled }: EpisodeShowNotesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 overflow-x-auto border-b border-outline-variant/50 bg-surface-neutral-soft dark:bg-white/5 px-2 py-2 text-on-surface-variant">
      {items.map((item) => {
        if (item.kind === "separator") {
          return (
            <span key={item.label} aria-hidden="true" className="mx-1 h-5 w-px bg-outline-variant/50" />
          );
        }

        if (item.kind === "heading-dropdown") {
          return (
            <ToolbarTooltip key={item.label} label={item.label}>
              <HeadingDropdown
                activeLevel={item.activeLevel}
                disabled={disabled}
                onHeadingChange={item.onHeadingChange}
              />
            </ToolbarTooltip>
          );
        }

        if (item.kind === "list-dropdown") {
          return (
            <ToolbarTooltip key={item.label} label={item.label}>
              <ListDropdown
                activeBullet={item.activeBullet}
                activeOrdered={item.activeOrdered}
                activeTask={item.activeTask}
                disabled={disabled}
                onBulletList={item.onBulletList}
                onOrderedList={item.onOrderedList}
                onTaskList={item.onTaskList}
              />
            </ToolbarTooltip>
          );
        }

        // kind === "button"
        return (
          <ToolbarTooltip key={item.label} label={item.label}>
            <button
              aria-label={item.label}
              aria-pressed={item.active}
              className={[
                "rounded-lg px-1.5 py-1.5 transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/60",
                item.active
                  ? "bg-primary/15 text-primary"
                  : "hover:bg-surface-container-low hover:text-on-surface"
              ].join(" ")}
              disabled={disabled}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                item.onAction();
              }}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                {item.icon}
              </span>
            </button>
          </ToolbarTooltip>
        );
      })}
    </div>
  );
}

