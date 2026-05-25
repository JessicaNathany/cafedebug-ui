"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

import {
  formatHtmlSourceForDisplay,
  getEditorHtml,
  syncEditorFromHtmlSource
} from "../services/episode-show-notes-serialization";

type UseEpisodeShowNotesEditorOptions = {
  value: string;
  onChange: (html: string) => void;
};

export function useEpisodeShowNotesEditor({
  value,
  onChange
}: UseEpisodeShowNotesEditorOptions) {
  const [sourceHtml, setSourceHtml] = useState(value);
  const lastSyncedRef = useRef<string>(value);
  const isInternalUpdate = useRef(false);
  const isSourceUpdate = useRef(false);
  const hasSourceEditsRef = useRef(false);
  const sourceSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
        underline: false
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank"
        }
      }),
      Highlight,
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      const html = getEditorHtml(currentEditor);
      lastSyncedRef.current = html;
      isInternalUpdate.current = true;
      setSourceHtml(html);
      onChange(html);
    }
  });

  const applySourceHtmlToEditor = useCallback(
    (nextHtml: string) => {
      if (!editor || editor.isDestroyed) {
        return;
      }

      try {
        const canonicalHtml = syncEditorFromHtmlSource(editor, nextHtml);
        lastSyncedRef.current = canonicalHtml;
        setSourceHtml(canonicalHtml);
        hasSourceEditsRef.current = false;

        if (canonicalHtml !== nextHtml) {
          isInternalUpdate.current = true;
          onChange(canonicalHtml);
        }
      } catch {
        return;
      }
    },
    [editor, onChange]
  );

  const clearSourceSyncTimeout = useCallback(() => {
    if (!sourceSyncTimeoutRef.current) {
      return;
    }

    clearTimeout(sourceSyncTimeoutRef.current);
    sourceSyncTimeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearSourceSyncTimeout();
    };
  }, [clearSourceSyncTimeout]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      lastSyncedRef.current = value;
      setSourceHtml(value);
      return;
    }

    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      setSourceHtml(value);
      return;
    }

    if (isSourceUpdate.current) {
      isSourceUpdate.current = false;
      lastSyncedRef.current = value;
      return;
    }

    if (value === lastSyncedRef.current) {
      return;
    }

    lastSyncedRef.current = value;
    setSourceHtml(value);
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  const syncSourceFromEditor = useCallback(async () => {
    if (!editor || editor.isDestroyed) {
      hasSourceEditsRef.current = false;
      setSourceHtml(await formatHtmlSourceForDisplay(value));
      return;
    }

    const html = getEditorHtml(editor);
    const formattedHtml = await formatHtmlSourceForDisplay(html);
    lastSyncedRef.current = html;
    hasSourceEditsRef.current = false;
    setSourceHtml(formattedHtml);
  }, [editor, value]);

  const flushSourceToEditor = useCallback(() => {
    clearSourceSyncTimeout();

    if (!hasSourceEditsRef.current) {
      return;
    }

    applySourceHtmlToEditor(sourceHtml);
  }, [applySourceHtmlToEditor, clearSourceSyncTimeout, sourceHtml]);

  const updateSourceHtml = useCallback(
    (nextHtml: string) => {
      setSourceHtml(nextHtml);
      isSourceUpdate.current = true;
      hasSourceEditsRef.current = true;
      onChange(nextHtml);

      clearSourceSyncTimeout();
      sourceSyncTimeoutRef.current = setTimeout(() => {
        applySourceHtmlToEditor(nextHtml);
      }, 200);
    },
    [applySourceHtmlToEditor, clearSourceSyncTimeout, onChange]
  );

  // ── Structure commands ──────────────────────────────────────────────────────

  const setHeading = useCallback(
    (level: 1 | 2 | 3 | 4) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const setParagraph = useCallback(() => {
    editor?.chain().focus().setParagraph().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleTaskList = useCallback(() => {
    editor?.chain().focus().toggleTaskList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  // ── Text mark commands ──────────────────────────────────────────────────────

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor?.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleHighlight = useCallback(() => {
    editor?.chain().focus().toggleHighlight().run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // ── Sub/superscript commands ────────────────────────────────────────────────

  const toggleSuperscript = useCallback(() => {
    editor?.chain().focus().toggleSuperscript().run();
  }, [editor]);

  const toggleSubscript = useCallback(() => {
    editor?.chain().focus().toggleSubscript().run();
  }, [editor]);

  // ── Alignment commands ──────────────────────────────────────────────────────

  const setTextAlign = useCallback(
    (alignment: string) => {
      editor?.chain().focus().setTextAlign(alignment).run();
    },
    [editor]
  );

  // ── Aggregated return values ────────────────────────────────────────────────

  const commands = {
    setHeading,
    setParagraph,
    toggleBulletList,
    toggleOrderedList,
    toggleTaskList,
    toggleBlockquote,
    toggleBold,
    toggleItalic,
    toggleStrike,
    toggleCode,
    toggleUnderline,
    toggleHighlight,
    setLink,
    toggleSuperscript,
    toggleSubscript,
    setTextAlign
  };

  const activeStates = {
    bold: editor?.isActive("bold") ?? false,
    italic: editor?.isActive("italic") ?? false,
    strike: editor?.isActive("strike") ?? false,
    code: editor?.isActive("code") ?? false,
    underline: editor?.isActive("underline") ?? false,
    highlight: editor?.isActive("highlight") ?? false,
    blockquote: editor?.isActive("blockquote") ?? false,
    bulletList: editor?.isActive("bulletList") ?? false,
    orderedList: editor?.isActive("orderedList") ?? false,
    taskList: editor?.isActive("taskList") ?? false,
    link: editor?.isActive("link") ?? false,
    heading1: editor?.isActive("heading", { level: 1 }) ?? false,
    heading2: editor?.isActive("heading", { level: 2 }) ?? false,
    heading3: editor?.isActive("heading", { level: 3 }) ?? false,
    heading4: editor?.isActive("heading", { level: 4 }) ?? false,
    superscript: editor?.isActive("superscript") ?? false,
    subscript: editor?.isActive("subscript") ?? false,
    alignLeft: editor?.isActive({ textAlign: "left" }) ?? false,
    alignCenter: editor?.isActive({ textAlign: "center" }) ?? false,
    alignRight: editor?.isActive({ textAlign: "right" }) ?? false,
    alignJustify: editor?.isActive({ textAlign: "justify" }) ?? false
  };

  const activeHeadingLevel = (
    editor?.isActive("heading", { level: 1 })
      ? 1
      : editor?.isActive("heading", { level: 2 })
        ? 2
        : editor?.isActive("heading", { level: 3 })
          ? 3
          : editor?.isActive("heading", { level: 4 })
            ? 4
            : 0
  ) as 0 | 1 | 2 | 3 | 4;

  return {
    editor,
    commands,
    activeStates,
    activeHeadingLevel,
    sourceHtml,
    updateSourceHtml,
    flushSourceToEditor,
    syncSourceFromEditor,
    isReady: !!editor && !editor.isDestroyed
  };
}
