import type { AboutContent } from "../types";

export const mockAboutContent = {
  hero: {
    eyebrow: "// SOBRE O CAFÉ DEBUG",
    heading: "Café Debug é um podcast dedicado ao universo da ciência e tecnologia.",
    description:
      "Desde sua fundação em 2017, o programa tem se destacado por trazer especialistas do setor para discutir uma ampla variedade de tópicos, incluindo desenvolvimento de software, ferramentas tecnológicas, conceitos avançados de arquitetura de software, trajetórias profissionais na tecnologia e na ciência, e muito mais. Junte-se a nós para explorar as últimas tendências e inovações que moldam nosso mundo. Apresentado e criado por Jéssica Nathany.",
    metrics: [
      { value: "200+", label: "episódios publicados" },
      { value: "9 anos", label: "compartilhando conhecimento sobre ciência e tecnologia" }
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
