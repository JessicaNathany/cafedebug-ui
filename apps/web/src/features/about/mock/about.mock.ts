import type { AboutContent } from "../types";

export const mockAboutContent = {
  hero: {
    eyebrow: "// SOBRE O CAFÉDEBUG",
    heading: "Café, código e conversas que movem a comunidade dev brasileira.",
    description:
      "Desde 2018, o CaféDebug reúne pessoas desenvolvedoras de todo o Brasil para falar de carreira, tecnologia, cultura e os bastidores reais de quem constrói software. Um podcast que virou comunidade.",
    metrics: [
      { value: "180+", label: "episódios publicados" },
      { value: "6 anos", label: "no ar, sem pausa" },
      { value: "320k+", label: "ouvintes na comunidade" }
    ]
  },
  mission: {
    eyebrow: "// PROPÓSITO",
    title: "Por que existimos",
    paragraphs: [
      "Acreditamos que crescer na carreira de tecnologia não deveria depender de sorte ou de estar no lugar certo. Nossa missão é democratizar o conhecimento e as conversas honestas que normalmente só acontecem entre quem já está dentro.",
      "Cada episódio é uma porta aberta: para a pessoa iniciante que quer entender o mercado, para a sênior que busca novas perspectivas, e para toda a comunidade que aprende junto, em português."
    ],
    values: [
      {
        id: "real-conversations",
        icon: "mic",
        title: "Conversas reais",
        description: "Sem roteiro engessado. Falamos de promoções, demissões, síndrome do impostor e tudo que acontece de verdade."
      },
      {
        id: "community-first",
        icon: "users",
        title: "Comunidade primeiro",
        description: "Mais de 12 mil pessoas no Discord trocando vagas, dúvidas e códigos todos os dias."
      },
      {
        id: "open-access",
        icon: "heart",
        title: "Acesso aberto",
        description: "Conteúdo gratuito, em português, para quem não tem acesso às mesmas oportunidades."
      },
      {
        id: "career-without-hype",
        icon: "compass",
        title: "Carreira sem hype",
        description: "Tecnologia com pé no chão: o que realmente importa para crescer de forma sustentável."
      }
    ]
  },
  impact: {
    eyebrow: "// IMPACTO NA COMUNIDADE",
    title: "Números que viraram histórias",
    metrics: [
      { id: "listeners", value: "320k+", label: "ouvintes ativos", description: "em todas as plataformas de áudio" },
      { id: "discord-members", value: "12.4k", label: "membros no Discord", description: "trocando código e vagas diariamente" },
      { id: "downloads", value: "8.7M", label: "downloads totais", description: "desde o primeiro episódio em 2018" },
      { id: "jobs", value: "1.2k+", label: "vagas divulgadas", description: "conectando talentos a empresas" }
    ]
  },
  journey: {
    eyebrow: "// A JORNADA",
    title: "De um microfone na cozinha à maior comunidade dev em português",
    milestones: [
      {
        id: "2018",
        year: "2018",
        title: "O primeiro episódio",
        description: "Dois amigos, um microfone emprestado e uma conversa de 40 minutos sobre o primeiro emprego em tech. 200 downloads na primeira semana."
      },
      {
        id: "2019",
        year: "2019",
        title: "A comunidade nasce",
        description: "Criamos o servidor no Discord para responder aos ouvintes. Em três meses, 1.000 pessoas já trocavam vagas e dúvidas."
      },
      {
        id: "2021",
        year: "2021",
        title: "100 episódios",
        description: "Marcamos a centena com um especial ao vivo e os primeiros patrocinadores. O podcast virou profissão."
      },
      {
        id: "2023",
        year: "2023",
        title: "Eventos presenciais",
        description: "O primeiro CaféDebug Meetup reuniu 400 pessoas em São Paulo. A comunidade saiu das telas."
      },
      {
        id: "2026",
        year: "2026",
        title: "CaféDebug 2.0",
        description: "Nova plataforma, newsletter semanal e um quadro de vagas próprio. A comunidade entra em uma nova fase."
      }
    ]
  }
} as const satisfies AboutContent;
