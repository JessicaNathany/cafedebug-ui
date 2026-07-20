import type { Episode } from "../types";

export const mockEpisodes: Episode[] = [
  {
    slug: "entrevista-tecnica-2026",
    number: 142,
    category: "CARREIRA",
    title: "Como passar numa entrevista técnica em 2026",
    summary: "Princípios práticos para preparar storytelling técnico, algoritmo e arquitetura sem decorar respostas.",
    publishedAt: "2026-06-12",
    dateLabel: "12 Jun 2026",
    durationMinutes: 48,
    plays: "8.4k reproduções",
    audioUrl: "/mock/sample-audio.mp3",
    artworkUrl: "/mock/episode-142.svg",
    guestName: "Ana Ribeiro",
    guestRole: "Engenheira de Software · Google",
    showNotesHtml:
      "<p>Falamos sobre preparação de entrevistas técnicas em ciclos reais de produto e como estudar com foco no problema de negócio.</p><p>Discutimos sinais de senioridade, arquitetura para comunicação em entrevistas e formas de transformar experiência em narrativa.</p><p>No final, listamos um checklist enxuto de revisão para os sete dias anteriores à entrevista.</p>"
  },
  {
    slug: "negociacao-salarial-senior",
    number: 141,
    category: "CARREIRA",
    title: "Negociação salarial para pessoas desenvolvedoras seniores",
    summary: "Como negociar proposta com clareza de escopo, impacto e pacote completo sem perder relacionamento.",
    publishedAt: "2026-06-05",
    dateLabel: "05 Jun 2026",
    durationMinutes: 44,
    plays: "6.2k reproduções",
    audioUrl: "/mock/sample-audio.mp3",
    artworkUrl: "/mock/episode-141.svg",
    guestName: "Marina Costa",
    guestRole: "Staff Engineer · iFood",
    showNotesHtml:
      "<p>Exploramos abordagem para negociação orientada por valor entregue e contexto de mercado.</p><p>Também cobrimos como estruturar contra-propostas sem tornar a conversa binária.</p>"
  },
  {
    slug: "microservicos-valem-a-pena",
    number: 140,
    category: "ARQUITETURA",
    title: "Microsserviços valem a pena no seu contexto?",
    summary: "Trade-offs de custo cognitivo, operações e governança antes de quebrar o monolito.",
    publishedAt: "2026-05-29",
    dateLabel: "29 Mai 2026",
    durationMinutes: 52,
    plays: "7.1k reproduções",
    audioUrl: "/mock/sample-audio.mp3",
    artworkUrl: "/mock/episode-140.svg",
    guestName: "Rafael Tomasi",
    guestRole: "Staff Engineer · Nubank",
    showNotesHtml:
      "<p>Passamos por critérios de separação de domínios, times e plataforma para evitar monólito distribuído.</p><p>A conversa inclui sinais de maturidade de observabilidade e governança de contratos.</p>"
  },
  {
    slug: "programando-com-ia",
    number: 139,
    category: "IA",
    title: "Programando com IA sem perder autonomia",
    summary: "Práticas para usar copilotos e agentes com validação técnica, revisão humana e segurança.",
    publishedAt: "2026-05-22",
    dateLabel: "22 Mai 2026",
    durationMinutes: 46,
    plays: "9.0k reproduções",
    audioUrl: "/mock/sample-audio.mp3",
    artworkUrl: "/mock/episode-139.svg",
    guestName: "Lucas Vieira",
    guestRole: "Principal Engineer · Thoughtworks",
    showNotesHtml:
      "<p>Discutimos limites e oportunidades de IA no dia a dia de engenharia, com foco em validação e contexto de domínio.</p><p>Fechamos com padrões para revisão de código assistida e métricas de qualidade.</p>"
  }
];
