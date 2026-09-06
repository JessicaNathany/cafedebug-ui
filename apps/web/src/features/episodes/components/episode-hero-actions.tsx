"use client";

import { Bookmark, Check, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { Episode } from "../types";

export function EpisodeHeroActions({ episode }: { episode: Episode }) {
  const [isSaved, setIsSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  const shareEpisode = async () => {
    const url = new URL(`/episodes/${episode.slug}`, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ text: episode.summary, title: episode.title, url });
        setShareStatus("Compartilhamento aberto");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Link copiado para a área de transferência");
    } catch {
      setShareStatus("Não foi possível copiar o link deste episódio");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button aria-label="Compartilhar episódio" className="h-12 w-[146px] gap-2 border border-border bg-card font-secondary text-sm font-medium hover:bg-secondary" onClick={shareEpisode} variant="ghost">
        <Share2 aria-hidden size={16} />
        Compartilhar
      </Button>
      <Button aria-pressed={isSaved} className="h-12 w-[102px] gap-2 border border-border bg-card font-secondary text-sm font-medium hover:bg-secondary" onClick={() => setIsSaved((saved) => !saved)} variant="ghost">
        {isSaved ? <Check aria-hidden size={16} /> : <Bookmark aria-hidden size={16} />}
        {isSaved ? "Salvo" : "Salvar"}
      </Button>
      <p aria-live="polite" className="sr-only" role="status">
        {shareStatus}
      </p>
    </div>
  );
}
