"use client";

import Image from "next/image";
import { Heart, Reply, Send } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import type { EpisodeComment } from "../types";

type EpisodeCommentsProps = {
  avatarUrl: string;
  comments: readonly EpisodeComment[];
};

export function EpisodeComments({ avatarUrl, comments }: EpisodeCommentsProps) {
  const fieldId = useId();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState("");
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(() => new Set());
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submittedComments, setSubmittedComments] = useState<EpisodeComment[]>([]);

  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = comment.trim();

    if (!body) {
      return;
    }

    setSubmittedComments((current) => [
      {
        author: "Você",
        avatarUrl,
        body: replyTo ? `@${replyTo} ${body}` : body,
        id: `local-comment-${current.length + 1}`,
        likes: 0,
        meta: "agora"
      },
      ...current
    ]);
    setComment("");
    setReplyTo(null);
  };

  const toggleLike = (commentId: string) => {
    setLikedCommentIds((current) => {
      const next = new Set(current);

      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }

      return next;
    });
  };

  const replyToComment = (author: string) => {
    setReplyTo(author);
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  const visibleComments = [...submittedComments, ...comments];

  return (
    <section aria-labelledby="episode-comments-title" className="grid w-full max-w-[860px] gap-6">
      <h2 className="font-primary text-2xl font-bold leading-tight text-foreground" id="episode-comments-title">
        Comentários ({visibleComments.length})
      </h2>
      <form className="grid gap-3" onSubmit={submitComment}>
        <div className="flex items-start gap-3">
          <Image alt="Seu avatar" className="size-10 shrink-0 rounded-pill object-cover" height={40} sizes="40px" src={avatarUrl} width={40} />
          <label className="sr-only" htmlFor={fieldId}>
            Compartilhe o que achou do episódio
          </label>
          <textarea className="h-20 min-w-0 flex-1 resize-none rounded-m border border-border bg-background p-4 font-secondary text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" id={fieldId} onChange={(event) => setComment(event.target.value)} placeholder={replyTo ? `Responder a ${replyTo}…` : "Compartilhe o que achou do episódio…"} ref={composerRef} value={comment} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pl-13">
          <p className="font-secondary text-xs text-muted-foreground">{replyTo ? `Respondendo a ${replyTo}.` : "Seja gentil. Markdown suportado."}</p>
          <div className="flex items-center gap-2">
            {replyTo ? <Button className="h-10 font-secondary text-sm" onClick={() => setReplyTo(null)} type="button" variant="ghost">Cancelar resposta</Button> : null}
            <Button className="h-10 gap-2 font-secondary text-sm font-semibold" type="submit">
              <Send aria-hidden size={16} />
              Enviar
            </Button>
          </div>
        </div>
      </form>
      <ol className="grid gap-6">
        {visibleComments.map((item) => {
          const isLiked = likedCommentIds.has(item.id);

          return (
            <li className="flex gap-3.5" key={item.id}>
              <Image alt={item.author} className="size-10 shrink-0 rounded-pill object-cover" height={40} sizes="40px" src={item.avatarUrl} width={40} />
              <article className="grid min-w-0 gap-1">
                <p className="font-secondary text-sm font-semibold text-foreground">
                  {item.author} <span className="font-normal text-muted-foreground">· {item.meta}</span>
                </p>
                <p className="font-secondary text-sm leading-[1.55] text-muted-foreground">{item.body}</p>
                <div className="flex items-center gap-5 pt-0.5">
                  <Button aria-label={`${isLiked ? "Remover like de" : "Curtir"} comentário de ${item.author}`} aria-pressed={isLiked} className="h-10 gap-1.5 bg-transparent px-0 font-secondary text-[13px] font-normal text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={() => toggleLike(item.id)} variant="ghost">
                    <Heart aria-hidden className={isLiked ? "fill-current text-primary" : undefined} size={15} />
                    {item.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button aria-label={`Responder a ${item.author}`} className="h-10 gap-1.5 bg-transparent px-0 font-secondary text-[13px] font-normal text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={() => replyToComment(item.author)} variant="ghost">
                    <Reply aria-hidden size={15} />
                    Responder
                  </Button>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
