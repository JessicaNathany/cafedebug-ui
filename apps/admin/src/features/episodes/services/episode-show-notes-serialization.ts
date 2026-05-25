import type { Editor } from "@tiptap/react";

const TIPTAP_EMPTY_PARAGRAPH = "<p></p>";
let formatHtmlSourceFormatterPromise:
  | Promise<(source: string) => Promise<string>>
  | null = null;

export const getEditorHtml = (editor: Editor): string => {
  return editor.getHTML();
};

const loadHtmlSourceFormatter = async (): Promise<(source: string) => Promise<string>> => {
  if (formatHtmlSourceFormatterPromise) {
    return formatHtmlSourceFormatterPromise;
  }

  formatHtmlSourceFormatterPromise = (async () => {
    const [prettierModule, htmlPluginModule] = await Promise.all([
      import("prettier/standalone"),
      import("prettier/plugins/html")
    ]);

    const prettier = (prettierModule as { default?: unknown }).default ?? prettierModule;
    const htmlPlugin = (htmlPluginModule as { default?: unknown }).default ?? htmlPluginModule;

    return async (source: string) => {
      const format = (prettier as { format: (input: string, options: Record<string, unknown>) => Promise<string> }).format;

      return format(source, {
        parser: "html",
        plugins: [htmlPlugin],
        printWidth: 100,
        tabWidth: 2,
        useTabs: false
      });
    };
  })();

  return formatHtmlSourceFormatterPromise;
};

export const formatHtmlSourceForDisplay = async (html: string): Promise<string> => {
  const source = html.trim();

  if (!source) {
    return "";
  }

  try {
    const formatter = await loadHtmlSourceFormatter();
    const formatted = await formatter(source);
    return formatted.trimEnd();
  } catch {
    return html;
  }
};

export const syncEditorFromHtmlSource = (editor: Editor, html: string): string => {
  editor.commands.setContent(html || "", { emitUpdate: false });
  return editor.getHTML();
};

export const isEditorContentEmpty = (editor: Editor): boolean => {
  return editor.isEmpty;
};

export const isHtmlContentEmpty = (html: string): boolean => {
  const trimmed = html.trim();
  return trimmed.length === 0 || trimmed === TIPTAP_EMPTY_PARAGRAPH;
};
