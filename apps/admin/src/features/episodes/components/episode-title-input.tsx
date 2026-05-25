"use client";

import { useEffect, useRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type EpisodeTitleInputProps = {
  hasError?: boolean;
  registration: UseFormRegisterReturn;
};

const MAX_LINES = 3;

export function EpisodeTitleInput({ hasError, registration }: EpisodeTitleInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    const el = textareaRef.current;

    if (!el) return;

    const computedStyle = window.getComputedStyle(el);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);

    const maxHeight = lineHeight * MAX_LINES + paddingTop + paddingBottom;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  // Resize when value is populated on initial load / edit mode
  useEffect(() => {
    resize();
  }, []);

  const { ref: registerRef, onChange, ...rest } = registration;

  return (
    <textarea
      aria-invalid={hasError ? true : undefined}
      className="hide-scrollbar w-full resize-none overflow-y-auto border-0 border-b-2 border-transparent bg-transparent px-0 py-1.5 font-display text-2xl font-bold leading-tight text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/35 hover:border-outline-variant/60 focus:border-primary focus:ring-0 md:text-3xl xl:text-4xl"
      placeholder="Episode Title..."
      ref={(el) => {
        registerRef(el);
        textareaRef.current = el;
      }}
      rows={1}
      onChange={(event) => {
        onChange(event);
        resize();
      }}
      {...rest}
    />
  );
}
