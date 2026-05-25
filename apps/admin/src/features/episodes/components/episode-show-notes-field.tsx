"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import type { UseFormReturn } from "react-hook-form";
import { EditorContent } from "@tiptap/react";

import type { EpisodeEditorSchemaValues } from "../schemas/episode.schema";
import { useEpisodeShowNotesEditor } from "../hooks/use-episode-show-notes-editor";
import { EpisodeShowNotesToolbar, type ToolbarItem } from "./episode-show-notes-toolbar";

type EditorMode = "write" | "html";

type EpisodeShowNotesFieldProps = {
  form: UseFormReturn<EpisodeEditorSchemaValues>;
  error?: string | undefined;
};

const editorClassName =
  "min-h-[520px] w-full" +
  " [&_.tiptap]:min-h-[520px] [&_.tiptap]:p-4 [&_.tiptap]:text-sm [&_.tiptap]:leading-relaxed [&_.tiptap]:text-on-surface [&_.tiptap]:outline-none" +
  // Headings — Tailwind preflight resets these, so explicit styles are required
  " [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:leading-tight [&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:mt-4" +
  " [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:leading-tight [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:mt-3" +
  " [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:leading-snug [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:mt-3" +
  " [&_.tiptap_h4]:text-base [&_.tiptap_h4]:font-semibold [&_.tiptap_h4]:leading-snug [&_.tiptap_h4]:mb-1 [&_.tiptap_h4]:mt-2" +
  " [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-outline-variant [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:text-on-surface-variant" +
  " [&_.tiptap_code]:rounded [&_.tiptap_code]:bg-surface-container-low [&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:font-mono [&_.tiptap_code]:text-xs" +
  " [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6" +
  " [&_.tiptap_a]:text-primary [&_.tiptap_a]:underline" +
  " [&_.tiptap_mark]:bg-warning/30 [&_.tiptap_mark]:text-on-surface" +
  " [&_.tiptap_ul[data-type=taskList]]:list-none [&_.tiptap_ul[data-type=taskList]]:pl-0" +
  " [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-on-surface-variant/45 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]";

export function EpisodeShowNotesField({ form, error }: EpisodeShowNotesFieldProps) {
  const [editorMode, setEditorMode] = useState<EditorMode>("write");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const description = form.watch("description");

  useEffect(() => {
    const resolveTheme = () => {
      setIsDarkTheme(document.documentElement.getAttribute("data-theme") === "dark");
    };

    resolveTheme();

    const observer = new MutationObserver(resolveTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleChange = useCallback(
    (html: string) => {
      form.setValue("description", html, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    },
    [form]
  );

  const {
    editor,
    commands,
    activeStates,
    activeHeadingLevel,
    sourceHtml,
    updateSourceHtml,
    flushSourceToEditor,
    syncSourceFromEditor,
    isReady
  } = useEpisodeShowNotesEditor({
    value: description,
    onChange: handleChange
  });

  const handleSwitchToWrite = useCallback(() => {
    flushSourceToEditor();
    setEditorMode("write");
  }, [flushSourceToEditor]);

  const handleSwitchToHtml = useCallback(() => {
    void syncSourceFromEditor();
    setEditorMode("html");
  }, [syncSourceFromEditor]);

  const toolbarItems = useMemo<ToolbarItem[]>(
    () => [
      // ── Group 1: Structure ────────────────────────────────────────────────
      {
        kind: "heading-dropdown",
        label: "Heading",
        activeLevel: activeHeadingLevel,
        onHeadingChange: (level) => {
          if (level === 0) commands.setParagraph();
          else commands.setHeading(level);
        }
      },
      {
        kind: "list-dropdown",
        label: "List",
        activeBullet: activeStates.bulletList,
        activeOrdered: activeStates.orderedList,
        activeTask: activeStates.taskList,
        onBulletList: commands.toggleBulletList,
        onOrderedList: commands.toggleOrderedList,
        onTaskList: commands.toggleTaskList
      },
      { kind: "separator", label: "sep-1" },
      // ── Group 2: Text marks ───────────────────────────────────────────────
      { kind: "button", label: "Bold", icon: "format_bold", active: activeStates.bold, onAction: commands.toggleBold },
      { kind: "button", label: "Italic", icon: "format_italic", active: activeStates.italic, onAction: commands.toggleItalic },
      { kind: "button", label: "Strikethrough", icon: "strikethrough_s", active: activeStates.strike, onAction: commands.toggleStrike },
      { kind: "button", label: "Underline", icon: "format_underlined", active: activeStates.underline, onAction: commands.toggleUnderline },
      { kind: "button", label: "Highlight", icon: "ink_highlighter", active: activeStates.highlight, onAction: commands.toggleHighlight },
      { kind: "button", label: "Inline Code", icon: "code", active: activeStates.code, onAction: commands.toggleCode },
      { kind: "button", label: "Quote", icon: "format_quote", active: activeStates.blockquote, onAction: commands.toggleBlockquote },
      { kind: "button", label: "Link", icon: "link", active: activeStates.link, onAction: commands.setLink },
      { kind: "separator", label: "sep-2" },
      // ── Group 3: Alignment ────────────────────────────────────────────────
      { kind: "button", label: "Align Left", icon: "format_align_left", active: activeStates.alignLeft, onAction: () => commands.setTextAlign("left") },
      { kind: "button", label: "Align Center", icon: "format_align_center", active: activeStates.alignCenter, onAction: () => commands.setTextAlign("center") },
      { kind: "button", label: "Align Right", icon: "format_align_right", active: activeStates.alignRight, onAction: () => commands.setTextAlign("right") },
      { kind: "button", label: "Justify", icon: "format_align_justify", active: activeStates.alignJustify, onAction: () => commands.setTextAlign("justify") }
    ],
    [activeStates, activeHeadingLevel, commands]
  );

  return (
    <div className="flex min-h-[500px] flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="text-sm font-semibold tracking-tight text-on-surface" htmlFor="episode-show-notes">
          Show Notes
        </label>

        <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 dark:bg-surface-container dark:border dark:border-outline-variant/50">
          <button
            className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/60 ${
              editorMode === "write"
                ? "bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/50"
                : "bg-transparent text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              handleSwitchToWrite();
            }}
          >
            Write
          </button>
          <button
            className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/60 ${
              editorMode === "html"
                ? "bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/50"
                : "bg-transparent text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              handleSwitchToHtml();
            }}
          >
            Code
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest shadow-ambient">
        <EpisodeShowNotesToolbar
          disabled={!isReady || editorMode === "html"}
          items={toolbarItems}
        />

        {editorMode === "write" ? (
          <EditorContent
            className={editorClassName}
            editor={editor}
            id="episode-show-notes"
          />
        ) : (
          <div className="min-h-[520px] p-4">
            <CodeMirror
              aria-label="Episode show notes HTML source"
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
                autocompletion: true
              }}
              className="rounded-lg border border-outline-variant/60 bg-surface text-on-surface [&_.cm-editor]:bg-surface [&_.cm-editor]:text-on-surface [&_.cm-scroller]:bg-surface [&_.cm-content]:text-on-surface [&_.cm-gutters]:border-r-outline-variant/50 [&_.cm-gutters]:bg-surface-container-low [&_.cm-gutters]:text-on-surface-variant [&_.cm-activeLine]:bg-surface-container-low [&_.cm-activeLineGutter]:bg-surface-container-low"
              extensions={[html(), EditorView.lineWrapping]}
              minHeight="488px"
              theme={isDarkTheme ? "dark" : "light"}
              value={sourceHtml}
              onChange={updateSourceHtml}
            />
            <p className="mt-3 text-xs text-on-surface-variant">
              Advanced mode: Tiptap may normalize unsupported HTML to match its schema.
            </p>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : null}
    </div>
  );
}
