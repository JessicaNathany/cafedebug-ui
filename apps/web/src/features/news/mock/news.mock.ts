import type { NewsArticle } from "../types";

export const mockNewsArticles: NewsArticle[] = [
  {
    slug: "vulnerabilidade-critica-framework-js",
    category: "SEGURANÇA",
    title: "Vulnerabilidade crítica em framework JS é corrigida",
    excerpt: "Patch de emergência lançado após descoberta de falha que afetava milhões de aplicações.",
    readTimeLabel: "4 min de leitura",
    artworkUrl: "/mock/news-security.jpg",
    artworkAlt: "Pessoa trabalhando na segurança de software em um notebook",
    authorName: "Camila Torres",
    authorAvatarUrl: "/mock/author-camila.jpg",
    authorAvatarAlt: "Foto de Camila Torres"
  },
  {
    slug: "cafedebug-conf-2026-inscricoes-abertas",
    category: "COMUNIDADE",
    title: "CaféDebug Conf 2026: inscrições abertas",
    excerpt: "O maior evento da comunidade dev brasileira volta em outubro, agora em formato híbrido.",
    readTimeLabel: "3 min de leitura",
    artworkUrl: "/mock/news-community.jpg",
    artworkAlt: "Palestrante em um evento da comunidade de desenvolvimento",
    authorName: "Pedro Antunes",
    authorAvatarUrl: "/mock/author-pedro.jpg",
    authorAvatarAlt: "Foto de Pedro Antunes"
  }
];
