import type { Episode, EpisodeDetailContent } from "../types";

const chapterDefinitions = [
  ["A abertura: o problema que queremos resolver", 0],
  ["O contexto antes de escolher a arquitetura", 382],
  ["Onde os limites de domínio realmente aparecem", 748],
  ["Times, comunicação e decisões reversíveis", 1114],
  ["Trade-offs que merecem uma conversa franca", 1480],
  ["Métricas que ajudam sem virar teatro", 1846],
  ["Perguntas da comunidade", 2212],
  ["O que levar para a próxima semana", 2578]
] as const;

const resourceDefinitions = [
  ["Resumo do episódio", "file-text"],
  ["Leituras recomendadas", "book-open"],
  ["Repositório citado", "github"],
  ["Links compartilhados", "link"],
  ["Ouvir em outra plataforma", "play-circle"]
] as const;

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function getMockEpisodeDetailContent(episode: Episode): EpisodeDetailContent {
  return {
    chapters: chapterDefinitions.map(([title, startSeconds], index) => ({
      id: `${episode.slug}-chapter-${index + 1}`,
      startSeconds,
      timestamp: formatTimestamp(startSeconds),
      title
    })),
    comments: [
      {
        author: "Pedro Martins",
        avatarUrl: "/mock/author-pedro.jpg",
        body: "Ótima conversa. A parte sobre decisões reversíveis mudou a forma como vou conduzir a próxima discussão de arquitetura.",
        id: `${episode.slug}-comment-1`,
        likes: 34,
        meta: "há 2 horas"
      },
      {
        author: "Camila Nunes",
        avatarUrl: "/mock/author-camila.jpg",
        body: "Gostei especialmente dos exemplos práticos e das perguntas para levar ao time antes de dividir um serviço.",
        id: `${episode.slug}-comment-2`,
        likes: 12,
        meta: "há 5 horas"
      },
      {
        author: "Mariana Costa",
        avatarUrl: episode.guestAvatarUrl,
        body: "Esse episódio entrou direto na minha lista para compartilhar com a equipe.",
        id: `${episode.slug}-comment-3`,
        likes: 28,
        meta: "ontem"
      }
    ],
    guestBio: `${episode.guestName} compartilha experiências práticas sobre produto, tecnologia e as decisões que tornam times de engenharia mais consistentes.`,
    guestSocials: [
      { href: "https://www.linkedin.com", label: "LinkedIn" },
      { href: "https://github.com", label: "GitHub" },
      { href: "https://x.com", label: "X" }
    ],
    resources: resourceDefinitions.map(([label, icon], index) => ({
      href: [
        "https://www.cafedebug.com.br/",
        "https://martinfowler.com/",
        "https://github.com/",
        "https://developer.mozilla.org/",
        "https://open.spotify.com/"
      ][index]!,
      icon,
      label
    }))
  };
}
